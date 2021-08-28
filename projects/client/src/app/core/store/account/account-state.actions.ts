import { Account } from '../../../shared/models/account/account.model';

export class SetAccount {
  static type = '[Account] - Set';

  constructor(readonly account: Account) {}
}
