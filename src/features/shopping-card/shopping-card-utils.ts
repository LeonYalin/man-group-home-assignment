import { Coupon, CouponType, Product } from "../../shared/models";
import { SelectedCountsById } from "./ShoppingCardPage";

export const ALL_CATEGORIES = "all_categories";

export interface ShoppingCardData {
  productsData: {
    product: Product;
    quantity: number;
  }[];
  total: number;
  discount: number;
  shippingCost: number;
}

export function prepareShoppingCardData(
  products: Product[],
  countsById: SelectedCountsById,
  appliedCoupon: Coupon | null
): ShoppingCardData {
  const shoppingCardData: ShoppingCardData = {
    productsData: [],
    total: 0,
    discount: 0,
    shippingCost: 0,
  };

  // map id to product
  for (const [id, count] of Object.entries(countsById)) {
    const product = products.find((p) => p.id === Number(id));
    if (product) {
      shoppingCardData.productsData.push({
        product,
        quantity: count,
      });
    }
  }

  // calculate products cost
  const totalProductsCost = calculateProductsCost(
    shoppingCardData,
    appliedCoupon
  );

  // calculate shipping cost
  const shippingCost = calculateShippingCost(totalProductsCost, appliedCoupon);
  shoppingCardData.shippingCost = shippingCost;

  // calculate total
  const total = totalProductsCost + shippingCost;
  shoppingCardData.total = total;

  // calculate discount
  shoppingCardData.discount = calculateDiscount(
    shoppingCardData,
    appliedCoupon,
    total
  );

  return shoppingCardData;
}

export function calculateDiscount(
  shoppingCardData: ShoppingCardData,
  appliedCoupon: Coupon | null,
  total: number
): number {
  if (!appliedCoupon) {
    return 0;
  }
  const totalProductsCostNoDiscount = calculateProductsCost(
    shoppingCardData,
    null
  );
  const shippingCostNoDiscount = calculateShippingCost(
    totalProductsCostNoDiscount,
    null
  );
  const totalNoDiscount = totalProductsCostNoDiscount + shippingCostNoDiscount;

  return totalNoDiscount - total;
}

export function calculateProductPrice(
  product: Product,
  quantity: number,
  appliedCoupon: Coupon | null
): number {
  let price = product.price * quantity;
  if (appliedCoupon?.Type === CouponType.Supplier) {
    if (appliedCoupon.SupplierId === product.supplierId) {
      price -= price * appliedCoupon.Discount!;
    }
  } else if (appliedCoupon?.Type === CouponType.Category) {
    if (product.categories.includes(appliedCoupon.Category!)) {
      price -= price * appliedCoupon.Discount!;
    }
  }
  return price;
}

export function calculateProductsCost(
  shippingCardData: ShoppingCardData,
  appliedCoupon: Coupon | null
): number {
  let total = 0;
  for (const { product, quantity } of shippingCardData.productsData) {
    total += calculateProductPrice(product, quantity, appliedCoupon);
  }
  return total;
}

export function calculateShippingCost(
  total: number,
  appliedCoupon: Coupon | null
): number {
  if (appliedCoupon?.Type === CouponType.FreeShipping) {
    return 0;
  }
  if (total < 20) {
    return 7;
  } else if (total < 40) {
    return 5;
  } else {
    return 0;
  }
}

export function formatCategories(categories: string[]): string {
  return categories.map((c) => formatCategory(c)).join(", ");
}

export function formatCategory(category: string): string {
  if (category === ALL_CATEGORIES) return "All Categories";
  return category.charAt(0).toUpperCase() + category.slice(1);
}

export function formatShippingCostText(shippingCost: number): string {
  return shippingCost === 0 ? "Free" : `$${shippingCost.toFixed(2)}`;
}

export function sortProducts(
  products: Product[],
  sortField: string,
  sortOrder: "asc" | "desc"
): Product[] {
  return [...products].sort((a: any, b: any) => {
    if (sortOrder === "asc") {
      return a[sortField] < b[sortField] ? -1 : 1;
    } else {
      return a[sortField] > b[sortField] ? -1 : 1;
    }
  });
}

export function filterProducts(
  products: Product[],
  categoryFilter: string | null
): Product[] {
  if (!categoryFilter || categoryFilter === ALL_CATEGORIES) {
    return products;
  }
  return products.filter((p) => p.categories.includes(categoryFilter));
}

export function prepareCategories(products: Product[]): string[] {
  const categories = Array.from(
    new Set(products.flatMap((product) => product.categories))
  );
  categories.unshift(ALL_CATEGORIES);
  return categories;
}
