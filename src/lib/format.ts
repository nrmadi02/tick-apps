type FormatRupiahOptions = {
  withPrefix?: boolean;
  withDecimals?: boolean;
  withSpacing?: boolean;
};

export const formatRupiah = (
  amount: number | null | undefined,
  options: FormatRupiahOptions = {},
): string => {
  const {
    withPrefix = true,
    withDecimals = false,
    withSpacing = true,
  } = options;

  if (amount === null || amount === undefined) return "Gratis";

  const formatter = new Intl.NumberFormat("id-ID", {
    style: withPrefix ? "currency" : "decimal",
    currency: "IDR",
    minimumFractionDigits: withDecimals ? 2 : 0,
    maximumFractionDigits: withDecimals ? 2 : 0,
  });

  let formatted = formatter.format(amount);

  // Handle spacing between currency and amount
  if (!withSpacing && withPrefix) {
    formatted = formatted.replace(/\s+/g, "");
  }

  return formatted;
};
