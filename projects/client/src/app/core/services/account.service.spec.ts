import firebase from 'firebase';

import { of } from 'rxjs';
import { take } from 'rxjs/operators';

import { createServiceFactory, mockProvider } from '@ngneat/spectator';

import { AccountService } from './account.service';
import { AuthRepository } from '../repositories/auth.repository';

describe('AccountService', () => {
  const creator = createServiceFactory({
    service: AccountService,
    providers: [
      {
        provide: AuthRepository,
        useValue: {
          ...mockProvider(AuthRepository),
          user$: of(null),
        },
      },
    ],
  });

  const getAccount = (user: Partial<firebase.User> | null) =>
    new AccountService({ user$: of(user) } as AuthRepository).account$.pipe(take(1)).toPromise();

  it('should create', () => expect(creator().service).toBeTruthy());

  it('should have an account regardless of user', async () => {
    let account = await getAccount(null);

    expect(account).toBeTruthy();

    account = await getAccount({});

    expect(account.user).toEqual(undefined);

    account = await getAccount({ uid: 'user' });

    expect(account.user?.id).toEqual('user');
  });
});
