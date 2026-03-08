import requests
import os
from dotenv import load_dotenv

load_dotenv()

HF_API_KEY = os.getenv("HF_API_KEY")

# Section 17(5) blocked categories under GST
BLOCKED_CATEGORIES = {
    "Food & Beverage":      {"blocked": True,  "reason": "Section 17(5)(b) — food/beverages"},
    "Club Membership":      {"blocked": True,  "reason": "Section 17(5)(b) — club membership"},
    "Health & Fitness":     {"blocked": True,  "reason": "Section 17(5)(b) — health services"},
    "Personal Vehicle":     {"blocked": True,  "reason": "Section 17(5)(a) — motor vehicle personal use"},
    "Travel & Hotel":       {"blocked": False, "reason": "Eligible if for business travel"},
    "Office Supplies":      {"blocked": False, "reason": "Fully eligible"},
    "Electronics":          {"blocked": False, "reason": "Capital goods — fully eligible"},
    "Furniture":            {"blocked": False, "reason": "Capital goods — fully eligible"},
    "Raw Materials":        {"blocked": False, "reason": "Inputs — fully eligible"},
    "Professional Services":{"blocked": False, "reason": "Business services — eligible"},
    "Pharmaceuticals":      {"blocked": False, "reason": "Business use — eligible"},
    "Clothing & Apparel":   {"blocked": True,  "reason": "Section 17(5) — personal use"},
    "Other":                {"blocked": False, "reason": "Verify manually"},
}

CANDIDATE_LABELS = list(BLOCKED_CATEGORIES.keys())


def classify_invoice_description(description: str) -> dict:
    if not description or len(description.strip()) < 3:
        return {"category": "Other", "confidence": 0, "itc_blocked": False, "reason": "No description"}

    print(f"🧠 Classifying: {description[:80]}")

    headers = {
        "Authorization": f"Bearer {HF_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "inputs": description,
        "parameters": {
            "candidate_labels": CANDIDATE_LABELS,
            "multi_label": False
        }
    }

    try:
        response = requests.post(
            "https://router.huggingface.co/hf-inference/models/facebook/bart-large-mnli",
            headers=headers,
            json=payload,
            timeout=30
        )

        print(f"📥 HF status: {response.status_code}")

        if response.status_code == 503:
            print("⏳ Model loading, using fallback...")
            return classify_with_keywords(description)

        if response.status_code != 200:
            print(f"❌ HF error: {response.text[:200]}")
            return classify_with_keywords(description)

        result = response.json()

        if isinstance(result, dict) and "error" in result:
            print(f"❌ HF error: {result['error']}")
            return classify_with_keywords(description)

        top_label = result[0]["label"]
        top_score = result[0]["score"]

        category_info = BLOCKED_CATEGORIES[top_label]

        print(f"✅ Category: {top_label} | Score: {top_score:.2f} | Blocked: {category_info['blocked']}")

        return {
            "category":    top_label,
            "confidence":  round(top_score, 3),
            "itc_blocked": category_info["blocked"],
            "reason":      category_info["reason"],
            "all_scores":  {r["label"]: round(r["score"], 3) for r in result[:3]}
        }

    except Exception as e:
        print(f"❌ Classification error: {e}")
        return classify_with_keywords(description)


def classify_with_keywords(description: str) -> dict:
    desc = description.lower()

    rules = [
        (["lunch", "dinner", "breakfast", "food", "meal", "restaurant", "snack", "tea", "coffee", "catering", "bhojan"], "Food & Beverage"),
        (["laptop", "computer", "mobile", "phone", "tablet", "monitor", "printer", "scanner", "camera", "dell", "hp", "lenovo"], "Electronics"),
        (["chair", "table", "desk", "furniture", "sofa", "shelf", "cabinet", "rack", "almirah"], "Furniture"),
        (["car", "vehicle", "bike", "scooter", "petrol", "diesel", "fuel", "automobile", "gaadi"], "Personal Vehicle"),
        (["hotel", "flight", "train", "travel", "ticket", "accommodation", "lodging", "yatra"], "Travel & Hotel"),
        (["medicine", "tablet", "capsule", "pharma", "drug", "injection", "medical", "health"], "Pharmaceuticals"),
        (["gym", "fitness", "yoga", "spa", "massage", "wellness", "club", "membership"], "Health & Fitness"),
        (["shirt", "pant", "cloth", "uniform", "dress", "fabric", "textile", "garment", "kapda"], "Clothing & Apparel"),
        (["paper", "pen", "pencil", "stationery", "stapler", "file", "folder", "office supply"], "Office Supplies"),
        (["rice", "wheat", "dal", "oil", "sugar", "flour", "grain", "moong", "atta", "chawal"], "Raw Materials"),
        (["consulting", "legal", "accounting", "audit", "service", "professional", "advisory"], "Professional Services"),
    ]

    for keywords, category in rules:
        if any(kw in desc for kw in keywords):
            info = BLOCKED_CATEGORIES[category]
            return {
                "category":    category,
                "confidence":  0.85,
                "itc_blocked": info["blocked"],
                "reason":      info["reason"] + " (keyword match)",
                "all_scores":  {}
            }

    return {
        "category":    "Other",
        "confidence":  0.60,
        "itc_blocked": False,
        "reason":      "Could not classify — verify manually",
        "all_scores":  {}
    }


def classify_invoice(invoice_fields: dict) -> dict:
    description = (
        invoice_fields.get("description", {}).get("value") or
        invoice_fields.get("item_name", {}).get("value") or
        invoice_fields.get("product", {}).get("value") or
        "Business purchase invoice"
    )

    result = classify_invoice_description(description)

    total_tax = (
        (invoice_fields.get("cgst", {}).get("value") or 0) +
        (invoice_fields.get("sgst", {}).get("value") or 0) +
        (invoice_fields.get("igst", {}).get("value") or 0)
    )

    itc_eligible = 0 if result["itc_blocked"] else total_tax
    itc_blocked  = total_tax if result["itc_blocked"] else 0

    result["total_tax"]    = round(total_tax, 2)
    result["itc_eligible"] = round(itc_eligible, 2)
    result["itc_blocked"]  = round(itc_blocked, 2)

    return result