def generate_evaluation_prompt(question, answer):
    return f"""
You are a professional technical interview evaluator.

Evaluate the candidate's answer.

Question:
{question}

Candidate Answer:
{answer}

Scoring rules:
- technical_accuracy: 0 to 10
- clarity: 0 to 10
- depth: 0 to 10
- communication: 0 to 10
- overall_score = average of the 4 scores
- overall_score must be between 0 and 10

Also identify:
- topic
- difficulty_level: Easy, Medium, or Hard
- answer_quality: Poor, Average, Good, or Excellent
- final_recommendation

Return ONLY valid JSON.
Do not use markdown.
Do not write explanation outside JSON.

Use this exact JSON format:

{{
    "topic": "",
    "difficulty_level": "",
    "technical_accuracy": 0,
    "clarity": 0,
    "depth": 0,
    "communication": 0,
    "overall_score": 0,
    "answer_quality": "",
    "strengths": [],
    "weaknesses": [],
    "improvements": [],
    "final_recommendation": ""
}}
"""