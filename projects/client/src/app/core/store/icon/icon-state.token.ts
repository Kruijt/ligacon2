import { StateToken } from '@ngxs/store';

import { IconStateModel } from './icon-state.model';

export const IconStateToken = new StateToken<IconStateModel>('icon');
