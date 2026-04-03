export interface Client {
  id: string;
  name: string;
  gstin: string;
  state: string;
  whatsapp: string;
  itcThisMonth: number;
  invoiceCount: number;
  complianceStatus: 'compliant' | 'attention' | 'at-risk';
  riskScore: number;
}

export interface Invoice {
  id: string;
  clientId: string;
  clientName: string;
  invoiceNo: string;
  date: string;
  supplierGstin: string;
  supplierName: string;
  total: number;
  cgst: number;
  sgst: number;
  igst: number;
  itc: number;
  aiCategory: string;
  status: 'confirmed' | 'pending' | 'rejected';
}

export interface Alert {
  id: string;
  clientName: string;
  type: string;
  message: string;
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
  daysRemaining: number;
  resolved: boolean;
}

export const clients: Client[] = [
  { id: '1', name: 'Shree Ram General Store', gstin: '24AABCS1429B1Z5', state: 'Gujarat', whatsapp: '+91 98765 43210', itcThisMonth: 3200, invoiceCount: 8, complianceStatus: 'compliant', riskScore: 82 },
  { id: '2', name: 'Mehta Traders', gstin: '24AADCM7654K1ZQ', state: 'Gujarat', whatsapp: '+91 98765 43211', itcThisMonth: 4500, invoiceCount: 12, complianceStatus: 'compliant', riskScore: 95 },
  { id: '3', name: 'Krishna Kirana', gstin: '27AABCK9012L1ZR', state: 'Maharashtra', whatsapp: '+91 98765 43212', itcThisMonth: 1800, invoiceCount: 5, complianceStatus: 'at-risk', riskScore: 35 },
  { id: '4', name: 'Patel Electronics', gstin: '24AABCP3456M1ZS', state: 'Gujarat', whatsapp: '+91 98765 43213', itcThisMonth: 5200, invoiceCount: 15, complianceStatus: 'attention', riskScore: 58 },
  { id: '5', name: 'Jai Hind Pharma', gstin: '07AABCJ7890N1ZT', state: 'Delhi', whatsapp: '+91 98765 43214', itcThisMonth: 2100, invoiceCount: 6, complianceStatus: 'compliant', riskScore: 78 },
  { id: '6', name: 'Sharma Wholesale', gstin: '27AABCS2345P1ZU', state: 'Maharashtra', whatsapp: '+91 98765 43215', itcThisMonth: 1900, invoiceCount: 4, complianceStatus: 'attention', riskScore: 52 },
  { id: '7', name: 'Desai Textiles', gstin: '24AABCD6789Q1ZV', state: 'Gujarat', whatsapp: '+91 98765 43216', itcThisMonth: 1614, invoiceCount: 3, complianceStatus: 'compliant', riskScore: 65 },
];

