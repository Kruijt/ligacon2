import { Injectable } from '@angular/core';
import { RouterStateSnapshot } from '@angular/router';

import { RouterStateSerializer } from '@ngxs/router-plugin';

import { RouterState } from './router-nav-state.model';

@Injectable()
export class RouterNavStateSerializer implements RouterStateSerializer<RouterState> {
  serialize(routerState: RouterStateSnapshot): RouterState {
    const {
      url,
      root: { queryParams },
    } = routerState;

    let { root: route } = routerState;

    while (route.firstChild) {
      route = route.firstChild;
    }

    const { params, data } = route;

    return { url, params, data, queryParams };
  }
}
