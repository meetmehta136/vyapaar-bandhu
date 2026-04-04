from fastapi import APIRouter
from app.services.compliance_engine import (
    check_itc_eligibility,
    calculate_gst_liability,
    calculate_penalty,
    get_filing_deadlines
)

router = APIRouter(prefix="/compliance", tags=["Compliance"])


@router.get("/itc/{category}")
def itc_check(category: str):
    return check_itc_eligibility(category)


@router.get("/deadlines/{period}")
def deadlines(period: str):
    return get_filing_deadlines(period)


@router.get("/penalty/{return_type}/{days_late}/{tax_liability}")
def penalty(return_type: str, days_late: int, tax_liability: float):
    return calculate_penalty(return_type, days_late, tax_liability)


@router.post("/liability")
def liability(transactions: list):
    return calculate_gst_liability(transactions)


@router.get("/gstr3b-json/{period}")
def generate_gstr3b(period: str, gstin: str = ""):
    """
    Generate GSTR-3B JSON ready to upload on GST portal.
    period format: YYYY-MM  e.g. 2025-11
    """
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
        db.close()