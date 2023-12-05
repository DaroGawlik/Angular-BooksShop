import { BookModel } from "./book.model";
export interface Order {
  [key: string]: any;
  orderId: number;
  orderData: {
    name: string;
    surname: string;
  };
  deliveryDate: string | null;
  deliveryAddress: {
    street: string;
    houseNumber: string;
    flatNumber: string;
  };
  paymentType: string | null;
  gifts: string[] | null;
  additionalInformation: string | null;
  books: BookModel[] | null;
  orderDate: string | null;
}