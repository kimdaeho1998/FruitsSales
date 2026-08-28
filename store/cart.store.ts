"use client";
import { create } from "zustand"; import type { CartItem } from "@/types/cart";
type CartState = { items: CartItem[]; addItem: (item: CartItem) => void; removeItem: (variantId: string) => void; updateQuantity: (variantId: string, quantity: number) => void; clearCart: () => void };
/** displayPrice is UI-only; order totals must be recalculated from server-side variant prices. */
export const useCartStore = create<CartState>((set) => ({ items: [], addItem: (item) => set((state) => ({ items: [...state.items.filter((entry) => entry.variantId !== item.variantId), item] })), removeItem: (variantId) => set((state) => ({ items: state.items.filter((item) => item.variantId !== variantId) })), updateQuantity: (variantId, quantity) => set((state) => ({ items: state.items.map((item) => item.variantId === variantId ? { ...item, quantity: Math.max(1, quantity) } : item) })), clearCart: () => set({ items: [] }) }));
