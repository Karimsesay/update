import React, { useState } from 'react';
import { CustomsDoc, Shipment } from '../types';
import { STORE_INFO } from '../data/initialData';
import { StorageService } from '../services/storage';
import { FileText, Printer, Plus, CheckCircle, Shield, Building2, Trash2, ArrowLeft } from 'lucide-react';

interface Props {
  customsDocs: CustomsDoc[];
  shipments: Shipment[];
  onRefreshDocs?: () => void;
}

interface LineItem {
  id: string;
  description: string;
  hsCode: string;
  packages: number;
  grossWeightKg: number;
  cbm: number;
  valueUSD: number;
}

export const CustomsDocsView: React.FC<Props> = ({ customsDocs, shipments, onRefreshDocs }) => {
  const [selectedDocId, setSelectedDocId] = useState<string>(customsDocs[0]?.id || '');
  const [viewMode, setViewMode] = useState<'view' | 'builder'>('view');

  // Builder Form State
  const [builderType, setBuilderType] = useState<'Bill of Lading' | 'Commercial Invoice' | 'Packing List'>('Bill of Lading');
  const [refNumber, setRefNumber] = useState(`DOC-SL-${Date.now().toString().slice(-6)}`);
  const [shipperName, setShipperName] = useState('Global Lite Logistics (Guangzhou Consolidation Yard)');
  const [shipperAddress, setShipperAddress] = useState('No. 88 Guangyuan Road, Baiyun International Logistics Park, Guangzhou, China');
  const [consigneeName, setConsigneeName] = useState(STORE_INFO.consigneeName);
  const [consigneeAddress, setConsigneeAddress] = useState(STORE_INFO.address);
  const [managerName, setManagerName] = useState(STORE_INFO.managerName);
  const [vesselVoyage, setVesselVoyage] = useState('COSCO SHIPPING KILIMANJARO V.204W');
  const [pol, setPol] = useState('Guangzhou Port (Nansha Terminal, China)');
  const [pod, setPod] = useState('Queen Elizabeth II Quay (Water Quay, Freetown, SL)');
  const [containerNumber, setContainerNumber] = useState('CSQU3094821');
  const [sealNumber, setSealNumber] = useState('COS-772910');

  const [builderItems, setBuilderItems] = useState<LineItem[]>([
    {
      id: 'item-1',
      description: 'Royal Guinea Gold-Thread Brocade Fabric & Dutch Wax Cotton',
      hsCode: '5208.52',
      packages: 180,
      grossWeightKg: 5400,
      cbm: 24.5,
      valueUSD: 9800
    },
    {
      id: 'item-2',
      description: 'Women Contemporary Maxi Dresses & Men Tailored Apparel',
      hsCode: '6204.42',
      packages: 120,
      grossWeightKg: 3850,
      cbm: 18.2,
      valueUSD: 7400
    },
    {
      id: 'item-3',
      description: 'Organic Herbal Detox Teas & ACV Glow Gummies',
      hsCode: '2106.90',
      packages: 70,
      grossWeightKg: 2200,
      cbm: 11.5,
      valueUSD: 4200
    }
  ]);

  const currentDoc = customsDocs.find((d) => d.id === selectedDocId) || customsDocs[0];
  const linkedShipment = shipments.find((s) => s.id === currentDoc?.shipmentId) || shipments[0];

  const handlePrint = () => {
    window.print();
  };

  const handleAddLineItem = () => {
    setBuilderItems([
      ...builderItems,
      {
        id: `item-${Date.now()}`,
        description: 'Stainless Cookware Set / Solar Emergency Lanterns',
        hsCode: '7323.93',
        packages: 50,
        grossWeightKg: 2800,
        cbm: 14.2,
        valueUSD: 3400
      }
    ]);
  };

  const handleRemoveLineItem = (id: string) => {
    if (builderItems.length <= 1) return;
    setBuilderItems(builderItems.filter(i => i.id !== id));
  };

  const handleSaveBuiltDocument = (e: React.FormEvent) => {
    e.preventDefault();
    const totalUSD = builderItems.reduce((sum, item) => sum + item.valueUSD, 0);
    const totalSLE = Math.round(totalUSD * 22.8);
    const totalPackages = builderItems.reduce((sum, item) => sum + item.packages, 0);

    const newDoc = StorageService.createCustomsDoc({
      docType: builderType,
      referenceNumber: refNumber,
      shipmentId: shipments[0]?.id || 'ship-101',
      consigneeName,
      consigneeAddress,
      managerName,
      dateIssued: new Date().toISOString().split('T')[0],
      totalValueUSD: totalUSD,
      totalValueSLE: totalSLE,
      itemCount: totalPackages,
      status: 'Certified',
      details: {
        shipperName,
        shipperAddress,
        vesselVoyage,
        portOfLoading: pol,
        portOfDischarge: pod,
        containerNumber,
        sealNumber,
        lineItems: builderItems
      }
    });

    if (onRefreshDocs) onRefreshDocs();
    setSelectedDocId(newDoc.id);
    setViewMode('view');
    alert(`${builderType} #${refNumber} generated and saved permanently!`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-700">
            <span>Automated Customs & ASYCUDA Engine</span>
            <span aria-hidden="true">·</span>
            <span>China to Sierra Leone Trade Compliance</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 mt-1">
            Customs Documentation, B/L & Invoice Builder
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Generate and manage Bill of Lading, Packing Lists, Commercial Invoices, and NRA ASYCUDA Single Administrative Documents.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {viewMode === 'view' ? (
            <>
              <button
                onClick={() => setViewMode('builder')}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-2 cursor-pointer transition-colors shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Build New B/L or Invoice</span>
              </button>
              <button
                onClick={handlePrint}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors shadow-xs"
              >
                <Printer className="w-4 h-4" />
                <span>Print Document</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => setViewMode('view')}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Documents</span>
            </button>
          )}
        </div>
      </div>

      {/* DOCUMENT BUILDER MODE */}
      {viewMode === 'builder' ? (
        <form onSubmit={handleSaveBuiltDocument} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 font-display">
                Create & Certify Trade Document
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Build an official Bill of Lading, Commercial Freight Invoice, or Packing List for Sierra Leone customs clearance.
              </p>
            </div>

            {/* Document Type Selector */}
            <div className="flex items-center p-1 bg-slate-100 rounded-lg text-xs font-medium">
              {(['Bill of Lading', 'Commercial Invoice', 'Packing List'] as const).map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setBuilderType(type)}
                  className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                    builderType === type ? 'bg-slate-900 text-white font-semibold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-medium mb-1">Document Reference No. *</label>
              <input
                type="text"
                required
                value={refNumber}
                onChange={(e) => setRefNumber(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono focus:outline-none focus:border-slate-900"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">Carrier Vessel / Voyage No. *</label>
              <input
                type="text"
                required
                value={vesselVoyage}
                onChange={(e) => setVesselVoyage(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-900"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">Shipper / Factory (China) *</label>
              <input
                type="text"
                required
                value={shipperName}
                onChange={(e) => setShipperName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-900"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">Consignee (Sierra Leone) *</label>
              <input
                type="text"
                required
                value={consigneeName}
                onChange={(e) => setConsigneeName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-900 font-semibold"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">Port of Loading (POL)</label>
              <input
                type="text"
                value={pol}
                onChange={(e) => setPol(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-900"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">Port of Discharge (POD)</label>
              <input
                type="text"
                value={pod}
                onChange={(e) => setPod(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-900"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">Container Number</label>
              <input
                type="text"
                value={containerNumber}
                onChange={(e) => setContainerNumber(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono focus:outline-none focus:border-slate-900"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">Seal Number</label>
              <input
                type="text"
                value={sealNumber}
                onChange={(e) => setSealNumber(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono focus:outline-none focus:border-slate-900"
              />
            </div>
          </div>

          {/* Line Items Table Builder */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">
                Consignment Line Items
              </h3>
              <button
                type="button"
                onClick={handleAddLineItem}
                className="text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Item Row</span>
              </button>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                  <tr>
                    <th className="py-2.5 px-3">Description of Goods</th>
                    <th className="py-2.5 px-3">HS Code</th>
                    <th className="py-2.5 px-3 text-right">Packages</th>
                    <th className="py-2.5 px-3 text-right">Gross Wt (kg)</th>
                    <th className="py-2.5 px-3 text-right">CBM</th>
                    <th className="py-2.5 px-3 text-right">Value (USD $)</th>
                    <th className="py-2.5 px-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {builderItems.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-slate-50/50">
                      <td className="p-2">
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => {
                            const val = e.target.value;
                            setBuilderItems(items => items.map(i => i.id === item.id ? { ...i, description: val } : i));
                          }}
                          className="w-full px-2 py-1 border border-slate-200 rounded focus:outline-none focus:border-slate-900 text-xs"
                        />
                      </td>
                      <td className="p-2 w-28">
                        <input
                          type="text"
                          value={item.hsCode}
                          onChange={(e) => {
                            const val = e.target.value;
                            setBuilderItems(items => items.map(i => i.id === item.id ? { ...i, hsCode: val } : i));
                          }}
                          className="w-full px-2 py-1 border border-slate-200 rounded font-mono text-xs"
                        />
                      </td>
                      <td className="p-2 w-24">
                        <input
                          type="number"
                          value={item.packages}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setBuilderItems(items => items.map(i => i.id === item.id ? { ...i, packages: val } : i));
                          }}
                          className="w-full px-2 py-1 border border-slate-200 rounded font-mono text-right text-xs"
                        />
                      </td>
                      <td className="p-2 w-28">
                        <input
                          type="number"
                          value={item.grossWeightKg}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setBuilderItems(items => items.map(i => i.id === item.id ? { ...i, grossWeightKg: val } : i));
                          }}
                          className="w-full px-2 py-1 border border-slate-200 rounded font-mono text-right text-xs"
                        />
                      </td>
                      <td className="p-2 w-24">
                        <input
                          type="number"
                          step="0.1"
                          value={item.cbm}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setBuilderItems(items => items.map(i => i.id === item.id ? { ...i, cbm: val } : i));
                          }}
                          className="w-full px-2 py-1 border border-slate-200 rounded font-mono text-right text-xs"
                        />
                      </td>
                      <td className="p-2 w-28">
                        <input
                          type="number"
                          value={item.valueUSD}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setBuilderItems(items => items.map(i => i.id === item.id ? { ...i, valueUSD: val } : i));
                          }}
                          className="w-full px-2 py-1 border border-slate-200 rounded font-mono text-right text-xs font-bold"
                        />
                      </td>
                      <td className="p-2 text-center w-12">
                        <button
                          type="button"
                          onClick={() => handleRemoveLineItem(item.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setViewMode('view')}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg cursor-pointer shadow-xs"
            >
              Save & Certify {builderType}
            </button>
          </div>
        </form>
      ) : (
        /* DOCUMENT VIEWING MODE */
        <>
          {/* Document Selector Pills/Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 border-b border-slate-200">
            {customsDocs.map((doc) => (
              <button
                key={doc.id}
                onClick={() => setSelectedDocId(doc.id)}
                className={`px-4 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer flex items-center gap-2 ${
                  currentDoc?.id === doc.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>{doc.docType}</span>
                <span className="opacity-70 font-mono text-[11px]">({doc.referenceNumber})</span>
              </button>
            ))}
          </div>

          {/* Official Document Viewport (Printable Container) */}
          {currentDoc && (
            <div className="bg-white rounded-2xl border border-slate-300 shadow-md p-6 sm:p-10 max-w-4xl mx-auto space-y-8 font-sans">
              
              {/* Letterhead */}
              <div className="border-b-2 border-slate-900 pb-6">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div>
                    <span className="text-[11px] font-bold tracking-widest uppercase text-amber-700 block">
                      SIERRA LEONE REVENUE AUTHORITY & MARITIME CUSTOMS
                    </span>
                    <h2 className="text-2xl font-bold font-display text-slate-900 mt-1">
                      {currentDoc.docType.toUpperCase()}
                    </h2>
                    <div className="text-xs text-slate-500 font-mono mt-1">
                      Doc Ref: <strong className="text-slate-900">{currentDoc.referenceNumber}</strong> · Date: {currentDoc.dateIssued}
                    </div>
                  </div>

                  <div className="sm:text-right text-xs">
                    <div className="font-bold text-slate-900">GLOBAL LITE LOGISTICS</div>
                    <div className="text-slate-600">Import & Export Freight Agency</div>
                    <div className="text-slate-500">Guangzhou / Yiwu to Freetown Quay</div>
                  </div>
                </div>
              </div>

              {/* Parties Grid (Shipper, Consignee, Notify Party) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs bg-slate-50 p-5 rounded-xl border border-slate-200">
                <div>
                  <span className="font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    1. Shipper / Export Consignor
                  </span>
                  <div className="font-semibold text-slate-900">
                    {currentDoc.details?.shipperName || 'Global Lite Logistics (China Consolidation)'}
                  </div>
                  <div className="text-slate-600">
                    {currentDoc.details?.shipperAddress || 'Baiyun District International Freight Terminal, Guangzhou, China'}
                  </div>
                </div>

                <div>
                  <span className="font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    2. Consignee (Sierra Leone)
                  </span>
                  <div className="font-semibold text-slate-900">{currentDoc.consigneeName || STORE_INFO.consigneeName}</div>
                  <div className="text-slate-700 font-medium">Mauwiltus Enterprise</div>
                  <div className="text-slate-600">{currentDoc.consigneeAddress || STORE_INFO.address}</div>
                  <div className="text-slate-700 font-mono">Tel: {STORE_INFO.primaryContact} / {STORE_INFO.secondaryContact}</div>
                </div>

                <div>
                  <span className="font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    3. Port of Loading & Vessel
                  </span>
                  <div className="text-slate-800">
                    <strong>POL:</strong> {currentDoc.details?.portOfLoading || linkedShipment?.originPort || 'Guangzhou Port / Nansha, China'}
                  </div>
                  <div className="text-slate-800">
                    <strong>Vessel:</strong> {currentDoc.details?.vesselVoyage || linkedShipment?.vesselName || 'COSCO SHIPPING KILIMANJARO V.204W'}
                  </div>
                </div>

                <div>
                  <span className="font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    4. Port of Discharge & Clearing Officer
                  </span>
                  <div className="text-slate-800">
                    <strong>POD:</strong> {currentDoc.details?.portOfDischarge || 'Queen Elizabeth II Quay, Cline Town, Freetown'}
                  </div>
                  <div className="text-slate-800">
                    <strong>Enterprise Manager:</strong> {currentDoc.managerName || STORE_INFO.managerName}
                  </div>
                </div>
              </div>

              {/* Consignment Item Breakdown Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-300 bg-slate-100 text-slate-700 font-semibold">
                      <th className="py-2.5 px-3">Item Marks / HS Code</th>
                      <th className="py-2.5 px-3">Description of Goods</th>
                      <th className="py-2.5 px-3 text-right">Cartons</th>
                      <th className="py-2.5 px-3 text-right">Gross Wt (kg)</th>
                      <th className="py-2.5 px-3 text-right">Declared Value (USD)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {currentDoc.details?.lineItems ? (
                      currentDoc.details.lineItems.map((li: any, idx: number) => (
                        <tr key={idx}>
                          <td className="py-3 px-3 font-mono">HS {li.hsCode}</td>
                          <td className="py-3 px-3 font-medium text-slate-900">{li.description}</td>
                          <td className="py-3 px-3 text-right font-mono tabular-nums">{li.packages}</td>
                          <td className="py-3 px-3 text-right font-mono tabular-nums">{li.grossWeightKg.toLocaleString()}</td>
                          <td className="py-3 px-3 text-right font-mono tabular-nums">${li.valueUSD.toLocaleString()}.00</td>
                        </tr>
                      ))
                    ) : (
                      <>
                        <tr>
                          <td className="py-3 px-3 font-mono">HS 5208.52 / GLL-01</td>
                          <td className="py-3 px-3 font-medium text-slate-900">
                            Guinea Brocade Gold-Thread & Dutch Wax Fabrics (Combed Cotton)
                          </td>
                          <td className="py-3 px-3 text-right font-mono tabular-nums">180</td>
                          <td className="py-3 px-3 text-right font-mono tabular-nums">5,400</td>
                          <td className="py-3 px-3 text-right font-mono tabular-nums">$9,800.00</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-3 font-mono">HS 6204.42 / GLL-02</td>
                          <td className="py-3 px-3 font-medium text-slate-900">
                            Women Contemporary Maxi Dresses & Men Formal Tailored Attire
                          </td>
                          <td className="py-3 px-3 text-right font-mono tabular-nums">120</td>
                          <td className="py-3 px-3 text-right font-mono tabular-nums">3,850</td>
                          <td className="py-3 px-3 text-right font-mono tabular-nums">$7,400.00</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-3 font-mono">HS 2106.90 / GLL-03</td>
                          <td className="py-3 px-3 font-medium text-slate-900">
                            Organic Hibiscus-Moringa Herbal Teas & Apple Cider Vinegar Gummies
                          </td>
                          <td className="py-3 px-3 text-right font-mono tabular-nums">70</td>
                          <td className="py-3 px-3 text-right font-mono tabular-nums">2,200</td>
                          <td className="py-3 px-3 text-right font-mono tabular-nums">$4,200.00</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-3 font-mono">HS 7323.93 / GLL-04</td>
                          <td className="py-3 px-3 font-medium text-slate-900">
                            Stainless Household Cookware & Solar Rechargeable Lantern Units
                          </td>
                          <td className="py-3 px-3 text-right font-mono tabular-nums">50</td>
                          <td className="py-3 px-3 text-right font-mono tabular-nums">2,800</td>
                          <td className="py-3 px-3 text-right font-mono tabular-nums">$3,400.00</td>
                        </tr>
                      </>
                    )}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-slate-900 font-bold bg-slate-50">
                      <td className="py-3 px-3" colSpan={2}>CONSOLIDATED TOTAL</td>
                      <td className="py-3 px-3 text-right font-mono tabular-nums">{currentDoc.itemCount} pkgs</td>
                      <td className="py-3 px-3 text-right font-mono tabular-nums">14,250 kg</td>
                      <td className="py-3 px-3 text-right font-mono tabular-nums font-bold text-sm">
                        ${currentDoc.totalValueUSD.toLocaleString('en-US')}.00
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Assessment & Certification Footer */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-6 border-t border-slate-200 text-xs">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-emerald-700 font-semibold">
                    <CheckCircle className="w-4 h-4" />
                    <span>NRA Customs Assessment Status: {currentDoc.status}</span>
                  </div>
                  <p className="text-slate-500 leading-relaxed">
                    Total Landed Value in Sierra Leone: <strong className="text-slate-900 font-mono">SLE {currentDoc.totalValueSLE.toLocaleString('en-US')}</strong>. All goods undergo standard valuation under ASYCUDA World System at Water Quay.
                  </p>
                </div>

                <div className="border border-slate-300 p-4 rounded-lg bg-slate-50/50 flex flex-col justify-between">
                  <div className="text-[11px] text-slate-500 uppercase font-semibold">Authorized Signatures</div>
                  <div className="mt-4 flex justify-between text-xs font-mono text-slate-800">
                    <div>
                      <div className="border-b border-slate-400 pb-1 font-bold">{currentDoc.consigneeName || STORE_INFO.consigneeName}</div>
                      <span className="text-[10px] text-slate-500">Licensed Consignee</span>
                    </div>
                    <div>
                      <div className="border-b border-slate-400 pb-1 font-bold">{currentDoc.managerName || STORE_INFO.managerName}</div>
                      <span className="text-[10px] text-slate-500">Enterprise Manager</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}
        </>
      )}

    </div>
  );
};
