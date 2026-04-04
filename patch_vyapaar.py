"""
Vyapaar Bandhu — AI Moat Patch Script
Run: python patch_vyapaar.py
From: C:\\Users\\dhruv\\vyapaar-bandhu
"""

import os, sys

ROOT = r"C:\Users\dhruv\vyapaar-bandhu"

def ok(msg):  print(f"   \033[92mOK\033[0m: {msg}")
def warn(msg):print(f"   \033[93mWARN\033[0m: {msg}")
def err(msg): print(f"   \033[91mFAIL\033[0m: {msg}"); sys.exit(1)
def log(msg): print(f"\n\033[96m>> {msg}\033[0m")

def read(path):
    if not os.path.exists(path): return None
    with open(path, "r", encoding="utf-8") as f: return f.read()

def write(path, content):
    with open(path, "w", encoding="utf-8") as f: f.write(content)

def patch(path, find, replace, label):
    c = read(path)
    if c is None:    warn(f"{label} — file not found: {path}"); return False
    if find not in c: warn(f"{label} — string not found (already patched or different version)"); return False
    write(path, c.replace(find, replace, 1))
    ok(label)
    return True


# ════════════════════════════════════════════════════════════════
# FILE 1: backend/app/routes/whatsapp.py
# ════════════════════════════════════════════════════════════════
log("Patching whatsapp.py ...")
WA = os.path.join(ROOT, "backend", "app", "routes", "whatsapp.py")
if not os.path.exists(WA): err(f"whatsapp.py not found at {WA}")

# 1-A: Update function signature
patch(WA,
    "def build_confirmation_message(fields: dict, gstin_status: str) -> str:",
    "def build_confirmation_message(fields: dict, gstin_status: str, ai_result: dict = None) -> str:",
    "1-A: build_confirmation_message signature"
)

# 1-B: Add AI block just before the return msg at end of build_confirmation_message
patch(WA,
    "    msg += \"'edit total' -> Total badlein\"\n    return msg",
    """    msg += \"'edit total' -> Total badlein\"

    # AI MOAT: show classification in WhatsApp confirmation
    if ai_result:
        cat      = ai_result.get("category", "General")
        conf     = int(ai_result.get("confidence", 0) * 100)
        keywords = ", ".join(ai_result.get("matched_keywords", []))
        cgst_v   = float((fields.get("cgst") or {}).get("value") or 0)
        sgst_v   = float((fields.get("sgst") or {}).get("value") or 0)
        igst_v   = float((fields.get("igst") or {}).get("value") or 0)
        itc_val  = round(cgst_v + sgst_v + igst_v, 2)
        blocked  = cat in ["Food & Beverages", "Food (Blocked)", "Personal Vehicle", "Blocked"]
        msg += "\\n\\nAI Classification:\\n"
        msg += "--------------------\\n"
        msg += f"Category: {cat}\\n"
        msg += f"Confidence: {conf}%\\n"
        if keywords:
            msg += f"Keywords: {keywords}\\n"
        if blocked:
            msg += "ITC: Blocked (Section 17(5))\\n"
        elif itc_val > 0:
            msg += f"ITC Eligible: Rs.{itc_val:,.2f}\\n"
    return msg""",
    "1-B: AI block in confirmation message"
)

# 1-C: apply_field_edit passes ai_result
patch(WA,
    "    msg += build_confirmation_message(fields, gstin_status)",
    "    msg += build_confirmation_message(fields, gstin_status, session.get(\"ai_result\"))",
    "1-C: apply_field_edit passes ai_result"
)

# 1-D: Run classification at scan time, store in session
patch(WA,
    '        PENDING_CONFIRMATIONS[sender] = {"fields": fields, "awaiting_edit": None}\n        msg = build_confirmation_message(fields, gstin_status)\n        send_whatsapp_message(sender, msg)',
    '''        # AI MOAT: classify at scan time so user sees it immediately
        ai_result = {"category": "General", "confidence": 0.0, "matched_keywords": []}
        try:
            from app.services.classification_service import classify_invoice
            raw = classify_invoice(fields)
            if isinstance(raw, dict):
                ai_result = raw
            elif raw:
                ai_result = {
                    "category":         getattr(raw, "category", "General"),
                    "confidence":       float(getattr(raw, "confidence", 0.0)),
                    "matched_keywords": list(getattr(raw, "matched_keywords", [])),
                }
        except Exception as _e:
            print(f"Classification error (non-fatal): {_e}")

        PENDING_CONFIRMATIONS[sender] = {"fields": fields, "awaiting_edit": None, "ai_result": ai_result}
        msg = build_confirmation_message(fields, gstin_status, ai_result)
        send_whatsapp_message(sender, msg)''',
    "1-D: Classify at scan time, store in session"
)

