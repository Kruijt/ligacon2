import { tap } from 'rxjs/operators';

import { Injectable } from '@angular/core';

import {
  State,
  Actions,
  StateToken,
  NgxsOnInit,
  StateContext,
  createSelector,
  getActionTypeFromInstance,
} from '@ngxs/store';

import { actionsToType } from './actions.utilities';
import { ActionContext, ActionStatus } from './actions.models';

export type ActionsStateModel = Record<string, number>;

const ACTIONS_STATE = new StateToken<ActionsStateModel>('actions');

@Injectable()
@State<ActionsStateModel>({
  name: ACTIONS_STATE,
  defaults: {},
})
export class ActionsState implements NgxsOnInit {
  static whileAction(action: any | any[]) {
    const actionTypes = actionsToType(action);

    console.log(actionTypes);

    return createSelector([ActionsState], (state) => actionTypes.some((type) => !!state[type]));
  }

  constructor(private actions$: Actions) {}

  ngxsOnInit({ patchState, getState }: StateContext<ActionsStateModel>): void {
    this.actions$
      .pipe(
        tap((ctx: ActionContext) => {
          const type = getActionTypeFromInstance(ctx.action);

          if (!type) {
            return;
          }

          patchState({
            [type]: Math.max(0, (getState()[type] ?? 0) + (ctx.status === ActionStatus.Dispatched ? 1 : -1)),
          });
        }),
      )
      .subscribe();
  }
}
