import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FIREBASE_APP_NAME, FIREBASE_OPTIONS } from '@angular/fire/compat';

import { environment } from '../../../../environments/environment';
import { AppRoutingModule } from '../../../app-routing.module';

@NgModule({
  imports: [AppRoutingModule, BrowserModule, BrowserAnimationsModule],
  exports: [RouterModule],
})
export class CoreModule {
  static forRoot(): ModuleWithProviders<CoreModule> {
    return {
      ngModule: CoreModule,
      providers: [
        { provide: FIREBASE_OPTIONS, useValue: environment.firebase },
        { provide: FIREBASE_APP_NAME, useValue: environment.firebase.projectId },
      ],
    };
  }
}
