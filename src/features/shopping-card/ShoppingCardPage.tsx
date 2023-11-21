import {
  Alert,
  AlertColor,
  Box,
  Container,
  Grid,
  Snackbar,
} from "@mui/material";
import { ProductList } from "./ProductsList";
import ShoppingCart from "./ShoppingCard";
import { useEffect, useMemo, useState } from "react";
import { Coupon, Product } from "../../shared/models";
import { shoppingCardService } from "./shopping-card-service";
import {
  ALL_CATEGORIES,
  filterProducts,
  prepareCategories,
  prepareShoppingCardData,
  sortProducts,
} from "./shopping-card-utils";
import { availableCoupons } from "./coupons-utils";

export type SelectedCountsById = Record<string, number>;

export function ShoppingCardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCountsById, setSelectedCountsById] =
    useState<SelectedCountsById>({});
  const [productsLoading, setProductsLoading] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [sortField, setSortField] = useState<string>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [categoryFilter, setCategoryFilter] = useState<string>(ALL_CATEGORIES);
  const [snackbarData, setSnackbarData] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setProductsLoading(true);
        const products = await shoppingCardService.getProducts();
        setProducts(products);
      } catch (error) {
        setSnackbarData({
          open: true,
          message: "Error while fetching products",
          severity: "error",
        });
      } finally {
        setProductsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const shoppingCardData = useMemo(() => {
    const data = prepareShoppingCardData(
      products,
      selectedCountsById,
      appliedCoupon
    );
    return data;
  }, [products, selectedCountsById, appliedCoupon]);

  const sortedAndFilteredProducts = useMemo(() => {
    const sortedProducts = sortProducts(products, sortField, sortOrder);
    const sortedAndFilteredProducts = filterProducts(
      sortedProducts,
      categoryFilter
    );
    return sortedAndFilteredProducts;
  }, [products, sortField, sortOrder, categoryFilter]);

  const categories = useMemo(() => {
    const productCategories = prepareCategories(products);
    return productCategories;
  }, [products]);

  const handleAddProduct = (productId: number) => {
    const existingProduct = selectedCountsById[productId];
    if (existingProduct) {
      return; // do not add the product again
    } else {
      setSelectedCountsById((prev) => ({
        ...prev,
        [productId]: 1,
      }));
    }
  };

  const handleProductDelete = (productId: number) => {
    setSelectedCountsById((prev) => {
      const { [productId]: _, ...rest } = prev;
      return rest;
    });
  };

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    setSelectedCountsById((prev) => ({
      ...prev,
      [productId]: newQuantity,
    }));
  };

  const handleCouponApply = (couponCode: string) => {
    const coupon = availableCoupons.find((c) => c.Code === couponCode);
    if (coupon) {
      setAppliedCoupon(coupon);
    } else {
      setSnackbarData({
        open: true,
        message: "Invalid coupon code",
        severity: "error",
      });
    }
  };

  const handleCouponDelete = () => {
    setAppliedCoupon(null);
  };

  const handleSortChange = (sortField: string, sortOrder: "asc" | "desc") => {
    setSortField(sortField);
    setSortOrder(sortOrder);
  };

  const handleCategoryFilterChange = (filterValue: string) => {
    setCategoryFilter(filterValue);
  };

  const handleSnackbarClose = () => {
    setSnackbarData({ open: false, message: "", severity: "success" });
  };

  return (
    <Container>
      <Grid container>
        <Grid item xs={12} md={7}>
          <Box style={{ padding: 16, marginTop: 16 }}>
            <ProductList
              products={sortedAndFilteredProducts}
              loading={productsLoading}
              sortField={sortField}
              sortOrder={sortOrder}
              categories={categories}
              categoryFilter={categoryFilter}
              onAddProduct={handleAddProduct}
              onSortChange={handleSortChange}
              onCategoryFilterChange={handleCategoryFilterChange}
            />
          </Box>
        </Grid>

        <Grid item xs={12} md={5}>
          <Box style={{ padding: "16px 0 0px 16px", marginTop: 16 }}>
            <ShoppingCart
              data={shoppingCardData}
              appliedCoupon={appliedCoupon}
              onQuantityChange={handleQuantityChange}
              onCouponApply={handleCouponApply}
              onCouponDelete={handleCouponDelete}
              onProductDelete={handleProductDelete}
            />
          </Box>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbarData.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarData.severity as AlertColor}
          sx={{ width: "100%" }}
        >
          {snackbarData.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
