export interface Order {
  [key: string]: any;
  orderData: object;
  deliveryDate: string;
  deliveryAdrress: object;
  paymentType: string;
  gifts: string[];
  additionalInformation: string;
  books: object[];
  id?: string;
  orderDate: string;
}
