export type PriceType = "hybrid" | "percentage" | "fixed";
export interface ProductReseller {
  id: number;
  created_at: string;
  updated_at: string;
  branchID: number;
  productID: number;
  hargaJual: number;
  hargaModal: number;
  categoryName: string;
  categoryThumbnail: string;
  categoryBanner: string;
  categoryInformation: string;
  brand: string;
  typeHarga: PriceType;
  marginValue: number;
  isActive: boolean;
  productName: string;
  isCheckNickname: boolean;
  hargaPromo: number;
}

export interface UpdateProductReseller {
  id: number;
  margin: number;
  hargaPromo: number;
  isActive: boolean;
  productName: string;
}