# 1-E: process_confirmed_invoice — use stored ai_result instead of background thread
patch(WA,
    '''    from app.services.invoice_service import save_invoice
    from app.services.classification_service import classify_invoice

    # Save invoice first — fast DB operation
    db_result = save_invoice(sender, fields)

    # Run classification in background — don't block reply
    threading.Thread(target=classify_invoice, args=(fields,), daemon=True).start()

    # Use tax type as category placeholder
    category = "GST Purchase"''',
    '''    from app.services.invoice_service import save_invoice

    # AI MOAT: use classification already done at scan time
    ai_result = data.get("ai_result", {"category": "General", "confidence": 0.0, "matched_keywords": []})
    category  = ai_result.get("category", "General")
    conf_pct  = int(ai_result.get("confidence", 0) * 100)
    blocked   = category in ["Food & Beverages", "Food (Blocked)", "Personal Vehicle", "Blocked"]

    db_result = save_invoice(sender, fields, ai_category=category, ai_confidence=ai_result.get("confidence", 0))''',
    "1-E: Use stored classification in process_confirmed_invoice"
)

# 1-F: Insert itc var computation before the reply message
patch(WA,
    '    msg = "✅ Invoice save ho gayi!\\n\\n"',
    '''    cgst_v    = float((fields.get("cgst") or {}).get("value") or 0)
    sgst_v    = float((fields.get("sgst") or {}).get("value") or 0)
    igst_v    = float((fields.get("igst") or {}).get("value") or 0)
    total_itc = round(cgst_v + sgst_v + igst_v, 2)

    msg = "✅ Invoice save ho gayi!\\n\\n"''',
    "1-F: ITC vars before save reply"
)

# 1-G: Replace old ITC reply block with AI-aware version
patch(WA,
    '''    if total_tax > 0:
        msg += f"\\n💰 ITC Mila: Rs.{round(total_tax, 2)}\\n"
        msg += f"({tax_type})\\n"
    if db_result.get("success"):
        msg += f"📊 Is Mahine Ka Total ITC: Rs.{db_result['itc_total']}\\n"
        msg += f"📄 Invoice ID: #{db_result['invoice_id']}\\n"
    else:
        msg += f"\\n⚠️ DB save mein error: {db_result.get('error', 'unknown')}\\n"

    msg += "\\nAur invoices bhejte rahein! 📄"
    return msg''',
    '''    msg += f"\\nCategory: {category} ({conf_pct}% AI confidence)\\n"
    if blocked:
        msg += "ITC: Blocked (Section 17(5))\\n"
        msg += "(Yeh expense ITC eligible nahi hai)\\n"
    elif total_itc > 0:
        msg += f"ITC Mila: Rs.{total_itc:,.2f}\\n"
    if db_result.get("success"):
        msg += f"Total ITC is mahine: Rs.{db_result['itc_total']:,.2f}\\n"
        msg += f"Invoice ID: #{db_result['invoice_id']}\\n"
    else:
        msg += f"DB save error: {db_result.get('error', 'unknown')}\\n"
    msg += "\\nAur invoices bhejte rahein!"
    return msg''',
    "1-G: AI-aware save reply"
)


# ════════════════════════════════════════════════════════════════
# FILE 2: backend/app/models/base.py — add AI columns
# ════════════════════════════════════════════════════════════════
log("Patching models/base.py ...")
MB = os.path.join(ROOT, "backend", "app", "models", "base.py")
if not os.path.exists(MB): err(f"models/base.py not found at {MB}")

mc = read(MB)
if "ai_category" in mc:
    warn("AI columns already in models/base.py")
else:
    AI_COLS = """
    # AI MOAT columns — added by patch script
    ai_category    = Column(String,  nullable=True)
    ai_confidence  = Column(Float,   nullable=True)
    ai_keywords    = Column(String,  nullable=True)
    user_corrected = Column(Boolean, default=False)"""

    anchors = [
        "    status = Column(",
        "    created_at = Column(",
        "    date = Column(",
        "    total_amt = Column(",
        "    taxable_amt = Column(",
    ]
    inserted = False
    for anc in anchors:
        idx = mc.find(anc)
        if idx >= 0:
            eol = mc.find("\n", idx)
            mc  = mc[:eol] + AI_COLS + mc[eol:]
            write(MB, mc)
            ok(f"AI columns inserted after: {anc.strip()}")
            inserted = True
            break
    if not inserted:
        mc += "\n# TODO add to Invoice class:\n# ai_category = Column(String, nullable=True)\n# ai_confidence = Column(Float, nullable=True)\n# ai_keywords = Column(String, nullable=True)\n# user_corrected = Column(Boolean, default=False)\n"
        write(MB, mc)
        warn("Anchor not found — added as TODO comment. Add columns manually to Invoice class.")


