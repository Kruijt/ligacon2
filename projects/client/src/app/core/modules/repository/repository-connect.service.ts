import { catchError, filter, finalize, share, take, takeUntil, tap } from 'rxjs/operators';
import { defer, Observable, of, race, Subject } from 'rxjs';

import { Injectable } from '@angular/core';

import { Actions, ActionType, ofActionDispatched, Store } from '@ngxs/store';

import { RepositoryState } from './repository.state';
import {
  StreamConnected,
  StreamDisconnected,
  StreamEmitted,
  StreamErrored,
} from './models/repository-decorator-helper.models';
import { Disconnect, DisconnectAll, DisconnectStream, RepositoryConnectActions } from './repository.actions';
import { ActionTypeDef } from './models/respository-types.model';
import { attachAction } from './repository.utilities';

function defaultTrackBy(action: any) {
  return '';
}

function streamId(opts: { actionType: ActionType; action: any; trackBy: (action: any) => string }) {
  let id = `${opts.actionType.type}`;
  if (opts.trackBy(opts.action)) {
    id = id.concat(` (${opts.trackBy(opts.action)})`);
  }
  return id;
}

function tapOnce<T>(fn: (value: any) => void) {
  return (source: Observable<any>) =>
    defer(() => {
      let first = true;
      return source.pipe(
        tap<T>((payload) => {
          if (first) {
            fn(payload);
          }
          first = false;
        }),
      );
    }).pipe(share());
}

@Injectable({
  providedIn: 'root',
})
export class RepositoryConnectService {
  private activeFirestoreConnections: string[] = [];

  private actionsPending: string[] = [];

  constructor(private store: Store, private actions: Actions) {}

  connect<T>(
    actionType: ActionTypeDef<T>,
    opts: {
      to: (action: T) => Observable<any>;
      trackBy?: (action: T) => string;
      connectedActionFinishesOn?: 'FirstEmit' | 'StreamCompleted';
      cancelPrevious?: boolean;
    },
  ) {
    const connectedActionFinishesOn = opts.connectedActionFinishesOn || 'FirstEmit';
    const trackBy = opts.trackBy || defaultTrackBy;
    const cancelPrevious = !!opts.cancelPrevious;

    interface CompletedHandler {
      actionCompletedHandlerSubject: Subject<unknown>;
    }

    const subjects: { [key: string]: CompletedHandler } = {};

    function getSubjects(id: string): CompletedHandler {
      if (!subjects[id]) {
        const actionCompletedHandlerSubject = new Subject();
        subjects[id] = {
          actionCompletedHandlerSubject,
        };
      }

      return subjects[id];
    }

    attachAction(RepositoryState, actionType, (_stateContext: any, action: any) => {
      const { actionCompletedHandlerSubject } = getSubjects(streamId({ actionType, action, trackBy }));

      const completed$ = actionCompletedHandlerSubject.asObservable().pipe(take(1));

      if (cancelPrevious) {
        return completed$;
      }

      if (this.activeFirestoreConnections.includes(streamId({ actionType, action, trackBy }))) {
        return;
      }

      if (this.actionsPending.includes(streamId({ actionType, action, trackBy }))) {
        return completed$;
      }

      return completed$;
    });

    const actionDispatched$ = this.actions.pipe(
      ofActionDispatched(actionType),
      // skip actions already connected or cancelPrevious
      filter((action) => {
        return cancelPrevious || !this.activeFirestoreConnections.includes(streamId({ actionType, action, trackBy }));
      }),
      // filter actions dispatched on same tick
      filter((action) => {
        return !this.actionsPending.includes(streamId({ actionType, action, trackBy }));
      }),
      tap((action) => {
        this.actionsPending.push(streamId({ actionType, action, trackBy }));
      }),
    );

    const firestoreStreamHandler$ = (action: T) => {
      const streamFn = opts.to;
      return streamFn(action).pipe(
        // connected
        tapOnce((_) => {
          const StreamConnectedClass = StreamConnected(actionType);
          this.store.dispatch(new StreamConnectedClass(action));
          this.activeFirestoreConnections.push(streamId({ actionType, action, trackBy }));
          // remove from actionsPending once connected
          this.actionsPending.splice(this.actionsPending.indexOf(streamId({ actionType, action, trackBy })), 1);

          this.store.dispatch(new RepositoryConnectActions.StreamConnected(streamId({ actionType, action, trackBy })));
        }),
        // emmited
        tap((payload) => {
          const StreamEmittedClass = StreamEmitted(actionType);
          this.store.dispatch(new StreamEmittedClass(action, payload));
          this.store.dispatch(
            new RepositoryConnectActions.StreamEmitted({
              id: streamId({ actionType, action, trackBy }),
              items: payload,
            }),
          );
        }),
        // completed if FirstEmit
        tapOnce(() => {
          if (connectedActionFinishesOn === 'FirstEmit') {
            const { actionCompletedHandlerSubject } = getSubjects(streamId({ actionType, action, trackBy }));
            actionCompletedHandlerSubject.next(action);
          }
        }),
        takeUntil(
          race(
            this.actions.pipe(ofActionDispatched(new DisconnectStream(actionType) as any)),
            this.actions.pipe(ofActionDispatched(DisconnectAll)),
            this.actions.pipe(ofActionDispatched(Disconnect)).pipe(
              filter((disconnectAction) => {
                const { payload } = disconnectAction;
                if (!payload) {
                  return false;
                }
                const disconnectedStreamId = streamId({
                  actionType: payload.constructor || payload,
                  action: disconnectAction.payload,
                  trackBy,
                });

                return disconnectedStreamId === streamId({ actionType, action, trackBy });
              }),
            ),
          ),
        ),
        finalize(() => {
          const StreamDisconnectedClass = StreamDisconnected(actionType);
          this.store.dispatch(new StreamDisconnectedClass(action));
          this.store.dispatch(
            new RepositoryConnectActions.StreamDisconnected(streamId({ actionType, action, trackBy })),
          );
          this.activeFirestoreConnections.splice(
            this.activeFirestoreConnections.indexOf(streamId({ actionType, action, trackBy })),
            1,
          );

          // completed if StreamCompleted
          if (connectedActionFinishesOn === 'StreamCompleted') {
            const { actionCompletedHandlerSubject } = getSubjects(streamId({ actionType, action, trackBy }));
            actionCompletedHandlerSubject.next(action);
          }
        }),
        catchError((err) => {
          const { actionCompletedHandlerSubject } = getSubjects(streamId({ actionType, action, trackBy }));
          actionCompletedHandlerSubject.error(err);

          const StreamErroredClass = StreamErrored(actionType);
          this.store.dispatch(new StreamErroredClass(action, err));

          return of({});
        }),
      );
    };
  }
}
