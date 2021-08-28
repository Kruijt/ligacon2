import { Collection } from '../../../shared/models/collection/collection.model';

export class Create {
  static type = '[Collection] - Create';
}

export class GetAll {
  static type = '[Collection] - Get All';
}

export class Update {
  static type = '[Collection] - Update';

  constructor(readonly id: string, readonly update: Partial<Collection>) {}
}

export class Delete {
  static type = '[Collection] - Delete';

  constructor(readonly id: string) {}
}

export class Duplicate {
  static type = '[Collection] - Duplicate';

  constructor(readonly id: string) {}
}

export class Open {
  static type = '[Collection] - Load';

  constructor(readonly id: string) {}
}

export class Close {
  static type = '[Collection] - Close';

  constructor(readonly id: string) {}
}
