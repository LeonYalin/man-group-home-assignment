import { Product } from "../shared/models";

export const mockProducts: Product[] = [
  {
    id: 1,
    name: "USB Cable",
    imageUrl:
      "https://images.unsplash.com/photo-1492107376256-4026437926cd?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&h=400&q=80",
    supplierId: 1,
    wholesalePrice: 2.0,
    price: 4.0,
    categories: ["accessory"],
  },
  {
    id: 2,
    name: "Laptop",
    imageUrl:
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&h=400&q=80",
    supplierId: 2,
    wholesalePrice: 800.0,
    price: 1000.0,
    categories: ["electronic"],
  },
  {
    id: 3,
    name: "Monitor",
    imageUrl:
      "https://images.unsplash.com/photo-1546538915-a9e2c8d0a0b2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&h=400&q=80",
    supplierId: 1,
    wholesalePrice: 180.0,
    price: 220.0,
    categories: ["electronic"],
  },
  {
    id: 4,
    name: "Headphones",
    imageUrl:
      "https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&h=400&q=80",
    supplierId: 1,
    wholesalePrice: 20.0,
    price: 30.0,
    categories: ["accessory", "electronic", "audio"],
  },
];
