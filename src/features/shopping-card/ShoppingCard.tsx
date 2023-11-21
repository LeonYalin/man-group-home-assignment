// ShoppingCart.tsx
import React, { useState } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  IconButton,
  Grid,
  Typography,
  Divider,
} from "@mui/material";
import {
  ShoppingCardData,
  formatShippingCostText,
} from "./shopping-card-utils";
import DeleteIcon from "@mui/icons-material/Delete";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { Coupon } from "../../shared/models";

type Props = {
  data: ShoppingCardData;
  appliedCoupon: Coupon | null;
  onQuantityChange: (productId: number, newQuantity: number) => void;
  onProductDelete: (productId: number) => void;
  onCouponApply: (couponCode: string) => void;
  onCouponDelete: () => void;
};

export const ShoppingCart = ({
  data,
  appliedCoupon,
  onQuantityChange,
  onProductDelete,
  onCouponApply,
  onCouponDelete,
}: Props) => {
  const [couponCode, setCouponCode] = useState("");

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    onQuantityChange(productId, newQuantity);
  };

  const handleCouponApply = () => {
    onCouponApply(couponCode);
  };

  const handleDeleteProduct = (productId: number) => {
    onProductDelete(productId);
  };

  return (
    <Paper style={{ padding: 16 }}>
      <Typography variant="h4" sx={{ marginBottom: "0.35rem" }}>
        Cart
      </Typography>

      {data.productsData.length === 0 ? (
        <div style={{ textAlign: "center" }}>
          <AddShoppingCartIcon style={{ fontSize: "52px" }} />
          <div style={{ marginTop: "10px" }}></div>
          <Typography variant="h6">Your cart is empty</Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Time to start shopping!
          </Typography>
        </div>
      ) : (
        <>
          <TableContainer data-testid="shopping-card-table">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.productsData.map(({ product, quantity }) => (
                  <TableRow key={product.id} data-product-id={product.id}>
                    <TableCell>
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        style={{ width: 50, height: 50, marginRight: 10 }}
                      />
                      {product.name}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() =>
                          handleQuantityChange(product.id, quantity - 1)
                        }
                        disabled={quantity <= 1}
                        color="primary"
                        size="small"
                        className="decrement-quantity-button"
                      >
                        -
                      </IconButton>
                      {quantity}
                      <IconButton
                        onClick={() =>
                          handleQuantityChange(product.id, quantity + 1)
                        }
                        color="primary"
                        size="small"
                        className="increment-quantity-button"
                      >
                        +
                      </IconButton>
                    </TableCell>
                    <TableCell>${product.price.toFixed(2)}</TableCell>
                    <TableCell>
                      ${(product.price * quantity).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        aria-label="delete"
                        onClick={() => handleDeleteProduct(product.id)}
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {appliedCoupon ? (
            <div
              data-testid="applied-coupon-wrapper"
              style={{ marginTop: 16, display: "flex", alignItems: "center" }}
            >
              <div style={{ flex: 1 }}>
                <Typography variant="subtitle2">Applied Coupon:</Typography>
                <Typography variant="subtitle1">
                  <span
                    style={{
                      background: "lightcoral",
                      color: "white",
                      padding: "4px",
                      borderRadius: "4px",
                    }}
                  >
                    {appliedCoupon.Code}
                  </span>
                </Typography>
                <Typography variant="subtitle1" data-testid="applied-coupon-description">
                  {appliedCoupon.Description}
                </Typography>
              </div>
              <IconButton
                aria-label="delete coupon"
                onClick={() => onCouponDelete()}
                size="small"
                id="delete-coupon-button"
                data-testid="delete-coupon-button"
              >
                <DeleteIcon />
              </IconButton>
              <Divider style={{ margin: "16px 0" }} />
            </div>
          ) : (
            <Grid
              className="enter-coupon-wrapper"
              container
              spacing={3}
              sx={{ display: "flex", marginTop: 2 }}
            >
              <Grid item xs={9}>
                <TextField
                  size="small"
                  label="Coupon Code"
                  variant="outlined"
                  fullWidth
                  value={couponCode}
                  disabled={!!appliedCoupon}
                  onChange={(e) => setCouponCode(e.target.value)}
                  id="coupon-code-input"
                  inputProps={{
                    "data-testid": "coupon-code-input",
                  }}
                  data-testid="coupon-code-input"
                />
              </Grid>
              <Grid
                item
                xs={3}
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  disabled={!couponCode || !!appliedCoupon}
                  onClick={() => handleCouponApply()}
                  id="apply-coupon-button"
                  data-testid="apply-coupon-button"
                >
                  Apply
                </Button>
              </Grid>
            </Grid>
          )}
        </>
      )}

      {data.productsData.length > 0 && (
        <>
          <div
            style={{
              marginTop: 16,
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Typography
              variant="caption"
              sx={{ display: "flex", alignItems: "flex-end" }}
            >
              Shipping:
              <span style={{ marginLeft: "5px" }}>
                {formatShippingCostText(data.shippingCost)}
              </span>
            </Typography>
          </div>
          {data.discount > 0 && (
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                color: "lightcoral",
              }}
            >
              <Typography
                variant="body2"
                sx={{ display: "flex", alignItems: "flex-end" }}
                data-testid="discount-text"
              >
                Discount:
                <span style={{ marginLeft: "5px" }}>
                  -${data.discount.toFixed(2)}
                </span>
              </Typography>
            </div>
          )}

          <div style={{ marginTop: 16, textAlign: "right" }} data-testid="total-price-text">
            <strong>
              Total: ${data.total.toFixed(2)}{" "}
              {data.discount > 0 && (
                <span style={{ textDecoration: "line-through" }}>
                  ${(data.discount + data.total).toFixed(2)}
                </span>
              )}
            </strong>
          </div>
        </>
      )}
    </Paper>
  );
};

export default ShoppingCart;
