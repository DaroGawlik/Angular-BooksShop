import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-order-fields',
  templateUrl: './order-fields.component.html',
  styleUrls: ['./order-fields.component.scss'],
})
export class OrderFieldsComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
  // Other ways if u need get access to filed before submit
  // @ViewChild('f') signupForm: NgForm;
  // onSubmit() {
  //   console.log(this.signupForm);
  // }
  public value = new Date();
  paymentTypes = ['Cash', 'Card'];
  additionalInformation = '';
  onSubmit(form: NgForm) {
    console.log(form);
    console.log();
    // form.reset();
  }

  dateChanged($event: any) {
    console.log($event.target.value);
  }
}
