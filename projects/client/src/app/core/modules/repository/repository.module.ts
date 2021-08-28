import { ModuleWithProviders, NgModule } from '@angular/core';

import { NgxsModule } from '@ngxs/store';

import { FirebaseModule } from '../firebase/firebase.module';
import { RepositoryState } from './repository.state';

@NgModule({
  imports: [FirebaseModule.forRoot(), NgxsModule.forFeature([RepositoryState])],
})
export class RepositoryModule {
  static forRoot(): ModuleWithProviders<RepositoryModule> {
    return {
      ngModule: RepositoryModule,
    };
  }
}
