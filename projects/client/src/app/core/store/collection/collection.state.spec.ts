import { NgxsModule, Store } from '@ngxs/store';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator';

import { CollectionState } from './collection.state';
import { Create } from './collection-state.actions';
import { CollectionStateToken } from './collection-state.token';

describe('CollectionState', () => {
  const creator = createServiceFactory({
    service: CollectionState,
    mocks: [],
    imports: [NgxsModule.forRoot([CollectionState])],
  });

  let spec: SpectatorService<CollectionState>;
  let cs: CollectionState;
  let store: Store;

  beforeEach(() => {
    spec = creator();
    cs = spec.service;
    store = spec.inject(Store);
  });

  it('should create', () => expect(cs).toBeTruthy());

  it('should start with empty collection', () => {
    expect(store.selectSnapshot(CollectionStateToken).length).toBe(0);
  });

  it('should add collection on create', () => {
    store.dispatch(new Create());

    expect(store.selectSnapshot(CollectionStateToken).length).toBe(1);
  });
});
