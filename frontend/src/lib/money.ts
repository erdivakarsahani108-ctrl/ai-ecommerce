export function formatMoney(cents: number): string {
  const v = (cents ?? 0) / 100;
  return v.toLocaleString(undefined, { style: "currency", currency: "USD" });
}

