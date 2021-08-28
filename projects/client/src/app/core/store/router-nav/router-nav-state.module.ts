import { ModuleWithProviders, NgModule } from '@angular/core';
import { NgxsRouterPluginModule, RouterStateSerializer } from '@ngxs/router-plugin';

import { NgxsModule } from '@ngxs/store';

import { RouterNavState } from './router-nav.state';
import { RouterNavStateSerializer } from './router-nav-state.serializer';

@NgModule({
  imports: [NgxsRouterPluginModule.forRoot(), NgxsModule.forFeature([RouterNavState])],
})
export class RouterNavStateModule {
  static forRoot(): ModuleWithProviders<RouterNavStateModule> {
    return {
      ngModule: RouterNavStateModule,
      providers: [{ provide: RouterStateSerializer, useClass: RouterNavStateSerializer }],
    };
  }
}
