import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { ShoppingCardPage } from "./ShoppingCardPage";
import { mockProducts } from "../../mocks/products-mocks";
import { context, response, rest } from "msw";
import { setupServer } from "msw/node";
import { GET_PRODUCTS_URL } from "./shopping-card-service";
import { sortProducts } from "./shopping-card-utils";

export const handlers = [
  rest.get(GET_PRODUCTS_URL, () => {
    return response(context.status(200), context.json(mockProducts));
  }),
];

const server = setupServer(...handlers);
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("ShoppingCardPage", () => {
  test("renders the product list and shopping cart components", async () => {
    render(<ShoppingCardPage />);

    const tableEl = await screen.findByRole("table");
    expect(tableEl).toBeInTheDocument();

    // go over the products list and add them to the cart
    const sortedProducts = sortProducts(mockProducts, "name", "asc");
    tableEl.querySelectorAll("tbody tr").forEach((row, index) => {
      const product = sortedProducts[index];
      expect(row).toHaveTextContent(product.name);
      expect(row).toHaveTextContent(product.price.toString());

      // click on add to cart button
      const addToCartBtn = row.querySelector("td button") as HTMLButtonElement;
      expect(addToCartBtn).toBeInTheDocument();
      expect(addToCartBtn).toHaveTextContent("Add to Cart");
      fireEvent.click(addToCartBtn);
    });

    // check the shopping cart
    const shoppingCartTableWrapper = await screen.findByTestId(
      "shopping-card-table"
    );
    expect(shoppingCartTableWrapper).toBeInTheDocument();
    const shoppingCartTable = shoppingCartTableWrapper.querySelector("table");
    expect(shoppingCartTable).toBeInTheDocument();
    const shoppingCartTableBody = shoppingCartTable?.querySelector("tbody");
    expect(shoppingCartTableBody).toBeInTheDocument();
    const shoppingCartTableRows = shoppingCartTableBody?.querySelectorAll("tr");
    expect(shoppingCartTableRows).toHaveLength(sortedProducts.length);

    // check the products in the shopping cart, and increase the quantity of the headphones to 2
    shoppingCartTableRows?.forEach((row, index, total) => {
      const productId = row.getAttribute("data-product-id");
      const product = sortedProducts.find((p) => p.id.toString() === productId);
      if (product) {
        expect(product).toBeDefined();
        expect(row).toHaveTextContent(product.name);
        expect(row).toHaveTextContent(product.price.toString());
        expect(row).toHaveTextContent("1");

        // if it is a headphones, increase the quantity to 2
        if (product.id === 4) {
          const increaseBtn = row.querySelector(
            ".increment-quantity-button"
          ) as HTMLButtonElement;
          expect(increaseBtn).toBeInTheDocument();
          expect(increaseBtn).toHaveTextContent("+");
          fireEvent.click(increaseBtn);
          expect(row).toHaveTextContent("2");
        }
      }
    });

    // apply coupon code "AUDIO15"
    const couponCodeInput = await screen.findByLabelText("Coupon Code");
    expect(couponCodeInput).toBeInTheDocument();
    fireEvent.change(couponCodeInput, { target: { value: "AUDIO15" } });
    const applyCouponBtn = await screen.findByRole("button", {
      name: "Apply",
    });
    expect(applyCouponBtn).toBeInTheDocument();
    fireEvent.click(applyCouponBtn);

    // check the applied coupon
    const appliedCouponWrapper = await screen.findByTestId(
      "applied-coupon-wrapper"
    );
    expect(appliedCouponWrapper).toBeInTheDocument();
    expect(appliedCouponWrapper).toHaveTextContent("Applied Coupon:");
    expect(appliedCouponWrapper).toHaveTextContent("AUDIO15");
    expect(
      await screen.findByTestId("applied-coupon-description")
    ).toHaveTextContent("15% on all Audio Products");
    expect(await screen.findByTestId("discount-text")).toHaveTextContent(
      "Discount:-$9.00"
    );
    expect(await screen.findByTestId("total-price-text")).toHaveTextContent(
      "Total: $1275.00 $1284.00"
    );

    // remove the coupon
    const deleteCouponBtn = await screen.findByTestId("delete-coupon-button");
    expect(deleteCouponBtn).toBeInTheDocument();
    fireEvent.click(deleteCouponBtn);
  });
});
