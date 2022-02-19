export class Category {

  categoryId: number;
  categoryName: string;

  public constructor(init?: Partial<Category>) {
    this.categoryId = 0;
    this.categoryName = "";
    Object.assign(this, init);
  }

}
