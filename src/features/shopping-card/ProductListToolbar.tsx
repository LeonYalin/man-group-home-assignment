import {
  Button,
  ButtonGroup,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Toolbar,
  Typography,
} from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { formatCategory } from "./shopping-card-utils";

type Props = {
  sortField: string;
  sortOrder: "asc" | "desc";
  categories: string[];
  categoryFilter: string | null;
  onSortChange: (sortField: string, sortOrder: "asc" | "desc") => void;
  onCategoryFilterChange: (value: string) => void;
};

export const ProductListToolbar = ({
  sortField,
  sortOrder,
  categories,
  categoryFilter,
  onSortChange,
  onCategoryFilterChange,
}: Props) => {
  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
      }}
    >
      <Grid container spacing={3}>
        <Grid item xs={4} style={{ display: "flex", alignItems: "flex-end" }}>
          <Typography variant="h4" sx={{}}>
            Products
          </Typography>
        </Grid>

        <Grid
          item
          xs={8}
          style={{
            display: "flex",
            justifyContent: "flex-end",
            paddingRight: 12,
          }}
        >
          <div
            style={{ display: "flex", alignItems: "flex-end", marginRight: 24 }}
          >
            <FormControl
              variant="standard"
              style={{ minWidth: 120, marginRight: 16 }}
            >
              <InputLabel id="sort-field-label">Sort By</InputLabel>
              <Select
                labelId="sort-field-label"
                label="Sort By"
                id="sort-field"
                name="sortField"
                value={sortField}
                data-testid="sort-field-select-wrapper"
                onChange={(event) =>
                  onSortChange(event.target.value, sortOrder)
                }
              >
                <MenuItem value="name">Name</MenuItem>
                <MenuItem value="price">Price</MenuItem>
              </Select>
            </FormControl>

            <ButtonGroup variant="contained">
              <Button
                variant="text"
                startIcon={
                  sortOrder === "asc" ? (
                    <ArrowUpwardIcon />
                  ) : (
                    <ArrowDownwardIcon />
                  )
                }
                onClick={() =>
                  onSortChange(sortField, sortOrder === "asc" ? "desc" : "asc")
                }
              >
                {sortOrder === "asc" ? "ASC" : "DESC"}
              </Button>
            </ButtonGroup>
          </div>

          <FormControl variant="standard" style={{ minWidth: 120 }}>
            <InputLabel id="category-filter-label">Filter By</InputLabel>
            <Select
              labelId="category-filter-label"
              id="category-filter"
              name="categoryFilter"
              value={categoryFilter || ""}
              data-testid="filter-by-select-wrapper"
              onChange={(event) => onCategoryFilterChange(event.target.value)}
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {formatCategory(category)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Toolbar>
  );
};
