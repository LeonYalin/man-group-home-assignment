import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ShoppingCart from "./ShoppingCard";
import { Coupon, CouponType } from "../../shared/models";
import { ShoppingCardData } from "./shopping-card-utils";
import { cloneDeep } from "lodash";

describe("ShoppingCart", () => {
  const mockData = {
    productsData: [
      {
        product: {
          id: 1,
          name: "Product 1",
          imageUrl: "image-url-1",
          price: 10.0,
          wholesalePrice: 0,
          supplierId: 1,
          categories: ["category1"],
        },
        quantity: 2,
      },
      {
        product: {
          id: 2,
          name: "Product 2",
          imageUrl: "image-url-2",
          price: 20.0,
          wholesalePrice: 0,
          supplierId: 2,
          categories: ["category2"],
        },
        quantity: 3,
      },
    ],
    shippingCost: 5.0,
    discount: 2.0,
    total: 48.0,
  };

  const mockCoupon: Coupon = {
    Code: "APPL10",
    Description: "10% on all Apple Products",
    Type: 2,
    Discount: 0.1,
    SupplierId: 1,
  };

  const mockOnQuantityChange = jest.fn();
  const mockOnProductDelete = jest.fn();
  const mockOnCouponApply = jest.fn();
  const mockOnCouponDelete = jest.fn();

  function renderComponent(
    mockData: ShoppingCardData,
    mockAppliedCoupon: Coupon | null
  ) {
    return render(
      <ShoppingCart
        data={mockData}
        appliedCoupon={mockAppliedCoupon}
        onQuantityChange={mockOnQuantityChange}
        onProductDelete={mockOnProductDelete}
        onCouponApply={mockOnCouponApply}
        onCouponDelete={mockOnCouponDelete}
      />
    );
  }

  test("renders cart title", async () => {
    renderComponent(mockData, null);
    const cartTitle = await screen.findByText("Cart");
    expect(cartTitle).toBeInTheDocument();
  });

  test("renders empty cart message when there are no products", async () => {
    const mockShoppingCartData = cloneDeep(mockData);
    mockShoppingCartData.productsData = [];
    renderComponent(mockShoppingCartData, null);
    const emptyCartMessage = await screen.findByText("Your cart is empty");
    expect(emptyCartMessage).toBeInTheDocument();
  });

  test("renders product details when there are products in the cart", async () => {
    renderComponent(mockData, null);
    const product1Name = await screen.findByText("Product 1");
    const product2Name = await screen.findByText("Product 2");
    expect(product1Name).toBeInTheDocument();
    expect(product2Name).toBeInTheDocument();
  });

  test("calls onQuantityChange when quantity is decreased", async () => {
    renderComponent(mockData, null);
    const decreaseButton = await screen.findAllByRole("button", {
      name: "-",
    });
    fireEvent.click(decreaseButton[0]);
    expect(mockOnQuantityChange).toHaveBeenCalledWith(1, 1);
  });

  test("calls onQuantityChange when quantity is increased", async () => {
    renderComponent(mockData, null);
    const increaseButton = await screen.findAllByRole("button", {
      name: "+",
    });
    fireEvent.click(increaseButton[0]);
    expect(mockOnQuantityChange).toHaveBeenCalledWith(1, 3);
  });

  test("calls onProductDelete when delete button is clicked", async () => {
    renderComponent(mockData, null);
    const deleteButton = await screen.findAllByRole("button", {
      name: "delete",
    });
    fireEvent.click(deleteButton[0]);
    expect(mockOnProductDelete).toHaveBeenCalledWith(1);
  });

  test("calls onCouponApply when apply button is clicked", async () => {
    renderComponent(mockData, null);
    const couponCodeInput = (await screen.findByLabelText(
      "Coupon Code"
    )) as HTMLInputElement;
    fireEvent.change(couponCodeInput, { target: { value: "APPL10" } });
    const applyButton = await screen.findByRole("button", {
      name: "Apply",
    });
    fireEvent.click(applyButton);
    expect(mockOnCouponApply).toHaveBeenCalled();
  });

  test("calls onCouponDelete when delete coupon button is clicked", async () => {
    const { container } = renderComponent(mockData, mockCoupon);
    const deleteCouponButton = (await screen.findByTestId(
      "delete-coupon-button"
    )) as HTMLButtonElement;
    fireEvent.click(deleteCouponButton);
    expect(mockOnCouponDelete).toHaveBeenCalled();
  });
});
