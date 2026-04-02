import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Item { id: number; name: string; price: number; category: string; }

interface CartState {
  cart: Item[];
  history: Item[][]; 
  promoCode: string;
  addItem: (item: Item) => void;
  removeItem: (id: number) => void;
  undo: () => void;
  setPromo: (code: string) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],
      history: [],
      promoCode: '',

      addItem: (item) => {
        const currentCart = get().cart;
        set({ 
          history: [...get().history, currentCart], 
          cart: [...currentCart, item] 
        });
      },

      removeItem: (id) => {
        const currentCart = get().cart;
        const index = currentCart.findIndex(i => i.id === id);
        if (index > -1) {
          const newCart = [...currentCart];
          newCart.splice(index, 1);
          set({ history: [...get().history, currentCart], cart: newCart });
        }
      },

      undo: () => {
        const history = get().history;
        if (history.length === 0) return;
        const previousState = history[history.length - 1];
        const newHistory = history.slice(0, -1);
        set({ cart: previousState, history: newHistory });
      },

      setPromo: (code) => set({ promoCode: code }),
    }),
    { name: 'grocery-storage' } // LocalStorage key
  )
);