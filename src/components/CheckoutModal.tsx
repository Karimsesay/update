import React, { useState, useEffect } from 'react';
import { CartItem, PaymentMethod, Order, UserProfile } from '../types';
import { STORE_INFO } from '../data/initialData';
import { StorageService } from '../services/storage';
import { X, CheckCircle, Smartphone, Building, Banknote, Globe, Printer, FileText, QrCode, ShieldCheck } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  currentUser?: UserProfile | null;
  onOrderCompleted: (order: Order) => void;
}

export const CheckoutModal: React.FC<Props> = ({
  isOpen,
  onClose,
  items,
  currentUser,
  onOrderCompleted
}) => {
  const [customerName, setCustomerName] = useState(currentUser?.name || '');
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone || '+232 73 775786');
  const [deliveryAddress, setDeliveryAddress] = useState(currentUser?.address || '15 Macdonald Street, Freetown');
  const [deliveryType, setDeliveryType] = useState<'store_pickup' | 'freetown_delivery'>('store_pickup');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('orange-money');
  const [paymentPhone, setPaymentPhone] = useState('');
  const [paymentRef, setPaymentRef] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [receiptView, setReceiptView] = useState<'receipt' | 'invoice'>('receipt');

  useEffect(() => {
    if (currentUser) {
      if (currentUser.name && !customerName) setCustomerName(currentUser.name);
      if (currentUser.phone && customerPhone === '+232 ') setCustomerPhone(currentUser.phone);
      if (currentUser.address && deliveryAddress === '15 Macdonald Street, Freetown') setDeliveryAddress(currentUser.address);
    }
  }, [currentUser]);

  if (!isOpen) return null;

  const totalSLE = items.reduce((sum, item) => sum + item.product.priceSLE * item.quantity, 0);
  const totalUSD = items.reduce((sum, item) => sum + item.product.priceUSD * item.quantity, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) {
      alert('Please provide your name and phone number for order processing.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const order = StorageService.createOrder({
        customerName,
        customerPhone,
        deliveryAddress: deliveryType === 'store_pickup' ? `Store Pickup: ${STORE_INFO.address}` : deliveryAddress,
        items: items.map(i => ({
          productId: i.product.id,
          productName: i.product.name,
          quantity: i.quantity,
          priceSLE: i.product.priceSLE,
          sku: i.product.sku
        })),
        totalSLE,
        totalUSD,
        paymentMethod,
        paymentPhone: paymentPhone || customerPhone,
        paymentReference: paymentRef || `SL-GTB-${Date.now().toString().slice(-6)}`,
        paymentStatus: paymentMethod === 'cash-on-delivery' ? 'pending' : 'confirmed',
        fulfillmentStatus: deliveryType === 'store_pickup' ? 'ready_for_pickup' : 'processing',
        consigneeName: STORE_INFO.consigneeName,
        managerName: STORE_INFO.managerName,
        storeLocation: STORE_INFO.address
      });

      setConfirmedOrder(order);
      setIsSubmitting(false);
      onOrderCompleted(order);
    }, 600);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200">
        
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 font-display">
              {confirmedOrder ? (receiptView === 'invoice' ? 'Commercial Tax Invoice' : 'Order Payment Receipt') : 'Secure Sierra Leone Checkout'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Mauwiltus Enterprise · 15 Macdonald Street, Freetown
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {confirmedOrder ? (
          /* Confirmation & Switchable Invoice / Receipt Screen */
          <div className="p-6 space-y-6">
            
            {/* View Switcher: Receipt vs Invoice */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex gap-2 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setReceiptView('receipt')}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    receiptView === 'receipt' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Customer Receipt
                </button>
                <button
                  type="button"
                  onClick={() => setReceiptView('invoice')}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                    receiptView === 'invoice' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Tax & Customs Invoice</span>
                </button>
              </div>

              <button
                onClick={handlePrint}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Document</span>
              </button>
            </div>

            {/* RECEIPT VIEW */}
            {receiptView === 'receipt' && (
              <div className="space-y-4">
                <div className="text-center py-4 bg-emerald-50 rounded-xl border border-emerald-100">
                  <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                  <h3 className="text-base font-bold text-emerald-900">
                    Payment & Order Confirmed!
                  </h3>
                  <p className="text-xs text-emerald-700 mt-1">
                    Receipt Ref: <strong className="font-mono tabular-nums">{confirmedOrder.orderNumber}</strong>
                  </p>
                </div>

                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-2.5 text-xs">
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-500">Customer:</span>
                    <span className="font-semibold text-slate-900">{confirmedOrder.customerName} ({confirmedOrder.customerPhone})</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-500">Pickup / Delivery:</span>
                    <span className="font-semibold text-slate-900 text-right">{confirmedOrder.deliveryAddress}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-500">Payment Channel:</span>
                    <span className="font-semibold text-slate-900 capitalize">
                      {confirmedOrder.paymentMethod === 'afrimoney'
                        ? 'AfriMoney (+232 33 434592)'
                        : confirmedOrder.paymentMethod === 'bank-transfer'
                        ? 'Guaranty Trust Bank (GTB)'
                        : confirmedOrder.paymentMethod.replace('-', ' ')}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-500">Store Manager:</span>
                    <span className="font-semibold text-slate-900">{STORE_INFO.managerName}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-500">Consignee & Logistics:</span>
                    <span className="font-semibold text-slate-900">{STORE_INFO.consigneeName}</span>
                  </div>
                  <div className="pt-2 flex justify-between text-sm">
                    <span className="font-bold text-slate-900">Total Amount Paid:</span>
                    <span className="font-bold text-slate-900 font-mono tabular-nums">
                      SLE {confirmedOrder.totalSLE.toLocaleString('en-US')}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* INVOICE VIEW */}
            {receiptView === 'invoice' && (
              <div className="border border-slate-300 rounded-xl p-5 bg-white space-y-4 text-xs font-sans">
                {/* Official Invoice Header */}
                <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4">
                  <div>
                    <h3 className="font-display font-extrabold text-base text-slate-900">MAUWILTUS ENTERPRISE</h3>
                    <div className="text-[11px] text-slate-600">Import & Retail Specialists (China to Sierra Leone)</div>
                    <div className="text-[11px] text-slate-600">{STORE_INFO.address}</div>
                    <div className="text-[11px] font-mono text-slate-600">TIN: 10048291-SL · Tel: {STORE_INFO.primaryContact}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold font-mono text-slate-900">TAX INVOICE</div>
                    <div className="text-[11px] font-mono text-slate-500">Invoice: {confirmedOrder.invoiceNumber || 'INV-SL-2026-9041'}</div>
                    <div className="text-[11px] text-slate-500">Date: {new Date().toLocaleDateString('en-GB')}</div>
                  </div>
                </div>

                {/* Billed To / Shipped By */}
                <div className="grid grid-cols-2 gap-4 py-2 border-b border-slate-200">
                  <div>
                    <span className="font-bold text-slate-700 block uppercase text-[10px]">Billed To:</span>
                    <div className="font-semibold text-slate-900">{confirmedOrder.customerName}</div>
                    <div className="text-slate-600 font-mono">{confirmedOrder.customerPhone}</div>
                    <div className="text-slate-600">{confirmedOrder.deliveryAddress}</div>
                  </div>
                  <div>
                    <span className="font-bold text-slate-700 block uppercase text-[10px]">Payment & Bank Reference:</span>
                    <div className="font-semibold text-slate-900">
                      {confirmedOrder.paymentMethod === 'bank-transfer'
                        ? 'GTB (Guaranty Trust Bank SL)'
                        : confirmedOrder.paymentMethod === 'afrimoney'
                        ? 'AfriMoney Direct (+232 33 434592)'
                        : confirmedOrder.paymentMethod.replace('-', ' ')}
                    </div>
                    <div className="text-slate-600 font-mono">Ref: {confirmedOrder.paymentReference}</div>
                    <div className="text-emerald-700 font-semibold uppercase text-[10px]">Status: PAID IN FULL</div>
                  </div>
                </div>

                {/* Invoice Items Table */}
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-300 font-semibold text-slate-800">
                      <th className="py-2 px-2">Description</th>
                      <th className="py-2 px-2 text-center">Qty</th>
                      <th className="py-2 px-2 text-right">Unit Price</th>
                      <th className="py-2 px-2 text-right">Total (SLE)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {confirmedOrder.items.map((it, idx) => (
                      <tr key={idx}>
                        <td className="py-2 px-2 font-sans font-medium text-slate-900">{it.productName}</td>
                        <td className="py-2 px-2 text-center tabular-nums">{it.quantity}</td>
                        <td className="py-2 px-2 text-right tabular-nums">SLE {(it.priceSLE / it.quantity).toLocaleString()}</td>
                        <td className="py-2 px-2 text-right font-bold tabular-nums">SLE {it.priceSLE.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="border-t-2 border-slate-900 font-mono">
                    <tr>
                      <td colSpan={3} className="py-2 px-2 text-right font-sans font-medium">Subtotal (Net Ex-GST):</td>
                      <td className="py-2 px-2 text-right tabular-nums">SLE {Math.round(confirmedOrder.totalSLE / 1.15).toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td colSpan={3} className="py-1 px-2 text-right font-sans text-slate-500">Sierra Leone GST (15%):</td>
                      <td className="py-1 px-2 text-right text-slate-700 tabular-nums">SLE {Math.round(confirmedOrder.totalSLE - (confirmedOrder.totalSLE / 1.15)).toLocaleString()}</td>
                    </tr>
                    <tr className="font-bold text-sm bg-slate-50">
                      <td colSpan={3} className="py-2 px-2 text-right font-sans">Total Landed Amount Paid:</td>
                      <td className="py-2 px-2 text-right text-slate-900 tabular-nums">SLE {confirmedOrder.totalSLE.toLocaleString()}</td>
                    </tr>
                  </tfoot>
                </table>

                {/* Signatures */}
                <div className="pt-4 border-t border-slate-200 flex justify-between text-[11px] font-mono text-slate-700">
                  <div>
                    <div className="border-b border-slate-400 pb-1 font-bold">{STORE_INFO.managerName}</div>
                    <span className="text-slate-500">Authorized Mauwiltus Signatory</span>
                  </div>
                  <div>
                    <div className="border-b border-slate-400 pb-1 font-bold">{STORE_INFO.consigneeName}</div>
                    <span className="text-slate-500">Global Lite Customs Consignee</span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors"
              >
                Close & Return to Storefront
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Form */
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5 max-h-[80vh] overflow-y-auto">
            {/* Delivery Option */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                1. Delivery & Collection Method
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setDeliveryType('store_pickup')}
                  className={`p-3 text-left border rounded-xl transition-all cursor-pointer ${
                    deliveryType === 'store_pickup'
                      ? 'border-slate-900 bg-slate-50 text-slate-900'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <div className="font-semibold text-xs text-slate-900">Store Pickup (Free)</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">15 Macdonald St, Central Freetown</div>
                </button>
                <button
                  type="button"
                  onClick={() => setDeliveryType('freetown_delivery')}
                  className={`p-3 text-left border rounded-xl transition-all cursor-pointer ${
                    deliveryType === 'freetown_delivery'
                      ? 'border-slate-900 bg-slate-50 text-slate-900'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <div className="font-semibold text-xs text-slate-900">Freetown Dispatch</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Motorbike / Van courier delivery</div>
                </button>
              </div>
            </div>

            {/* Customer Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Full Customer Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mariama Kamara"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Sierra Leone Mobile Phone *
                </label>
                <input
                  type="text"
                  required
                  placeholder="+232 7X XXX XXX"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-900 font-mono"
                />
              </div>
            </div>

            {deliveryType === 'freetown_delivery' && (
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Delivery Address / Landmark in Freetown *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 42 Wilkinson Road, near Lumley Junction"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-900"
                />
              </div>
            )}

            {/* Payment Method Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                2. Select Sierra Leone Payment Method
              </label>

              <div className="space-y-2">
                {/* Orange Money */}
                <label className={`flex items-start gap-3 p-3 border rounded-xl cursor-pointer transition-all ${
                  paymentMethod === 'orange-money' ? 'border-amber-600 bg-amber-50/50' : 'border-slate-200 hover:border-slate-300'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'orange-money'}
                    onChange={() => setPaymentMethod('orange-money')}
                    className="mt-1 accent-amber-600"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5 font-semibold text-xs text-slate-900">
                      <Smartphone className="w-4 h-4 text-amber-600" />
                      <span>Orange Money Sierra Leone</span>
                    </div>
                    <div className="text-[11px] text-slate-700 mt-1 font-medium">
                      Orange Money Number: <strong className="font-mono text-slate-950 font-bold bg-amber-100/80 px-1.5 py-0.5 rounded">+232 73 775786</strong>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      Dial *144# on Orange SL or transfer direct to Mauwiltus Enterprise (+232 73 775786)
                    </div>
                  </div>
                </label>

                {/* AfriMoney (Africell) - UPDATED TO +232 33 434592 AND NO AGENT CODE */}
                <label className={`flex items-start gap-3 p-3 border rounded-xl cursor-pointer transition-all ${
                  paymentMethod === 'afrimoney' ? 'border-purple-600 bg-purple-50/50' : 'border-slate-200 hover:border-slate-300'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'afrimoney'}
                    onChange={() => setPaymentMethod('afrimoney')}
                    className="mt-1 accent-purple-600"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5 font-semibold text-xs text-slate-900">
                      <Smartphone className="w-4 h-4 text-purple-600" />
                      <span>AfriMoney (Africell Sierra Leone)</span>
                    </div>
                    <div className="text-[11px] text-slate-700 mt-1 font-medium">
                      Send direct to number: <strong className="font-mono text-slate-950 font-bold bg-purple-100/80 px-1.5 py-0.5 rounded">+232 33 434592</strong>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      (No agent code required — transfer directly via *161# to +232 33 434592)
                    </div>
                  </div>
                </label>

                {/* Guaranty Trust Bank (GTB) - NO ACCOUNT NUMBER */}
                <label className={`flex items-start gap-3 p-3 border rounded-xl cursor-pointer transition-all ${
                  paymentMethod === 'bank-transfer' ? 'border-orange-600 bg-orange-50/50' : 'border-slate-200 hover:border-slate-300'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'bank-transfer'}
                    onChange={() => setPaymentMethod('bank-transfer')}
                    className="mt-1 accent-orange-600"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5 font-semibold text-xs text-slate-900">
                      <Building className="w-4 h-4 text-orange-600" />
                      <span>Guaranty Trust Bank (SL) Ltd — GTB</span>
                    </div>
                    <div className="text-[11px] text-slate-700 mt-1">
                      Direct In-Branch Cash Deposit / Online GTB Transfer
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      Mauwiltus Enterprise / Global Lite · Wilberforce St / Cotton Tree Branch (Bank details provided upon invoice generation / visit 15 Macdonald St)
                    </div>
                  </div>
                </label>

                {/* Cash on Delivery / Store Pickup */}
                <label className={`flex items-start gap-3 p-3 border rounded-xl cursor-pointer transition-all ${
                  paymentMethod === 'cash-on-delivery' ? 'border-emerald-600 bg-emerald-50/50' : 'border-slate-200 hover:border-slate-300'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'cash-on-delivery'}
                    onChange={() => setPaymentMethod('cash-on-delivery')}
                    className="mt-1 accent-emerald-600"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5 font-semibold text-xs text-slate-900">
                      <Banknote className="w-4 h-4 text-emerald-600" />
                      <span>Cash on Delivery / In-Store Cash at 15 Macdonald Street</span>
                    </div>
                    <div className="text-[11px] text-slate-600 mt-1">
                      Pay cash upon collection or courier arrival. Inspected before payment.
                    </div>
                  </div>
                </label>

                {/* Cross-border China-SL Wire / Alipay & WeChat */}
                <label className={`flex items-start gap-3 p-3 border rounded-xl cursor-pointer transition-all ${
                  paymentMethod === 'cross-border-wire' ? 'border-slate-800 bg-slate-50' : 'border-slate-200 hover:border-slate-300'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'cross-border-wire'}
                    onChange={() => setPaymentMethod('cross-border-wire')}
                    className="mt-1 accent-slate-800"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5 font-semibold text-xs text-slate-900">
                      <Globe className="w-4 h-4 text-slate-700" />
                      <span>Cross-Border China RMB Wire / Alipay & WeChat Pay</span>
                    </div>
                    <div className="text-[11px] text-slate-600 mt-1">
                      Direct RMB conversion to Global Lite Guangzhou account for wholesale consignments.
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Total and Submit */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 block">Total Payable</span>
                <span className="text-xl font-bold text-slate-900 font-mono tabular-nums">
                  SLE {totalSLE.toLocaleString('en-US')}
                </span>
                <span className="text-[11px] text-slate-400 block font-mono">
                  (approx. ${totalUSD.toFixed(2)} USD)
                </span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="py-2.5 px-6 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors shadow-xs disabled:opacity-60"
              >
                {isSubmitting ? (
                  <span>Processing...</span>
                ) : (
                  <span>Generate Invoice & Confirm</span>
                )}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
