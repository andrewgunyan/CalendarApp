from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from .database import SessionLocal, engine, Base
from .models import User
from .routers import users
from . import firebase
from .database import get_db, test_database

app = FastAPI()
app.include_router(users.router, prefix="/users", tags=["users"])

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create tables on startup (if not already there)
Base.metadata.create_all(bind=engine)

@app.get("/")
def root():
    return {"message": "Calendar API is running"}

@app.get("/test-db")
def test_db(db: Session = Depends(get_db)):
    return test_database(db)