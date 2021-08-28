import { NgModule } from '@angular/core';

import { ForOfDirective } from './directives/for-of.directive';
import { LoadingDirective } from './directives/loading.directive';

@NgModule({
  declarations: [ForOfDirective, LoadingDirective],
  exports: [ForOfDirective, LoadingDirective],
})
export class SharedModule {}
