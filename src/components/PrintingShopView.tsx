import React, { useState } from 'react';
import { Order, Shipment, CustomsDoc, Product, Language } from '../types';
import { STORE_INFO } from '../data/initialData';
import { TRANSLATIONS } from '../services/i18n';
import { 
  Printer, 
  FileText, 
  FileCheck, 
  Tag, 
  Receipt, 
  Download, 
  Copy, 
  Check, 
  MapPin, 
  Phone, 
  QrCode,
  ShieldCheck,
  Building,
  Smartphone
} from 'lucide-react';

interface Props {
  language: Language;
  orders: Order[];
  shipments: Shipment[];
  customsDocs: CustomsDoc[];
  products: Product[];
}

type DocCategory = 'receipt' | 'invoice' | 'bl' | 'packing_list' | 'asycuda' | 'barcodes';
type PrintFormat = 'a4' | 'thermal_80mm' | 'sticker_tag';

export const PrintingShopView: React.FC<Props> = ({
  language,
  orders,
  shipments,
  customsDocs,
  products
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const [activeDoc, setActiveDoc] = useState<DocCategory>('receipt');
  const [format, setFormat] = useState<PrintFormat>('thermal_80mm');
  const [selectedOrderId, setSelectedOrderId] = useState<string>(orders[0]?.id || 'demo');
  const [copied, setCopied] = useState(false);

  const selectedOrder = orders.find(o => o.id === selectedOrderId) || {
    id: 'demo-ord-1',
    orderNumber: 'ME-202610-8819',
    customerName: 'Mariama Turay',
    customerPhone: '+232 76 543210',
    deliveryAddress: 'Store Pickup: 15 Macdonald Street, Freetown',
    items: [
      { productId: 'p1', productName: 'Royal Guinea Gold-Thread Brocade Fabric (5 Yards)', quantity: 2, priceSLE: 2500, sku: 'ME-FAB-001' },
      { productId: 'p2', productName: 'Organic Moringa & Hibiscus Detox Wellness Tea', quantity: 3, priceSLE: 1140, sku: 'ME-TEA-002' }
    ],
    totalSLE: 3640,
    totalUSD: 159.6,
    paymentMethod: 'orange-money' as const,
    paymentPhone: '+232 73 775786',
    paymentReference: 'OM-SL-8849201',
    paymentStatus: 'confirmed' as const,
    fulfillmentStatus: 'ready_for_pickup' as const,
    consigneeName: STORE_INFO.consigneeName,
    managerName: STORE_INFO.managerName,
    storeLocation: STORE_INFO.address,
    invoiceIssued: true,
    invoiceNumber: 'INV-SL-2026-9041',
    createdAt: '2026-10-23'
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = () => {
    const text = `Mauwiltus Enterprise & Global Lite Logistics\n15 Macdonald Street, Freetown\nOrder: ${selectedOrder.orderNumber}\nCustomer: ${selectedOrder.customerName} (${selectedOrder.customerPhone})\nTotal: SLE ${selectedOrder.totalSLE.toLocaleString()}\nManager: ${STORE_INFO.managerName}\nConsignee: ${STORE_INFO.consigneeName}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                Official Document Center
              </span>
              <span className="text-xs text-slate-500 font-mono">15 Macdonald Street · In-Store & Trade Printing</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 tracking-tight">
              Mauwiltus Printing Shop & Document Hub
            </h1>
            <p className="text-slate-600 text-sm max-w-2xl leading-relaxed">
              Generate and print official trade paperwork: 80mm thermal POS receipts, A4 commercial tax invoices, customs Bill of Lading, packing slips, and shelf barcode labels.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs cursor-pointer transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print Document Now</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Controls & Document Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Selector & Format Options (4 Cols) */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* Document Type Selection */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              1. Select Document Template
            </h3>

            <div className="space-y-2 text-xs">
              <button
                type="button"
                onClick={() => { setActiveDoc('receipt'); setFormat('thermal_80mm'); }}
                className={`w-full p-3 rounded-xl border text-left flex items-start gap-3 transition-colors cursor-pointer ${
                  activeDoc === 'receipt' ? 'border-slate-900 bg-slate-50 text-slate-900 font-semibold' : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <Receipt className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-900">80mm POS Thermal Receipt</div>
                  <div className="text-[11px] text-slate-500">Fast store slip for mobile money & in-store counter</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => { setActiveDoc('invoice'); setFormat('a4'); }}
                className={`w-full p-3 rounded-xl border text-left flex items-start gap-3 transition-colors cursor-pointer ${
                  activeDoc === 'invoice' ? 'border-slate-900 bg-slate-50 text-slate-900 font-semibold' : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <FileText className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-900">NRA Commercial Tax Invoice (A4)</div>
                  <div className="text-[11px] text-slate-500">Official tax document with 15% GST and corporate TIN</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => { setActiveDoc('bl'); setFormat('a4'); }}
                className={`w-full p-3 rounded-xl border text-left flex items-start gap-3 transition-colors cursor-pointer ${
                  activeDoc === 'bl' ? 'border-slate-900 bg-slate-50 text-slate-900 font-semibold' : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <FileCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-900">Ocean Bill of Lading (B/L)</div>
                  <div className="text-[11px] text-slate-500">Global Lite shipping manifest: Guangzhou to Freetown Quay</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => { setActiveDoc('barcodes'); setFormat('sticker_tag'); }}
                className={`w-full p-3 rounded-xl border text-left flex items-start gap-3 transition-colors cursor-pointer ${
                  activeDoc === 'barcodes' ? 'border-slate-900 bg-slate-50 text-slate-900 font-semibold' : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <Tag className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-900">Price & Barcode Shelf Labels</div>
                  <div className="text-[11px] text-slate-500">Retail adhesive stickers for fabrics, tea tins, and dresses</div>
                </div>
              </button>
            </div>
          </div>

          {/* Paper / Printer Format */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              2. Paper Format & Output
            </h3>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setFormat('thermal_80mm')}
                className={`p-2.5 rounded-lg border text-center transition-all cursor-pointer ${
                  format === 'thermal_80mm' ? 'border-slate-900 bg-slate-900 text-white font-bold' : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                80mm POS Slip
              </button>
              <button
                type="button"
                onClick={() => setFormat('a4')}
                className={`p-2.5 rounded-lg border text-center transition-all cursor-pointer ${
                  format === 'a4' ? 'border-slate-900 bg-slate-900 text-white font-bold' : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                A4 Standard
              </button>
              <button
                type="button"
                onClick={() => setFormat('sticker_tag')}
                className={`p-2.5 rounded-lg border text-center transition-all cursor-pointer ${
                  format === 'sticker_tag' ? 'border-slate-900 bg-slate-900 text-white font-bold' : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                Barcode Tag
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2">
            <button
              onClick={handleCopyText}
              className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Summary'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex-1 py-2 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Page</span>
            </button>
          </div>

        </div>

        {/* Right Column: Printable Canvas Preview (8 Cols) */}
        <div className="lg:col-span-8">
          <div className="bg-slate-100 p-4 sm:p-8 rounded-2xl border border-slate-200 flex justify-center overflow-x-auto min-h-[600px]">
            
            {/* 1. 80mm THERMAL RECEIPT PREVIEW */}
            {activeDoc === 'receipt' && (
              <div className="w-[340px] bg-white border border-slate-300 p-5 rounded shadow-md text-xs font-mono space-y-3 print:border-none print:shadow-none print:w-full">
                <div className="text-center space-y-1 border-b border-dashed border-slate-300 pb-3">
                  <div className="font-extrabold text-sm text-slate-950 font-sans tracking-wide">MAUWILTUS ENTERPRISE</div>
                  <div className="text-[10px] text-slate-600">Global Lite Logistics Import & Export</div>
                  <div className="text-[10px] text-slate-600">{STORE_INFO.address}</div>
                  <div className="text-[10px] text-slate-600">Tel: {STORE_INFO.primaryContact} / {STORE_INFO.secondaryContact}</div>
                  <div className="text-[10px] text-slate-700 font-bold pt-1">*** CUSTOMER RECEIPT ***</div>
                </div>

                <div className="text-[11px] space-y-1 border-b border-dashed border-slate-300 pb-2">
                  <div className="flex justify-between">
                    <span>Receipt No:</span>
                    <span className="font-bold">{selectedOrder.orderNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date / Time:</span>
                    <span>{new Date().toLocaleDateString('en-GB')} {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Customer:</span>
                    <span className="font-bold">{selectedOrder.customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Phone:</span>
                    <span>{selectedOrder.customerPhone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment:</span>
                    <span className="font-bold uppercase">
                      {selectedOrder.paymentMethod === 'orange-money'
                        ? 'Orange Money (+232 73 775786)'
                        : selectedOrder.paymentMethod === 'afrimoney'
                        ? 'AfriMoney (+232 33 434592)'
                        : selectedOrder.paymentMethod === 'bank-transfer'
                        ? 'GTB Bank Deposit / Transfer'
                        : selectedOrder.paymentMethod}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-2 border-b border-dashed border-slate-300 pb-3">
                  <div className="flex justify-between font-bold text-[10px] border-b border-slate-200 pb-1">
                    <span>ITEM</span>
                    <span>QTY x PRICE</span>
                    <span>TOTAL</span>
                  </div>
                  {selectedOrder.items.map((it, idx) => (
                    <div key={idx} className="space-y-0.5 text-[11px]">
                      <div className="font-sans font-medium line-clamp-1">{it.productName}</div>
                      <div className="flex justify-between text-slate-600">
                        <span>{it.quantity} @ SLE {(it.priceSLE / it.quantity).toLocaleString()}</span>
                        <span className="font-bold text-slate-900">SLE {it.priceSLE.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="space-y-1 border-b border-dashed border-slate-300 pb-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Net Subtotal:</span>
                    <span>SLE {Math.round(selectedOrder.totalSLE / 1.15).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>NRA GST (15%):</span>
                    <span>SLE {Math.round(selectedOrder.totalSLE - (selectedOrder.totalSLE / 1.15)).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-bold text-sm text-slate-950 pt-1 border-t border-slate-300">
                    <span>TOTAL PAID:</span>
                    <span className="tabular-nums">SLE {selectedOrder.totalSLE.toLocaleString()}</span>
                  </div>
                </div>

                <div className="text-center text-[10px] text-slate-500 space-y-1 pt-2">
                  <div>Store Manager: <strong>{STORE_INFO.managerName}</strong></div>
                  <div>Licensed Consignee: <strong>{STORE_INFO.consigneeName}</strong></div>
                  <div className="text-slate-700 font-medium">Thank you for shopping at Mauwiltus Enterprise!</div>
                  <div className="font-mono pt-1 text-[9px] text-slate-400">||| | || ||||| ||| |||| | ||| ||</div>
                </div>
              </div>
            )}

            {/* 2. A4 COMMERCIAL TAX INVOICE PREVIEW */}
            {activeDoc === 'invoice' && (
              <div className="w-full max-w-2xl bg-white border border-slate-300 p-8 rounded shadow-md text-xs space-y-6 print:border-none print:shadow-none">
                <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4">
                  <div>
                    <h2 className="font-display font-extrabold text-lg text-slate-900">MAUWILTUS ENTERPRISE</h2>
                    <div className="text-slate-600 font-medium">Import & Sourcing Logistics (China to Sierra Leone)</div>
                    <div className="text-slate-600">{STORE_INFO.address}</div>
                    <div className="text-slate-600 font-mono">TIN: 10048291-SL · Tel: {STORE_INFO.primaryContact} / {STORE_INFO.secondaryContact}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold font-mono text-slate-900 tracking-tight">COMMERCIAL TAX INVOICE</div>
                    <div className="text-xs font-mono text-slate-600 mt-1">Invoice: {selectedOrder.invoiceNumber || 'INV-SL-2026-9041'}</div>
                    <div className="text-xs text-slate-500">Date: {new Date().toLocaleDateString('en-GB')}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 py-2 border-b border-slate-200">
                  <div>
                    <span className="font-bold text-slate-700 block uppercase text-[10px]">Customer Details:</span>
                    <div className="font-semibold text-slate-900 text-sm mt-0.5">{selectedOrder.customerName}</div>
                    <div className="text-slate-600 font-mono">{selectedOrder.customerPhone}</div>
                    <div className="text-slate-600">{selectedOrder.deliveryAddress}</div>
                  </div>
                  <div>
                    <span className="font-bold text-slate-700 block uppercase text-[10px]">Payment & Settlement:</span>
                    <div className="font-semibold text-slate-900 mt-0.5">
                      {selectedOrder.paymentMethod === 'orange-money'
                        ? 'Orange Money (+232 73 775786)'
                        : selectedOrder.paymentMethod === 'afrimoney'
                        ? 'AfriMoney Direct (+232 33 434592)'
                        : selectedOrder.paymentMethod === 'bank-transfer'
                        ? 'Guaranty Trust Bank (SL) Ltd'
                        : selectedOrder.paymentMethod}
                    </div>
                    <div className="text-slate-600 font-mono">Ref: {selectedOrder.paymentReference || 'CONF-884910'}</div>
                    <div className="text-emerald-700 font-bold uppercase text-[10px] mt-1">Status: SETTLED IN FULL</div>
                  </div>
                </div>

                {/* Table */}
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-300 font-bold text-slate-800">
                      <th className="py-2.5 px-3">Description & Goods Details</th>
                      <th className="py-2.5 px-3 text-center">Qty</th>
                      <th className="py-2.5 px-3 text-right">Unit Rate</th>
                      <th className="py-2.5 px-3 text-right">Total (SLE)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-mono">
                    {selectedOrder.items.map((it, idx) => (
                      <tr key={idx}>
                        <td className="py-2.5 px-3 font-sans font-medium text-slate-900">{it.productName}</td>
                        <td className="py-2.5 px-3 text-center tabular-nums">{it.quantity}</td>
                        <td className="py-2.5 px-3 text-right tabular-nums">SLE {(it.priceSLE / it.quantity).toLocaleString()}</td>
                        <td className="py-2.5 px-3 text-right font-bold tabular-nums">SLE {it.priceSLE.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="border-t-2 border-slate-900 font-mono">
                    <tr>
                      <td colSpan={3} className="py-2 px-3 text-right font-sans font-medium">Subtotal (Ex-Tax):</td>
                      <td className="py-2 px-3 text-right tabular-nums">SLE {Math.round(selectedOrder.totalSLE / 1.15).toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td colSpan={3} className="py-1 px-3 text-right font-sans text-slate-600">Sierra Leone NRA GST (15%):</td>
                      <td className="py-1 px-3 text-right text-slate-700 tabular-nums">SLE {Math.round(selectedOrder.totalSLE - (selectedOrder.totalSLE / 1.15)).toLocaleString()}</td>
                    </tr>
                    <tr className="font-bold text-sm bg-slate-50">
                      <td colSpan={3} className="py-2.5 px-3 text-right font-sans">Total Amount Payable:</td>
                      <td className="py-2.5 px-3 text-right text-slate-900 tabular-nums">SLE {selectedOrder.totalSLE.toLocaleString()}</td>
                    </tr>
                  </tfoot>
                </table>

                {/* Authorized signatures */}
                <div className="pt-8 border-t border-slate-200 flex justify-between text-xs">
                  <div>
                    <div className="border-b border-slate-400 pb-1 font-bold text-slate-900">{STORE_INFO.managerName}</div>
                    <span className="text-slate-500 text-[11px]">Authorized Signatory, Mauwiltus Enterprise</span>
                  </div>
                  <div>
                    <div className="border-b border-slate-400 pb-1 font-bold text-slate-900">{STORE_INFO.consigneeName}</div>
                    <span className="text-slate-500 text-[11px]">Customs Consignee, Global Lite Logistics</span>
                  </div>
                </div>
              </div>
            )}

            {/* 3. BILL OF LADING PREVIEW */}
            {activeDoc === 'bl' && (
              <div className="w-full max-w-2xl bg-white border border-slate-300 p-8 rounded shadow-md text-xs font-mono space-y-5 print:border-none print:shadow-none">
                <div className="flex justify-between items-start border-b-2 border-slate-900 pb-3">
                  <div>
                    <div className="font-sans font-black text-base text-slate-900">GLOBAL LITE LOGISTICS IMPORT & EXPORT</div>
                    <div className="text-[11px] text-slate-600 font-sans">International Ocean Freight & Consolidation</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-sm text-slate-900">OCEAN BILL OF LADING</div>
                    <div className="text-[11px] text-slate-600">B/L NO: GLL-2026-FNA-0881</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border border-slate-200 p-3 bg-slate-50 text-[11px]">
                  <div>
                    <span className="font-bold uppercase text-slate-500 block">Shipper / Exporter:</span>
                    <div>Zhejiang Global Lite Sourcing Terminal</div>
                    <div>Yiwu & Guangzhou Logistics Hub, China</div>
                  </div>
                  <div>
                    <span className="font-bold uppercase text-slate-500 block">Consignee:</span>
                    <div className="font-bold text-slate-900">{STORE_INFO.consigneeName}</div>
                    <div>Mauwiltus Enterprise, {STORE_INFO.address}</div>
                    <div>Tel: {STORE_INFO.secondaryContact}</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 border border-slate-200 p-3 text-[11px]">
                  <div>
                    <span className="font-bold text-slate-500 block">Port of Loading:</span>
                    <div>Guangzhou Nansha, China</div>
                  </div>
                  <div>
                    <span className="font-bold text-slate-500 block">Port of Discharge:</span>
                    <div>Freetown Water Quay, SL</div>
                  </div>
                  <div>
                    <span className="font-bold text-slate-500 block">Ocean Vessel:</span>
                    <div>CMA CGM Africa Star / V.402</div>
                  </div>
                </div>

                <table className="w-full border-collapse border border-slate-200 text-[11px]">
                  <thead className="bg-slate-100 font-bold">
                    <tr>
                      <th className="p-2 border border-slate-200">Container / Seal</th>
                      <th className="p-2 border border-slate-200">Description of Goods</th>
                      <th className="p-2 border border-slate-200 text-center">Packages</th>
                      <th className="p-2 border border-slate-200 text-right">Gross Wt / CBM</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-2 border border-slate-200">MSKU-982104-2<br/>Seal: CN-88192</td>
                      <td className="p-2 border border-slate-200 font-sans">
                        African Brocade Fabrics, Women's Occasion Dresses, Herbal Detox Teas, Gummy Supplements, Household Cookware
                      </td>
                      <td className="p-2 border border-slate-200 text-center">480 CTNS</td>
                      <td className="p-2 border border-slate-200 text-right">6,840 KG<br/>32.4 CBM</td>
                    </tr>
                  </tbody>
                </table>

                <div className="pt-4 border-t border-slate-300 flex justify-between text-[11px]">
                  <div>Freighted Prepaid at Guangzhou Hub</div>
                  <div>Certified: <strong>{STORE_INFO.consigneeName}</strong> (Licensed Consignee)</div>
                </div>
              </div>
            )}

            {/* 4. PRODUCT PRICE & BARCODE SHELF LABELS */}
            {activeDoc === 'barcodes' && (
              <div className="w-full max-w-2xl bg-white border border-slate-300 p-6 rounded shadow-md space-y-6 print:border-none print:shadow-none">
                <div className="border-b border-slate-200 pb-3 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Store Shelf Barcode Tags (3x2 Grid)</h3>
                    <p className="text-xs text-slate-500">Self-adhesive price stickers for 15 Macdonald Street retail shelves</p>
                  </div>
                  <span className="text-xs font-mono bg-slate-100 px-2.5 py-1 rounded">15 Macdonald St</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {products.slice(0, 6).map((prod) => (
                    <div key={prod.id} className="border-2 border-slate-900 rounded-lg p-3 bg-white space-y-1.5 flex flex-col justify-between">
                      <div>
                        <div className="text-[10px] font-bold text-slate-500 tracking-wider uppercase truncate">
                          MAUWILTUS ENTERPRISE
                        </div>
                        <div className="text-xs font-bold text-slate-900 line-clamp-2 leading-tight">
                          {prod.name}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                          SKU: {prod.sku}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-200">
                        <div className="text-base font-black font-mono text-slate-950 tabular-nums">
                          SLE {prod.priceSLE.toLocaleString()}
                        </div>
                        <div className="text-[9px] text-slate-400 font-mono">
                          (approx. ${prod.priceUSD.toFixed(2)} USD)
                        </div>
                        <div className="font-mono text-[9px] text-center tracking-widest text-slate-600 pt-1">
                          |||| || | |||| |||
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>

      </div>

    </div>
  );
};
