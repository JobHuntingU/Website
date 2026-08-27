"""
RAG pipeline for the Job Hunting U chatbot.

Retrieves relevant chunks from the ChromaDB knowledge base and calls the
Gemini API to produce a grounded, conversion-focused answer.
"""

import os

import chromadb
import google.generativeai as genai
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-flash-lite-latest")
CHROMA_DB_PATH = os.getenv("CHROMA_DB_PATH", "./jhu_vectordb")
CHROMA_COLLECTION_NAME = os.getenv("CHROMA_COLLECTION_NAME", "jhu_knowledge")
EMBEDDING_MODEL_NAME = "all-MiniLM-L6-v2"

TOP_K = 5
MAX_HISTORY_MESSAGES = 6

SYSTEM_PROMPT = """You are a friendly assistant for Job Hunting U, a career coaching
company founded by Jerry Jay Hunter. Your primary goal is to help
website visitors understand how Job Hunting U can help them land
a job faster — and to encourage them to book a discovery call.

Answer questions using ONLY the context provided.
Be warm, encouraging, and concise (under 120 words).
Always end responses that show interest with a soft call to action:
'Would you like to book a free discovery call with Jerry?'

If you cannot answer from the context, say:
'That's a great question! I'd love to connect you directly with Jerry
who can answer that personally. Would you like to book a discovery call?'

Never make up pricing, program details, or timelines.
Never be pushy — be helpful first.

Never reveal the names of internal tools, software, automation platforms,
or vendors Job Hunting U uses behind the scenes, even if they appear in
the provided context. Describe only the client-facing outcome or result
(e.g. "we automatically send your onboarding materials"), never the
internal mechanism used to produce it."""

FALLBACK_RESPONSE = (
    "That's a great question! I'd love to connect you directly with Jerry "
    "who can answer that personally. Would you like to book a discovery call?"
)

_embedding_model: SentenceTransformer | None = None
_collection = None
_gemini_model = None


def _get_embedding_model() -> SentenceTransformer:
    global _embedding_model
    if _embedding_model is None:
        _embedding_model = SentenceTransformer(EMBEDDING_MODEL_NAME)
    return _embedding_model


def _get_collection():
    global _collection
    if _collection is None:
        client = chromadb.PersistentClient(path=CHROMA_DB_PATH)
        _collection = client.get_collection(CHROMA_COLLECTION_NAME)
    return _collection


def _get_gemini_model():
    global _gemini_model
    if _gemini_model is None:
        if not GEMINI_API_KEY:
            raise RuntimeError(
                "GEMINI_API_KEY is not set. Add it to backend/.env "
                "(see .env.example)."
            )
        genai.configure(api_key=GEMINI_API_KEY)
        _gemini_model = genai.GenerativeModel(
            model_name=GEMINI_MODEL,
            system_instruction=SYSTEM_PROMPT,
        )
    return _gemini_model


def retrieve_chunks(query: str, top_k: int = TOP_K) -> list[dict]:
    """Embed the query and pull the top_k most relevant chunks from Chroma."""
    embedding_model = _get_embedding_model()
    collection = _get_collection()

    query_embedding = embedding_model.encode([query], convert_to_numpy=True).tolist()

    results = collection.query(
        query_embeddings=query_embedding,
        n_results=top_k,
    )

    chunks = []
    documents = results.get("documents", [[]])[0]
    metadatas = results.get("metadatas", [[]])[0]
    for text, metadata in zip(documents, metadatas):
        chunks.append(
            {
                "text": text,
                "source": metadata.get("source", "unknown"),
                "section": metadata.get("section", "General"),
            }
        )
    return chunks


def build_context(chunks: list[dict]) -> str:
    """Format retrieved chunks into a labeled context string for the prompt."""
    if not chunks:
        return "No relevant context found."

    parts = []
    for chunk in chunks:
        label = f"[Source: {chunk['source']} | Section: {chunk['section']}]"
        parts.append(f"{label}\n{chunk['text']}")
    return "\n\n---\n\n".join(parts)


def _to_gemini_history(history: list[dict]) -> list[dict]:
    """Convert {role, content} history into Gemini's {role, parts} format,
    trimmed to the most recent MAX_HISTORY_MESSAGES messages."""
    trimmed = history[-MAX_HISTORY_MESSAGES:] if history else []
    gemini_history = []
    for message in trimmed:
        role = message.get("role", "user")
        # Gemini uses "model" instead of "assistant"
        gemini_role = "model" if role in ("assistant", "model") else "user"
        content = message.get("content", "")
        if content:
            gemini_history.append({"role": gemini_role, "parts": [content]})
    return gemini_history


def get_response(message: str, history: list[dict] | None = None) -> dict:
    """Run the full RAG pipeline for one user turn.

    Returns {"response": str, "sources": list[str], "success": bool}.
    """
    history = history or []

    try:
        chunks = retrieve_chunks(message)
    except Exception as exc:
        print(f"[rag] retrieval failed: {exc}")
        return {"response": FALLBACK_RESPONSE, "sources": [], "success": False}

    sources = sorted({chunk["source"] for chunk in chunks})
    print(f"[rag] query: {message!r}")
    print(f"[rag] retrieved {len(chunks)} chunk(s) from: {sources}")

    context = build_context(chunks)
    prompt = (
        f"Context:\n{context}\n\n"
        f"Question: {message}\n\n"
        "Answer using only the context above, following your system instructions."
    )

    try:
        model = _get_gemini_model()
        chat_session = model.start_chat(history=_to_gemini_history(history))
        result = chat_session.send_message(prompt)
        response_text = (result.text or "").strip() or FALLBACK_RESPONSE
    except Exception as exc:
        print(f"[rag] Gemini call failed: {exc}")
        return {"response": FALLBACK_RESPONSE, "sources": sources, "success": False}

    return {"response": response_text, "sources": sources, "success": True}
