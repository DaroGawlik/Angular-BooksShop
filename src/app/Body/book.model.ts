export class BookModel {
  public author: string;
  public imageLink: string;
  public title: string;
  public price: number;
  public description: string;

  constructor(
    author: string,
    imageLink: string,
    title: string,
    price: number,
    description: string
  ) {
    this.author = author;
    this.imageLink = imageLink;
    this.title = title;
    this.price = price;
    this.description = description;
  }
}
