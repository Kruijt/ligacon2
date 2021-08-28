import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import { Injectable } from '@angular/core';

import { User } from 'firebase/auth';

import { Account } from '../../shared/models/account/account.model';
import { AuthRepository } from '../repositories/auth.repository';

@Injectable({ providedIn: 'root' })
export class AccountService {
  readonly account$: Observable<Account> = this.ar.user$.pipe(
    // @ts-ignore
    map((user) => this.parseToAccount(user)),
    shareReplay(1),
  );

  constructor(private ar: AuthRepository) {}

  private parseToAccount(user: User | null): Account {
    return {
      user: user?.uid
        ? {
            id: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoUrl: user.photoURL,
          }
        : void 0,
    };
  }
}
