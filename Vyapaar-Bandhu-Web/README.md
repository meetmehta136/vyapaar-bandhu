# VyapaarBandhu — Landing Page

> **Live Site:** [https://vyapaar-bandhu-web.vercel.app/](https://vyapaar-bandhu-web.vercel.app/)

The official marketing & showcase landing page for **VyapaarBandhu** — a WhatsApp-native GST compliance automation platform built for Indian small businesses and CA firms.

---

## 📌 What This Repo Is

This is the **static landing page** for the VyapaarBandhu project. It is a single-page HTML/CSS/JS site with no build step or framework dependency — just open `index.html` in a browser.

> For the actual CA Elite dashboard (React + TypeScript), see → [Vyapaar-Bandhu](https://github.com/meetmehta136/Vyapaar-Bandhu)

---

## 🌐 Live Links

| Resource | URL |
|---|---|
| 🌍 Landing Page | [vyapaar-bandhu-web.vercel.app](https://vyapaar-bandhu-web.vercel.app/) |
| 📊 CA Dashboard (Live Demo) | [vyapaarbandhu-ca-elite.vercel.app](https://vyapaarbandhu-ca-elite.vercel.app) |
| 🔌 Backend API Docs | [vyapaar-bandhu.onrender.com/docs](https://vyapaar-bandhu.onrender.com/docs) |
| 🤗 ML Model (HuggingFace) | [meet136/indicbert-gst-classifier](https://huggingface.co/meet136/indicbert-gst-classifier) |
| 💻 GitHub (Full Project) | [github.com/meetmehta136/Vyapaar-Bandhu](https://github.com/meetmehta136/Vyapaar-Bandhu) |

---

## ✨ Features of This Landing Page

- **Custom animated cursor** — cyan dot + ring, hover-aware
- **Particle canvas hero** — animated circuit-node background
- **Loader screen** — animated logo ring + progress bar
- **Sticky navbar** with glassmorphism blur on scroll
- **Infinite marquee** — scrolling tech highlights
- **Tab-based "How It Works"** section with real product screenshots
  - Send Invoice, OCR & Extract, Confirm & Classify, CA Reviews, File & Export
- **Video modal** — "See How It Works" button opens a demo video popup
- **CA Dashboard modal** — "CA Dashboard" button opens a scrollable image gallery of CA portal screenshots
- **Feature grid, Built & Live checklist, Tech Stack** columns
- **Honest Assessment** section — risk/mitigation cards
- **Scroll reveal animations** on all sections
- **Fully responsive** — mobile nav with hamburger menu

---

## 🗂️ Project Structure

```
Vyapaar-Bandhu-Web/
├── index.html          # Main landing page (single page)
├── css/
│   └── styles.css      # All styles — design system, components, animations
├── js/
│   └── main.js         # Cursor, loader, navbar, tabs, scroll reveal, canvas
└── assets/
    ├── images/
    │   ├── VBLogo.png
    │   ├── VBLogo-tr.png
    │   ├── SendInvoice.jpeg
    │   ├── ORC&Extract.jpeg
    │   ├── Confirm.jpeg
    │   ├── CA_Review1.png
    │   ├── CA_Review2.png
    │   ├── CA_Review3.png
    │   ├── FileExport.png
    │   ├── ui_ledger_mockup.png
    │   └── ui_whatsapp_bot.png
    └── DemoVideo.mp4   # (upload here when ready)
```

---

## 🚀 Running Locally

No build step needed. Just open the file directly:

```bash
# Option 1 — open directly
start index.html

# Option 2 — serve with any static server (e.g. VS Code Live Server)
# Right-click index.html → Open with Live Server
```

---

## 🎬 Adding the Demo Video

Place your video file at:

```
assets/DemoVideo.mp4
```

The "See How It Works" button will automatically load and play it in the modal.

---

## 🎨 Design System

| Token | Value |
|---|---|
| Background | `#050810` |
| Blue (primary) | `#0a6eff` |
| Cyan (accent) | `#00c8ff` |
| Font | Plus Jakarta Sans + Rajdhani |
| Border radius | `14px` |

---

## 🤖 About VyapaarBandhu (the Product)

VyapaarBandhu lets a shopkeeper **photograph a purchase invoice, send it on WhatsApp, and receive ITC calculated, RCM flagged, and a GSTR-3B JSON generated — in under 20 seconds.**

### Key Stats
- **87.5%** OCR accuracy on real blurry Indian invoices
- **<20s** end-to-end WhatsApp response time
- **₹24/month** cost per user at scale
- **1 CA firm = 40–80 users** (CA-led distribution model)

### Tech Stack
- **Backend:** FastAPI · PostgreSQL · SQLAlchemy · Twilio WhatsApp API · Render
- **Frontend:** React · TypeScript · Tailwind CSS · Recharts · Vercel
- **AI/ML:** NVIDIA Nemotron 12B VLM · BART-large-mnli · Fine-tuned IndicBERT · HuggingFace

---

## 👤 Author

Built solo by **Meet Mehta**
- GitHub: [@meetmehta136](https://github.com/meetmehta136)
- HuggingFace: [meet136](https://huggingface.co/meet136)

---

*Confidential · April 2026 · Prepared by Meet Mehta*
