import React, { createContext, useContext, useState, useCallback } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const addItem = useCallback((product, ml, quantity = 1) => {
    const variant = product.variants.find(v => v.ml === ml);
    if (!variant) return;
    setItems(prev => {
      const key = `${product._id}-${ml}`;
      const existing = prev.find(i => i.key === key);
      if (existing) {
        return prev.map(i => i.key === key ? { ...i, quantity: i.quantity + quantity } : i);
      }
      return [...prev, {
        key, product, productId: product._id, name: product.name,
        image: product.images?.[0] || '', type: product.type,
        ml, price: variant.price, quantity
      }];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((key) => {
    setItems(prev => prev.filter(i => i.key !== key));
  }, []);

  const updateQty = useCallback((key, quantity) => {
    if (quantity < 1) return;
    setItems(prev => prev.map(i => i.key === key ? { ...i, quantity } : i));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, subtotal, itemCount, isOpen, setIsOpen }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
