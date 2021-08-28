import { Directive, TemplateRef } from '@angular/core';

@Directive()
export abstract class StructuralDirective<T = any> {
  constructor(readonly tr: TemplateRef<T>) {}
}
