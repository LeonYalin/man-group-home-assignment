import { Box, Container, Grid, Paper } from "@mui/material";
import { ProductList } from "./ProductsList";
import ShoppingCart from "./ShoppingCard";
import { useEffect, useMemo, useState } from "react";
import { Coupon, Product } from "../../shared/models";
import { shoppingCardService } from "./shopping-card-service";
import {
  ShoppingCardData,
  availableCoupons,
  prepareShoppingCardData,
} from "./shopping-card-utils";

const INITIAL_SHOPPING_CARD_DATA: ShoppingCardData = {
  productsData: [],
  total: 0,
  shippingCost: 0,
};

export type SelectedCountsById = Record<string, number>;

export function ShoppingCardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCountsById, setSelectedCountsById] =
    useState<SelectedCountsById>({});
  const [productsLoading, setProductsLoading] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setProductsLoading(true);
        const products = await shoppingCardService.getProducts();
        setProducts(products);
      } catch (error) {
        console.error(error);
      } finally {
        setProductsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const shoppingCardData = useMemo(() => {
    const data = prepareShoppingCardData(products, selectedCountsById);
    return data;
  }, [products, selectedCountsById]);

  const handleAddProduct = (productId: number) => {
    const existingProduct = selectedCountsById[productId];
    if (existingProduct) {
      // do not add the product again
      return;
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
      // TODO: update shopping card data
    } else {
      // show error toast
    }
  };

  const handleCouponDelete = () => {
    console.log("handleCouponDelete");
    setAppliedCoupon(null);
    // TODO: update shopping card data
  };

  return (
    <Container>
      <Grid container>
        <Grid item xs={12} md={7}>
          <Box style={{ padding: 16, marginTop: 16 }}>
            <ProductList
              products={products}
              loading={productsLoading}
              onAddProduct={handleAddProduct}
            />
          </Box>
        </Grid>

        <Grid item xs={12} md={5}>
          <Box style={{ padding: 16, marginTop: 16 }}>
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
    </Container>
  );
}
