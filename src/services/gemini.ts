import { GoogleGenAI } from '@google/genai';

// Initialize SDK safely
const apiKey = process.env.GEMINI_API_KEY || (typeof window !== 'undefined' ? (window as any).__GEMINI_KEY__ : '');

let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  try {
    aiClient = new GoogleGenAI({ apiKey });
  } catch (e) {
    console.warn('GoogleGenAI client init notice:', e);
  }
}

export async function askTradeAdvisor(prompt: string, context?: string): Promise<string> {
  if (!aiClient) {
    // Domain-specific intelligent fallback when no API key is provided
    return getLocalSinoSaloneAdvice(prompt);
  }

  try {
    const systemInstruction = `You are the Sino-Salone Trade & Logistics Intelligence Advisor for Global Lite Logistics import and export and Mauwiltus Enterprise (15 Macdonald Street, Freetown, Sierra Leone; Managed by Williette M. Lawson, Consignee: Abdul K. Sesay).
You specialize in China-Sierra Leone trade corridors:
- Ports: Guangzhou Nansha, Yiwu, Shenzhen to Queen Elizabeth II Quay (Freetown Water Quay) and Lungi Airport.
- Sierra Leone National Revenue Authority (NRA) customs tariffs, ECOWAS CET (Common External Tariff), ASYCUDA World single administrative documents, and 15% GST.
- Merchandise: Man & Woman dresses, herbal health teas, gummies, Guinea brocade, Dutch wax fabrics, and household items.
- Currency: New Leone (SLE), USD, and Chinese Yuan (RMB/CNY).
Provide concise, accurate, professional guidance with practical actionable steps for importers, warehouse workers, and store managers.`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: context ? `Context:\n${context}\n\nQuestion:\n${prompt}` : prompt,
      config: {
        systemInstruction,
        temperature: 0.4
      }
    });

    return response.text || 'No response generated from trade intelligence service.';
  } catch (error) {
    console.warn('Gemini trade query error, using local advisory knowledge:', error);
    return getLocalSinoSaloneAdvice(prompt);
  }
}

function getLocalSinoSaloneAdvice(query: string): string {
  const q = query.toLowerCase();

  if (q.includes('customs') || q.includes('duty') || q.includes('nra') || q.includes('tax')) {
    return `**Sierra Leone Customs & NRA Assessment Guidelines:**
1. **ECOWAS Common External Tariff (CET):**
   - Finished Garments & Dresses: 20% import duty
   - Cotton Fabric & Brocade (raw/semi-finished): 10% - 20%
   - Dietary Gummies & Herbal Teas: 10% duty + requires Pharmacy Board inspection
   - Household Essentials / Solar units: 0% - 5% (renewable incentive)
2. **Goods & Services Tax (GST):** Standard 15% calculated on (CIF Value + Import Duty + Port Surcharge).
3. **ASYCUDA World Submission:** Registered under Consignee **Abdul K. Sesay** at Queen Elizabeth II Quay (Water Quay). Required docs: Bill of Lading, Commercial Invoice, Packing List, Form M (if applicable).`;
  }

  if (q.includes('freight') || q.includes('cbm') || q.includes('cost') || q.includes('shipping')) {
    return `**Global Lite Freight & Sourcing Rates (China -> Freetown):**
- **Sea Freight (LCL Groupage):** Approx. $160 - $185 per CBM from Guangzhou/Yiwu consolidation yards to Queen Elizabeth II Quay. Transit time: 32 - 42 days.
- **Sea Freight (FCL 40ft High Cube):** Approx. $4,800 - $5,400 depending on carrier (COSCO / Maersk / CMA CGM).
- **Air Cargo Express (Shenzhen/Guangzhou to Lungi FNA):** $8.50 - $11.00/kg (7 - 10 business days). Ideal for health gummies, tea refills, and express samples.
- **Port Clearance & Handling:** Nectar SL stevedoring & terminal handling adds approx. SLE 3,200 - 4,500 per LCL consignment.`;
  }

  if (q.includes('fabric') || q.includes('tea') || q.includes('dress') || q.includes('sourcing')) {
    return `**Mauwiltus Sourcing Recommendations:**
- **Guinea Brocade & Fabrics:** Best sourced from Shaoxing Keqiao textile market or Yiwu District 4. Aim for 100% combed cotton, 5-yard or 6-yard bolts.
- **Herbal Teas & Gummies:** Verify manufacturer GMP/ISO22000 certificates before container consolidation. Ensure silica gel desiccant packs are enclosed due to Atlantic ocean humidity.
- **Apparel:** Guangzhou Shahe & Shisanhang wholesale markets offer high-margin contemporary dresses suitable for the Freetown market.`;
  }

  return `**Global Lite Logistics & Mauwiltus Trade Advisory:**
For imports between China and Sierra Leone (Consignee: Abdul K. Sesay, Manager: Williette M. Lawson, 15 Macdonald Street, Freetown):
- We consolidate weekly in Guangzhou and Yiwu.
- Payments accepted via Orange Money (+232 90 703350), Afrimoney (+232 73 775786), and RCB/SLCB bank transfer.
- Live tracking is supported from factory pickup to Queen Elizabeth II Quay and 15 Macdonald Street store door.`;
}
