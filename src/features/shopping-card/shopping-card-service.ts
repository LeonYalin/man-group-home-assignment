import { Product } from "../../shared/models";

export interface GetProductsResponseBody extends Array<Product> {}

export interface CalculateCostRequestBody {
  items: {
    productId: number;
    unitQuantity: number;
  }[];
  couponCode: string;
}

export interface CalculateCostResponseBody {
  itemsCost: number;
  shippingCost: number;
  discount: number;
  finalCost: number;
}

export const shoppingCardService = {
  getProducts: async (): Promise<GetProductsResponseBody> => {
    const res = await fetch(
      "https://man-shopping-cart-test.azurewebsites.net/api/Products"
    );
    return await res.json();
  },
  calculateCost: async (
    payload: CalculateCostRequestBody
  ): Promise<CalculateCostResponseBody> => {
    const res = await fetch(
      "https://man-shopping-cart-test.azurewebsites.net/api/Cart/CalculateCost",
      {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return await res.json();
  },
};
