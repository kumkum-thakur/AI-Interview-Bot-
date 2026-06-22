from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.interview import router
from app.database.init_db import create_tables

app = FastAPI(title="InterviewIQ AI")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup():
    create_tables()


@app.get("/")
def home():
    return {"message": "InterviewIQ AI Backend Running"}


app.include_router(router)