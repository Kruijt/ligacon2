import { NgModule } from '@angular/core';

import { NgxsModule } from '@ngxs/store';

import { CoreModule } from './core/modules/core/core.module';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [CoreModule.forRoot(), NgxsModule.forRoot([], { developmentMode: !environment.production })],
  bootstrap: [AppComponent],
})
export class AppModule {}
