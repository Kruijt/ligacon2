import { StateToken } from '@ngxs/store';

import { CollectionStateModel } from './collection-state.model';

export const CollectionStateToken = new StateToken<CollectionStateModel>('collection');
