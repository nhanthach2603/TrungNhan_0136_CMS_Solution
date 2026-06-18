import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useToast } from './ToastContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const { addToast } = useToast();
    const [cart, setCart] = useState(() => {
        const localData = localStorage.getItem('cart');
        return localData ? JSON.parse(localData) : [];
    });
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Save cart to local storage whenever it changes
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const toggleCart = useCallback(() => {
        setIsCartOpen(prev => !prev);
    }, []);

    const addToCart = useCallback((product, quantity = 1) => {
        setCart(prevCart => {
            const existingIndex = prevCart.findIndex(item => item.id === product.id);
            if (existingIndex > -1) {
                const updatedCart = [...prevCart];
                updatedCart[existingIndex].quantity += quantity;
                addToast(`Đã cập nhật số lượng ${product.name} trong giỏ hàng!`, 'success');
                return updatedCart;
            } else {
                addToast(`Đã thêm ${product.name} vào giỏ hàng!`, 'success');
                return [...prevCart, {
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    imageUrl: product.imageUrl,
                    categoryProductName: product.categoryProductName,
                    quantity: quantity
                }];
            }
        });
        setIsCartOpen(true); // Auto-open cart drawer when adding item
    }, [addToast]);

    const removeFromCart = useCallback((productId) => {
        setCart(prevCart => {
            const item = prevCart.find(i => i.id === productId);
            if (item) {
                addToast(`Đã xóa ${item.name} khỏi giỏ hàng!`, 'info');
            }
            return prevCart.filter(i => i.id !== productId);
        });
    }, [addToast]);

    const updateQuantity = useCallback((productId, quantity) => {
        if (quantity < 1) return;
        setCart(prevCart =>
            prevCart.map(item =>
                item.id === productId ? { ...item, quantity } : item
            )
        );
    }, []);

    const clearCart = useCallback(() => {
        setCart([]);
        localStorage.removeItem('cart');
    }, []);

    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
    const cartTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return (
        <CartContext.Provider value={{
            cart,
            isCartOpen,
            setIsCartOpen,
            toggleCart,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            cartCount,
            cartTotal
        }}>
            {children}
        </CartContext.Provider>
    );
};
