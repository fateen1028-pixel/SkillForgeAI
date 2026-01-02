import os
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from app.core.config import settings

load_dotenv()

def get_gemini_llm():
    return ChatGoogleGenerativeAI(
        model=settings.GEMINI_MODEL,
        temperature=0.2,
        response_mime_type="application/json",
        google_api_key=settings.GOOGLE_API_KEY or os.getenv("GOOGLE_API_KEY")
    )
    