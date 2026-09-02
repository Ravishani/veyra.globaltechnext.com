"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("cart");

      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);

        setCartItems(
          Array.isArray(parsedCart) ? parsedCart : []
        );
      }
    } catch (error) {
      console.error("Cart load error:", error);
      setCartItems([]);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    try {
      localStorage.setItem(
        "cart",
        JSON.stringify(cartItems)
      );
    } catch (error) {
      console.error("Cart save error:", error);
    }
  }, [cartItems, isLoaded]);

  const addToCart = (product) => {
    if (!product?.id) {
      return false;
    }

    let wasExisting = false;

    setCartItems((currentItems) => {
      const existingProduct = currentItems.find(
        (item) =>
          Number(item.id) === Number(product.id)
      );

      if (existingProduct) {
        wasExisting = true;

        return currentItems.map((item) => {
          if (
            Number(item.id) ===
            Number(product.id)
          ) {
            return {
              ...item,
              quantity:
                Number(item.quantity || 1) + 1,
            };
          }

          return item;
        });
      }

      return [
        ...currentItems,
        {
          id: product.id,
          name: product.name || "",
          slug: product.slug || "",
          sku: product.sku || "",
          price: Number(product.price || 0),
          discount_price: Number(
            product.discount_price || 0
          ),
          image: product.image || null,
          category: product.category || null,
          quantity: 1,
        },
      ];
    });

    return wasExisting;
  };

  const removeFromCart = (productId) => {
    setCartItems((currentItems) =>
      currentItems.filter(
        (item) =>
          Number(item.id) !== Number(productId)
      )
    );
  };

  const updateQuantity = (
    productId,
    quantity
  ) => {
    const newQuantity = Number(quantity);

    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems((currentItems) =>
      currentItems.map((item) => {
        if (
          Number(item.id) ===
          Number(productId)
        ) {
          return {
            ...item,
            quantity: newQuantity,
          };
        }

        return item;
      })
    );
  };

  const increaseQuantity = (productId) => {
    setCartItems((currentItems) =>
      currentItems.map((item) => {
        if (
          Number(item.id) ===
          Number(productId)
        ) {
          return {
            ...item,
            quantity:
              Number(item.quantity || 1) + 1,
          };
        }

        return item;
      })
    );
  };

  const decreaseQuantity = (productId) => {
    setCartItems((currentItems) =>
      currentItems
        .map((item) => {
          if (
            Number(item.id) ===
            Number(productId)
          ) {
            return {
              ...item,
              quantity:
                Number(item.quantity || 1) - 1,
            };
          }

          return item;
        })
        .filter(
          (item) => Number(item.quantity) > 0
        )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = useMemo(() => {
    return cartItems.reduce(
      (total, item) =>
        total + Number(item.quantity || 0),
      0
    );
  }, [cartItems]);

  const cartTotal = useMemo(() => {
    return cartItems.reduce((total, item) => {
      const price =
        Number(item.discount_price) > 0 &&
        Number(item.discount_price) <
          Number(item.price)
          ? Number(item.discount_price)
          : Number(item.price || 0);

      return (
        total +
        price * Number(item.quantity || 0)
      );
    }, 0);
  }, [cartItems]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartTotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
}