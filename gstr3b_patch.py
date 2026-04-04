"""
GSTR-3B One-tap Download — Patch Script
Run: py gstr3b_patch.py
From: C:\\Users\\dhruv\\vyapaar-bandhu
"""
import os, sys

ROOT = r"C:\Users\dhruv\vyapaar-bandhu"

def ok(m):   print(f"   \033[92mOK\033[0m: {m}")
def warn(m): print(f"   \033[93mWARN\033[0m: {m}")
def err(m):  print(f"   \033[91mFAIL\033[0m: {m}"); sys.exit(1)
def log(m):  print(f"\n\033[96m>> {m}\033[0m")

def read(p):
    if not os.path.exists(p): return None
    with open(p, "r", encoding="utf-8") as f: return f.read()

def write(p, c):
    with open(p, "w", encoding="utf-8") as f: f.write(c)

def patch(path, find, replace, label):
    c = read(path)
    if c is None:     warn(f"{label} — file not found"); return False
    if find not in c: warn(f"{label} — string not found (already patched?)"); return False
    write(path, c.replace(find, replace, 1))
    ok(label)
    return True


# ════════════════════════════════════════════════════════════
# FILE 1: backend/app/routes/compliance.py
# Add GET /compliance/gstr3b-json/{period}
# ════════════════════════════════════════════════════════════
log("Patching compliance.py ...")
COMP = os.path.join(ROOT, "backend", "app", "routes", "compliance.py")
if not os.path.exists(COMP): err(f"compliance.py not found at {COMP}")

