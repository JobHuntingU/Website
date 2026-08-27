"""
FastAPI server for the Job Hunting U RAG chatbot.
"""

import os

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import rag

load_dotenv()

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


@app.get("/api/chatbot/health")
def health():
    gemini_key_present = bool(os.getenv("GEMINI_API_KEY"))
    return {"status": "ok", "gemini_api_key_configured": gemini_key_present}


@app.post("/api/chatbot/chat", response_model=ChatResponse)
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
