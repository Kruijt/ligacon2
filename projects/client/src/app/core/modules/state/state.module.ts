import { ModuleWithProviders, NgModule } from '@angular/core';

import { NgxsModule } from '@ngxs/store';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsDispatchPluginModule } from '@ngxs-labs/dispatch-decorator';

import { IconState } from '../../store/icon/icon.state';
import { environment } from '../../../../environments/environment';
import { AccountState } from '../../store/account/account.state';
import { ActionsState } from '../../store/actions/actions.state';
import { CollectionState } from '../../store/collection/collection.state';
import { RouterNavStateModule } from '../../store/router-nav/router-nav-state.module';

@NgModule({
  imports: [
    NgxsModule.forFeature([AccountState, CollectionState, IconState, ActionsState]),
    NgxsDispatchPluginModule.forRoot(),
    NgxsLoggerPluginModule.forRoot({ disabled: environment.production }),

    RouterNavStateModule.forRoot(),
  ],
})
export class StateModule {
  static forRoot(): ModuleWithProviders<StateModule> {
    return {
      ngModule: StateModule,
    };
  }
}
