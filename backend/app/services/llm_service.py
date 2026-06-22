from groq import Groq
from app.config.settings import GROQ_API_KEY

client = Groq(api_key=GROQ_API_KEY)


def get_llm_response(prompt):

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {
                "role": "system",
                "content": """
                You are a professional interview evaluator.
                Always return ONLY valid JSON.
                """
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.2
    )

    return response.choices[0].message.content


def generate_interview_question(topic="OOP"):

    prompt = f"""
    Generate one professional interview question about {topic}.
    Return only the question.
    """

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    return response.choices[0].message.content


def generate_adaptive_question(topic, previous_score):

    if previous_score < 5:
        difficulty = "easy"
    elif previous_score <= 7:
        difficulty = "medium"
    else:
        difficulty = "hard"

    prompt = f"""
    Generate one {difficulty} level interview question on {topic}.

    Candidate previously scored {previous_score}/10.

    Return only the interview question.
    """

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.4
    )

    return response.choices[0].message.content


def generate_learning_roadmap(topic, weaknesses):

    prompt = f"""
    You are an interview mentor.

    Topic: {topic}
    Weaknesses: {weaknesses}

    Generate a personalized learning roadmap.

    Rules:
    - Focus only on the biggest weakness.
    - Return only 5 short learning steps.
    - Each step must be under 10 words.
    - Identify one focus area.
    - Do not write paragraphs.
    - Return ONLY valid JSON.

    Format:
    {{
      "focus_area": "short focus area",
      "roadmap_steps": [
        "step 1",
        "step 2",
        "step 3",
        "step 4",
        "step 5"
      ]
    }}
    """

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.3
    )

    return response.choices[0].message.content


def generate_resume_question(resume_text):

    prompt = f"""
    You are a technical interviewer.

    Read this resume content:

    {resume_text[:4000]}

    Generate ONE interview question based on the candidate's resume.

    Rules:
    - Ask about a skill, project, internship, or technology mentioned in the resume.
    - Make it specific to the resume.
    - Do not ask generic questions.
    - Return only the question.
    """

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.4
    )

    return response.choices[0].message.content


def analyze_resume(resume_text):

    prompt = f"""
    You are a resume analysis assistant.

    Read this resume:

    {resume_text[:4000]}

    Extract resume insights.

    Return ONLY valid JSON in this format:

    {{
      "detected_skills": ["skill1", "skill2", "skill3"],
      "projects": ["project1", "project2"],
      "resume_strength_score": 80,
      "summary": "short summary of candidate profile"
    }}

    Rules:
    - detected_skills should contain maximum 8 skills.
    - projects should contain maximum 3 projects.
    - resume_strength_score should be between 0 and 100.
    - summary should be short and simple.
    - Do not write explanation after JSON.
    """

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.3
    )

    return response.choices[0].message.content


def evaluate_resume_answer(question, answer):

    prompt = f"""
    You are a senior technical interviewer.

    Resume-Based Interview Question:
    {question}

    Candidate Answer:
    {answer}

    Evaluate this answer.

    Return ONLY valid JSON in this format:

    {{
      "score": 8,
      "answer_quality": "Good",
      "strengths": [
        "point 1",
        "point 2"
      ],
      "weaknesses": [
        "point 1",
        "point 2"
      ],
      "improvements": [
        "point 1",
        "point 2"
      ],
      "final_recommendation": "short recommendation"
    }}

    Rules:
    - score must be between 0 and 10.
    - answer_quality should be Poor, Average, Good, or Excellent.
    - Keep every point short.
    - Do not write explanation after JSON.
    """

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.2
    )

    return response.choices[0].message.content