import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccordionComponent } from './accordion.component';
import { AccordionHeaderDirective } from './accordion-header.directive';
import { AccordionContentDirective } from './accordion-content.directive';

@NgModule({
  declarations: [AccordionComponent, AccordionHeaderDirective, AccordionContentDirective],
  imports: [CommonModule],
  exports: [AccordionComponent, AccordionHeaderDirective, AccordionContentDirective],
})
export class AccordionModule {}
