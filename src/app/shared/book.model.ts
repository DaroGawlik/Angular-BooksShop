export class BookModel {
  public author: string;
  public imageLink: string;
  public title: string;
  public price: number;
  public description: string;
  public amount?: string;

  constructor(
    author: string,
    imageLink: string,
    title: string,
    price: number,
    description: string,
    amount?: string
  ) {
    this.author = author;
    this.imageLink = imageLink;
    this.title = title;
    this.price = price;
    this.description = description;
    this.amount = amount;
  }
}