"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      isDrawerOpen: false,

      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),
      setDrawerOpen: (open) => set({ isDrawerOpen: open }),

      addToCart: (product, { size, color, quantity = 1 } = {}) => {
        const { items } = get();
        const selectedSize = size || (product.sizes && product.sizes[0]) || "Standard";
        const selectedColor = color || (product.colors && product.colors[0]) || "Default";

        // Find existing matching item with same productId, size and color
        const existingIndex = items.findIndex(
          (item) =>
            item.productId === (product._id || product.id) &&
            item.size === selectedSize &&
            item.color === selectedColor
        );

        if (existingIndex > -1) {
          const updatedItems = [...items];
          updatedItems[existingIndex].quantity += quantity;
          set({ items: updatedItems, isDrawerOpen: true });
        } else {
          const newItem = {
            productId: product._id || product.id,
            slug: product.slug,
            name: product.name,
            image: product.images?.[0] || "/images/placeholder.jpg",
            price: Number(product.price),
            quantity,
            size: selectedSize,
            color: selectedColor,
            category: product.category,
          };
          set({ items: [...items, newItem], isDrawerOpen: true });
        }
      },

      removeFromCart: (productId, size, color) => {
        set({
          items: get().items.filter(
            (item) =>
              !(
                item.productId === productId &&
                item.size === size &&
                item.color === color
              )
          ),
        });
      },

      updateQuantity: (productId, size, color, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(productId, size, color);
          return;
        }
        set({
          items: get().items.map((item) =>
            item.productId === productId &&
            item.size === size &&
            item.color === color
              ? { ...item, quantity }
              : item
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      getCartTotal: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },

      getCartCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: "nivora-cart-storage",
      storage: createJSONStorage(() => {
        if (typeof window !== "undefined") {
          return localStorage;
        }
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
      }),
      partialize: (state) => ({ items: state.items }),
    }
  )
);
