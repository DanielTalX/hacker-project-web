export class Product {
  productId: number;
  productName: string;
  introductionDate: Date;
  price: number;
  url: string;
  categoryId: number;

  public constructor(init?: Partial<Product>) {
    this.productId = 0;
    this.productName = "";
    this.introductionDate = new Date();
    this.price = 0;
    this.url = "";
    this.categoryId = 0;
    Object.assign(this, init);
  }
}
