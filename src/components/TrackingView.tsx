import React, { useState } from 'react';
import { Shipment, ShipmentStatus } from '../types';
import { STORE_INFO } from '../data/initialData';
import { Search, Ship, Plane, CheckCircle2, Clock, MapPin, FileText, UserCheck, AlertCircle } from 'lucide-react';

interface Props {
  shipments: Shipment[];
}

export const TrackingView: React.FC<Props> = ({ shipments }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedShipmentId, setSelectedShipmentId] = useState<string>(shipments[0]?.id || '');

  const currentShipment = shipments.find(
    (s) => s.id === selectedShipmentId || s.trackingNumber.toLowerCase() === searchQuery.toLowerCase().trim()
  ) || shipments[0];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const match = shipments.find(
      (s) =>
        s.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        s.billOfLading.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        s.containerNumber?.toLowerCase().includes(searchQuery.toLowerCase().trim())
    );
    if (match) {
      setSelectedShipmentId(match.id);
    } else {
      alert(`No shipment found matching "${searchQuery}". Try "GLL-SL-884210" or "GLL-AIR-90432".`);
    }
  };

  const getStatusBadge = (status: ShipmentStatus) => {
    switch (status) {
      case 'in_transit':
        return <span className="text-amber-700 font-semibold text-xs">Vessel In Transit (Maritime Route)</span>;
      case 'arrived_freetown_port':
        return <span className="text-blue-700 font-semibold text-xs">Arrived at Queen Elizabeth II Quay</span>;
      case 'nra_customs_clearance':
        return <span className="text-purple-700 font-semibold text-xs">NRA ASYCUDA Customs Processing</span>;
      case 'delivered_to_store':
        return <span className="text-emerald-700 font-semibold text-xs">Delivered to 15 Macdonald Street</span>;
      default:
        return <span className="text-slate-700 font-semibold text-xs">Origin Warehouse Processing</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Title & Slogan */}
      <div className="border-b border-slate-200 pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-700">
            <span>Global Lite Logistics import and export</span>
            <span aria-hidden="true">·</span>
            <span>Live Cargo Tracking</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 mt-1">
            China to Sierra Leone Shipment Tracking
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time multi-modal logistics from Guangzhou, Yiwu & Shenzhen to Queen Elizabeth II Quay, Freetown.
          </p>
        </div>

        {/* Tracking Search Form */}
        <form onSubmit={handleSearch} className="flex gap-2 max-w-md w-full">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Enter Tracking No. e.g. GLL-SL-884210"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-slate-900 font-mono"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shrink-0"
          >
            Track Cargo
          </button>
        </form>
      </div>

      {/* Shipment Selector Strip */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {shipments.map((ship) => (
          <button
            key={ship.id}
            onClick={() => setSelectedShipmentId(ship.id)}
            className={`p-3 rounded-xl border text-left min-w-[240px] shrink-0 transition-all cursor-pointer ${
              currentShipment?.id === ship.id
                ? 'border-slate-900 bg-white shadow-xs'
                : 'border-slate-200 bg-slate-50/60 hover:bg-white text-slate-600'
            }`}
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono font-bold text-slate-900">{ship.trackingNumber}</span>
              {ship.freightType === 'AIR_CARGO' ? (
                <Plane className="w-3.5 h-3.5 text-blue-600" />
              ) : (
                <Ship className="w-3.5 h-3.5 text-amber-600" />
              )}
            </div>
            <div className="text-[11px] text-slate-500 mt-1 truncate">
              {ship.goodsDescription}
            </div>
            <div className="text-[11px] font-mono mt-1 text-slate-700">
              ETA: {ship.estimatedArrival}
            </div>
          </button>
        ))}
      </div>

      {currentShipment ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Column: Live Route Milestone Timeline */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
            
            {/* Header overview */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <div className="text-xs text-slate-500">Active Consignment</div>
                <div className="text-lg font-bold text-slate-900 font-mono">
                  {currentShipment.trackingNumber}
                </div>
                <div className="mt-1">
                  {getStatusBadge(currentShipment.status)}
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs text-slate-500">Bill of Lading / Airway Bill</div>
                <div className="text-xs font-mono font-semibold text-slate-800">
                  {currentShipment.billOfLading}
                </div>
                {currentShipment.containerNumber && (
                  <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                    Container: {currentShipment.containerNumber}
                  </div>
                )}
              </div>
            </div>

            {/* Geographical Route Pipeline Card */}
            <div className="p-4 bg-slate-900 text-white rounded-xl space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Origin Port</span>
                <span>Destination Port</span>
              </div>
              <div className="flex items-center justify-between font-bold text-sm">
                <span>{currentShipment.originPort}</span>
                <span className="text-amber-400 px-3">✈ / 🚢</span>
                <span>{currentShipment.destinationPort}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
                <span>Vessel/Flight: <strong className="text-slate-200">{currentShipment.vesselName || 'Direct Cargo Carrier'}</strong></span>
                <span>Est. Delivery: <strong className="text-amber-400">{currentShipment.estimatedArrival}</strong></span>
              </div>
            </div>

            {/* Milestone Steps Timeline */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-4">
                Milestones & Customs Clearance Progression
              </h3>

              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
                {currentShipment.milestones.map((m, idx) => (
                  <div key={idx} className="relative flex items-start gap-4">
                    {/* Status Circle */}
                    <div className={`absolute -left-6 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center ${
                      m.completed ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'
                    }`}>
                      {m.completed ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : (
                        <Clock className="w-3.5 h-3.5" />
                      )}
                    </div>

                    <div className="flex-1 bg-slate-50/70 p-3.5 rounded-xl border border-slate-100">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <h4 className="text-xs font-semibold text-slate-900">
                          {m.label}
                        </h4>
                        <span className="text-[11px] font-mono text-slate-500 shrink-0">
                          {m.timestamp}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                        <span>{m.location}</span>
                      </div>
                      {m.notes && (
                        <p className="text-xs text-slate-600 mt-2 bg-white p-2 rounded border border-slate-200/60 leading-relaxed">
                          {m.notes}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Sidebar: Cargo Manifest, Consignee & ASYCUDA Status */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Consignee & Management Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4 text-xs">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <UserCheck className="w-4 h-4 text-amber-600" />
                <h3 className="font-bold text-slate-900 text-sm">Key Personnel & Contacts</h3>
              </div>

              <div>
                <span className="text-slate-500 block text-[11px]">Consignee (Bill of Lading):</span>
                <span className="font-semibold text-slate-900 text-sm">{STORE_INFO.consigneeName}</span>
                <p className="text-slate-600 mt-0.5">{STORE_INFO.address}</p>
                <p className="text-slate-700 font-mono mt-0.5 font-medium">{STORE_INFO.primaryContact}</p>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <span className="text-slate-500 block text-[11px]">Store & Operations Manager:</span>
                <span className="font-semibold text-slate-900 text-sm">{STORE_INFO.managerName}</span>
                <p className="text-slate-600 mt-0.5">Mauwiltus Enterprise Retail</p>
                <p className="text-slate-700 font-mono mt-0.5 font-medium">{STORE_INFO.secondaryContact}</p>
              </div>
            </div>

            {/* Cargo Specifications */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3 text-xs">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <FileText className="w-4 h-4 text-slate-700" />
                <h3 className="font-bold text-slate-900 text-sm">Manifest Metrics</h3>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 bg-slate-50 rounded-lg">
                  <span className="text-slate-500 text-[11px] block">Volume (CBM)</span>
                  <span className="font-bold text-slate-900 font-mono text-sm tabular-nums">
                    {currentShipment.cbm} m³
                  </span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg">
                  <span className="text-slate-500 text-[11px] block">Gross Weight</span>
                  <span className="font-bold text-slate-900 font-mono text-sm tabular-nums">
                    {currentShipment.grossWeightKg.toLocaleString()} kg
                  </span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg">
                  <span className="text-slate-500 text-[11px] block">Packages</span>
                  <span className="font-bold text-slate-900 font-mono text-sm tabular-nums">
                    {currentShipment.packagesCount} cartons
                  </span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg">
                  <span className="text-slate-500 text-[11px] block">Freight Mode</span>
                  <span className="font-bold text-slate-900 text-xs">
                    {currentShipment.freightType}
                  </span>
                </div>
              </div>

              <div className="pt-2 text-[11px] text-slate-600 leading-relaxed">
                <span className="font-semibold text-slate-800">Contents:</span> {currentShipment.goodsDescription}
              </div>
            </div>

            {/* ASYCUDA & NRA Customs Assessment */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3 text-xs">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <AlertCircle className="w-4 h-4 text-purple-600" />
                <h3 className="font-bold text-slate-900 text-sm">Sierra Leone NRA Customs</h3>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">ASYCUDA Doc ID:</span>
                  <span className="font-mono font-semibold text-slate-900">
                    {currentShipment.customsStatus.asycudaNumber}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Duty Assessment:</span>
                  <span className="font-mono font-bold text-slate-900 tabular-nums">
                    SLE {currentShipment.customsStatus.dutyAssessedSLE.toLocaleString('en-US')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">GST (15%):</span>
                  <span className="font-mono font-bold text-slate-900 tabular-nums">
                    SLE {currentShipment.customsStatus.gstAmountSLE.toLocaleString('en-US')}
                  </span>
                </div>
              </div>

              <div className="p-2 bg-purple-50 text-purple-900 rounded-lg text-[11px] leading-relaxed">
                Single Administrative Document (SAD) cleared for fast-track processing under Consignee Abdul K. Sesay.
              </div>
            </div>

          </div>

        </div>
      ) : null}

    </div>
  );
};
