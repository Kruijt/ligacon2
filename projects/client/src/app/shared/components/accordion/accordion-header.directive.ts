import { Directive } from '@angular/core';

import { StructuralDirective } from '../../directives/structural.directive';

@Directive({
  selector: '[liAccordionHeader]',
})
export class AccordionHeaderDirective extends StructuralDirective {}
