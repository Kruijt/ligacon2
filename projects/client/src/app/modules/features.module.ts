import { NgModule } from '@angular/core';

import { StateModule } from '../core/modules/state/state.module';
import { MainNavModule } from '../core/modules/main-nav/main-nav.module';
import { RepositoryModule } from '../core/modules/repository/repository.module';
import { FeaturesComponent } from './features.component';
import { FeaturesRoutingModule } from './features-routing.module';

@NgModule({
  declarations: [FeaturesComponent],
  imports: [StateModule.forRoot(), RepositoryModule.forRoot(), FeaturesRoutingModule, MainNavModule],
})
export class FeaturesModule {}