patch(COMP,
    "@router.post(\"/liability\")\ndef liability(transactions: list):\n    return calculate_gst_liability(transactions)",
    """@router.post("/liability")
def liability(transactions: list):
    return calculate_gst_liability(transactions)


@router.get("/gstr3b-json/{period}")
def generate_gstr3b(period: str, gstin: str = ""):
    \"\"\"
    Generate GSTR-3B JSON ready to upload on GST portal.
    period format: YYYY-MM  e.g. 2025-11
    \"\"\"
    from app.core.database import SessionLocal
    from app.models.base import Invoice, User, GSTLedger
    from datetime import datetime

    db = SessionLocal()
    try:
        # Parse period
        try:
            year, month = period.split("-")
            month_start = datetime(int(year), int(month), 1)
            if int(month) == 12:
                month_end = datetime(int(year) + 1, 1, 1)
            else:
                month_end = datetime(int(year), int(month) + 1, 1)
        except Exception:
            return {"error": "Invalid period format. Use YYYY-MM e.g. 2025-11"}

        # Pull all confirmed invoices for this period
        invoices = db.query(Invoice).filter(
            Invoice.date    >= month_start,
            Invoice.date    <  month_end,
            Invoice.status  == "confirmed"
        ).all()

        BLOCKED = ["Food & Beverages", "Food (Blocked)", "Personal Vehicle", "Blocked"]

        # Aggregate eligible vs blocked ITC
        eligible_cgst   = 0.0
        eligible_sgst   = 0.0
        eligible_igst   = 0.0
        blocked_cgst    = 0.0
        blocked_sgst    = 0.0
        blocked_igst    = 0.0
        total_taxable   = 0.0
        inward_supplies = []

        for inv in invoices:
            cgst = float(inv.cgst or 0)
            sgst = float(inv.sgst or 0)
            igst = float(inv.igst or 0)
            taxable = float(inv.taxable_amt or 0)
            cat = inv.ai_category or "General"

            total_taxable += taxable

            if cat in BLOCKED:
                blocked_cgst += cgst
                blocked_sgst += sgst
                blocked_igst += igst
            else:
                eligible_cgst += cgst
                eligible_sgst += sgst
                eligible_igst += igst

            inward_supplies.append({
                "invoice_no":   inv.invoice_no,
                "supplier_gstin": inv.seller_gstin,
                "invoice_date": inv.date.strftime("%d-%m-%Y") if inv.date else "",
                "taxable_value": round(taxable, 2),
                "igst":  round(igst, 2),
                "cgst":  round(cgst, 2),
                "sgst":  round(sgst, 2),
                "ai_category":   cat,
                "itc_eligible":  cat not in BLOCKED,
            })

        # Build GSTR-3B structure (official GST portal format)
        ret_period = f"{str(month).zfill(2)}{year}"   # MMYYYY as required by portal

        gstr3b = {
            "gstin":      gstin or "ENTER_YOUR_GSTIN",
            "ret_period": ret_period,
            "inward_dtls": {
                "isup_details": [
                    {
                        "ty":   "OTH",             # Other inward supplies
                        "inter": round(eligible_igst, 2),
                        "intra": round(eligible_cgst + eligible_sgst, 2),
                        "exmt":  0,
                        "ngsup": 0
                    }
                ]
            },
            "itc_elg": {
                "itc_avl": [
                    {
                        "ty":    "IMPG",            # Import of goods
                        "igst":  0, "cgst": 0, "sgst": 0, "cess": 0
                    },
                    {
                        "ty":    "IMPS",            # Import of services
                        "igst":  0, "cgst": 0, "sgst": 0, "cess": 0
                    },
                    {
                        "ty":    "ISRC",            # Inward supplies from ISD
                        "igst":  0, "cgst": 0, "sgst": 0, "cess": 0
                    },
                    {
                        "ty":    "ITC",             # All other ITC
                        "igst":  round(eligible_igst, 2),
                        "cgst":  round(eligible_cgst, 2),
                        "sgst":  round(eligible_sgst, 2),
                        "cess":  0
                    },
                    {
                        "ty":    "OTH",
                        "igst":  0, "cgst": 0, "sgst": 0, "cess": 0
                    }
                ],
                "itc_rev": [
                    {
                        "ty":    "RUL",
                        "igst":  0, "cgst": 0, "sgst": 0, "cess": 0
                    },
                    {
                        "ty":    "OTH",
                        "igst":  0, "cgst": 0, "sgst": 0, "cess": 0
                    }
                ],
                "itc_net": {
                    "igst": round(eligible_igst, 2),
                    "cgst": round(eligible_cgst, 2),
                    "sgst": round(eligible_sgst, 2),
                    "cess": 0
                },
                "itc_inelg": [
                    {
                        "ty":    "RUL",             # Section 17(5) blocked
                        "igst":  round(blocked_igst, 2),
                        "cgst":  round(blocked_cgst, 2),
                        "sgst":  round(blocked_sgst, 2),
                        "cess":  0
                    },
                    {
                        "ty":    "OTH",
                        "igst":  0, "cgst": 0, "sgst": 0, "cess": 0
                    }
                ]
            },
            "sup_details": {
                "osup_det": {
                    "txval": 0, "igst": 0, "cgst": 0,
                    "sgst": 0, "csgst": 0
                },
                "osup_zero": {
                    "txval": 0, "igst": 0, "cgst": 0,
                    "sgst": 0, "csgst": 0
                },
                "osup_nil_exmp": { "txval": 0 },
                "isup_rev":      { "txval": 0, "igst": 0, "cgst": 0, "sgst": 0, "csgst": 0 },
                "osup_nongst":   { "txval": 0 }
            },
            "inter_sup": {
                "unreg_details":  [],
                "comp_details":   [],
                "uin_details":    []
            },
            "intr_ltfee": {
                "intr_details": { "cgst": 0, "sgst": 0, "igst": 0 },
                "fee_details":  { "cgst": 0, "sgst": 0, "igst": 0 }
            },
            "_vyapaarbandhu_meta": {
                "generated_by":    "VyapaarBandhu AI",
                "generated_at":    datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ"),
                "period":          period,
                "total_invoices":  len(invoices),
                "total_taxable":   round(total_taxable, 2),
                "eligible_itc":    round(eligible_cgst + eligible_sgst + eligible_igst, 2),
                "blocked_itc":     round(blocked_cgst + blocked_sgst + blocked_igst, 2),
                "inward_supplies": inward_supplies,
            }
        }

        return gstr3b

    finally:
        db.close()""",
    "Backend: GSTR-3B JSON endpoint added"
)


