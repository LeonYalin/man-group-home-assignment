// import { mockProducts } from "../../mocks/products-mocks";
import { Product } from "../../shared/models";

export const GET_PRODUCTS_URL =
  "https://man-shopping-cart-test.azurewebsites.net/api/Products";
export const CALCULATE_COST_URL =
  "https://man-shopping-cart-test.azurewebsites.net/api/Cart/CalculateCost";

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
    const res = await fetch(GET_PRODUCTS_URL);
    return await res.json();
    // return Promise.resolve(mockProducts); // for local testing
  },
  calculateCost: async (
    payload: CalculateCostRequestBody
  ): Promise<CalculateCostResponseBody> => {
    const res = await fetch(CALCULATE_COST_URL, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await res.json();
  },
};
