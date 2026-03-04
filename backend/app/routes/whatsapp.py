from fastapi import APIRouter, Request, Form
from fastapi.responses import PlainTextResponse
from twilio.twiml.messaging_response import MessagingResponse
import os

router = APIRouter(prefix="/whatsapp", tags=["WhatsApp"])


@router.post("/webhook")
async def whatsapp_webhook(
    request: Request,
    Body: str = Form(default=""),
    From: str = Form(default=""),
    NumMedia: str = Form(default="0"),
    MediaUrl0: str = Form(default=""),
    MediaContentType0: str = Form(default=""),
):
    """
    This is the endpoint Twilio calls every time
    Rameshbhai sends a WhatsApp message.
    
    Twilio sends form data with:
    - Body: text message content
    - From: sender's WhatsApp number
    - NumMedia: number of images/files attached
    - MediaUrl0: URL of first attached image
    """
    
    print(f"📱 Message from: {From}")
    print(f"📝 Body: {Body}")
    print(f"🖼️  Media count: {NumMedia}")
    
    # Detect message type
    if int(NumMedia) > 0 and "image" in MediaContentType0:
        message_type = "image"
    elif Body:
        message_type = "text"
    else:
        message_type = "unknown"
    
    print(f"📌 Type: {message_type}")
    
    # Route to correct handler
    if message_type == "image":
        reply = handle_image(MediaUrl0, From)
    elif message_type == "text":
        reply = handle_text(Body, From)
    else:
        reply = "Kripya ek message ya photo bhejiye."
    
    # Send reply back via Twilio
    response = MessagingResponse()
    response.message(reply)
    return PlainTextResponse(str(response), media_type="application/xml")


def handle_text(body: str, sender: str) -> str:
    """Handle text messages"""
    body_lower = body.lower().strip()
    
    if any(word in body_lower for word in ["hello", "hi", "namaste", "helo"]):
        return (
            "Namaste! 🙏 VyapaarBandhu mein aapka swagat hai!\n\n"
            "Main aapki GST compliance mein madad kar sakta hoon:\n"
            "1️⃣ Invoice ki photo bhejiye → ITC calculate karunga\n"
            "2️⃣ 'tax' likhiye → is mahine ka GST liability\n"
            "3️⃣ 'deadline' likhiye → filing dates\n\n"
            "Kya karna chahenge?"
        )
    
    elif any(word in body_lower for word in ["tax", "gst", "kitna", "liability"]):
        return (
            "📊 Aapka GST Status:\n"
            "Is mahine abhi tak koi invoice upload nahi hua.\n"
            "Invoice ki photo bhejiye — main turant calculate karunga! 📸"
        )
    
    elif any(word in body_lower for word in ["deadline", "date", "last date", "due"]):
        from app.services.compliance_engine import get_filing_deadlines
        from datetime import datetime
        period = datetime.now().strftime("%Y-%m")
        deadlines = get_filing_deadlines(period)
        return (
            f"📅 Filing Deadlines:\n"
            f"GSTR-1: {deadlines['gstr1_deadline']} "
            f"({deadlines['days_to_gstr1']} din baaki)\n"
            f"GSTR-3B: {deadlines['gstr3b_deadline']} "
            f"({deadlines['days_to_gstr3b']} din baaki)\n\n"
            f"Waqt par file karein — penalty se bachein! ✅"
        )
    
    else:
        return (
            "Samajh nahi aaya. 😊\n"
            "'hello' likhiye shuru karne ke liye\n"
            "Ya invoice ki photo bhejiye!"
        )


def handle_image(media_url: str, sender: str) -> str:
    """Handle image messages — OCR pipeline comes here in Week 4"""
    return (
        "📸 Photo mil gayi! Processing ho rahi hai...\n"
        "Thoda intezaar karein — 10 seconds mein result aayega! ⏳\n\n"
        "(OCR pipeline Week 4 mein add hoga)"
    )