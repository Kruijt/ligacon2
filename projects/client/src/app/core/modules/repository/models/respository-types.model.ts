export interface Connected<T> {
  action: T;
}
export interface Emitted<T, U> {
  action: T;
  payload: U;
}
export interface Disconnected<T> {
  action: T;
}

export interface Errored<T> {
  action: T;
  error: any;
}

export interface ActionTypeDef<T> {
  type: string;
  new (...args: any): T;
}
