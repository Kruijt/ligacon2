import { Injectable } from '@angular/core';
import { Data, Params } from '@angular/router';

import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Navigate, RouterState as NgxsRouterState } from '@ngxs/router-plugin';

import * as Actions from './router-nav-state.actions';

import { RouterNavStateModel } from './router-nav-state.model';
import { RouterNavStateToken } from './router-nav-state.token';

@State({
  name: RouterNavStateToken,
  children: [NgxsRouterState],
})
@Injectable()
export class RouterNavState {
  @Selector([NgxsRouterState])
  static data({ router }: RouterNavStateModel): Data {
    return router.state.data || {};
  }

  @Selector([NgxsRouterState])
  static params({ router }: RouterNavStateModel): Params {
    return router.state.params || {};
  }

  @Action(Actions.NavigateToCollections)
  navigateToCollections({ dispatch }: StateContext<NgxsRouterState>): void {
    dispatch(new Navigate(['/collections']));
  }
}
