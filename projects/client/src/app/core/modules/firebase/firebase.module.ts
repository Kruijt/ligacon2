import { ModuleWithProviders, NgModule } from '@angular/core';

import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from '../../../../environments/environment';

@NgModule({
  imports: [AngularFireModule.initializeApp(environment.firebase, environment.firebase.projectId)],
  providers: [],
  exports: [AngularFireModule, AngularFireAuthModule, AngularFirestoreModule],
})
export class FirebaseModule {
  static forRoot(): ModuleWithProviders<FirebaseModule> {
    return {
      ngModule: FirebaseModule,
    };
  }
}
