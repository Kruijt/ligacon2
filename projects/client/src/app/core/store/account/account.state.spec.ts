import { from, of } from 'rxjs';

import { NgxsModule, Store } from '@ngxs/store';
import { NgxsDispatchPluginModule } from '@ngxs-labs/dispatch-decorator';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator';

import { AccountState } from './account.state';
import { AccountStateToken } from './account-state.token';

import { YoloService } from '../../services/yolo.service';
import { AccountService } from '../../services/account.service';
import { SetAccount } from './account-state.actions';
import { Account } from '../../../shared/models/account/account.model';

describe('AccountState', () => {
  const creator = createServiceFactory({
    service: AccountState,
    mocks: [AccountService, YoloService],
    imports: [NgxsModule.forRoot([AccountState]), NgxsDispatchPluginModule],
  });

  let spec: SpectatorService<AccountState>;
  let as: AccountState;
  let ar: AccountService;
  let ys: YoloService;
  let store: Store;

  beforeEach(() => {
    spec = creator();
    as = spec.service;

    ar = spec.inject(AccountService);
    ys = spec.inject(YoloService);
    store = spec.inject(Store);
  });

  it('should create', () => expect(as).toBeTruthy());

  it('should start with no user or team set', () => {
    expect(store.selectSnapshot(AccountStateToken).user).toBe(undefined);
    expect(store.selectSnapshot(AccountStateToken).team).toBe(undefined);
  });

  it('should set user id', () => {
    const account = { user: { id: 'user' }, team: { id: 'team' } } as Account;
    store.dispatch(new SetAccount(account));

    expect(store.selectSnapshot(AccountStateToken).user?.id).toBe(account.user?.id);
    expect(store.selectSnapshot(AccountStateToken).team?.id).toBe(account.team?.id);
  });

  it('should subscribe to account observable on ngxsOnInit', () => {
    const account = { user: void 0, team: void 0 };
    const obs = of(account);
    spyOn(obs, 'subscribe').and.callThrough();

    (ar as any).account$ = obs;
    as.ngxsOnInit();

    expect(obs.subscribe).toHaveBeenCalled();
  });

  it('should only call yolo prompt when first time no account', () => {
    (ar as any).account$ = of({ user: void 0, team: void 0 });
    as.ngxsOnInit();

    expect(ys.prompt).toHaveBeenCalled();

    (ys.prompt as any).calls.reset();

    (ar as any).account$ = of({ user: { id: 'uid' }, team: void 0 });
    as.ngxsOnInit();

    expect(ys.prompt).not.toHaveBeenCalled();

    (ys.prompt as any).calls.reset();

    (ar as any).account$ = from([
      { user: { id: 'uid' }, team: void 0 },
      { user: void 0, team: void 0 },
    ]);
    as.ngxsOnInit();

    expect(ys.prompt).not.toHaveBeenCalled();

    (ys.prompt as any).calls.reset();

    (ar as any).account$ = from([
      { user: void 0, team: void 0 },
      { user: { id: 'uid' }, team: void 0 },
    ]);
    as.ngxsOnInit();

    expect(ys.prompt).toHaveBeenCalledTimes(1);
  });
});
