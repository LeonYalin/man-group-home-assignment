import { Coupon } from "../../shared/models";


export const availableCoupons: Coupon[] = [
  {
    Code: "freeShipping!",
    Description: "Free Shipping",
    Type: 1,
  },
  {
    Code: "APPL10",
    Description: "10% on all Apple Products",
    Type: 2,
    Discount: 0.1,
    SupplierId: 1,
  },
  {
    Code: "AUDIO15",
    Description: "15% on all Audio Products",
    Type: 3,
    Discount: 0.15,
    Category: "audio",
  },
  {
    Code: "ELEC25",
    Description: "25% on all Electronic Products",
    Type: 3,
    Discount: 0.25,
    Category: "electronic",
  },
];
