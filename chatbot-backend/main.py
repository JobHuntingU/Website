"""
FastAPI server for the Job Hunting U RAG chatbot.
"""

import os

from dotenv import load_dotenv
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import airtable_client
import rag

load_dotenv()

MAX_RESUME_SIZE_BYTES = 5 * 1024 * 1024  # 5 MB
ALLOWED_RESUME_TYPES = {
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
}

app = FastAPI(title="Job Hunting U Chatbot API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


class HistoryMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    message: str
    history: list[HistoryMessage] = []


class ChatResponse(BaseModel):
    response: str
    sources: list[str]
    success: bool


@app.get("/health")
def health():
    gemini_key_present = bool(os.getenv("GEMINI_API_KEY"))
    return {"status": "ok", "gemini_api_key_configured": gemini_key_present}


@app.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest):
    if not request.message or not request.message.strip():
        raise HTTPException(status_code=400, detail="message must not be empty")

    history = [msg.model_dump() for msg in request.history]

    try:
        result = rag.get_response(request.message, history)
    except Exception as exc:
        print(f"[main] unexpected error in /chat: {exc}")
        return ChatResponse(
            response=(
                "Sorry, something went wrong on our end. Please try again, "
                "or book a discovery call with Jerry directly."
            ),
            sources=[],
            success=False,
        )

    return ChatResponse(**result)


@app.post("/leads")
async def submit_lead(
    name: str = Form(...),
    email: str = Form(...),
    phone: str = Form(...),
    question: str = Form(""),
    resume: UploadFile | None = File(None),
):
    name = name.strip()
    email = email.strip()
    phone = phone.strip()

    if not name or not email or not phone:
        raise HTTPException(status_code=400, detail="name, email, and phone are required")
    if "@" not in email:
        raise HTTPException(status_code=400, detail="invalid email address")

    try:
        record_id = airtable_client.create_lead(name, email, phone, question)

        if resume is not None and resume.filename:
            resume_bytes = await resume.read()
            if len(resume_bytes) > MAX_RESUME_SIZE_BYTES:
                print(f"[leads] resume too large ({len(resume_bytes)} bytes) — skipped attachment")
            elif resume.content_type not in ALLOWED_RESUME_TYPES:
                print(f"[leads] unsupported resume type {resume.content_type} — skipped attachment")
            else:
                airtable_client.attach_resume(
                    record_id, resume.filename, resume.content_type, resume_bytes
                )

        print(f"[leads] saved to Airtable: {name} <{email}> ({phone})")
        return {"success": True}
    except Exception as exc:
        print(f"[leads] failed to save lead: {exc}")
        raise HTTPException(
            status_code=500,
            detail="Something went wrong saving your info. Please try again.",
        )
