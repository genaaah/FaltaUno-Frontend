import React from "react";

function formatPrice(price, currency = "ARS") {
  if (currency === "ARS") return `$ ${price}`;
  return `${currency} ${price}`;
}

export default function Cart({ items, onRemove, onChangeQty, onCheckout, onClear }) {
  const total = items.reduce((s, it) => s + it.product.price * it.qty, 0);

  return (
    <div className="bg-white rounded-lg shadow p-4 w-full lg:sticky lg:top-6">
      <h4 className="font-bold mb-3">Carrito</h4>
      {items.length === 0 ? (
        <p className="text-sm text-gray-600">El carrito está vacío.</p>
      ) : (
        <div className="space-y-3">
          {items.map((it) => (
            <div key={it.product.id} className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-sm">{it.product.name}</div>
                <div className="text-xs text-gray-500">{formatPrice(it.product.price, it.product.currency)}</div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  value={it.qty}
                  onChange={(e) => onChangeQty(it.product.id, Math.max(1, Number(e.target.value)))}
                  className="w-16 px-2 py-1 border rounded"
                />
                <button onClick={() => onRemove(it.product.id)} className="text-red-500 text-sm">Quitar</button>
              </div>
            </div>
          ))}

          <div className="border-t pt-3 flex items-center justify-between">
            <div className="font-bold">Total</div>
            <div className="font-bold text-green-700">{formatPrice(total)}</div>
          </div>

          <div className="flex gap-2">
            <button onClick={onCheckout} className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700">Comprar</button>
            <button onClick={onClear} className="bg-gray-100 text-gray-700 py-2 px-3 rounded">Vaciar</button>
          </div>
        </div>
      )}
    </div>
  );
}
