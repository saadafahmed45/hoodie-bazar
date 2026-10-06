"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],

      toggleWishlist: (product) => {
        const id = product._id || product.id;
        const exists = get().items.some((item) => (item._id || item.id) === id);

        if (exists) {
          set({
            items: get().items.filter((item) => (item._id || item.id) !== id),
          });
          return false; // removed
        } else {
          set({
            items: [...get().items, product],
          });
          return true; // added
        }
      },

      isInWishlist: (productId) => {
        return get().items.some((item) => (item._id || item.id) === productId);
      },

      removeFromWishlist: (productId) => {
        set({
          items: get().items.filter((item) => (item._id || item.id) !== productId),
        });
      },
    }),
    {
      name: "nivora-wishlist-storage",
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
    }
  )
);
