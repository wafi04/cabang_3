export const calculateFee = (
  basePrice: number,
  feeData: { fixed: number; percentage: number },
  feeType: "fixed" | "percentage" | "hybrid"
): number => {
  if (!basePrice || basePrice <= 0) return 0;

  switch (feeType) {
    case "fixed":
      return feeData.fixed || 0;

    case "percentage":
      return Math.round(basePrice * ((feeData.percentage || 0) / 100));

    case "hybrid":
      const fixedFee = feeData.fixed || 0;
      const percentageFee = Math.round(
        basePrice * ((feeData.percentage || 0) / 100)
      );
      return fixedFee + percentageFee;

    default:
      return 0;
  }
};
