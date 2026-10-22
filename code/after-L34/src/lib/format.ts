// 32 → "₾32", 14.5 → "₾14.50"
export function formatPrice(price: number) {
  return Number.isInteger(price) ? `₾${price}` : `₾${price.toFixed(2)}`;
}