# ════════════════════════════════════════════════════════════════
# FILE 3: backend/app/services/invoice_service.py
# ════════════════════════════════════════════════════════════════
log("Patching invoice_service.py ...")
IS = os.path.join(ROOT, "backend", "app", "services", "invoice_service.py")
if not os.path.exists(IS): err(f"invoice_service.py not found at {IS}")

ic = read(IS)
if "ai_category" in ic:
    warn("invoice_service.py already has ai_category")
else:
    # Update signature
    for sig in [
        "def save_invoice(sender: str, fields: dict):",
        "def save_invoice(sender: str, fields: dict) ->",
    ]:
        if sig in ic:
            ic = ic.replace(sig, sig.replace(
                "sender: str, fields: dict",
                "sender: str, fields: dict, ai_category: str = None, ai_confidence: float = None"
            ), 1)
            ok("invoice_service.py: save_invoice signature updated")
            break
    else:
        warn("save_invoice signature not found — update manually")

    # Persist before db.add
    if "db.add(invoice)" in ic:
        ic = ic.replace(
            "db.add(invoice)",
            '# AI MOAT: persist classification\n        if ai_category:\n            invoice.ai_category   = ai_category\n            invoice.ai_confidence = ai_confidence\n        db.add(invoice)',
            1
        )
        ok("invoice_service.py: AI fields saved on invoice create")
    else:
        warn("db.add(invoice) not found — add ai fields manually before commit")

    write(IS, ic)


# ════════════════════════════════════════════════════════════════
# FILE 4: frontend/src/pages/InvoicesPage.tsx
# ════════════════════════════════════════════════════════════════
log("Patching InvoicesPage.tsx ...")
INV = os.path.join(ROOT, "vyapaarbandhu-ca-elite", "src", "pages", "InvoicesPage.tsx")
if not os.path.exists(INV): err(f"InvoicesPage.tsx not found at {INV}")

# 4-A: Add AI Details column header
patch(INV,
    '              <th className="py-3 px-3 text-left text-muted-foreground font-medium">Category</th>',
    '              <th className="py-3 px-3 text-left text-muted-foreground font-medium">Category</th>\n              <th className="py-3 px-3 text-left text-muted-foreground font-medium">AI Details</th>',
    "4-A: AI Details column header"
)

# 4-B: Replace category cell and add AI details cell
patch(INV,
    """                <td className="py-2.5 px-3">
                  <span className={cn('px-2 py-0.5 rounded-full text-[10px] font-medium', categoryColors[inv.aiCategory] || 'bg-muted text-muted-foreground')}>
                    {inv.aiCategory || 'General'}
                  </span>
                </td>""",
    """                <td className="py-2.5 px-3">
                  <span className={cn('px-2 py-0.5 rounded-full text-[10px] font-medium', categoryColors[inv.aiCategory] || 'bg-muted text-muted-foreground')}>
                    {inv.aiCategory || 'General'}
                  </span>
                </td>
                <td className="py-2.5 px-3 min-w-[140px]">
                  {inv.aiConfidence != null && (
                    <div className="flex items-center gap-1.5 mb-1">
                      <div className="w-14 h-1.5 rounded-full bg-muted overflow-hidden">
                        <div
                          className={cn('h-full rounded-full',
                            (inv.aiConfidence ?? 0) >= 0.85 ? 'bg-green-500' :
                            (inv.aiConfidence ?? 0) >= 0.65 ? 'bg-yellow-500' : 'bg-red-500'
                          )}
                          style={{ width: `${Math.round((inv.aiConfidence ?? 0) * 100)}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-muted-foreground">
                        {Math.round((inv.aiConfidence ?? 0) * 100)}%
                      </span>
                    </div>
                  )}
                  {inv.aiKeywords && (
                    <p className="text-[9px] text-muted-foreground truncate max-w-[130px]" title={inv.aiKeywords}>
                      {inv.aiKeywords}
                    </p>
                  )}
                  {inv.aiConfidence != null && (inv.aiConfidence ?? 1) < 0.85 && (
                    <select
                      className="text-[9px] border border-border rounded px-1 py-0.5 bg-background text-foreground mt-1 w-full"
                      defaultValue={inv.aiCategory ?? ''}
                      onChange={async (e) => {
                        const base = (import.meta as any).env?.VITE_API_URL || 'https://vyapaar-bandhu.onrender.com';
                        await fetch(`${base}/api/invoices/${inv.id}/correct`, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                          body: new URLSearchParams({ category: e.target.value })
                        });
                        refetch?.();
                      }}
                    >
                      {['Food','Capital Goods','Services','Exempt','Blocked','Mixed','Other'].map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  )}
                </td>""",
    "4-B: Category cell + AI Details cell with confidence bar + correction"
)


