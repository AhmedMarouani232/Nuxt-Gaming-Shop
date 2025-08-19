import { create } from 'zustand';
import type { CartItem, Product } from '@shared/schema';

interface CartState {
  items: Array<CartItem & { product: Product }>;
  isOpen: boolean;
  setItems: (items: Array<CartItem & { product: Product }>) => void;
  addItem: (item: CartItem & { product: Product }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isOpen: false,
  setItems: (items) => set({ items }),
  addItem: (item) => {
    const items = get().items;
    const existingItem = items.find(i => i.productId === item.productId);
    
    if (existingItem) {
      set({
        items: items.map(i => 
          i.productId === item.productId 
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        )
      });
    } else {
      set({ items: [...items, item] });
    }
  },
  removeItem: (id) => {
    set({ items: get().items.filter(item => item.id !== id) });
  },
  updateQuantity: (id, quantity) => {
    if (quantity <= 0) {
      get().removeItem(id);
      return;
    }
    
    set({
      items: get().items.map(item => 
        item.id === id ? { ...item, quantity } : item
      )
    });
  },
  clearCart: () => set({ items: [] }),
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  toggleCart: () => set({ isOpen: !get().isOpen }),
  getTotalItems: () => get().items.reduce((total, item) => total + item.quantity, 0),
  getTotalPrice: () => get().items.reduce((total, item) => 
    total + (parseFloat(item.product.price) * item.quantity), 0
  ),
}));
