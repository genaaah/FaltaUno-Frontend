import React from "react";

function formatPrice(price, currency = "ARS") {
  if (currency === "ARS") return `$ ${price}`;
  return `${currency} ${price}`;
}

export default function ProductCard({ product, onAdd }) {
  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col">
      <div className="h-28 sm:h-36 bg-green-50 rounded-md flex items-center justify-center mb-3">
        {/* Placeholder image area */}
        <span className="text-xs text-green-600">Imagen</span>
      </div>
      <h3 className="font-semibold text-gray-800">{product.name}</h3>
      <p className="text-sm text-gray-600 mb-3">{product.description}</p>
      <div className="mt-auto flex items-center justify-between">
        <div className="text-green-700 font-bold">{formatPrice(product.price, product.currency)}</div>
        <button
          onClick={() => onAdd(product)}
          className="bg-green-600 text-white px-3 py-1.5 rounded-md text-sm hover:bg-green-700 transition-colors"
        >
          Agregar
        </button>
      </div>
    </div>
  );
}
