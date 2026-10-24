import React, { useState } from 'react';
import { Currency, ExchangeRates } from '../types';
import { INITIAL_RATES } from '../data/initialData';
import { Calculator, ArrowRight, TrendingUp, DollarSign, ShieldAlert } from 'lucide-react';

interface Props {
  rates?: ExchangeRates;
}

export const LandedCostCalculator: React.FC<Props> = ({ rates = INITIAL_RATES }) => {
  // Input parameters
  const [cargoType, setCargoType] = useState<'SEA_LCL' | 'AIR_CARGO' | 'SEA_FCL'>('SEA_LCL');
  const [itemCategory, setItemCategory] = useState<'apparel' | 'fabrics' | 'tea_gummies' | 'household'>('fabrics');
  const [purchaseCostCNY, setPurchaseCostCNY] = useState<number>(200); // 200 RMB per item
  const [quantity, setQuantity] = useState<number>(50); // 50 items
  const [cbmTotal, setCbmTotal] = useState<number>(2.5); // 2.5 CBM
  const [weightKgTotal, setWeightKgTotal] = useState<number>(120); // 120 kg
  const [targetMarginPercent, setTargetMarginPercent] = useState<number>(45); // 45% margin

  // Exchange rates
  const cnyRate = rates.SLE_PER_CNY; // ~3.15 SLE per CNY
  const usdRate = rates.SLE_PER_USD; // ~22.8 SLE per USD

  // Duty rates based on ECOWAS CET & Sierra Leone Customs
  const dutyPercentage = 
    itemCategory === 'apparel' ? 0.20 :
    itemCategory === 'fabrics' ? 0.15 :
    itemCategory === 'tea_gummies' ? 0.10 : 0.05;

  const gstPercentage = 0.15; // 15% Sierra Leone GST

  // Freight Cost calculation
  let freightCostUSD = 0;
  if (cargoType === 'SEA_LCL') {
    freightCostUSD = Math.max(170, cbmTotal * 175); // $175 per CBM
  } else if (cargoType === 'AIR_CARGO') {
    freightCostUSD = weightKgTotal * 9.5; // $9.50 per kg express
  } else {
    freightCostUSD = 4900; // FCL container base
  }

  // Cost in USD
  const totalPurchaseUSD = (purchaseCostCNY * quantity) / rates.CNY_PER_USD;
  const cifUSD = totalPurchaseUSD + freightCostUSD;
  const cifSLE = cifUSD * usdRate;

  // Customs & Port handling
  const portHandlingUSD = cargoType === 'SEA_FCL' ? 450 : cargoType === 'SEA_LCL' ? 120 : 60;
  const customsDutyUSD = cifUSD * dutyPercentage;
  const gstUSD = (cifUSD + customsDutyUSD) * gstPercentage;

  const totalLandedUSD = cifUSD + portHandlingUSD + customsDutyUSD + gstUSD;
  const totalLandedSLE = totalLandedUSD * usdRate;

  const landedCostPerUnitUSD = totalLandedUSD / quantity;
  const landedCostPerUnitSLE = totalLandedSLE / quantity;

  // Recommended Selling Price with Target Margin
  const retailPriceSLE = landedCostPerUnitSLE / (1 - targetMarginPercent / 100);
  const retailPriceUSD = retailPriceSLE / usdRate;
  const estimatedProfitTotalSLE = (retailPriceSLE * quantity) - totalLandedSLE;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Title */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-700">
          <span>Predictive Supply Chain Modeling</span>
          <span aria-hidden="true">·</span>
          <span>China to Sierra Leone Landed Cost Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 mt-1">
          Landed Cost & Tariff Valuation Calculator
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Compute FOB factory cost in RMB, sea/air tariffs, Queen Elizabeth II Quay handling, ECOWAS CET customs duty, and 15% NRA GST.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Form Controls Column */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Consignment Parameters
          </h2>

          {/* Freight Mode Selector */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Freight Mode
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setCargoType('SEA_LCL')}
                className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                  cargoType === 'SEA_LCL'
                    ? 'border-slate-900 bg-slate-900 text-white'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                Sea Cargo LCL
              </button>
              <button
                type="button"
                onClick={() => setCargoType('AIR_CARGO')}
                className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                  cargoType === 'AIR_CARGO'
                    ? 'border-slate-900 bg-slate-900 text-white'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                Air Cargo Express
              </button>
              <button
                type="button"
                onClick={() => setCargoType('SEA_FCL')}
                className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                  cargoType === 'SEA_FCL'
                    ? 'border-slate-900 bg-slate-900 text-white'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                40ft Sea FCL
              </button>
            </div>
          </div>

          {/* Item Category */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Goods Classification & NRA Tariff Group
            </label>
            <select
              value={itemCategory}
              onChange={(e) => setItemCategory(e.target.value as any)}
              className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-slate-900 cursor-pointer"
            >
              <option value="fabrics">Fabrics & Textiles (Guinea Brocade, Cotton - 15% Duty)</option>
              <option value="apparel">Men & Women Dresses / Finished Apparel (20% Duty)</option>
              <option value="tea_gummies">Health Teas, Diet Gummies & Supplements (10% Duty + Pharmacy Board)</option>
              <option value="household">Household Essentials / Solar Goods (5% Duty)</option>
            </select>
          </div>

          {/* Sourcing Cost & Quantity */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Unit Cost in China (RMB ¥)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-mono">¥</span>
                <input
                  type="number"
                  min="1"
                  value={purchaseCostCNY}
                  onChange={(e) => setPurchaseCostCNY(Number(e.target.value))}
                  className="w-full pl-7 pr-3 py-2 text-xs border border-slate-200 rounded-lg font-mono tabular-nums focus:outline-none focus:border-slate-900"
                />
              </div>
              <span className="text-[11px] text-slate-400 font-mono mt-0.5 block">
                ≈ ${(purchaseCostCNY / rates.CNY_PER_USD).toFixed(2)} USD
              </span>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Quantity Units
              </label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg font-mono tabular-nums focus:outline-none focus:border-slate-900"
              />
            </div>
          </div>

          {/* CBM and Weight */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Total Volume (CBM)
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                value={cbmTotal}
                onChange={(e) => setCbmTotal(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg font-mono tabular-nums focus:outline-none focus:border-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Gross Weight (kg)
              </label>
              <input
                type="number"
                min="1"
                value={weightKgTotal}
                onChange={(e) => setWeightKgTotal(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg font-mono tabular-nums focus:outline-none focus:border-slate-900"
              />
            </div>
          </div>

          {/* Target Margin Slider */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-medium text-slate-700">
                Target Retail Profit Margin
              </label>
              <span className="text-xs font-mono font-bold text-slate-900 tabular-nums">
                {targetMarginPercent}%
              </span>
            </div>
            <input
              type="range"
              min="15"
              max="70"
              value={targetMarginPercent}
              onChange={(e) => setTargetMarginPercent(Number(e.target.value))}
              className="w-full accent-slate-900 cursor-pointer"
            />
          </div>

        </div>

        {/* Calculation Result Column */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Main Landed Card */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                Predicted Landed Cost (Freetown Door)
              </div>
              <div className="text-xs font-mono text-slate-400">
                1 USD = {usdRate} SLE
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs text-slate-400 block">Landed Cost Per Unit:</span>
                <span className="text-2xl font-bold font-mono text-white tabular-nums">
                  SLE {landedCostPerUnitSLE.toFixed(1)}
                </span>
                <span className="text-xs font-mono text-slate-400 block mt-0.5">
                  (${landedCostPerUnitUSD.toFixed(2)} USD)
                </span>
              </div>

              <div>
                <span className="text-xs text-slate-400 block">Recommended Retail Price:</span>
                <span className="text-2xl font-bold font-mono text-amber-400 tabular-nums">
                  SLE {retailPriceSLE.toFixed(0)}
                </span>
                <span className="text-xs font-mono text-slate-400 block mt-0.5">
                  (${retailPriceUSD.toFixed(2)} USD)
                </span>
              </div>
            </div>

            {/* Estimated Batch Net Margin */}
            <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-300">Projected Batch Profit:</span>
              </div>
              <span className="font-bold text-emerald-400 font-mono text-sm tabular-nums">
                +SLE {estimatedProfitTotalSLE.toLocaleString('en-US', { maximumFractionDigits: 0 })}
              </span>
            </div>
          </div>

          {/* Breakdown Itemized Table */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3 text-xs">
            <h3 className="font-bold text-slate-900 uppercase tracking-wider text-xs border-b border-slate-100 pb-2">
              Landed Cost Component Breakdown
            </h3>

            <div className="space-y-2">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">FOB Factory Sourcing (China):</span>
                <span className="font-mono text-slate-900 tabular-nums">
                  ${totalPurchaseUSD.toFixed(2)} USD (¥{(purchaseCostCNY * quantity).toLocaleString()} CNY)
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">Freight Cost (Global Lite):</span>
                <span className="font-mono text-slate-900 tabular-nums">
                  ${freightCostUSD.toFixed(2)} USD
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">Queen Elizabeth II Quay / Port Handling:</span>
                <span className="font-mono text-slate-900 tabular-nums">
                  ${portHandlingUSD.toFixed(2)} USD
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">NRA Customs Duty ({(dutyPercentage * 100).toFixed(0)}%):</span>
                <span className="font-mono text-slate-900 tabular-nums">
                  ${customsDutyUSD.toFixed(2)} USD
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">Sierra Leone GST (15%):</span>
                <span className="font-mono text-slate-900 tabular-nums">
                  ${gstUSD.toFixed(2)} USD
                </span>
              </div>
              <div className="flex justify-between pt-2 font-bold text-sm text-slate-900">
                <span>Total Consignment Landed:</span>
                <span className="font-mono tabular-nums">
                  SLE {totalLandedSLE.toLocaleString('en-US', { maximumFractionDigits: 0 })} (${totalLandedUSD.toFixed(2)})
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
