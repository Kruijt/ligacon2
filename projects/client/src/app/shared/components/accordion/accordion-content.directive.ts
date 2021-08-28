import { Directive } from '@angular/core';

import { StructuralDirective } from '../../directives/structural.directive';

@Directive({
  selector: '[liAccordionContent]',
})
export class AccordionContentDirective extends StructuralDirective {}
