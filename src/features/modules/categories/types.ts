export interface Category {
  id: number;
  name: string;
  sub_name: string;
  brand: string;
  thumbnail: string;
  bannerUrl: string;
  information: string;
  instruction: string;
  isActive: boolean;
  isCheckNickname: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductOrder {
  productName: string;
  productCode: string;
  productPrice: number;
}
export interface FilterState {
  category: string;
  setCategory: (category: string) => void;
  resetCategory: () => void;
}

export interface CategoryWithProducts {
  subCategoryId: number;
  subCategoryName: string;
  subCategorySubName: string;
  subCategoryThumbnail: string;
  subCategoryBanner: string;
  productTypes: {
    products: ProductOrder[];
    typeName: string;
  }[];
}
