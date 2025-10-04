"use client";
import { useOrder } from "@/features/hooks/useFormOrder";
import { AuthenticationLayout } from "@/features/layouts/authenticationLayout";
import { useGetResellerPricing } from "@/features/modules/products/api";
import { ProductsOrder } from "@/features/modules/products/components/ProductsData";
import { BannerOrder } from "@/features/modules/transactions/components/order/BannerOrder";
import { Cart } from "@/features/modules/transactions/components/order/cart";
import { DialogValidateTransactions } from "@/features/modules/transactions/components/order/DialogTransactions";
import {
  HeaderOrder,
  OrderInformation,
} from "@/features/modules/transactions/components/order/HeaderOrder";
import { MethodSection } from "@/features/modules/transactions/components/order/MethodSection";
import { PhoneNumberInput } from "@/features/modules/transactions/components/order/PhoneNumberInput";
import { PlaceHolderInput } from "@/features/modules/transactions/components/order/PlaceholderInput";
import { useParams } from "next/navigation";

export default function OrderLayout() {
  const { slug } = useParams();

  const {
    transactionResult,
    showDialog,
    formData,
    setFormData,
    closeDialog,
    selectedMethod,
    selectedProduct,
    isSubmitting,
    confirmOrder,
  } = useOrder();

  const { data, isLoading } = useGetResellerPricing({
    brand: slug as string,
    limit: "1000",
    status: "active",
    page: "1",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData({ [field]: value });
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

  const categoryData = data?.data.data[0];

  return (
    <AuthenticationLayout>
      <div className="relative min-h-screen">
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
              isCheckNickName={categoryData?.isCheckNickname as boolean}
            />
            {data && <ProductsOrder products={data?.data.data} />}

            <MethodSection />
            <PhoneNumberInput
              email={formData.email || ""}
              phoneNumber={formData.phoneNumber || ""}
              setEmail={(value) => handleInputChange("email", value)}
              setPhoneNumber={(value) =>
                handleInputChange("phoneNumber", value)
              }
            />
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
                isCheckNickName={categoryData?.isCheckNickname as boolean}
              />

              {data && <ProductsOrder products={data?.data.data} />}

              <MethodSection />
              <PhoneNumberInput
                email={formData.email || ""}
                phoneNumber={formData.phoneNumber || ""}
                setEmail={(value) => handleInputChange("email", value)}
                setPhoneNumber={(value) =>
                  handleInputChange("phoneNumber", value)
                }
              />
            </div>
          </div>
        </section>
      </div>

      {/* Dialog di level parent */}
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
