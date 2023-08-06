import { Component, DoCheck, OnInit, OnDestroy } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { BookModel } from 'src/app/shared/book.model';
import { BooksService } from 'src/app/service/books.service';
import { Order } from 'src/app/shared/order.model';
import { OrdersService } from 'src/app/service/orders.service';
import { BookModelToOrder } from 'src/app/shared/book.model.toorder';

import { State as BooksInBagState } from 'src/app/service/store-ngrx/booksInbag.reducer';
import * as fromBooksInBag from 'src/app/service/store-ngrx/booksInbag.selectors';
import * as BooksInBagActions from 'src/app/service/store-ngrx/booksInbag.actions';
@Component({
  selector: 'app-order-fields',
  templateUrl: './order-fields.component.html',
  styleUrls: ['./order-fields.component.scss'],
})
export class OrderFieldsComponent implements OnInit, DoCheck {
  loadedOrders: Order[] = [];
  isFetching = false;
  error: string | null = null;

  lengthBooksInBag$: Observable<number>;
  bagOfBooksArr$: Observable<BookModel[]>;

  public BooksModelToOrder: BookModelToOrder[] = [];

  signupForm: FormGroup;
  paymentTypes = ['Cash', 'Card'];
  additionalInformation: string = '';
  todayDate = new Date();
  miniumDeliveryDate = this.todayDate.setDate(this.todayDate.getDate() + 2);
  maxCharsOfArea: number = 80;
  howClickedGifts: number = 0;

  // BAGBAR
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

  constructor(
    private bookService: BooksService,
    private ordersService: OrdersService,
    private router: Router,
    private store: Store<{ bag: BooksInBagState }>
  ) {}

  ngOnInit() {
    this.lengthBooksInBag$ = this.store.select(fromBooksInBag.lengthBooksInBag);
    this.bagOfBooksArr$ = this.store.select(fromBooksInBag.selectBooksInbag);

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
      orderDate: new FormControl(this.todayDate, [Validators.required]),
    });
    // this.isFetching = true;
    // this.ordersService.fetchOrders().subscribe(
    //   (orders) => {
    //     this.isFetching = false;
    //     this.loadedOrders = orders;
    //   },
    //   (error) => {
    //     this.error = error.message;
    //   }
    // );
    // this.additionalInformationControl =
    //   this.signupForm.controls['additionalInformation'];
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

  order() {
    const checkedGifts = this.gifts.filter((gift) => gift.isClick === true);
    const giftsArr: any = [];
    checkedGifts.forEach((gift) => giftsArr.push(gift.text));
    this.pushGiftsToControlArray(giftsArr);
    this.doArrayBooksToOrder();
    this.onCreatePost(this.signupForm.value);
    this.clearOrderFieldsAfterSend();
  }

  clearOrderFieldsAfterSend() {
    this.router.navigate(['/user-panel']);
    this.signupForm.reset();
    this.store.dispatch(BooksInBagActions.RemoveAllBooks());
  }

  // START API
  onCreatePost(postData: Order) {
    this.ordersService.createAndStoreOrder(postData);
  }

  // STOP API

  openAside() {
    this.isAsideOpen = true;
  }

  doArrayBooksToOrder() {
    const uniqueBooks: any[] = []; // Tymczasowa tablica na unikatowe książki

    this.bagOfBooksArr$.subscribe((booksInBag: BookModel[]) => {
      for (let book = 0; book < booksInBag.length; book++) {
        const bookModel = booksInBag[book];
        const cloneBook: any = (({ imageLink, description, price, ...rest }) =>
          rest)(bookModel);

        this.store
          .select(fromBooksInBag.countSameBooksInBag(bookModel))
          .subscribe((amount: number) => {
            cloneBook.amount = amount;

            // Sprawdzamy, czy książka już istnieje w tablicy unikatowych książek
            const existingBook = uniqueBooks.find(
              (book) => book.title === cloneBook.title
            );

            // Jeśli książka nie istnieje, dodajemy ją do tablicy unikatowych książek
            if (!existingBook) {
              uniqueBooks.push(cloneBook);
            }

            // Sprawdzamy, czy przetworzyliśmy już wszystkie książki, aby uniknąć powielania
            if (book === booksInBag.length - 1) {
              console.log(uniqueBooks);
              this.pushOrderBooksToControlArray(uniqueBooks); // Przekazujemy tablicę unikatowych książek do funkcji
            }
          });
      }
    });
  }

  pushOrderBooksToControlArray(arr: any) {
    for (let book of arr) {
      {
        let bookForm = new FormControl(book);
        (<FormArray>this.signupForm.get('books')).push(bookForm);
      }
    }
  }

  ngDoCheck() {}
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
