import { Data, Params } from '@angular/router';

export interface RouterState {
  url: string;
  data: Data;
  params: Params;
  queryParams: Params;
}

export interface RouterNavStateModel {
  router: {
    state: RouterState;
  };
}
