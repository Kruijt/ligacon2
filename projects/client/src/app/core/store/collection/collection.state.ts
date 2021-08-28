import { Observable } from 'rxjs';

import { Injectable } from '@angular/core';

import { Action, NgxsOnInit, State, StateContext } from '@ngxs/store';

import * as Actions from './collection-state.actions';

import { Emitted } from '../../modules/repository/models/respository-types.model';
import { Collection } from '../../../shared/models/collection/collection.model';
import { StreamEmitted } from '../../modules/repository/models/repository-decorator-helper.models';
import { CollectionStateModel } from './collection-state.model';
import { CollectionStateToken } from './collection-state.token';
import { CollectionRepository } from '../../repositories/collection.repository';
import { RepositoryConnectService } from '../../modules/repository/repository-connect.service';

@State({
  name: CollectionStateToken,
  defaults: [],
})
@Injectable()
export class CollectionState implements NgxsOnInit {
  constructor(private cr: CollectionRepository, private fc: RepositoryConnectService) {}

  ngxsOnInit(): void {
    this.fc.connect(Actions.GetAll, {
      to: () => this.cr.collection$(),
    });
  }

  @Action(Actions.Create)
  create(): Observable<string> {
    return this.cr.create$();
  }

  @Action(Actions.Update)
  update(_: StateContext<CollectionStateModel>, { id, update }: Actions.Update): Observable<string> {
    return this.cr.update$(id, update);
  }

  @Action(Actions.Delete)
  delete(_: StateContext<CollectionStateModel>, { id }: Actions.Delete): Observable<void> {
    return this.cr.delete$(id);
  }

  @Action(Actions.Duplicate)
  duplicate({ getState }: StateContext<CollectionStateModel>, { id }: Actions.Duplicate): Observable<string> {
    const collection = getState().find((col) => col.id === id);

    if (!collection) {
      throw new Error(`Collection ${id} not found to duplicate`);
    }

    return this.cr.create$({
      ...collection,
      name: collection.name && `${collection.name} (Duplicate)`,
    });
  }

  @Action(StreamEmitted(Actions.GetAll))
  getAllEmitted({ setState }: StateContext<CollectionStateModel>, { payload }: Emitted<Actions.GetAll, Collection[]>) {
    setState(payload);
  }
}
