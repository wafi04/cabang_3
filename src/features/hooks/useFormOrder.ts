import { useState } from "react";
import { useCreateTransactions } from "../modules/transactions/api";
import { TransactionResponse } from "../modules/transactions/types";
import { useOrderStore } from "./useOrder";

export function useOrder() {
  const { mutate, isPending } = useCreateTransactions();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [transactionResult, setTransactionResult] =
    useState<TransactionResponse | null>(null);

  const store = useOrderStore();

  const submitOrder = () => {
    if (isSubmitting || isPending) return;

    setIsSubmitting(true);

    try {
      const { formData, selectedProduct, selectedMethod } = store;

      // Validate required data
      if (!selectedProduct || !selectedMethod) {
        throw new Error("Product dan metode pembayaran harus dipilih");
      }

      const noTujuan = formData.serverId?.trim()
        ? `${formData.gameId.trim()}${formData.serverId.trim()}`
        : formData.gameId.trim();

      mutate(
        {
          noTujuan,
          ID: selectedProduct.id,
          paymentMethod: selectedMethod.code,
          productId: selectedProduct.productId,
        },
        {
          onSuccess: (data) => {
            setTransactionResult(data.data);
            setShowDialog(true);
          },
          onError: (error) => {
            const message =
              error instanceof Error ? error.message : "Terjadi kesalahan";
            store.setError("root", message);
          },
        }
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Terjadi kesalahan";
      store.setError("root", message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmOrder = () => {
    submitOrder();
  };

  const closeDialog = () => {
    setShowDialog(false);
    setTransactionResult(null);

    if (transactionResult) {
      store.clearForm();
    }
  };

  // Helper function to get order summary
  const getOrderSummary = () => {
    const { selectedProduct, selectedMethod } = store;
    const calculation = store.getCalculation();

    if (!selectedProduct || !selectedMethod) {
      return null;
    }

    return {
      product: selectedProduct,
      paymentMethod: selectedMethod,
      calculation,
      customer: {
        gameId: store.formData.gameId,
        serverId: store.formData.serverId,
        noTujuan: store.formData.serverId?.trim()
          ? `${store.formData.gameId.trim()}${store.formData.serverId.trim()}`
          : store.formData.gameId.trim(),
      },
    };
  };

  // Helper function to check if order is valid
  const isOrderValid = () => {
    const { selectedProduct, selectedMethod, formData } = store;
    return (
      selectedProduct &&
      selectedMethod &&
      formData.gameId?.trim() &&
      store.validateForm()
    );
  };

  return {
    // Form Data
    formData: store.formData,
    errors: store.errors,

    // Selected Items (now as objects)
    selectedProduct: store.selectedProduct, // Product object
    selectedMethod: store.selectedMethod, // PaymentMethod object

    // Calculations
    calculation: store.getCalculation(), // OrderCalculation object

    // Dialog state
    showDialog,
    transactionResult,

    // Loading states
    isSubmitting: isSubmitting || isPending,
    isPending,

    // Validation
    isOrderValid: isOrderValid(),

    // Order summary
    orderSummary: getOrderSummary(),

    // Form actions
    setFormData: store.setFormData,
    setSelectedProduct: store.setSelectedProduct, // Now sets Product object
    setSelectedMethod: store.setSelectedMethod, // Now sets PaymentMethod object
    setError: store.setError,
    clearErrors: store.clearErrors,
    clearForm: store.clearForm,
    validateForm: store.validateForm,

    // Transaction actions
    submitOrder,
    confirmOrder,
    closeDialog,

    // Utility functions
    getOrderSummary,
  };
}
