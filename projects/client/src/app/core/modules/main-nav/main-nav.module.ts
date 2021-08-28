import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';

import { MainNavComponent } from './components/main-nav.component';
import { AvatarModule } from '../../../modules/avatar/avatar.module';

@NgModule({
  declarations: [MainNavComponent],
  imports: [CommonModule, AvatarModule, MatToolbarModule],
  exports: [MainNavComponent],
})
export class MainNavModule {}
