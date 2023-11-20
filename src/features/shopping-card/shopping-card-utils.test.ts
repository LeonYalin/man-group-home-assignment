import {
  prepareShoppingCardData,
  calculateDiscount,
  calculateProductPrice,
  calculateProductsCost,
  calculateShippingCost,
  formatCategories,
  formatCategory,
  formatShippingCostText,
  sortProducts,
  filterProducts,
  prepareCategories,
  ALL_CATEGORIES,
  ShoppingCardData,
} from "./shopping-card-utils";
import { Coupon, CouponType, Product } from "../../shared/models";

const mockAppliedCouponSupplier: Coupon | null = {
  Type: CouponType.Supplier,
  Code: "APPL10",
  Description: "10% on all Apple Products",
  SupplierId: 1,
  Discount: 0.1,
};

const mockAppliedCouponCategory: Coupon | null = {
  Code: "AUDIO15",
  Description: "15% on all Audio Products",
  Type: CouponType.Category,
  Category: "category1",
  Discount: 0.2,
};

const mockAppliedCouponFreeShipping: Coupon | null = {
  Code: "freeShipping!",
  Description: "Free Shipping",
  Type: CouponType.FreeShipping,
};

const mockProduct1: Product = {
  id: 1,
  name: "Product 1",
  price: 10,
  imageUrl: "",
  wholesalePrice: 0,
  supplierId: 1,
  categories: ["category1"],
};
const mockProduct2: Product = {
  id: 2,
  name: "Product 2",
  price: 20,
  imageUrl: "",
  wholesalePrice: 0,
  supplierId: 2,
  categories: ["category2"],
};

describe("prepareShoppingCardData", () => {
  it("should prepare shopping card data correctly", () => {
    const products: Product[] = [mockProduct1, mockProduct2];
    const countsById = {
      1: 2,
      2: 3,
    };

    const shoppingCardData = prepareShoppingCardData(
      products,
      countsById,
      mockAppliedCouponSupplier
    );

    expect(shoppingCardData.productsData).toEqual([
      {
        product: products[0],
        quantity: 2,
      },
      {
        product: products[1],
        quantity: 3,
      },
    ]);
    expect(shoppingCardData.total).toBe(78);
    expect(shoppingCardData.discount).toBe(2);
    expect(shoppingCardData.shippingCost).toBe(0);
  });
});

describe("calculateDiscount", () => {
  it("should calculate discount correctly", () => {
    const shoppingCardData = {
      productsData: [
        {
          product: mockProduct1,
          quantity: 2,
        },
        {
          product: mockProduct2,
          quantity: 3,
        },
      ],
      total: 78,
      discount: 2,
      shippingCost: 0,
    };

    const discount = calculateDiscount(
      shoppingCardData,
      mockAppliedCouponSupplier,
      78
    );

    expect(discount).toBe(2);
  });

  it("should return 0 discount if no coupon applied", () => {
    const shoppingCardData: ShoppingCardData = {
      productsData: [
        {
          product: mockProduct1,
          quantity: 2,
        },
        {
          product: mockProduct2,
          quantity: 3,
        },
      ],
      total: 100,
      discount: 0,
      shippingCost: 0,
    };

    const discount = calculateDiscount(shoppingCardData, null, 100);

    expect(discount).toBe(0);
  });
});

describe("calculateProductPrice", () => {
  it("should calculate product price correctly with supplier coupon", () => {
    const quantity = 2;
    const price = calculateProductPrice(
      mockProduct1,
      quantity,
      mockAppliedCouponSupplier
    );

    expect(price).toBe(18);
  });

  it("should calculate product price correctly with category coupon", () => {
    const quantity = 2;
    const price = calculateProductPrice(
      mockProduct1,
      quantity,
      mockAppliedCouponCategory
    );
    expect(price).toBe(16);
  });

  it("should calculate product price correctly without coupon", () => {
    const quantity = 2;
    const price = calculateProductPrice(mockProduct1, quantity, null);
    expect(price).toBe(20);
  });
});

