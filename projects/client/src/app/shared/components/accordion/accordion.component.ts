import { mapTo, switchMap } from 'rxjs/operators';
import { Observable, of, timer } from 'rxjs';

import { CdkAccordionItem } from '@angular/cdk/accordion';
import { matExpansionAnimations, MatExpansionPanelState } from '@angular/material/expansion';
import { ChangeDetectionStrategy, Component, ContentChild } from '@angular/core';

import { AccordionHeaderDirective } from './accordion-header.directive';
import { AccordionContentDirective } from './accordion-content.directive';

@Component({
  selector: 'li-accordion',
  templateUrl: 'accordion.component.html',
  styleUrls: ['accordion.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [matExpansionAnimations.bodyExpansion],
})
export class AccordionComponent extends CdkAccordionItem {
  @ContentChild(AccordionHeaderDirective, { static: true })
  header?: AccordionHeaderDirective;

  @ContentChild(AccordionContentDirective, { static: true })
  content?: AccordionContentDirective;

  readonly showContent$: Observable<boolean> = this.expandedChange.pipe(
    switchMap((expand) => (expand ? of(true) : timer(1).pipe(mapTo(false)))),
  );

  get expandedState(): MatExpansionPanelState {
    return this.expanded ? 'expanded' : 'collapsed';
  }
}
