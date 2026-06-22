from sqlalchemy import Column, Integer, String, Float, Text
from app.database.connection import Base


class InterviewRecord(Base):

    __tablename__ = "interview_records"

    id = Column(Integer, primary_key=True, index=True)

    question = Column(Text)
    answer = Column(Text)

    topic = Column(String)
    difficulty_level = Column(String)

    technical_accuracy = Column(Float)
    clarity = Column(Float)
    depth = Column(Float)
    communication = Column(Float)
    overall_score = Column(Float)

    answer_quality = Column(String)

    strengths = Column(Text)
    weaknesses = Column(Text)
    improvements = Column(Text)

    final_recommendation = Column(Text)