describe("calculateProductsCost", () => {
  it("should calculate products cost correctly", () => {
    const shoppingCardData = {
      productsData: [
        {
          product: mockProduct1,
          quantity: 2,
        },
        {
          product: mockProduct2,
          quantity: 3,
        },
      ],
      total: 78,
      discount: 2,
      shippingCost: 0,
    };

    const productsCost = calculateProductsCost(
      shoppingCardData,
      mockAppliedCouponSupplier
    );

    expect(productsCost).toBe(78);
  });
});

describe("calculateShippingCost", () => {
  it("should calculate shipping cost correctly with free shipping coupon", () => {
    const total = 10;
    const shippingCost = calculateShippingCost(
      total,
      mockAppliedCouponFreeShipping
    );
    expect(shippingCost).toBe(0);
  });

  it("should calculate shipping cost correctly for total < 20", () => {
    const total = 15;
    const shippingCost = calculateShippingCost(total, null);
    expect(shippingCost).toBe(7);
  });

  it("should calculate shipping cost correctly for 20 <= total < 40", () => {
    const total = 30;
    const shippingCost = calculateShippingCost(total, null);
    expect(shippingCost).toBe(5);
  });

  it("should calculate shipping cost correctly for total >= 40", () => {
    const total = 50;
    const shippingCost = calculateShippingCost(total, null);
    expect(shippingCost).toBe(0);
  });
});

describe("formatCategories", () => {
  it("should format categories correctly", () => {
    const categories = ["category1", "category2", "category3"];
    const formattedCategories = formatCategories(categories);
    expect(formattedCategories).toBe("Category1, Category2, Category3");
  });
});

describe("formatCategory", () => {
  it("should format category correctly", () => {
    const category = "category1";
    const formattedCategory = formatCategory(category);
    expect(formattedCategory).toBe("Category1");
  });

  it("should format 'all_categories' category correctly", () => {
    const category = ALL_CATEGORIES;
    const formattedCategory = formatCategory(category);
    expect(formattedCategory).toBe("All Categories");
  });
});

describe("formatShippingCostText", () => {
  it("should format shipping cost text correctly for free shipping", () => {
    const shippingCost = 0;
    const formattedShippingCostText = formatShippingCostText(shippingCost);
    expect(formattedShippingCostText).toBe("Free");
  });

  it("should format shipping cost text correctly for non-zero shipping cost", () => {
    const shippingCost = 5;
    const formattedShippingCostText = formatShippingCostText(shippingCost);
    expect(formattedShippingCostText).toBe("$5.00");
  });
});

describe("sortProducts", () => {
  it("should sort products in ascending order", () => {
    const products: Product[] = [mockProduct1, mockProduct2];
    const sortField = "price";
    const sortOrder = "asc";
    const sortedProducts = sortProducts(products, sortField, sortOrder);
    expect(sortedProducts).toEqual([mockProduct1, mockProduct2]);
  });

  it("should sort products in descending order", () => {
    const products: Product[] = [mockProduct1, mockProduct2];
    const sortField = "price";
    const sortOrder = "desc";
    const sortedProducts = sortProducts(products, sortField, sortOrder);
    expect(sortedProducts).toEqual([mockProduct2, mockProduct1]);
  });
});

describe("filterProducts", () => {
  it("should filter products by category", () => {
    const products: Product[] = [mockProduct1, mockProduct2];
    const categoryFilter = "category1";
    const filteredProducts = filterProducts(products, categoryFilter);
    expect(filteredProducts).toEqual([mockProduct1]);
  });

  it("should return all products if category filter is null", () => {
    const products: Product[] = [mockProduct1, mockProduct2];
    const categoryFilter = null;
    const filteredProducts = filterProducts(products, categoryFilter);
    expect(filteredProducts).toEqual(products);
  });

  it("should return all products if category filter is 'all_categories'", () => {
    const products: Product[] = [mockProduct1, mockProduct2];
    const categoryFilter = "all_categories";
    const filteredProducts = filterProducts(products, categoryFilter);
    expect(filteredProducts).toEqual(products);
  });
});

describe("prepareCategories", () => {
  it("should prepare categories correctly", () => {
    const products: Product[] = [mockProduct1, mockProduct2];
    const categories = prepareCategories(products);
    expect(categories).toEqual(["all_categories", "category1", "category2"]);
  });
});
