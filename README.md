# VyapaarBandhu 🤝
> AI-Powered GST Compliance Assistant for Indian Small Businesses

[![Live API](https://img.shields.io/badge/API-Live-success)](https://vyapaar-bandhu.onrender.com/docs)
[![Dashboard](https://img.shields.io/badge/Dashboard-Live-blue)](https://vyapaarbandhu-ca-elite.vercel.app)
[![Built Solo](https://img.shields.io/badge/Built-Solo%208%20Weeks-orange)]()

## 🎯 Problem
8 crore Indian SMEs spend ₹2,000–₹5,000/month on basic GST compliance. Missing a deadline = ₹50/day penalty. Most shopkeepers don't have an accountant on payroll.

## 💡 Solution
WhatsApp-native GST compliance — send an invoice photo, get ITC calculated instantly. No app to install. Zero learning curve.

## 🏗️ Architecture
```
WhatsApp → Twilio → FastAPI Backend → PostgreSQL
                         ↓
              OpenRouter VLM (OCR)
              HuggingFace NLP (Classification)
              Compliance Engine (Pure Python)
                         ↓
              CA Dashboard (React + Vercel)
```

## ✨ Features
- 📱 **WhatsApp Bot** — invoice OCR in under 20 seconds
- 🧠 **AI Classification** — Section 17(5) ITC eligibility detection  
- ⚖️ **Compliance Engine** — 100% pure Python, zero AI calls, hardcoded from GST Act
- 🏦 **Bank PDF Parser** — HDFC, SBI, ICICI, Axis, Kotak
- 📊 **CA Dashboard** — traffic light system, AI insights, filing PDFs
- 🔍 **ITC Leakage Detection** — flags blocked category invoices automatically

## 🤖 ML Stack
| Component | Model | Purpose |
|---|---|---|
| OCR | nvidia/nemotron-nano-12b-v2-vl | Invoice field extraction |
| Classification | facebook/bart-large-mnli | Zero-shot ITC category detection |
| Fine-tuned | meetmehta136/indicbert-gst-classifier | Indian SME transaction classifier |

## 📊 Performance
- OCR Accuracy: **87.5%** on real blurry Indian invoices
- WhatsApp response: **< 20 seconds**
- Cost per user: **₹24/month**
- Gross margin: **92%** at 500 users

## 🛠️ Tech Stack
- **Backend:** FastAPI, PostgreSQL, SQLAlchemy, Pydantic
- **Frontend:** React, TypeScript, Tailwind, Recharts
- **AI/ML:** OpenRouter, HuggingFace, ai4bharat/indic-bert
- **Infra:** Render, Vercel, Twilio

## 🚀 Live Demo
- API Docs: https://vyapaar-bandhu.onrender.com/docs
- CA Dashboard: https://vyapaarbandhu-ca-elite.vercel.app

## 📦 Run Locally
```bash
git clone https://github.com/meetmehta136/vyapaar-bandhu
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## 🗄️ Database Schema
8 ACID-compliant tables: `users`, `invoices`, `gst_ledger`, `filing_history`, `alerts`, `ca_partners`

## 💰 Business Model
| Plan | Price | Target |
|---|---|---|
| Consumer | ₹299/month | Individual SMEs |
| CA Partner | ₹999/month | CA firms (40+ clients each) |

## 🏆 Built For
OceanLab X CHARUSAT Hacks 2026 · April 3–5
Meet Mehta (Dhruv) · CHARUSAT University

## 📬 Contact
- GitHub: [@meetmehta136](https://github.com/meetmehta136)
- HuggingFace: [meetmehta136](https://huggingface.co/meetmehta136)
