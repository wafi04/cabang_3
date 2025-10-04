import { useOrder } from "@/features/hooks/useFormOrder";
import { ProductReseller } from "@/features/types/products";
import { FormatCurrency } from "@/utils/format";
import { toast } from "react-hot-toast";

export function ProductsOrder({ products }: { products: ProductReseller[] }) {
  const calculateDiscount = (originalPrice: number, promoPrice: number) => {
    const discount = ((originalPrice - promoPrice) / originalPrice) * 100;
    return Math.round(discount);
  };
  const { setSelectedProduct, orderSummary, formData } = useOrder();

  return (
    <div className="space-y-3 bg-card p-4 rounded-lg border border-border">
      <h2 className="text-lg font-semibold text-foreground mb-4">
        Pilih Nominal
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map((product) => {
          const hasPromo = product.hargaPromo && product.hargaPromo > 0;
          const discountPercentage = hasPromo
            ? calculateDiscount(product.hargaJual, product.hargaPromo ?? 0)
            : 0;

          return (
            <div
              key={product.id}
              onClick={() => {
                if (!formData?.gameId || formData.gameId === "") {
                  toast.error("Masukkan Akun Terlebih Dahulu");
                  return;
                }
                setSelectedProduct({
                  id: product.id,
                  productId: product.productID,
                  name: product.productName,
                  price: hasPromo
                    ? product.hargaPromo ?? product.hargaJual
                    : product.hargaJual,
                });
              }}
              className="bg-card border rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer hover:border-primary/30"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-medium text-foreground text-sm mb-2">
                    {product.productName}
                  </h3>

                  <div className="space-y-1">
                    {hasPromo ? (
                      <>
                        {/* Promo Price */}
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-green-600 dark:text-green-500">
                            {FormatCurrency(product.hargaPromo ?? 0)}
                          </span>
                          <span className="bg-destructive/10 text-destructive text-xs font-semibold px-2 py-1 rounded">
                            -{discountPercentage}%
                          </span>
                        </div>

                        {/* Original Price */}
                        <div className="text-sm text-muted-foreground line-through">
                          {FormatCurrency(product.hargaJual)}
                        </div>
                      </>
                    ) : (
                      /* Regular Price */
                      <div className="text-lg font-bold text-foreground">
                        {FormatCurrency(product.hargaJual)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
