import { create } from 'zustand';

interface CartItem {
    product: string;
    name: string;
    image: string;
    price: number;
    qty: number;
    vendor: string;
}

interface CartState {
    cartItems: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (id: string) => void;
    clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
    cartItems: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('cartItems') || '[]') : [],
    addToCart: (item) => set((state) => {
        const existItem = state.cartItems.find((x) => x.product === item.product);
        let newItems;
        if (existItem) {
            newItems = state.cartItems.map((x) => x.product === existItem.product ? item : x);
        } else {
            newItems = [...state.cartItems, item];
        }
        localStorage.setItem('cartItems', JSON.stringify(newItems));
        return { cartItems: newItems };
    }),
    removeFromCart: (id) => set((state) => {
        const newItems = state.cartItems.filter((x) => x.product !== id);
        localStorage.setItem('cartItems', JSON.stringify(newItems));
        return { cartItems: newItems };
    }),
    clearCart: () => set(() => {
        localStorage.removeItem('cartItems');
        return { cartItems: [] };
    }),
}));
