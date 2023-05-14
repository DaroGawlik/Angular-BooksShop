import {
  Component,
  DoCheck,
  OnInit,
  ViewChild,
  Output,
  EventEmitter,
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
  NgForm,
  FormBuilder,
} from '@angular/forms';
import { BooksService } from 'src/app/service/books.service';
import { BookModel } from 'src/app/shared/book.model';

@Component({
  selector: 'app-order-fields',
  templateUrl: './order-fields.component.html',
  styleUrls: ['./order-fields.component.scss'],
})
export class OrderFieldsComponent implements OnInit, DoCheck {
  signupForm: FormGroup;
  paymentTypes = ['Cash', 'Card'];
  additionalInformation = '';
  todayDate = new Date();
  miniumDeliveryDate = this.todayDate.setDate(this.todayDate.getDate() + 2);
  maxCharsOfArea = 80;
  textOfArea = '';
  howClickedGifts: number = 0;

  // BAGBAR
  public bagOfBooksArr: BookModel[] = [];
  countAllBookInBag: number = 0;
  isAsideOpen: boolean = false;

  gifts = [
    {
      text: 'Pack as a gift',
      isClick: false,
    },
    {
      text: 'Add postcard',
      isClick: false,
    },
    {
      text: 'Provide 2% discount to the next time',
      isClick: false,
    },
    {
      text: 'Branded pen or pencil',
      isClick: false,
    },
  ];

  // @Output()
  // isAsideOpen = new EventEmitter<boolean>();

  constructor(private bookService: BooksService) {
    this.bookService.getBagOfBooksObs().subscribe((booksInBag: BookModel[]) => {
      this.countAllBookInBag = booksInBag.length;
    });
  }

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
          Validators.pattern('[a-zA-Z0-9.]*$'),
        ]),
        flatNumber: new FormControl(null, [
          Validators.required,
          Validators.pattern('[[1-9](-?[1-9][0-9]*)]*$'),
        ]),
      }),
      paymentType: new FormControl(null, [Validators.required]),
      gifts: new FormArray([]),
      additionalInformation: new FormControl(),
    });
  }

  clickGift(gift: any) {
    gift.isClick = !gift.isClick;

    this.howClickedGifts = this.gifts.filter(
      (gift) => gift.isClick === true
    ).length;
  }

  pushGiftsToControlArray(arr: any) {
    for (let gift of arr) {
      {
        let test = new FormControl(gift);
        console.log(gift);
        (<FormArray>this.signupForm.get('gifts')).push(test);
      }
    }
  }

  onSubmit() {
    const checkedGifts = this.gifts.filter((gift) => gift.isClick === true);
    const giftsArr: any = [];
    checkedGifts.forEach((gift) => giftsArr.push(gift.text));
    this.pushGiftsToControlArray(giftsArr);
    console.log(this.signupForm.value);
  }

  openAside() {
    this.isAsideOpen = true;
  }

  ngDoCheck(): void {}
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
