import { Directive, Input, HostBinding } from '@angular/core';

@Directive({
  selector: '[loading]',
})
export class LoadingDirective {
  @Input()
  @HostBinding('class.loading')
  loading: boolean = false;

  @Input()
  disabled?: boolean;

  @HostBinding('disabled')
  get isDisabled(): boolean {
    return this.loading || !!this.disabled;
  }
}
