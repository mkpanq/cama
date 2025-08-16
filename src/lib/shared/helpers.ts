export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

// TODO: Empty states - for now, I've add PLN as default currency, but it needs to be fixed!
export function currencyFormat(
  amount: number,
  currency: string = "PLN",
  format: string = "pl-PL",
) {
  return new Intl.NumberFormat(format, {
    style: "currency",
    currency,
  }).format(amount);
}
