import React, { useState } from 'react';
import { Product, Currency } from '../types';
import { Package, ShoppingBag, Eye } from 'lucide-react';
import { formatCurrencyAmount } from '../services/currency';

interface Props {
  product: Product;
  currency: Currency;
  onAddToCart: (p: Product) => void;
  onSelect: (p: Product) => void;
}

export const ProductCard: React.FC<Props> = ({
  product,
  currency,
  onAddToCart,
  onSelect
}) => {
  const [imageError, setImageError] = useState(false);

  const formatPrice = () => {
    return formatCurrencyAmount(product.priceUSD, currency);
  };

  return (
    <div className="group relative bg-white border border-slate-200/80 rounded-xl overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md flex flex-col justify-between">
      {/* Product Image Area */}
      <div 
        className="relative aspect-4/3 bg-slate-100 overflow-hidden cursor-pointer"
        onClick={() => onSelect(product)}
      >
        {!imageError && product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400 p-4 text-center">
            <Package className="w-8 h-8 mb-2 opacity-50" />
            <span className="text-xs font-medium text-slate-500">{product.name}</span>
          </div>
        )}

        {/* Sold out overlay */}
        {product.soldOut && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="text-white font-semibold text-xs tracking-wider uppercase px-3 py-1 bg-rose-900/80 rounded">
              Sold Out
            </span>
          </div>
        )}

        {/* Quick View Button on Hover */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect(product);
          }}
          className="absolute bottom-3 right-3 p-2 bg-white/90 hover:bg-white text-slate-800 rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          title="Quick View Details"
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Quiet Unboxed Metadata */}
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>{product.categoryLabel}</span>
            <span aria-hidden="true">·</span>
            <span className="truncate">{product.origin}</span>
          </div>

          <h3 
            onClick={() => onSelect(product)}
            className="font-semibold text-slate-900 text-sm leading-snug line-clamp-2 hover:text-amber-800 transition-colors cursor-pointer"
          >
            {product.name}
          </h3>
        </div>

        {/* Price & Action Row */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <div className="text-base font-bold text-slate-900 font-mono tabular-nums">
              {formatPrice()}
            </div>
            <div className="text-[11px] text-slate-500">
              {product.soldOut ? (
                <span className="text-rose-600 font-medium">Out of stock</span>
              ) : (
                <span>In stock: <strong className="font-mono tabular-nums text-slate-700">{product.stock}</strong></span>
              )}
            </div>
          </div>

          <button
            onClick={() => onAddToCart(product)}
            disabled={product.soldOut}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              product.soldOut
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-slate-900 hover:bg-slate-800 text-white'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};
