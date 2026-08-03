"""
Airtable integration for storing chatbot leads (name, email, phone,
the question they asked, and an optional resume attachment).
"""

import base64
import os

import requests
from dotenv import load_dotenv

load_dotenv()

AIRTABLE_API_KEY = os.getenv("AIRTABLE_API_KEY")
AIRTABLE_BASE_ID = os.getenv("AIRTABLE_BASE_ID")
AIRTABLE_TABLE_NAME = os.getenv("AIRTABLE_TABLE_NAME", "Leads")

RECORDS_URL = f"https://api.airtable.com/v0/{AIRTABLE_BASE_ID}/{AIRTABLE_TABLE_NAME}"


def _headers() -> dict:
    if not AIRTABLE_API_KEY or not AIRTABLE_BASE_ID:
        raise RuntimeError(
            "AIRTABLE_API_KEY and AIRTABLE_BASE_ID must be set in .env"
        )
    return {
        "Authorization": f"Bearer {AIRTABLE_API_KEY}",
        "Content-Type": "application/json",
    }


def create_lead(name: str, email: str, phone: str, question_asked: str = "") -> str:
    """Create a lead record in Airtable. Returns the new record's ID."""
    payload = {
        "fields": {
            "Name": name,
            "Email": email,
            "Phone": phone,
            "Questions Asked": question_asked,
        }
    }
    response = requests.post(RECORDS_URL, json=payload, headers=_headers(), timeout=15)
    response.raise_for_status()
    return response.json()["id"]


def attach_resume(record_id: str, filename: str, content_type: str, file_bytes: bytes) -> None:
    """Upload a resume file onto the Client_Resume attachment field of an
    existing lead record, using Airtable's content-upload endpoint."""
    upload_url = (
        f"https://content.airtable.com/v0/{AIRTABLE_BASE_ID}/{record_id}"
        "/Client_Resume/uploadAttachment"
    )
    payload = {
        "contentType": content_type,
        "filename": filename,
        "file": base64.b64encode(file_bytes).decode("utf-8"),
    }
    response = requests.post(upload_url, json=payload, headers=_headers(), timeout=30)
    response.raise_for_status()
