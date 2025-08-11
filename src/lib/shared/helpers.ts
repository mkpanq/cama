export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export function currencyFormat(
  amount: number,
  currency: string,
  format: string = "pl-PL",
) {
  return new Intl.NumberFormat(format, {
    style: "currency",
    currency,
  }).format(amount);
}
