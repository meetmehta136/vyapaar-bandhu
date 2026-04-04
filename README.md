<div align="center">

```
██╗   ██╗██╗   ██╗ █████╗ ██████╗  █████╗  █████╗ ██████╗
██║   ██║╚██╗ ██╔╝██╔══██╗██╔══██╗██╔══██╗██╔══██╗██╔══██╗
██║   ██║ ╚████╔╝ ███████║██████╔╝███████║███████║██████╔╝
╚██╗ ██╔╝  ╚██╔╝  ██╔══██║██╔═══╝ ██╔══██║██╔══██║██╔══██╗
 ╚████╔╝    ██║   ██║  ██║██║     ██║  ██║██║  ██║██║  ██║
  ╚═══╝     ╚═╝   ╚═╝  ╚═╝╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝
         ██████╗  █████╗ ███╗   ██╗██████╗ ██╗  ██╗██╗   ██╗
         ██╔══██╗██╔══██╗████╗  ██║██╔══██╗██║  ██║██║   ██║
         ██████╔╝███████║██╔██╗ ██║██║  ██║███████║██║   ██║
         ██╔══██╗██╔══██║██║╚██╗██║██║  ██║██╔══██║██║   ██║
         ██████╔╝██║  ██║██║ ╚████║██████╔╝██║  ██║╚██████╔╝
         ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═══╝╚═════╝ ╚═╝  ╚═╝ ╚═════╝
```

### 🤝 AI-Powered GST Compliance for India's 8 Crore SMEs

<br/>

