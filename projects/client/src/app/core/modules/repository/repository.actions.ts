import { ActionTypeDef } from './models/respository-types.model';

namespace RepositoryPayloads {
  export interface StreamEmitted {
    id: string;
    items: any;
  }
}

export namespace RepositoryConnectActions {
  export class StreamConnected {
    static readonly type = '[Repository] Connected';

    constructor(public payload: string) {}
  }
  export class StreamEmitted {
    static readonly type = '[Repository] Emitted';

    constructor(public payload: RepositoryPayloads.StreamEmitted) {}
  }
  export class StreamDisconnected {
    static readonly type = '[Repository] Disconnected';

    constructor(public payload: string) {}
  }
}

export class DisconnectStream {
  constructor(actionType: ActionTypeDef<any>) {
    return { type: `${actionType.type} Disconnect` };
  }
}

export class DisconnectAll {
  static readonly type = '[NgxsFirestore] DisconnectAll';
}

export class Disconnect {
  static readonly type = '[NgxsFirestore] Disconnect';

  constructor(public payload: any) {}
}
