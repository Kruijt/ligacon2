import { StateToken } from '@ngxs/store';

import { RouterNavStateModel } from './router-nav-state.model';

export const RouterNavStateToken = new StateToken<RouterNavStateModel>('routerNav');