[![API Live](https://img.shields.io/badge/⚡_API-LIVE-00d26a?style=for-the-badge&labelColor=0a0a0a)](https://vyapaar-bandhu-h53q.onrender.com/docs)
[![Website](https://img.shields.io/badge/🌍_Website-LIVE-00d26a?style=for-the-badge&labelColor=0a0a0a)](https://vyapaar-bandhu-web.vercel.app/)
[![Dashboard](https://img.shields.io/badge/📊_Dashboard-LIVE-4f8ef7?style=for-the-badge&labelColor=0a0a0a)](https://vyapaar-bandhu.vercel.app)
[![HuggingFace](https://img.shields.io/badge/🤗_Model-IndicBERT-ff9500?style=for-the-badge&labelColor=0a0a0a)](https://huggingface.co/meet136/indicbert-gst-classifier)
[![Solo Build](https://img.shields.io/badge/👤_Built_Solo-8_Weeks-e040fb?style=for-the-badge&labelColor=0a0a0a)]()

<br/>

> **"Send an invoice photo on WhatsApp → Get ITC calculated in under 20 seconds."**
> No app. No accountant. No BS.

</div>

---

## 💀 The Problem

```
₹2,000–₹5,000/month   →   What small businesses pay CAs for basic GST filing
₹50/day               →   Penalty for missing a deadline
8 crore               →   Indian SMEs who can't afford a full-time accountant
0                     →   Apps that work natively on WhatsApp with zero learning curve
```

---

## ⚡ What VyapaarBandhu Does

```
📸 Photo → 🤖 AI OCR → 🧠 Classification → ✅ ITC Calculated → 📊 CA Dashboard
          < 20 seconds end-to-end, entirely on WhatsApp >
```

---

## 🏗️ Architecture

```
                        ┌─────────────────────────────────────────┐
                        │            USER'S WHATSAPP               │
                        └──────────────────┬──────────────────────┘
                                           │ Invoice Photo
                                           ▼
                        ┌─────────────────────────────────────────┐
                        │              TWILIO API                  │
                        └──────────────────┬──────────────────────┘
                                           │
                                           ▼
              ┌────────────────────────────────────────────────────────┐
              │                   FASTAPI BACKEND                       │
              │                  (Render · Python)                      │
              │                                                         │
              │   ┌─────────────────┐    ┌──────────────────────────┐  │
              │   │  OpenRouter VLM  │    │  meet136/indicbert-gst   │  │
              │   │ (nemotron-nano)  │───▶│  Classifier (HuggingFace)│  │
              │   │   Invoice OCR   │    │  7 GST Categories · F1:1 │  │
              │   └─────────────────┘    └──────────────────────────┘  │
              │                                                         │
              │   ┌──────────────────────────────────────────────────┐ │
              │   │         COMPLIANCE ENGINE (Pure Python)           │ │
              │   │  GSTR-3B · GSTR-1 · ITC Rules · RCM Detection   │ │
              │   └──────────────────────────────────────────────────┘ │
              └────────────────────────────────┬───────────────────────┘
                                               │
                        ┌──────────────────────┴────────────────────┐
                        │                                            │
                        ▼                                            ▼
          ┌─────────────────────────┐              ┌────────────────────────────┐
          │      PostgreSQL DB       │              │      CA DASHBOARD           │
          │  8 ACID-compliant tables │              │   React · TypeScript        │
          │  users · invoices        │              │   Recharts · Vercel         │
          │  gst_ledger · alerts     │              │   Live data · PDF export   │
          │  ca_partners · gstr2b   │              └────────────────────────────┘
          └─────────────────────────┘
```

---

## 📱 WhatsApp Bot — Features

| Feature | What It Does |
|---|---|
| 📸 **Invoice OCR** | Extracts all fields from blurry real-world Indian invoices in < 20s |
| 🧠 **AI Classification** | Shows category + confidence + ITC *before* you confirm — zero surprise |
| 🔁 **Duplicate Detection** | Flags if you're uploading the same invoice twice |
| 🏦 **Bank PDF Parser** | Reads HDFC, SBI, ICICI, Axis, Kotak statements automatically |
| 📆 **Monthly GST Summary** | Type "summary" → get your ITC balance for the month |
| ⏰ **Deadline Reminders** | Automated alerts at 7, 3, and 1 day before GSTR deadlines |
| ✏️ **Correction Loop** | Low-confidence invoices show a correction dropdown — your fixes train the model |

---

## 🧠 AI Classification Engine

```
Input: "SUGAR KATTA 50KG · INVOICE #A-1042 · GSTIN 24XXXXX"
                          │
                          ▼
         ┌────────────────────────────────┐
         │   meet136/indicbert-gst        │
         │   Fine-tuned on 1,995 real     │
         │   Indian SME transactions      │
         └────────────────┬───────────────┘
                          │
              ┌───────────┴────────────┐
              ▼                        ▼
      Category: Food            Confidence: 94%
      (Blocked ITC ⛔)          Keywords: SUGAR, KATTA, 50KG
```

**7 GST Categories:**

```
  ✅ Capital Goods     ✅ Services          ✅ Mixed
  ✅ Other             ⚠️  Exempt           ⛔ Food & Beverages (Section 17(5) Blocked)
  ⛔ Blocked           
```

- **Section 17(5) auto-detection** — ineligible ITC flagged before it's ever claimed
- **F1 Score: 1.00** across all 7 categories on validation set
- **User correction loop** — corrections stored, model improves over time
- Classification runs **at scan time**, not after save — zero added latency

---

## 📊 CA Dashboard — Features

### Core Views
| Page | What You Get |
|---|---|
| 🏠 **Dashboard** | ITC totals, pending invoice count, client risk overview, AI classification breakdown card |
| 👥 **Clients** | All clients with ITC this month, invoice count, compliance status, risk score |
| 📄 **Invoices** | Full invoice list with AI confidence bars, keyword display, approve/reject actions, multi-client filter |
| 🤖 **AI Insights** | Classification breakdown by category, avg confidence, blocked vs eligible ITC analysis |
| ⚙️ **Admin Panel** | Revenue metrics, all users, system health, MRR estimation |

### Power Features
```
✅  Approve / Reject invoices individually or in bulk
✅  AI confidence bar on every invoice row (green ≥85%, yellow ≥65%, red <65%)
✅  AI reasoning display — keywords that triggered the classification
✅  ITC Trend chart (monthly, live from real DB)
✅  Client Risk Distribution pie chart
✅  WhatsApp Activity Feed
✅  AI Deadline Risk predictor
✅  ITC Leakage Report (Section 17(5) analysis)
✅  Supplier GSTIN risk analysis
✅  Invoice Anomaly Detection (flags invoices >2.5× avg value)
✅  Export to CSV
✅  Export GSTR-3B ready JSON (official GST portal format)
✅  Export Filing Summary PDF (ReportLab)
✅  Send WhatsApp reminder to client with one click
✅  Add clients manually with auto WhatsApp welcome message
```

---

## ⚖️ Compliance Engine

```python
# 100% pure Python. Zero AI calls. Hardcoded from the GST Act.
# Never wrong. Never hallucinates. Never needs an API key.

✅  GSTR-3B deadline calculation
✅  GSTR-1 deadline calculation  
✅  ITC eligibility rules enforcement (Section 17(5))
✅  RCM (Reverse Charge Mechanism) detection
✅  Automated alerts at 7, 3, 1 days before deadlines
```

---

## 🤖 ML Stack

| Component | Model | Training | Purpose |
|---|---|---|---|
| **OCR** | `nvidia/nemotron-nano-12b-v2-vl` | — | Invoice field extraction |
| **Classifier v1** | `facebook/bart-large-mnli` | Zero-shot | Baseline |
| **Classifier v2** | [`meet136/indicbert-gst-classifier`](https://huggingface.co/meet136/indicbert-gst-classifier) | 1,995 real SME transactions | Production |

---

## 📊 Numbers That Matter

```
┌─────────────────────┬──────────────────────────────────┐
│ OCR Accuracy        │ 87.5% on blurry real invoices    │
│ Classifier F1       │ 1.00 across all 7 GST categories │
│ WhatsApp Response   │ < 20 seconds end-to-end          │
│ Cost per user       │ ₹24/month                        │
│ Gross Margin        │ 92% at 500 users                 │
│ Market Size         │ 8 crore Indian SMEs              │
│ Addressable Pain    │ ₹2,000–₹5,000/user/month         │
└─────────────────────┴──────────────────────────────────┘
```

---

## 🗄️ Database Schema

```
8 ACID-compliant PostgreSQL tables

users          → phone · business_name · gstin · ca_id · state_code
invoices       → user_id · seller_gstin · invoice_no · date · taxable_amt
               → cgst · sgst · igst · status · ai_category · ai_confidence
               → ai_keywords · user_corrected
gst_ledger     → user_id · period · total_purchases · itc_available · net_liability
filing_history → user_id · period · gstr_type · filed_at · status
alerts         → user_id · type · message · due_date · resolved
ca_partners    → name · email · password_hash · created_at
transactions   → user_id · amount · type · description · created_at
gstr2b_cache   → user_id · period · raw_json · fetched_at
```

---

## 🛠️ Tech Stack

```
Backend         FastAPI · PostgreSQL · SQLAlchemy · Pydantic · APScheduler · ReportLab
Frontend        React · TypeScript · Tailwind CSS · Recharts · shadcn/ui
AI / ML         OpenRouter VLM · HuggingFace Inference API · IndicBERT (fine-tuned)
Infra           Render (backend + DB) · Vercel (frontend) · Twilio WhatsApp API
```

---

## 📁 Repository Structure

```
Vyapaar-Bandhu/
├── backend/
│   ├── app/
│   │   ├── main.py                    # Entry point + APScheduler
│   │   ├── routes/
│   │   │   ├── whatsapp.py            # Twilio webhook handler
│   │   │   ├── dashboard.py           # All CA dashboard API endpoints
│   │   │   ├── auth.py                # CA login / JWT
│   │   │   └── compliance.py          # Filing deadlines + ITC rules
│   │   ├── services/
│   │   │   ├── invoice_service.py     # Save invoices + ITC ledger updates
│   │   │   ├── ocr_service.py         # VLM invoice extraction
│   │   │   ├── classification_service.py  # IndicBERT inference
│   │   │   └── gstin_validator.py     # Supplier GSTIN verification
│   │   └── models/
│   │       └── base.py                # SQLAlchemy models (all 8 tables)
│   └── requirements.txt
│
└── vyapaarbandhu-ca-elite/
    ├── src/
    │   ├── pages/
    │   │   ├── Dashboard.tsx          # Main overview + KPIs
    │   │   ├── Clients.tsx            # Client list + risk scores
    │   │   ├── InvoicesPage.tsx       # Invoice table + approve/reject
    │   │   ├── AIInsights.tsx         # Classification analytics
    │   │   └── Admin.tsx              # System metrics + user management
    │   ├── components/
    │   │   ├── AppLayout.tsx          # Sidebar + navigation
    │   │   └── ui/                    # shadcn/ui components
    │   └── lib/
    │       └── api.ts                 # Typed API client
    └── package.json
```

---

## 🚀 Run Locally

**Backend:**
```bash
git clone https://github.com/meetmehta136/Vyapaar-Bandhu
cd backend
pip install -r requirements.txt
cp .env.example .env       # Add OPENROUTER_API_KEY, TWILIO creds, etc.

docker run --name vyapaar-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5433:5432 -d postgres

uvicorn app.main:app --reload
```

**Frontend:**
```bash
cd vyapaarbandhu-ca-elite
npm install
echo "VITE_API_URL=https://vyapaar-bandhu-h53q.onrender.com" > .env
npm run dev
```

**Required env vars:**
```
DATABASE_URL=postgresql://...
OPENROUTER_API_KEY=...
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
JWT_SECRET=...
DEFAULT_CA_ID=1
```

---

## 🌐 Live Links

| | |
|---|---|
| 🌍 Website | https://vyapaar-bandhu-web.vercel.app/ |
| 📡 API Docs | https://vyapaar-bandhu-h53q.onrender.com/docs |
| 📊 CA Dashboard | https://vyapaar-bandhu.vercel.app |
| 🤗 ML Model | https://huggingface.co/meet136/indicbert-gst-classifier |

---

## 📬 Contact

**GitHub:** [@meetmehta136](https://github.com/meetmehta136)  
**HuggingFace:** [meet136](https://huggingface.co/meet136)  
**Model:** [meet136/indicbert-gst-classifier](https://huggingface.co/meet136/indicbert-gst-classifier)

---

<div align="center">

**Built in 8 weeks. Solo. For 8 crore businesses that deserve better.**

*VyapaarBandhu — Aapka Digital CA* 🤝

</div>