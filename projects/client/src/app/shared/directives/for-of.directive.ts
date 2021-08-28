import { NgForOf, NgForOfContext } from '@angular/common';
import { Directive, Input, IterableDiffers, NgIterable, TemplateRef, ViewContainerRef } from '@angular/core';

import { BaseModel } from '../models/base.model';

@Directive({
  selector: '[for][forOf]',
})
export class ForOfDirective<T extends BaseModel, U extends NgIterable<T> = NgIterable<T>> extends NgForOf<T> {
  @Input()
  set forOf(forOf: T[] | undefined | null) {
    this.ngForOf = forOf;
  }

  get ngForTrackBy() {
    return (index: number, model: T) => model.id;
  }

  constructor(vc: ViewContainerRef, tr: TemplateRef<NgForOfContext<T, U>>, id: IterableDiffers) {
    super(vc, tr, id);
  }
}
