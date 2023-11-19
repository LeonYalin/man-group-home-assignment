import { Coupon, Product } from "../../shared/models";
import { SelectedCountsById } from "./ShoppingCardPage";

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

export interface ShoppingCardData {
  productsData: {
    product: Product;
    quantity: number;
  }[];
  total: number;
  shippingCost: number;
}

export function prepareShoppingCardData(
  products: Product[],
  countsById: SelectedCountsById
): ShoppingCardData {
  const shippingCardData: ShoppingCardData = {
    productsData: [],
    total: 0,
    shippingCost: 0,
  };

  // map id to product
  for (const [id, count] of Object.entries(countsById)) {
    const product = products.find((p) => p.id === Number(id));
    if (product) {
      shippingCardData.productsData.push({
        product,
        quantity: count,
      });
    }
  }

  // calculate total
  for (const { product, quantity } of shippingCardData.productsData) {
    shippingCardData.total += product.price * quantity;
  }

  // calculate shipping cost
  if (shippingCardData.total < 100) {
    shippingCardData.shippingCost = 10;
  }

  return shippingCardData;
}

export function formatCategories(categories: string[]): string {
  return categories
    .map((c) => c.charAt(0).toUpperCase() + c.slice(1))
    .join(", ");
}
