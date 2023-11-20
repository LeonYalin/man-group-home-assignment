import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Paper,
  Typography,
  LinearProgress,
  Box,
} from "@mui/material";
import { Product } from "../../shared/models";
import { formatCategories } from "./shopping-card-utils";
import CategoryIcon from "@mui/icons-material/Category";

interface Props {
  products: Product[];
  loading: boolean;
  onAddProduct: (productId: number) => void;
}

export const ProductList = ({ products, loading, onAddProduct }: Props) => {
  return loading ? (
    <Box sx={{ width: "100%" }}>
      <LinearProgress />
    </Box>
  ) : products.length > 0 ? (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Product</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <div style={{ display: "flex" }}>
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    style={{ width: 50, height: 50, marginRight: 10 }}
                  />
                  <div style={{ display: "flex", alignItems: "center" }}>
                    {product.name}
                  </div>
                </div>
              </TableCell>
              <TableCell>{formatCategories(product.categories)}</TableCell>
              <TableCell>${product.price.toFixed(2)}</TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => onAddProduct(product.id)}
                >
                  Add to Cart
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  ) : (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CategoryIcon style={{ fontSize: "48px" }} />
      <div style={{ marginTop: "10px" }}></div>
      <Typography variant="h6">No items found</Typography>
    </div>
  );
};
