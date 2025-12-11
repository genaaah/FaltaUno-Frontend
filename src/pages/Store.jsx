import React, { useEffect, useState } from "react";
import ProductCard from "../components/Store/ProductCard";
import Cart from "../components/Store/Cart";
import { getProducts, getCartByUserId, saveCartToServer } from "../services/productService";
import { useAuth } from "../context/AuthContext";



const productsData = async () => {
  try {
    const products = await getProducts();
    return products;
  } catch (error) {
    console.error("Error loading products:", error);
    return [];
  }
}

export default function Store() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [message, setMessage] = useState("");
  const [loadeded, setLoadeded] = useState(false);


  useEffect(() => {
    if (loadeded) {
      saveCartToBackend(cartItems);
    }

  }, [cartItems, loadeded]);

  useEffect(() => {
    const loadProducts = async () => {
      const data = await productsData();
      setProducts(data);
    };
    loadProducts();
  }, []);

  useEffect(() => {
    const loadCartFromServer = async () => {
      if (user && user.id) {
        try {
          const cartData = await getCartByUserId(user.id);
          setCartItems(cartData);
        } catch (error) {
          console.error('Error loading cart:', error);
        }
        finally {
          setLoadeded(true);
        }
      }
    };
    loadCartFromServer();
  }, []);


  const saveCartToBackend = async () => {
    if (user && user.id) {
      try {
        await saveCartToServer(user.id, cartItems);

      } catch (error) {
        console.error('Error saving cart to server:', error);
      }
    }
  }


  const handleAdd = (product) => {
    cartItems && console.log("Current cart items:", cartItems);
    const newCartItems = [...cartItems];
    const found = newCartItems.find((p) => p.product.id === product.id);
    if (found) {
      found.qty += 1;
    } else {
      newCartItems.push({ product, qty: 1 });
    }
    setCartItems(newCartItems);

    setTimeout(() => {
      setMessage("")
    }
      , 1500);
  };

  const handleRemove = (productId) => {
    setCartItems((prev) => prev.filter((p) => p.product.id !== productId));
  };

  const handleChangeQty = (productId, qty) => {
    setCartItems((prev) =>
      prev.map((p) => (p.product.id === productId ? { ...p, qty } : p))
    );
    setCartItems((prev) =>
      prev.map((p) => (p.product.id === productId ? { ...p, qty } : p))
    );
  };

  const handleClear = () => setCartItems([]);

  const handleCheckout = () => {
    setMessage("Compra realizada. Gracias por tu pedido.");
    setCartItems([]);

    setTimeout(() => {
      setMessage("");
    }, 2500);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Tienda Falta1</h1>
      {message && <div className="mb-4 text-sm text-green-700">{message}</div>}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 grid gap-4 grid-cols-[repeat(auto-fit,minmax(180px,1fr))]">
        <div className="lg:col-span-3 grid gap-4 grid-cols-[repeat(auto-fit,minmax(180px,1fr))]">
          {products.map((prod) => (
            <ProductCard key={prod.id} product={prod} onAdd={handleAdd} />
          ))}
        </div>

        <aside className="lg:col-span-1">
          <Cart
            items={cartItems}
            onRemove={handleRemove}
            onChangeQty={handleChangeQty}
            onCheckout={handleCheckout}
            onClear={handleClear}
          />
        </aside>
      </div>
    </div>
  );
}
