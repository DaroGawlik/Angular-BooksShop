import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appCheckWidthpage]',
})
export class CheckWidthPageDirective {
  ngOnInit(): void {
    this.innerWidth = window.innerWidth;
  }

  public innerWidth: any;
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.innerWidth = window.innerWidth;
    console.log(this.innerWidth);
  }
}