export const invoices: Invoice[] = [
  { id: '1', clientId: '1', clientName: 'Shree Ram General Store', invoiceNo: 'GSTINV/2026/0341', date: '2026-03-08', supplierGstin: '24AABCX1234A1Z1', supplierName: 'ABC Distributors', total: 25000, cgst: 2250, sgst: 2250, igst: 0, itc: 4500, aiCategory: 'Office Supplies', status: 'confirmed' },
  { id: '2', clientId: '2', clientName: 'Mehta Traders', invoiceNo: 'GSTINV/2026/0342', date: '2026-03-07', supplierGstin: '24AABCY5678B1Z2', supplierName: 'XYZ Trading Co', total: 39740, cgst: 3577, sgst: 3577, igst: 0, itc: 7154, aiCategory: 'Electronics', status: 'confirmed' },
  { id: '3', clientId: '3', clientName: 'Krishna Kirana', invoiceNo: 'GSTINV/2026/0343', date: '2026-03-07', supplierGstin: '27AABCZ9012C1Z3', supplierName: 'Fresh Foods Ltd', total: 15000, cgst: 0, sgst: 0, igst: 2700, itc: 2700, aiCategory: 'Food & Beverages', status: 'pending' },
  { id: '4', clientId: '4', clientName: 'Patel Electronics', invoiceNo: 'GSTINV/2026/0344', date: '2026-03-06', supplierGstin: '24AABCA3456D1Z4', supplierName: 'Samsung India', total: 45000, cgst: 4050, sgst: 4050, igst: 0, itc: 8100, aiCategory: 'Electronics', status: 'pending' },
  { id: '5', clientId: '5', clientName: 'Jai Hind Pharma', invoiceNo: 'GSTINV/2026/0345', date: '2026-03-06', supplierGstin: '07AABCB7890E1Z5', supplierName: 'Cipla Ltd', total: 32000, cgst: 0, sgst: 0, igst: 5760, itc: 5760, aiCategory: 'Pharmaceuticals', status: 'confirmed' },
  { id: '6', clientId: '1', clientName: 'Shree Ram General Store', invoiceNo: 'GSTINV/2026/0346', date: '2026-03-05', supplierGstin: '24AABCC1234F1Z6', supplierName: 'Local Caterers', total: 5000, cgst: 450, sgst: 450, igst: 0, itc: 0, aiCategory: 'Food (Blocked)', status: 'rejected' },
  { id: '7', clientId: '2', clientName: 'Mehta Traders', invoiceNo: 'GSTINV/2026/0347', date: '2026-03-05', supplierGstin: '24AABCD5678G1Z7', supplierName: 'Paper World', total: 12500, cgst: 1125, sgst: 1125, igst: 0, itc: 2250, aiCategory: 'Office Supplies', status: 'confirmed' },
  { id: '8', clientId: '6', clientName: 'Sharma Wholesale', invoiceNo: 'GSTINV/2026/0348', date: '2026-03-04', supplierGstin: '27AABCE9012H1Z8', supplierName: 'Reliance Fresh', total: 28000, cgst: 0, sgst: 0, igst: 5040, itc: 5040, aiCategory: 'FMCG', status: 'confirmed' },
  { id: '9', clientId: '4', clientName: 'Patel Electronics', invoiceNo: 'GSTINV/2026/0349', date: '2026-03-04', supplierGstin: '24AABCF3456I1Z9', supplierName: 'LG Electronics', total: 18000, cgst: 1620, sgst: 1620, igst: 0, itc: 3240, aiCategory: 'Electronics', status: 'confirmed' },
  { id: '10', clientId: '7', clientName: 'Desai Textiles', invoiceNo: 'GSTINV/2026/0350', date: '2026-03-03', supplierGstin: '24AABCG7890J1ZA', supplierName: 'Cotton King', total: 22000, cgst: 1320, sgst: 1320, igst: 0, itc: 2640, aiCategory: 'Textiles', status: 'pending' },
];

export const alerts: Alert[] = [
  { id: '1', clientName: 'Krishna Kirana', type: 'Filing Deadline', message: 'GSTR-3B filing due. Only 2 of 8 invoices uploaded.', priority: 'high', dueDate: '2026-03-20', daysRemaining: 11, resolved: false },
  { id: '2', clientName: 'Patel Electronics', type: 'ITC Mismatch', message: 'ITC claimed ₹8,100 but GSTR-2B shows ₹6,500. Difference: ₹1,600', priority: 'high', dueDate: '2026-03-18', daysRemaining: 9, resolved: false },
  { id: '3', clientName: 'Sharma Wholesale', type: 'Supplier Issue', message: 'Supplier Reliance Fresh has not filed GSTR-1 for Feb 2026', priority: 'medium', dueDate: '2026-03-25', daysRemaining: 16, resolved: false },
  { id: '4', clientName: 'Desai Textiles', type: 'Document Pending', message: '3 invoices pending verification. Upload original documents.', priority: 'medium', dueDate: '2026-03-22', daysRemaining: 13, resolved: false },
  { id: '5', clientName: 'Jai Hind Pharma', type: 'Compliance Alert', message: 'E-way bill expiring for shipment #EWB/2026/4521', priority: 'low', dueDate: '2026-03-15', daysRemaining: 6, resolved: false },
  { id: '6', clientName: 'Shree Ram General Store', type: 'Filing Complete', message: 'GSTR-1 filed successfully for February 2026', priority: 'low', dueDate: '2026-03-10', daysRemaining: 1, resolved: true },
  { id: '7', clientName: 'Mehta Traders', type: 'Reconciliation', message: 'GSTR-2A reconciliation completed. All invoices matched.', priority: 'low', dueDate: '2026-03-08', daysRemaining: 0, resolved: true },
  { id: '8', clientName: 'Jai Hind Pharma', type: 'Payment Received', message: 'Professional fee of ₹2,500 received for February', priority: 'low', dueDate: '2026-03-05', daysRemaining: 0, resolved: true },
];

export const itcTrendData = [
  { month: 'Oct', itc: 15200 },
  { month: 'Nov', itc: 17800 },
  { month: 'Dec', itc: 14500 },
  { month: 'Jan', itc: 19200 },
  { month: 'Feb', itc: 18100 },
  { month: 'Mar', itc: 20314 },
];

