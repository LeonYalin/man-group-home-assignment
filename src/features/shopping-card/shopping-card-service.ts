import { Product } from "../../shared/models";

export const shoppingCardService = {
  getProducts: async (): Promise<Product[]> => {
    const res = await fetch(
      "https://man-shopping-cart-test.azurewebsites.net/api/Products"
    );
    return await res.json();
  },
};
