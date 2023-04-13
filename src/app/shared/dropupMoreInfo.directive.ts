import { Directive, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: '[appDropupMoreInfo]',
})
export class DropupDirective {
  constructor() {}

  @HostBinding('class.open') isOpen = false;

  @HostListener('click') toggleOpen() {
    this.isOpen = !this.isOpen;
  }
}
