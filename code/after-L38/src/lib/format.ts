// 32 → "₾32", 14.5 → "₾14.50"
export function formatPrice(price: number) {
  return Number.isInteger(price) ? `₾${price}` : `₾${price.toFixed(2)}`;
}

// 1 → "1 item", 3 → "3 items"
export function formatItems(count: number) {
  return `${count} ${count === 1 ? "item" : "items"}`;
}
