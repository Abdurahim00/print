import type { CartItem } from "@/types"

// Keying rules to identify the "same" logical item across carts:
// - If a designId exists, key by designId (custom designs are unique by designId)
// - Otherwise, key by exact id only (do not attempt to strip timestamps or merge different unique entries)
const keyOf = (item: CartItem) => (item.designId ? `design:${item.designId}` : `id:${item.id}`)

export function mergeCartsPreferRight(left: CartItem[], right: CartItem[]): CartItem[] {
  const map = new Map<string, CartItem>()
  for (const li of left) {
    map.set(keyOf(li), li)
  }
  for (const ri of right) {
    const k = keyOf(ri)
    const existing = map.get(k)
    if (!existing) {
      map.set(k, ri)
      continue
    }
    const merged: CartItem = {
      ...existing,
      ...ri,
      quantity: ri.quantity,
      selectedSizes: ri.selectedSizes ?? existing.selectedSizes,
    }
    map.set(k, merged)
  }
  return Array.from(map.values())
}


