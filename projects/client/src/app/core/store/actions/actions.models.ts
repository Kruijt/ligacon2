export const enum ActionStatus {
  Dispatched = 'DISPATCHED',
  Successful = 'SUCCESSFUL',
  Canceled = 'CANCELED',
  Errored = 'ERRORED',
}

export interface ActionContext<T = any> {
  status: ActionStatus;
  action: T;
  error?: Error;
}
