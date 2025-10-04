import { ProductReseller } from "@/features/types/products";
import { create } from "zustand";

interface ProductsState {
  products: ProductReseller[];
  setProducts: (products: ProductReseller[]) => void;
  updateProduct: (
    id: string,
    field: keyof ProductReseller,
    value: string | number | null | boolean
  ) => void;
}

export const useProductsStore = create<ProductsState>((set) => ({
  products: [],
  setProducts: (products) => set({ products }),
  updateProduct: (id, field, value) =>
    set((state) => ({
      products: state.products.map((p) =>
        `${p.productID}-${p.branchID}` === id ? { ...p, [field]: value } : p
      ),
    })),
}));
