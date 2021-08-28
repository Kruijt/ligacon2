import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { Component } from '@angular/core';

import { Select } from '@ngxs/store';

import { User } from '../../../shared/models/account/user.model';
import { AccountState } from '../../../core/store/account/account.state';

@Component({
  selector: 'li-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
})
export class AvatarComponent {
  @Select(AccountState.user)
  readonly user$!: Observable<User | undefined>;

  @Select(AccountState.initial)
  readonly initial$!: Observable<string>;

  readonly avatar$: Observable<string | undefined> = this.user$.pipe(map((user) => user?.photoUrl || void 0));
}
