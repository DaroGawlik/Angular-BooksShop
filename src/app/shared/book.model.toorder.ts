export class BookModelToOrder {
    public author: string;
    public title: string;
    public amount: number;

    constructor(author: string, title: string, amount: number) {
      this.author = author;
      this.title = title;
      this.amount = amount;
    }
  }
