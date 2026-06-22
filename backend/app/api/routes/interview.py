from fastapi import APIRouter, UploadFile, File
from app.models.interview_models import InterviewRequest
from app.services.evaluator import evaluate_answer

from app.database.connection import SessionLocal
from app.models.database_models import InterviewRecord
from app.services.llm_service import (
    generate_interview_question,
    generate_adaptive_question,
    generate_learning_roadmap,
    generate_resume_question,
    analyze_resume,
    evaluate_resume_answer
)

from pypdf import PdfReader
from io import BytesIO
import json

router = APIRouter()


def extract_resume_text(file_bytes):
    pdf_reader = PdfReader(BytesIO(file_bytes))

    resume_text = ""

    for page in pdf_reader.pages:
        page_text = page.extract_text()
        if page_text:
            resume_text += page_text + "\n"

    return resume_text


def parse_json_response(response_text):
    try:
        if "```json" in response_text:
            start = response_text.find("```json") + 7
            end = response_text.find("```", start)
            json_text = response_text[start:end].strip()
            return json.loads(json_text)

        start = response_text.find("{")
        end = response_text.rfind("}") + 1

        if start != -1 and end != -1:
            json_text = response_text[start:end]
            return json.loads(json_text)

        return None

    except Exception as e:
        print("JSON parsing error:", e)
        print("Raw response:", response_text)
        return None


@router.post("/evaluate")
def evaluate_interview(data: InterviewRequest):

    result = evaluate_answer(
        question=data.question,
        answer=data.answer
    )

    roadmap_response = generate_learning_roadmap(
        topic=result.get("topic"),
        weaknesses=result.get("weaknesses")
    )

    roadmap_data = parse_json_response(roadmap_response)

    if roadmap_data is None:
        roadmap_data = {
            "focus_area": "Concept improvement",
            "roadmap_steps": [
                "Revise the basic concept",
                "Study one clear example",
                "Practice simple interview questions",
                "Improve technical explanation",
                "Try one harder question"
            ]
        }

    result["focus_area"] = roadmap_data.get("focus_area")
    result["roadmap_steps"] = roadmap_data.get("roadmap_steps")

    db = SessionLocal()

    record = InterviewRecord(
        question=data.question,
        answer=data.answer,
        topic=result.get("topic"),
        difficulty_level=result.get("difficulty_level"),
        technical_accuracy=result.get("technical_accuracy"),
        clarity=result.get("clarity"),
        depth=result.get("depth"),
        communication=result.get("communication"),
        overall_score=result.get("overall_score"),
        answer_quality=result.get("answer_quality"),
        strengths=json.dumps(result.get("strengths")),
        weaknesses=json.dumps(result.get("weaknesses")),
        improvements=json.dumps(result.get("improvements")),
        final_recommendation=result.get("final_recommendation")
    )

    db.add(record)
    db.commit()
    db.refresh(record)
    db.close()

    return result


@router.post("/evaluate-resume-answer")
def evaluate_resume_interview(data: dict):

    question = data.get("question", "")
    answer = data.get("answer", "")

    if not question.strip() or not answer.strip():
        return {
            "score": 0,
            "answer_quality": "Poor",
            "strengths": [],
            "weaknesses": ["Question or answer is missing"],
            "improvements": ["Provide both question and answer"],
            "final_recommendation": "Cannot evaluate without complete input."
        }

    response = evaluate_resume_answer(question, answer)

    result = parse_json_response(response)

    if result is None:
        result = {
            "score": 0,
            "answer_quality": "Poor",
            "strengths": [],
            "weaknesses": ["Could not evaluate answer properly"],
            "improvements": ["Try again with a clearer answer"],
            "final_recommendation": "Evaluation failed due to invalid AI response."
        }

    return result


@router.get("/history")
def get_history():

    db = SessionLocal()
    records = db.query(InterviewRecord).order_by(InterviewRecord.id.desc()).all()

    history = []

    for record in records:
        history.append({
            "id": record.id,
            "question": record.question,
            "answer": record.answer,
            "topic": record.topic,
            "difficulty_level": record.difficulty_level,
            "technical_accuracy": record.technical_accuracy,
            "clarity": record.clarity,
            "depth": record.depth,
            "communication": record.communication,
            "overall_score": record.overall_score,
            "answer_quality": record.answer_quality,
            "strengths": json.loads(record.strengths),
            "weaknesses": json.loads(record.weaknesses),
            "improvements": json.loads(record.improvements),
            "final_recommendation": record.final_recommendation
        })

    db.close()

    return history


@router.get("/generate-question")
def generate_question(topic: str = "OOP"):
    question = generate_interview_question(topic)

    return {
        "question": question
    }


@router.get("/adaptive-question")
def adaptive_question(
    topic: str = "OOP",
    previous_score: float = 5
):

    question = generate_adaptive_question(
        topic,
        previous_score
    )

    return {
        "topic": topic,
        "previous_score": previous_score,
        "question": question
    }


@router.post("/resume-question")
async def resume_question(file: UploadFile = File(...)):

    file_bytes = await file.read()
    resume_text = extract_resume_text(file_bytes)

    if not resume_text.strip():
        return {
            "error": "Could not extract text from resume PDF"
        }

    question = generate_resume_question(resume_text)

    return {
        "filename": file.filename,
        "question": question
    }


@router.post("/analyze-resume")
async def analyze_resume_endpoint(file: UploadFile = File(...)):

    file_bytes = await file.read()
    resume_text = extract_resume_text(file_bytes)

    if not resume_text.strip():
        return {
            "error": "Could not extract text from resume PDF"
        }

    analysis_response = analyze_resume(resume_text)
    question = generate_resume_question(resume_text)

    analysis_data = parse_json_response(analysis_response)

    if analysis_data is None:
        analysis_data = {
            "detected_skills": [],
            "projects": [],
            "resume_strength_score": 0,
            "summary": "Could not analyze resume properly."
        }

    return {
        "filename": file.filename,
        "detected_skills": analysis_data.get("detected_skills", []),
        "projects": analysis_data.get("projects", []),
        "resume_strength_score": analysis_data.get("resume_strength_score", 0),
        "summary": analysis_data.get("summary", ""),
        "question": question
    }


@router.delete("/history")
def clear_history():
    db = SessionLocal()

    db.query(InterviewRecord).delete()
    db.commit()
    db.close()

    return {
        "message": "History cleared successfully"
    }