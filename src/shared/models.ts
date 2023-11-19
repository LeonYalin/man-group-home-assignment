export interface Coupon {
  Code: string;
  Description: string;
  Type: number;
  Discount?: number;
  Category?: string;
  SupplierId?: number;
}

export class Product {
  constructor(
    public id = 0,
    public name = "",
    public imageUrl = "",
    public supplierId = 0,
    public wholesalePrice = 0,
    public price = 0,
    public categories: string[] = []
  ) {}
}
