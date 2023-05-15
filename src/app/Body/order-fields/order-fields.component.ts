import { Component, DoCheck, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { BooksService } from 'src/app/service/books.service';
import { BookModel } from 'src/app/shared/book.model';
import { BookModelToOrder } from 'src/app/shared/book.model.toorder';

@Component({
  selector: 'app-order-fields',
  templateUrl: './order-fields.component.html',
  styleUrls: ['./order-fields.component.scss'],
})
export class OrderFieldsComponent implements OnInit, DoCheck {
  public bagOfBooksArr: BookModel[] = [];
  public BooksModelToOrder: BookModelToOrder[] = [];

  signupForm: FormGroup;
  paymentTypes = ['Cash', 'Card'];
  additionalInformation = '';
  todayDate = new Date();
  miniumDeliveryDate = this.todayDate.setDate(this.todayDate.getDate() + 2);
  maxCharsOfArea = 80;
  textOfArea = '';
  howClickedGifts: number = 0;
  howMoreSameBook: number;
  howUniqueBooks: number;

  // BAGBAR
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

  constructor(private bookService: BooksService) {
    this.bookService.getBagOfBooksObs().subscribe((booksInBag: BookModel[]) => {
      this.bagOfBooksArr = booksInBag;
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
      books: new FormArray([]),
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
        let giftForm = new FormControl(gift);
        (<FormArray>this.signupForm.get('gifts')).push(giftForm);
      }
    }
  }

  onSubmit() {
    const checkedGifts = this.gifts.filter((gift) => gift.isClick === true);
    const giftsArr: any = [];
    checkedGifts.forEach((gift) => giftsArr.push(gift.text));
    this.pushGiftsToControlArray(giftsArr);
    this.getUniqueBooks();
    this.doArrayBooksToOrder(this.bagOfBooksArr);
    console.log(this.signupForm.value);
  }

  openAside() {
    this.isAsideOpen = true;
  }

  doArrayBooksToOrder(booksInBag: any) {
    let cloneBook: any;
    for (let book = 0; book < this.bagOfBooksArr.length; book++) {
      const bookModel = booksInBag[book];
      cloneBook = (({ imageLink, description, price, ...rest }) => rest)(
        bookModel
      );
      cloneBook.amount = this.countSameBook(cloneBook);
      if (
        this.BooksModelToOrder.filter((book) => book.title === cloneBook.title)
          .length < 1
      ) {
        this.BooksModelToOrder.push(cloneBook);
      }
    }
    this.pushOrderBooksToControlArray(this.BooksModelToOrder);
  }

  pushOrderBooksToControlArray(arr: any) {
    for (let book of arr) {
      {
        let bookForm = new FormControl(book);
        (<FormArray>this.signupForm.get('books')).push(bookForm);
      }
    }
  }

  countSameBook(cloneBook: any) {
    return this.bagOfBooksArr.filter((book) => book.title === cloneBook.title)
      .length;
  }

  getUniqueBooks() {
    this.howUniqueBooks = this.bagOfBooksArr.filter(
      (book, i, arr) => arr.findIndex((b) => b.author === book.author) === i
    ).length;
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
