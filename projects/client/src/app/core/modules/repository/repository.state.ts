import { Injectable } from '@angular/core';

import { State, StateContext, NgxsOnInit, Action } from '@ngxs/store';
import { patch, insertItem, removeItem, updateItem } from '@ngxs/store/operators';

import { RepositoryConnectActions } from './repository.actions';

export interface FirestoreConnection {
  id: string;
  connectedAt: Date;
  emmitedAt: Date[];
}

export interface RepositoryStateModel {
  connections: FirestoreConnection[];
}

@State<RepositoryStateModel>({
  name: 'repository',
  defaults: {
    connections: [],
  },
})
@Injectable()
export class RepositoryState implements NgxsOnInit {
  ngxsOnInit({ dispatch }: StateContext<RepositoryStateModel>) {}

  @Action([RepositoryConnectActions.StreamConnected])
  streamConnected(
    { setState }: StateContext<RepositoryStateModel>,
    { payload }: RepositoryConnectActions.StreamConnected,
  ) {
    const conn = {
      connectedAt: new Date(),
      id: payload,
    } as FirestoreConnection;

    setState(patch({ connections: insertItem(conn) }));
  }

  @Action([RepositoryConnectActions.StreamEmitted])
  streamEmitted({ setState }: StateContext<RepositoryStateModel>, { payload }: RepositoryConnectActions.StreamEmitted) {
    const { id } = payload;

    setState(
      patch<RepositoryStateModel>({
        connections: updateItem((x) => x?.id === id, patch({ emmitedAt: insertItem(new Date()) })),
      }),
    );
  }

  @Action([RepositoryConnectActions.StreamDisconnected])
  streamDisconnected(
    { setState, getState }: StateContext<RepositoryStateModel>,
    { payload }: RepositoryConnectActions.StreamDisconnected,
  ) {
    setState(patch<RepositoryStateModel>({ connections: removeItem((x) => x?.id === payload) }));
  }
}
