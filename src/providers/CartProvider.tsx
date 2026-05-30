'use client';

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';

import { CartItem, Product } from '@/lib/types';

interface CartContextType {
  items: CartItem[];

  addItem: (
    product: Product,
    quantity: number,
    size: string,
    color: string,
    personalization?: string,
  ) => void;

  removeItem: (productId: string) => void;

  updateQuantity: (productId: string, quantity: number) => void;

  clearCart: () => void;

  subtotal: number;

  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const storedCart = localStorage.getItem('cart');

      if (storedCart) {
        setItems(JSON.parse(storedCart));
      }
    } catch (error) {
      console.error('Erro ao carregar carrinho:', error);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    localStorage.setItem('cart', JSON.stringify(items));
  }, [items, hydrated]);

  const addItem = (
    product: Product,
    quantity: number,
    size: string,
    color: string,
    personalization?: string,
  ) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.size === size &&
          item.color === color &&
          item.personalization === personalization,
      );

      if (existingIndex > -1) {
        const updated = [...prev];

        updated[existingIndex].quantity += quantity;

        return updated;
      }

      return [
        ...prev,
        {
          product,
          quantity,
          size,
          color,
          personalization,
        },
      ];
    });
  };

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }

    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item,
      ),
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        subtotal,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('O useCart deve ser usado dentro de um CartProvider');
  }

  return context;
}
