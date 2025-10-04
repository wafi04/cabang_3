"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect } from "react";
import { useProductsStore } from "../useUpdateProducts";
import { useUpdateResellerPricing } from "../api";
import { ProductReseller } from "@/features/types/products";
import { FormatCurrency, formatDate } from "@/utils/format";

interface TableProductsProps {
  products: ProductReseller[];
}

export function TableProducts({ products }: TableProductsProps) {
  const {
    products: editedProducts,
    setProducts,
    updateProduct,
  } = useProductsStore();
  const { mutate, isPending } = useUpdateResellerPricing();

  useEffect(() => {
    setProducts(products);
  }, [products, setProducts]);

  const handleSave = (id: string, productID: number) => {
    const product = editedProducts.find(
      (p) => `${p.productID}-${p.branchID}` === id
    );
    if (!product) return;

    mutate({
      id: productID,
      productName: product.productName,
      margin: product.marginValue,

      hargaPromo: product.hargaPromo ?? 0,
      isActive: product.isActive,
    });
  };

  const handleMarginChange = (id: string, marginValue: number | null) => {
    const product = editedProducts.find(
      (p) => `${p.productID}-${p.branchID}` === id
    );
    if (!product) return;

    updateProduct(id, "marginValue", marginValue);

    if (marginValue !== null && marginValue > 0) {
      const newHargaJual = product.hargaModal + marginValue;
      updateProduct(id, "hargaJual", newHargaJual);
    } else {
      updateProduct(id, "hargaJual", product.hargaModal);
    }
  };

  if (editedProducts.length === 0) {
    return (
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="p-8 text-center space-y-2">
          <div className="text-4xl">🚀</div>
          <h3 className="text-lg font-semibold">Tidak ada data produk</h3>
          <p className="text-sm text-muted-foreground">
            Belum ada produk reseller yang tersedia.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produk</TableHead>
              <TableHead>Harga Modal</TableHead>
              <TableHead>Harga Jual</TableHead>
              <TableHead className="w-32">Margin</TableHead>
              <TableHead className="w-32">Harga Promo</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {editedProducts.map((product) => {
              const id = `${product.productID}-${product.branchID}`;
              return (
                <TableRow key={id}>
                  {/* Nama Produk */}
                  <TableCell className="font-medium">
                    {product.productName}
                  </TableCell>

                  {/* Harga Modal */}
                  <TableCell>{FormatCurrency(product.hargaModal)}</TableCell>

                  {/* Harga Jual */}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">
                        {FormatCurrency(product.hargaJual)}
                      </span>
                    </div>
                  </TableCell>

                  {/* Margin */}
                  <TableCell>
                    <Input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={product.marginValue ?? ""}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/\D/g, "");
                        const value = raw === "" ? null : Number(raw);
                        handleMarginChange(id, value);
                      }}
                      placeholder="0"
                      className="text-right"
                    />
                  </TableCell>

                  {/* Harga Promo */}
                  <TableCell>
                    <Input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={product.hargaPromo ?? ""}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/\D/g, "");
                        const value = raw === "" ? null : Number(raw);
                        updateProduct(id, "hargaPromo", value);
                      }}
                      placeholder="0"
                      className="text-right"
                    />
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    <Switch
                      checked={product.isActive}
                      onCheckedChange={(val) =>
                        updateProduct(id, "isActive", val)
                      }
                    />
                  </TableCell>

                  {/* Update Time */}
                  <TableCell className="text-sm text-muted-foreground">
                    {product.categoryName}
                  </TableCell>

                  {/* Save Button */}
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSave(id, product.id)}
                      disabled={isPending}
                    >
                      {isPending ? "Saving..." : "Save"}
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <p>
          Update terakhir:{" "}
          {formatDate(
            editedProducts[0]?.updated_at || new Date().toISOString()
          )}
        </p>
        <p>{editedProducts.length} produk ditampilkan</p>
      </div>
    </div>
  );
}
