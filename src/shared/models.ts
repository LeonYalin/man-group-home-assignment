export enum CouponType {
  Undefined = 0,
  FreeShipping = 1,
  Supplier = 2,
  Category = 3,
}

export interface Coupon {
  Code: string;
  Description: string;
  Type: CouponType;
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