# ════════════════════════════════════════════════════════════════
# FILE 5: frontend/src/pages/DashboardPage.tsx
# ════════════════════════════════════════════════════════════════
log("Patching DashboardPage.tsx ...")
DASH = os.path.join(ROOT, "vyapaarbandhu-ca-elite", "src", "pages", "DashboardPage.tsx")
if not os.path.exists(DASH): err(f"DashboardPage.tsx not found at {DASH}")

patch(DASH,
    "    </AppLayout>\n  );\n};\n\nexport default DashboardPage;",
    """      {/* AI MOAT: Classification Breakdown */}
      <div className="card-surface p-5 mb-8">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-sm font-semibold text-foreground">AI Classification Breakdown</h3>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/20 text-primary-val font-bold">LIVE</span>
        </div>
        <p className="text-xs text-muted-foreground mb-4">Every invoice auto-classified by your fine-tuned IndicBERT model</p>
        {(() => {
          const catMap: Record<string, { count: number; itc: number }> = {};
          invoices.forEach((inv: any) => {
            const cat = inv.aiCategory || 'General';
            if (!catMap[cat]) catMap[cat] = { count: 0, itc: 0 };
            catMap[cat].count += 1;
            catMap[cat].itc   += inv.itc || 0;
          });
          const entries = Object.entries(catMap).sort((a, b) => b[1].itc - a[1].itc);
          const avgConf = invoices.length > 0
            ? Math.round(invoices.reduce((s: number, i: any) => s + (i.aiConfidence || 0), 0) / invoices.length * 100)
            : 0;
          if (entries.length === 0) return (
            <p className="text-xs text-muted-foreground text-center py-4">No invoices yet.</p>
          );
          return (
            <>
              <div className="flex gap-3 mb-4 flex-wrap">
                <div className="px-3 py-2 rounded-lg bg-muted text-xs">
                  <span className="text-muted-foreground">Avg confidence: </span>
                  <span className="font-semibold">{avgConf}%</span>
                </div>
                <div className="px-3 py-2 rounded-lg bg-muted text-xs">
                  <span className="text-muted-foreground">Categories: </span>
                  <span className="font-semibold">{entries.length}</span>
                </div>
              </div>
              <div className="space-y-2">
                {entries.map(([cat, data]) => {
                  const blocked = ['Food & Beverages','Food (Blocked)','Personal Vehicle','Blocked'].includes(cat);
                  return (
                    <div key={cat} className="flex items-center justify-between py-2 border-b border-border/40 last:border-0">
                      <div className="flex items-center gap-2">
                        <span className={cn('px-2 py-0.5 rounded-full text-[10px] font-medium',
                          blocked ? 'bg-destructive/20 text-destructive-val' : categoryColors[cat] || 'bg-muted text-muted-foreground')}>
                          {cat}
                        </span>
                        <span className="text-[10px] text-muted-foreground">{data.count} invoice{data.count !== 1 ? 's' : ''}</span>
                      </div>
                      <div className="text-right">
                        <div className={cn('text-xs font-semibold', blocked ? 'text-destructive-val line-through' : 'text-accent-val')}>
                          Rs.{data.itc.toLocaleString('en-IN')}
                        </div>
                        <div className="text-[10px] text-muted-foreground">{blocked ? 'blocked' : 'ITC'}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          );
        })()}
      </div>

    </AppLayout>
  );
};

export default DashboardPage;""",
    "5: AI Classification Breakdown card in Dashboard"
)


# ════════════════════════════════════════════════════════════════
# GIT: commit and push
# ════════════════════════════════════════════════════════════════
log("Git commit and push ...")
os.chdir(ROOT)
os.system("git add -A")
os.system('git commit -m "feat: surface AI moat in WhatsApp + dashboard\n\n- whatsapp.py: classify at scan time, show category/confidence/ITC in confirmation and save reply\n- models/base.py: ai_category, ai_confidence, ai_keywords, user_corrected columns\n- invoice_service.py: save_invoice persists AI fields\n- InvoicesPage.tsx: confidence bar, keywords, low-conf correction dropdown\n- DashboardPage.tsx: AI Classification Breakdown card"')
os.system("git push origin main")

print("\n")
print("=" * 60)
print("  PUSHED. Render + Vercel deploying (~2 min).")
print("=" * 60)
print("""
  REQUIRED AFTER DEPLOY — Render Shell tab:

  python -c "from app.core.database import engine; \\
from app.models.base import Base; \\
Base.metadata.create_all(engine); \\
print('Tables updated OK')"

  This adds 4 new AI columns to your live PostgreSQL.
  Without this the backend crashes on every invoice save.
""")