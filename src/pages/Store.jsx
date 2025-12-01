import React, { useEffect, useState } from "react";
import productsData from "../content/products.json";
import ProductCard from "../components/Store/ProductCard";
import Cart from "../components/Store/Cart";

const STORAGE_KEY = "falta1_cart";

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
}

export default function Store() {
  const [products] = useState(productsData);
  const [cartItems, setCartItems] = useState(() => loadCart());
  const [message, setMessage] = useState("");

  useEffect(() => {
    saveCart(cartItems);
  }, [cartItems]);

  const handleAdd = (product) => {
    setCartItems((prev) => {
      const found = prev.find((p) => p.product.id === product.id);
      if (found) {
        return prev.map((p) => (p.product.id === product.id ? { ...p, qty: p.qty + 1 } : p));
      }
      return [...prev, { product, qty: 1 }];
    });
    setMessage("Producto agregado al carrito");
    setTimeout(() => setMessage(""), 1500);
  };

  const handleRemove = (productId) => {
    setCartItems((prev) => prev.filter((p) => p.product.id !== productId));
  };

  const handleChangeQty = (productId, qty) => {
    setCartItems((prev) => prev.map((p) => (p.product.id === productId ? { ...p, qty } : p)));
  };

  const handleClear = () => setCartItems([]);

  const handleCheckout = () => {
    // Simulate checkout
    setMessage("Compra realizada. Gracias por tu pedido.");
    setCartItems([]);
    setTimeout(() => setMessage(""), 2500);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Tienda Falta1</h1>
      {message && <div className="mb-4 text-sm text-green-700">{message}</div>}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
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
