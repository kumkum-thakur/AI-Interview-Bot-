from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes.interview import router
from app.database.connection import engine
from app.models.database_models import Base

app = FastAPI(title="InterviewIQ AI")

Base.metadata.create_all(bind=engine)

origins = [
    "http://localhost:5173",
    "https://ai-interview-bot-pied.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)


@app.get("/")
def home():
    return {"message": "InterviewIQ AI Backend Running"}