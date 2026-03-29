"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface WishItem {
  clubId: number;
  clubName: string;
  logo: string;
  category: string;
}

const MAX_WISHLIST = 3;

interface WishlistContextType {
  wishlist: WishItem[];
  addToWishlist: (item: WishItem) => boolean;
  removeFromWishlist: (clubId: number) => void;
  isInWishlist: (clubId: number) => boolean;
  isFull: () => boolean;
  clearWishlist: () => void;
  MAX_WISHLIST: number;
}

const WishlistContext = createContext<WishlistContextType>({
  wishlist: [],
  addToWishlist: () => false,
  removeFromWishlist: () => {},
  isInWishlist: () => false,
  isFull: () => false,
  clearWishlist: () => {},
  MAX_WISHLIST,
});

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<WishItem[]>([]);

  const addToWishlist = (item: WishItem): boolean => {
    if (wishlist.length >= MAX_WISHLIST) return false;
    if (wishlist.some((w) => w.clubId === item.clubId)) return false;
    setWishlist((prev) => {
      if (prev.length >= MAX_WISHLIST) return prev;
      if (prev.some((w) => w.clubId === item.clubId)) return prev;
      return [...prev, item];
    });
    return true;
  };

  const removeFromWishlist = (clubId: number) => {
    setWishlist((prev) => prev.filter((w) => w.clubId !== clubId));
  };

  const isInWishlist = (clubId: number) => wishlist.some((w) => w.clubId === clubId);

  const isFull = () => wishlist.length >= MAX_WISHLIST;

  const clearWishlist = () => setWishlist([]);

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist, isFull, clearWishlist, MAX_WISHLIST }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}
