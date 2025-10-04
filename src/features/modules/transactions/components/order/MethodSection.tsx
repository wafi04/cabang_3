"use client";
import { useOrder } from "@/features/hooks/useFormOrder";
import { useGetMethodByType } from "@/features/hooks/useGetMethods";
import { cn } from "@/lib/utils";
import { calculateFee } from "@/utils/calculateFee";
import { FormatCurrency } from "@/utils/format";
import { ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { HeaderFieldOrder } from "./HeaderFieldOrder";

export function MethodSection() {
  const { data } = useGetMethodByType();
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  const { selectedProduct, selectedMethod, setSelectedMethod } = useOrder();

  const handleGroupToggle = (groupType: string) => {
    if (!selectedProduct) {
      toast.error("Pilih Product Terlebih Dahulu");
      return;
    }
    setExpandedGroup(expandedGroup === groupType ? null : groupType);
  };

  const handleMethodSelect = (
    method: any,
    fee: number,
    total: number,
    calculationType: string,
    feeData: any
  ) => {
    setSelectedMethod({
      code: method.code,
      fee: {
        amount: feeData.fixed,
        percentage: feeData.percentage,
        type: calculationType as "fixed" | "percentage" | "hybrid",
      },
      name: method.name,
      total,
    });
  };

  if (!data?.data) {
    return (
      <section
        id="method-section"
        className="relative scroll-mt-20 rounded-xl bg-card border p-4 shadow-sm md:scroll-mt-[7.5rem]"
      >
        <h3 className="text-xl font-semibold text-foreground mb-4">
          Pilih Metode Pembayaran
        </h3>
        <div className="animate-pulse space-y-3">
          <div className="h-12 bg-gray-200 rounded-lg"></div>
          <div className="h-12 bg-gray-200 rounded-lg"></div>
          <div className="h-12 bg-gray-200 rounded-lg"></div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="method-section"
      className="relative scroll-mt-20 rounded-xl bg-card border shadow-sm md:scroll-mt-[7.5rem]"
    >
      <HeaderFieldOrder id={3} subName="Pilih Metode Pembayaran" />

      <div className="space-y-3 p-4">
        {data.data.map((group) => (
          <div
            key={group.type}
            className="rounded-lg border border-border overflow-hidden bg-background"
          >
            {/* Header dengan preview metode */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleGroupToggle(group.type);
              }}
              disabled={!selectedProduct}
              className={cn(
                "flex w-full items-center justify-between transition-colors focus:outline-none focus:ring-2 focus:ring-ring",
                !selectedProduct
                  ? "cursor-not-allowed opacity-50"
                  : "hover:bg-muted/50 cursor-pointer"
              )}
            >
              <div className="flex items-center justify-between w-full">
                <div className="w-full justify-between flex bg-primary text-primary-foreground py-3 px-4">
                  <h4 className="text-sm font-semibold">
                    {group.type.toUpperCase()}
                  </h4>
                  {expandedGroup === group.type ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </div>
              </div>
            </button>

            {/* Preview methods (ketika collapsed) */}
            {expandedGroup !== group.type &&
              group.methods &&
              group.methods.length > 0 && (
                <div className="flex gap-3 justify-end w-full p-4 items-center">
                  <div className="flex gap-2 items-center">
                    {group.methods.slice(0, 4).map((method) => (
                      <div
                        key={method.id}
                        className="relative h-6 w-16 flex-shrink-0 rounded border overflow-hidden bg-white"
                      >
                        <Image
                          src={method.image}
                          alt={method.name}
                          fill
                          sizes="(max-width: 64px) 100vw, 64px"
                          className="object-contain p-0.5"
                        />
                      </div>
                    ))}
                    {group.methods.length > 4 && (
                      <div className="text-xs text-muted-foreground font-medium">
                        +{group.methods.length - 4} lainnya
                      </div>
                    )}
                  </div>
                </div>
              )}

            {/* Expanded methods */}
            {expandedGroup === group.type && group.methods && (
              <div className="border-t bg-muted/20 p-4">
                <div className="grid gap-3 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                  {group.methods.map((method) => {
                    if (
                      method.min_amount &&
                      Number(selectedProduct?.price) < Number(method.min_amount)
                    ) {
                      return;
                    }
                    // Handle empty calculation_type
                    let calculationType = method.calculation_type;
                    if (!calculationType) {
                      if (
                        (!method.fee_amount || method.fee_amount === 0) &&
                        (!method.fee_percentage || method.fee_percentage === 0)
                      ) {
                        calculationType = "fixed";
                      } else if (method.fee_amount && method.fee_amount > 0) {
                        calculationType = "fixed";
                      } else if (
                        method.fee_percentage &&
                        method.fee_percentage > 0
                      ) {
                        calculationType = "percentage";
                      } else {
                        calculationType = "fixed";
                      }
                    }

                    const feeData = {
                      fixed: Number(method.fee_amount) || 0,
                      percentage: Number(method.fee_percentage) || 0,
                    };

                    const productPrice = selectedProduct?.price || 0;
                    const fee = calculateFee(
                      productPrice,
                      feeData,
                      calculationType as "fixed" | "percentage" | "hybrid"
                    );

                    const total = productPrice + fee;
                    const isSelected = selectedMethod?.code === method.code;

                    // Check minimum amount - skip if total is less than minimum

                    return (
                      <button
                        key={method.id}
                        type="button"
                        disabled={
                          !!(
                            method.min_amount &&
                            Number(productPrice) < Number(method.min_amount)
                          )
                        }
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleMethodSelect(
                            method,
                            fee,
                            total,
                            calculationType,
                            feeData
                          );
                        }}
                        className={cn(
                          "flex w-full items-center justify-between rounded-lg border p-3 transition-all hover:shadow-sm text-left",
                          isSelected
                            ? "border-primary bg-primary/10 shadow-sm ring-1 ring-primary/20"
                            : "border-border bg-background hover:border-primary/50 hover:bg-muted/30"
                        )}
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="relative w-12 h-8 flex-shrink-0 rounded border overflow-hidden bg-white">
                            <Image
                              src={method.image}
                              alt={method.name}
                              fill
                              sizes="(max-width: 48px) 100vw, 48px"
                              className="object-contain p-1"
                            />
                          </div>
                          <span className="text-sm font-medium text-foreground truncate">
                            {method.name}
                          </span>
                        </div>

                        {productPrice > 0 && (
                          <div className="flex flex-col items-end ml-2">
                            <span className="text-sm font-semibold text-primary">
                              {FormatCurrency(total)}
                            </span>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {!selectedProduct && (
        <div className="mt-4 p-3 bg-muted/50 rounded-lg border border-dashed">
          <p className="text-sm text-muted-foreground text-center">
            Silakan pilih produk terlebih dahulu untuk melihat metode pembayaran
          </p>
        </div>
      )}
    </section>
  );
}
