import { map } from 'rxjs/operators';

import { Injectable } from '@angular/core';

import { Action, NgxsOnInit, Selector, State, StateContext } from '@ngxs/store';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';

import { SetAccount } from './account-state.actions';

import { YoloService } from '../../services/yolo.service';
import { AccountService } from '../../services/account.service';

import { AccountStateToken } from './account-state.token';
import { AccountStateModel } from './account-state.model';
import { User } from '../../../shared/models/account/user.model';
import { Account } from '../../../shared/models/account/account.model';

@State({
  name: AccountStateToken,
  defaults: {},
})
@Injectable()
export class AccountState implements NgxsOnInit {
  @Selector()
  static user(state: Account): User | undefined {
    return state.user;
  }

  @Selector()
  static initial(state: Account): string {
    return (state.user?.displayName || state.user?.email)?.substring(0, 1) || '?';
  }

  @Selector()
  static userId(state: Account): string | undefined {
    return state.user?.id;
  }

  @Dispatch() readonly setAccount_ = (account: Account) => new SetAccount(account);

  constructor(private as: AccountService, private ys: YoloService) {}

  ngxsOnInit(): void {
    this.as.account$
      .pipe(
        map((account, index) => {
          if (!index && !account.user?.id) {
            this.ys.prompt();
          }

          return account;
        }),
      )
      .subscribe((account) => this.setAccount_(account));
  }

  @Action(SetAccount)
  setAccount({ setState }: StateContext<AccountStateModel>, { account }: SetAccount): void {
    setState(account);
  }
}
