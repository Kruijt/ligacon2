import { StateToken } from '@ngxs/store';

import { AccountStateModel } from './account-state.model';

export const AccountStateToken = new StateToken<AccountStateModel>('account');