export const clientRiskData = [
  { name: 'Compliant', value: 3, color: 'hsl(160, 84%, 39%)' },
  { name: 'Attention', value: 2, color: 'hsl(38, 92%, 50%)' },
  { name: 'At Risk', value: 1, color: 'hsl(0, 84%, 60%)' },
];

export const whatsappActivity = [
  { time: '9:42 AM', client: 'Mehta Traders', action: 'uploaded invoice', amount: '₹39,740', status: 'success' as const },
  { time: '9:15 AM', client: 'Krishna Kirana', action: 'asked about deadline', amount: null, status: 'warning' as const },
  { time: '8:55 AM', client: 'Shree Ram General Store', action: 'confirmed invoice GSTINV/8873', amount: null, status: 'success' as const },
  { time: '8:30 AM', client: 'Patel Electronics', action: 'ITC blocked (food bill)', amount: null, status: 'danger' as const },
  { time: '8:10 AM', client: 'Desai Textiles', action: 'uploaded 3 invoices', amount: '₹22,000', status: 'success' as const },
];

export const deadlinePredictions = [
  { client: 'Krishna Kirana', probability: 35, risk: 'high' as const },
  { client: 'Desai Textiles', probability: 65, risk: 'medium' as const },
  { client: 'Patel Electronics', probability: 80, risk: 'low' as const },
  { client: 'Mehta Traders', probability: 95, risk: 'low' as const },
];

export const monthlyItcTrend = [
  { month: 'Apr', shreeRam: 2800, mehta: 3900, krishna: 1200, patel: 4100, jaiHind: 1800, sharma: 1500, desai: 1200 },
  { month: 'May', shreeRam: 3100, mehta: 4200, krishna: 1400, patel: 4500, jaiHind: 1900, sharma: 1600, desai: 1300 },
  { month: 'Jun', shreeRam: 2900, mehta: 3800, krishna: 1100, patel: 4800, jaiHind: 2000, sharma: 1700, desai: 1400 },
  { month: 'Jul', shreeRam: 3200, mehta: 4100, krishna: 1500, patel: 4200, jaiHind: 1700, sharma: 1400, desai: 1100 },
  { month: 'Aug', shreeRam: 3400, mehta: 4400, krishna: 1600, patel: 4900, jaiHind: 2100, sharma: 1800, desai: 1500 },
  { month: 'Sep', shreeRam: 3000, mehta: 4000, krishna: 1300, patel: 5100, jaiHind: 1900, sharma: 1600, desai: 1200 },
  { month: 'Oct', shreeRam: 3300, mehta: 4300, krishna: 1700, patel: 4600, jaiHind: 2000, sharma: 1700, desai: 1300 },
  { month: 'Nov', shreeRam: 3500, mehta: 4500, krishna: 1800, patel: 5000, jaiHind: 2200, sharma: 1900, desai: 1600 },
  { month: 'Dec', shreeRam: 2700, mehta: 3700, krishna: 1000, patel: 4300, jaiHind: 1600, sharma: 1300, desai: 1000 },
  { month: 'Jan', shreeRam: 3100, mehta: 4600, krishna: 1900, patel: 5200, jaiHind: 2100, sharma: 1800, desai: 1500 },
  { month: 'Feb', shreeRam: 3000, mehta: 4200, krishna: 1600, patel: 4800, jaiHind: 2000, sharma: 1700, desai: 1400 },
  { month: 'Mar', shreeRam: 3200, mehta: 4500, krishna: 1800, patel: 5200, jaiHind: 2100, sharma: 1900, desai: 1614 },
];

export const categoryDistribution = [
  { name: 'Electronics', value: 40, color: 'hsl(239, 84%, 67%)' },
  { name: 'Office Supplies', value: 20, color: 'hsl(38, 92%, 50%)' },
  { name: 'Pharmaceuticals', value: 15, color: 'hsl(160, 84%, 39%)' },
  { name: 'FMCG', value: 12, color: 'hsl(280, 70%, 60%)' },
  { name: 'Textiles', value: 8, color: 'hsl(200, 80%, 50%)' },
  { name: 'Food (Blocked)', value: 5, color: 'hsl(0, 84%, 60%)' },
];

export const itcByState = [
  { state: 'Gujarat', itc: 14714 },
  { state: 'Maharashtra', itc: 3700 },
  { state: 'Delhi', itc: 2100 },
];

export const filingVelocity = [
  { week: 'W1', filings: 3 },
  { week: 'W2', filings: 5 },
  { week: 'W3', filings: 2 },
  { week: 'W4', filings: 4 },
];