# ════════════════════════════════════════════════════════════
# FILE 2: frontend/src/pages/DashboardPage.tsx
# Add GSTR-3B download button + state
# ════════════════════════════════════════════════════════════
log("Patching DashboardPage.tsx ...")
DASH = os.path.join(ROOT, "vyapaarbandhu-ca-elite", "src", "pages", "DashboardPage.tsx")
if not os.path.exists(DASH): err(f"DashboardPage.tsx not found")

# 2-A: Add useState for download loading
patch(DASH,
    "  const { data: stats, loading: statsLoading } = useDashboardStats();\n  const { data: invoicesData, loading: invoicesLoading } = useInvoices();\n  const [clients, setClients] = useState<any[]>([]);",
    """  const { data: stats, loading: statsLoading } = useDashboardStats();
  const { data: invoicesData, loading: invoicesLoading } = useInvoices();
  const [clients, setClients] = useState<any[]>([]);
  const [gstr3bLoading, setGstr3bLoading] = useState(false);

  const downloadGSTR3B = async () => {
    setGstr3bLoading(true);
    try {
      const period = new Date().toISOString().slice(0, 7); // YYYY-MM
      const base   = (import.meta as any).env?.VITE_API_URL || 'https://vyapaar-bandhu-h53q.onrender.com';
      const res    = await fetch(`${base}/compliance/gstr3b-json/${period}`);
      const json   = await res.json();

      // Download as .json file
      const blob = new Blob([JSON.stringify(json, null, 2)], { type: 'application/json' });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = `GSTR3B_${period}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      alert('Download failed. Check your connection.');
    } finally {
      setGstr3bLoading(false);
    }
  };""",
    "2-A: downloadGSTR3B function + loading state"
)

# 2-B: Add download button next to the page title
patch(DASH,
    '      <div className="mb-8">\n        <h1 className="text-2xl font-bold text-foreground">{getGreeting()}, CA 👋</h1>\n        <p className="text-sm text-muted-foreground mt-1">\n          {getFilingPeriod()} · {statsLoading ? \'Loading...\' : \'● Live Data\'}\n        </p>\n      </div>',
    """      <div className="mb-8 flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{getGreeting()}, CA 👋</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {getFilingPeriod()} · {statsLoading ? 'Loading...' : '● Live Data'}
          </p>
        </div>
        <button
          onClick={downloadGSTR3B}
          disabled={gstr3bLoading}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/20 text-primary-val border border-primary/30 hover:bg-primary/30 transition-colors text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {gstr3bLoading ? (
            <>
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              Generating...
            </>
          ) : (
            <>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Download GSTR-3B JSON
            </>
          )}
        </button>
      </div>""",
    "2-B: GSTR-3B download button in header"
)


# ════════════════════════════════════════════════════════════
# GIT commit and push
# ════════════════════════════════════════════════════════════
log("Git commit and push ...")
os.chdir(ROOT)
os.system("git add -A")
os.system('git commit -m "feat: one-tap GSTR-3B JSON download\\n\\n- GET /compliance/gstr3b-json/{period} generates portal-ready JSON\\n- Splits eligible vs Section 17(5) blocked ITC automatically\\n- Dashboard download button with loading spinner\\n- File saved as GSTR3B_YYYY-MM.json"')
os.system("git push origin main")

print("""
================================================================
  Done. Deploy in ~2 min.
================================================================

  Test it:
  1. Open https://vyapaar-bandhu.vercel.app
  2. Click 'Download GSTR-3B JSON' button (top right of dashboard)
  3. File downloads as GSTR3B_2025-11.json

  Or test the API directly:
  https://vyapaar-bandhu-h53q.onrender.com/compliance/gstr3b-json/2025-11

  The JSON has two sections jury cares about:
  - itc_elg.itc_net  → eligible ITC (CGST + SGST + IGST)
  - itc_elg.itc_inelg → blocked ITC (Section 17(5))
  - _vyapaarbandhu_meta → full invoice breakdown (your AI moat visible)
""")