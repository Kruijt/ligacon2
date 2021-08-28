import { Observable } from 'rxjs';

import { Injectable } from '@angular/core';

import { Action, NgxsOnInit, State, StateContext } from '@ngxs/store';

import * as Actions from './icon-state.actions';

import { Emitted } from '../../modules/repository/models/respository-types.model';
import { StreamEmitted } from '../../modules/repository/models/repository-decorator-helper.models';
import { IconStateModel } from './icon-state.model';
import { IconStateToken } from './icon-state.token';
import { RepositoryConnectService } from '../../modules/repository/repository-connect.service';
import { IconRepository } from '../../repositories/icon.repository';
import { Icon } from '../../../shared/models/icon/icon.model';

@State({
  name: IconStateToken,
  defaults: [],
})
@Injectable()
export class IconState implements NgxsOnInit {
  constructor(private ir: IconRepository, private fc: RepositoryConnectService) {}

  ngxsOnInit(): void {
    this.fc.connect(Actions.GetAll, {
      to: () => this.ir.collection$(),
    });
  }

  @Action(Actions.Create)
  create(): Observable<string> {
    return this.ir.create$();
  }

  @Action(Actions.Update)
  update(_: StateContext<IconStateModel>, { id, update }: Actions.Update): Observable<string> {
    return this.ir.update$(id, update);
  }

  @Action(Actions.Delete)
  delete(_: StateContext<IconStateModel>, { id }: Actions.Delete): Observable<void> {
    return this.ir.delete$(id);
  }

  @Action(Actions.Duplicate)
  duplicate({ getState }: StateContext<IconStateModel>, { id }: Actions.Duplicate): Observable<string> {
    const icon = getState().find((i) => i.id === id);

    if (!icon) {
      throw new Error(`Icon ${id} not found to duplicate`);
    }

    return this.ir.create$({
      ...icon,
      name: icon.name && `${icon.name} (Duplicate)`,
    });
  }

  @Action(StreamEmitted(Actions.GetAll))
  getAllEmitted({ setState }: StateContext<IconStateModel>, { payload }: Emitted<Actions.GetAll, Icon[]>) {
    setState(payload);
  }
}
