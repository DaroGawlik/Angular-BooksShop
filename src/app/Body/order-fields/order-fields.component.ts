import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  Validators,
  NgForm,
} from '@angular/forms';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-order-fields',
  templateUrl: './order-fields.component.html',
  styleUrls: ['./order-fields.component.scss'],
})
export class OrderFieldsComponent implements OnInit {
  signupForm: FormGroup;
  paymentTypes = ['Cash', 'Card'];
  additionalInformation = '';
  todayDate = new Date();
  miniumDeliveryDate = this.todayDate.setDate(this.todayDate.getDate() + 2);
  gifts = this._formBuilder.group({
    packAsAgift: false,
    addPostcard: false,
    provide: false,
    brandedPenOrPencil: false,
  });
  constructor(private _formBuilder: FormBuilder) {}

  ngOnInit() {
    this.signupForm = new FormGroup({
      orderData: new FormGroup({
        name: new FormControl(null, [
          Validators.required,
          Validators.pattern('[a-zA-Z.]*$'),
          Validators.minLength(4),
        ]),
        surname: new FormControl(null, [
          Validators.required,
          Validators.pattern('[a-zA-Z.]*$'),
          Validators.minLength(5),
        ]),
      }),
      deliveryDate: new FormControl(null, [Validators.required]),
      deliveryAdrress: new FormGroup({
        street: new FormControl(null, [
          Validators.required,
          Validators.pattern('[a-zA-Z0-9.]*$'),
          Validators.minLength(5),
        ]),
        houseNumber: new FormControl(null, [
          Validators.required,
          Validators.pattern('[0-9.]*$'),
        ]),
        flatNumber: new FormControl(null, [
          Validators.required,
          Validators.pattern('[[1-9](-?[1-9][0-9]*)]*$'),
        ]),
      }),
      paymentType: new FormControl(null, [Validators.required]),
      gifts: new FormArray([]),
    });
  }

  onAddGift() {
    console.log(this.gifts.value);
  }

  onSubmit() {
    console.log(this.signupForm);
  }
}

// handling forms in angular apps/ Template-driven method

//   Other ways if u need get access to filed before submit
//   @ViewChild('f') signupForm: NgForm;
//   onSubmit() {
//     console.log(this.signupForm);
//   }
//   onSubmit(form: NgForm) {
//     console.log(form);
//     form.reset();
//   }
