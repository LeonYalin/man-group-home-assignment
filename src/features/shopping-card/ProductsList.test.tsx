import React from "react";
import { render, screen } from "@testing-library/react";
import { ProductList } from "./ProductsList";

const mockProducts = [
  {
    id: 1,
    name: "Product 1",
    price: 10,
    imageUrl: "",
    wholesalePrice: 0,
    supplierId: 1,
    categories: ["category1"],
  },
  {
    id: 2,
    name: "Product 2",
    price: 20,
    imageUrl: "",
    wholesalePrice: 0,
    supplierId: 2,
    categories: ["category2"],
  },
];

describe("ProductList", () => {
  test("renders loading state when loading prop is true", () => {
    render(
      <ProductList
        products={[]}
        loading={true}
        sortField=""
        sortOrder="asc"
        categories={[]}
        categoryFilter={null}
        onAddProduct={() => {}}
        onSortChange={() => {}}
        onCategoryFilterChange={() => {}}
      />
    );

    const linearProgressElement = screen.getByRole("progressbar");
    expect(linearProgressElement).toBeInTheDocument();
  });

  test("renders table with products when loading prop is false and products array is not empty", () => {
    render(
      <ProductList
        products={mockProducts}
        loading={false}
        sortField=""
        sortOrder="asc"
        categories={[]}
        categoryFilter={null}
        onAddProduct={() => {}}
        onSortChange={() => {}}
        onCategoryFilterChange={() => {}}
      />
    );

    const tableElement = screen.getByRole("table");
    expect(tableElement).toBeInTheDocument();

    const product1NameElement = screen.getByText("Product 1");
    expect(product1NameElement).toBeInTheDocument();

    const product2NameElement = screen.getByText("Product 2");
    expect(product2NameElement).toBeInTheDocument();
  });

  test("renders no items found message when loading prop is false and products array is empty", () => {
    render(
      <ProductList
        products={[]}
        loading={false}
        sortField=""
        sortOrder="asc"
        categories={[]}
        categoryFilter={null}
        onAddProduct={() => {}}
        onSortChange={() => {}}
        onCategoryFilterChange={() => {}}
      />
    );

    const noItemsFoundElement = screen.getByText("No items found");
    expect(noItemsFoundElement).toBeInTheDocument();
  });
});
