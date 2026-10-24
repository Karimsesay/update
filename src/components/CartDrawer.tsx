import React from 'react';
import { CartItem, Currency } from '../types';
import { X, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { STORE_INFO } from '../data/initialData';
import { formatCurrencyAmount } from '../services/currency';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  currency: Currency;
  onUpdateQty: (productId: string, delta: number) => void;
  onRemove: (productId: string) => void;
  onCheckout: () => void;
}

export const CartDrawer: React.FC<Props> = ({
  isOpen,
  onClose,
  items,
  currency,
  onUpdateQty,
  onRemove,
  onCheckout
}) => {
  if (!isOpen) return null;

  const totalUSD = items.reduce((sum, item) => sum + item.product.priceUSD * item.quantity, 0);

  const formatTotal = () => {
    return formatCurrencyAmount(totalUSD, currency);
  };

  const formatItemPrice = (item: CartItem) => {
    return formatCurrencyAmount(item.product.priceUSD * item.quantity, currency);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-slate-200 animate-in slide-in-from-right duration-200">
        
        {/* Drawer Header */}
        <div className="p-4 sm:p-6 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-slate-800" />
            <h2 className="font-semibold text-slate-900 text-base">Shopping Bag</h2>
            <span className="text-xs text-slate-500 font-mono tabular-nums">({items.length} items)</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 p-8">
              <ShoppingBag className="w-12 h-12 stroke-1 text-slate-300 mb-3" />
              <p className="text-sm font-medium text-slate-700">Your shopping bag is empty</p>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                Explore our fabrics, dresses, herbal teas, gummies, and household items from China.
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.product.id}
                className="flex gap-4 p-3 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors"
              >
                <img
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  referrerPolicy="no-referrer"
                  className="w-18 h-18 object-cover rounded-md bg-slate-200 shrink-0"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />

                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="text-xs font-semibold text-slate-900 line-clamp-2">
                      {item.product.name}
                    </h4>
                    <button
                      onClick={() => onRemove(item.product.id)}
                      className="text-slate-400 hover:text-rose-600 transition-colors p-1 cursor-pointer shrink-0"
                      title="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-slate-200 rounded bg-white">
                      <button
                        onClick={() => onUpdateQty(item.product.id, -1)}
                        className="px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-100 cursor-pointer"
                      >
                        -
                      </button>
                      <span className="px-2 text-xs font-mono tabular-nums font-semibold text-slate-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQty(item.product.id, 1)}
                        className="px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-100 cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-xs font-bold text-slate-900 font-mono tabular-nums">
                      {formatItemPrice(item)}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer with Sierra Leone Local Trust */}
        {items.length > 0 && (
          <div className="p-4 sm:p-6 border-t border-slate-200 bg-white space-y-4">
            <div className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
              <span className="font-semibold text-slate-700">Pickup & Delivery:</span> Available directly at {STORE_INFO.address} or delivery across Freetown & provinces.
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-slate-600">Subtotal</span>
              <span className="font-bold text-lg text-slate-900 font-mono tabular-nums">
                {formatTotal()}
              </span>
            </div>

            <button
              onClick={() => {
                onClose();
                onCheckout();
              }}
              className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
            >
              <span>Proceed to Sierra Leone Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
