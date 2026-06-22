from app.prompts.evaluation_prompt import generate_evaluation_prompt
from app.services.llm_service import get_llm_response
import json
import re


def clean_json_response(response: str):
    response = response.strip()

    # Remove markdown code blocks if model adds them accidentally
    response = response.replace("```json", "")
    response = response.replace("```", "")
    response = response.strip()

    # Extract JSON object only
    match = re.search(r"\{.*\}", response, re.DOTALL)

    if match:
        response = match.group(0)

    return response


def validate_scores(result: dict):
    score_fields = [
        "technical_accuracy",
        "clarity",
        "depth",
        "communication",
        "overall_score"
    ]

    for field in score_fields:
        if field in result:
            result[field] = max(0, min(10, float(result[field])))

    if all(field in result for field in ["technical_accuracy", "clarity", "depth", "communication"]):
        avg = (
            result["technical_accuracy"]
            + result["clarity"]
            + result["depth"]
            + result["communication"]
        ) / 4
        result["overall_score"] = round(avg, 1)

    return result


def evaluate_answer(question, answer):
    if not question.strip() or not answer.strip():
        return {
            "error": "Question and answer cannot be empty"
        }

    prompt = generate_evaluation_prompt(question, answer)

    response = get_llm_response(prompt)

    try:
        cleaned_response = clean_json_response(response)
        parsed_response = json.loads(cleaned_response)
        validated_response = validate_scores(parsed_response)

        return validated_response

    except Exception:
        return {
            "error": "Failed to parse LLM response",
            "raw_response": response
        }