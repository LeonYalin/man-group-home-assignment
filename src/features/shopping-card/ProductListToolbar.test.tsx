import React from "react";
import {
  render,
  screen,
  fireEvent,
  RenderResult,
} from "@testing-library/react";
import { ProductListToolbar } from "./ProductListToolbar";

const mockSortField = "name";
const mockSortOrder = "asc";
const mockCategories = ["category1", "category2"];
const mockCategoryFilter = "category1";
const mockOnSortChange = jest.fn();
const mockOnCategoryFilterChange = jest.fn();
let renderResult: RenderResult;

describe("ProductListToolbar", () => {
  beforeEach(() => {
    renderResult = render(
      <ProductListToolbar
        sortField={mockSortField}
        sortOrder={mockSortOrder}
        categories={mockCategories}
        categoryFilter={mockCategoryFilter}
        onSortChange={mockOnSortChange}
        onCategoryFilterChange={mockOnCategoryFilterChange}
      />
    );
  });

  test("renders the title correctly", () => {
    const titleElement = screen.getByText("Products");
    expect(titleElement).toBeInTheDocument();
  });

  test("renders the sort field select correctly", () => {
    const sortFieldSelect = screen.getByLabelText("Sort By");
    expect(sortFieldSelect).toBeInTheDocument();
    expect(sortFieldSelect).toHaveTextContent("Name");
  });

  test("calls onSortChange when sort field is changed", () => {
    const sortFieldSelectWrapper = screen.getByTestId(
      "sort-field-select-wrapper"
    ) as HTMLDivElement;
    sortFieldSelectWrapper.querySelector("input")?.click();
    const selectNode = sortFieldSelectWrapper.childNodes[0]
      .nextSibling as HTMLSelectElement;
    fireEvent.change(selectNode, { target: { value: "price" } });
    expect(mockOnSortChange).toHaveBeenCalledWith("price", mockSortOrder);
  });

  test("renders the sort order button correctly", () => {
    const sortOrderButton = screen.getByText(
      mockSortOrder === "asc" ? "ASC" : "DESC"
    );
    expect(sortOrderButton).toBeInTheDocument();
  });

  test("calls onSortChange when sort order button is clicked", () => {
    const sortOrderButton = screen.getByText(
      mockSortOrder === "asc" ? "ASC" : "DESC"
    );
    fireEvent.click(sortOrderButton);
    expect(mockOnSortChange).toHaveBeenCalledWith(
      mockSortField,
      mockSortOrder === "asc" ? "desc" : "asc"
    );
  });

  test("renders the category filter select correctly", () => {
    const categoryFilterSelect = screen.getByLabelText("Filter By");
    expect(categoryFilterSelect).toBeInTheDocument();
    expect(categoryFilterSelect).toHaveTextContent("Category1");
  });

  test("calls onCategoryFilterChange when category filter is changed", () => {
    const categoryFilterSelectWrapper = screen.getByTestId(
      "filter-by-select-wrapper"
    ) as HTMLDivElement;
    categoryFilterSelectWrapper.querySelector("input")?.click();
    const selectNode = categoryFilterSelectWrapper.childNodes[0]
      .nextSibling as HTMLSelectElement;
    fireEvent.change(selectNode, { target: { value: "category2" } });
    expect(mockOnCategoryFilterChange).toHaveBeenCalledWith("category2");
  });
});
