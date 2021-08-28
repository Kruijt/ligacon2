import { Icon } from '../../../shared/models/icon/icon.model';

export class Create {
  static type = '[Icon] - Create';
}

export class GetAll {
  static type = '[Icon] - Get All';

  constructor(readonly collectionId: string) {}
}

export class Update {
  static type = '[Icon] - Update';

  constructor(readonly id: string, readonly update: Partial<Icon>) {}
}

export class Delete {
  static type = '[Icon] - Delete';

  constructor(readonly id: string) {}
}

export class Duplicate {
  static type = '[Icon] - Duplicate';

  constructor(readonly id: string) {}
}
