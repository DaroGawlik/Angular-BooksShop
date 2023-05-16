export interface Order {
  orderData: object;
  deliveryDate: string;
  deliveryAdrress: object;
  paymentType: string;
  gifts: string[];
  additionalInformation: string;
  books: object[];
  id?: string;
}
