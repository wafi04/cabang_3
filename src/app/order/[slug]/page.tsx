"use client";
import { AuthenticationLayout } from "@/features/layouts/authenticationLayout";
import { useGetResellerPricing } from "@/features/modules/products/api";
import { ProductsOrder } from "@/features/modules/products/components/ProductsData";
import { BannerOrder } from "@/features/modules/transactions/components/order/BannerOrder";
import {
  HeaderOrder,
  OrderInformation,
} from "@/features/modules/transactions/components/order/HeaderOrder";
import { MethodSection } from "@/features/modules/transactions/components/order/MethodSection";
import { PlaceHolderInput } from "@/features/modules/transactions/components/order/PlaceholderInput";
import { DialogValidateTransactions } from "@/features/modules/transactions/components/order/DialogTransactions";
import { useOrder } from "@/features/hooks/useFormOrder";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { Cart } from "@/features/modules/transactions/components/order/cart";

export default function OrderLayout() {
  const { slug } = useParams();
  const [displayCount, setDisplayCount] = useState<number>(20);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any>(null);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

  // Import useOrder untuk dialog
  const {
    transactionResult,
    showDialog,
    closeDialog,
    selectedMethod,
    selectedProduct,
    isSubmitting,
    confirmOrder,
  } = useOrder();

  const ITEMS_PER_PAGE = 20;

  const { data, isLoading } = useGetResellerPricing({
    brand: slug as string,
    limit: "1000",
    status: "active",
    page: "1",
  });

  useEffect(() => {
    if (data?.data?.data && Array.isArray(data.data.data)) {
      const items = data.data.data;

      const sortedItems = [...items].sort((a, b) => {
        const priceA =
          a.hargaPromo && a.hargaPromo > 0 ? a.hargaPromo : a.hargaJual;
        const priceB =
          b.hargaPromo && b.hargaPromo > 0 ? b.hargaPromo : b.hargaJual;
        return priceA - priceB;
      });

      setAllProducts(sortedItems);

      if (sortedItems.length > 0) {
        setCategoryData(sortedItems[0]);
      }
    }
  }, [data]);

  const displayedProducts = allProducts.slice(0, displayCount);
  const hasMore = displayCount < allProducts.length;

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setDisplayCount((prev) =>
        Math.min(prev + ITEMS_PER_PAGE, allProducts.length)
      );
      setIsLoadingMore(false);
    }, 300);
  };

  if (isLoading) {
    return (
      <AuthenticationLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AuthenticationLayout>
    );
  }

  if (!categoryData) {
    return (
      <AuthenticationLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center space-y-4">
            <p className="text-gray-500">Category not found</p>
            <button
              onClick={() => window.history.back()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
            >
              Go Back
            </button>
          </div>
        </div>
      </AuthenticationLayout>
    );
  }

  return (
    <AuthenticationLayout>
      <div className="relative bg-background min-h-screen">
        {/* Banner Section */}
        <section className="w-full">
          <BannerOrder image={categoryData?.categoryBanner} />
        </section>

        {/* Content area */}
        <section className="container mx-auto p-4 mt-5">
          {/* Mobile Layout */}
          <div className="lg:hidden space-y-6">
            <HeaderOrder
              brand={categoryData?.brand || ""}
              name={categoryData?.categoryName || ""}
              subName={categoryData?.categoryName || ""}
              thumbnail={categoryData?.categoryThumbnail || ""}
            />

            <OrderInformation
              inf={categoryData?.categoryInformation as string}
            />

            <PlaceHolderInput
              brand={slug as string}
              isCheckNickName={categoryData?.isCheckNickname}
            />

            <ProductsOrder products={displayedProducts} />

            {hasMore && (
              <div className="flex flex-col items-center gap-3 py-6">
                <button
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className="group relative px-8 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center gap-2"
                >
                  {isLoadingMore ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent"></div>
                      <span>Loading...</span>
                    </>
                  ) : (
                    <>
                      <span>Load More Products</span>
                      <ChevronDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            )}

            <MethodSection />
            <div className="sticky bottom-0 bg-background border-t pt-4 -mx-4 px-4">
              <Cart
                confirmOrder={confirmOrder}
                isSubmitting={isSubmitting}
                selectedMethod={selectedMethod}
                selectedProduct={selectedProduct}
              />
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:grid lg:grid-cols-12 gap-6 xl:gap-8">
            <div className="lg:col-span-4 xl:col-span-3">
              <div className="sticky top-4 space-y-4">
                <HeaderOrder
                  brand={categoryData?.brand || ""}
                  name={categoryData?.categoryName || ""}
                  subName={categoryData?.categoryName || ""}
                  thumbnail={categoryData?.categoryThumbnail || ""}
                />

                <OrderInformation
                  inf={categoryData?.categoryInformation as string}
                />
                <Cart
                  confirmOrder={confirmOrder}
                  isSubmitting={isSubmitting}
                  selectedMethod={selectedMethod}
                  selectedProduct={selectedProduct}
                />
              </div>
            </div>

            <div className="lg:col-span-8 xl:col-span-9 space-y-6">
              <PlaceHolderInput
                brand={slug as string}
                isCheckNickName={categoryData?.isCheckNickname}
              />

              <ProductsOrder products={displayedProducts} />

              {hasMore && (
                <div className="flex flex-col items-center gap-3 py-8">
                  <button
                    onClick={handleLoadMore}
                    disabled={isLoadingMore}
                    className="group relative px-10 py-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center gap-3"
                  >
                    {isLoadingMore ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary-foreground border-t-transparent"></div>
                        <span>Loading...</span>
                      </>
                    ) : (
                      <>
                        <span>Load More Products</span>
                        <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              )}

              <MethodSection />
            </div>
          </div>
        </section>
      </div>

      {/* Dialog di level parent - akan muncul di atas semua konten */}
      {showDialog && transactionResult && (
        <DialogValidateTransactions
          transactionData={{
            ...transactionResult,
            referenceID: transactionResult.referenceID,
          }}
          isOpen={showDialog}
          onClose={closeDialog}
        />
      )}
    </AuthenticationLayout>
  );
}
