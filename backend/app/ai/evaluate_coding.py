from app.schemas.ai_evaluation import AIEvaluationResult
from app.domain.task_context import TaskContext
# from app.ai.gemini_client import get_gemini_llm
from app.ai.groq_client import get_groq_llm
from app.ai.utils import normalize_llm_content
from app.core.config import settings
from langchain_core.messages import HumanMessage
import json

PROMPT_VERSION = "2.5.0"

def evaluate_coding(
    *,
    code: str,
    language: str,
    context: TaskContext,
) -> AIEvaluationResult:
    """
    AI evaluation for coding tasks.
    Context is mandatory.
    """

    # llm = get_gemini_llm()
    llm = get_groq_llm()
    model_name = settings.GROQ_MODEL # or settings.GEMINI_MODEL if using gemini

    prompt = f"""
You are evaluating a coding task.

Skill: {context.skill}
Difficulty: {context.difficulty}

Rules:
- Return ONLY valid JSON
- No markdown
- No explanations

JSON schema:
{{
  "passed": boolean,
  "score": float (0.0-1.0),
  "confidence": float (0.0-1.0),
  "feedback": "string",
  "mistakes": ["string"],
  "detected_concepts": ["string"],
  "explanation": "string"
}}

Scoring Guide:
- 1.0: Perfect solution. Correct, efficient, clean.
- 0.8-0.9: Correct but minor issues (style, variable names).
- 0.6-0.7: Mostly correct logic, but fails some edge cases or has small bugs. (Partial Credit)
- 0.4-0.5: Right idea but wrong implementation.
- 0.0-0.3: Completely incorrect or irrelevant.

User code ({language}):
{code}
"""

    response = llm.invoke([HumanMessage(content=prompt)])
    raw = normalize_llm_content(response.content)

    try:
        data = json.loads(raw)
        return AIEvaluationResult(
            passed=data["passed"],
            score=data["score"],
            feedback=data["feedback"],
            confidence=data.get("confidence", 1.0),
            detected_concepts=data.get("detected_concepts", []),
            mistakes=data.get("mistakes", []),
            explanation=data.get("explanation"),
            model_name=model_name,
            model_version="1.0.0",
            prompt_version=PROMPT_VERSION,
            temperature=0.0
        )
    except Exception as e:
        raise RuntimeError(
            f"Invalid JSON from coding evaluator.\nRaw:\n{raw}"
        ) from e
