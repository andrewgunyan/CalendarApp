from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from .database import SessionLocal, engine, Base
from .models import User

app = FastAPI()

# Create tables on startup (if not already there)
Base.metadata.create_all(bind=engine)

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def root():
    return {"message": "Calendar API is running"}

@app.get("/test-db")
def test_database(db: Session = Depends(get_db)):
    try:
        users = db.query(User).all()
        return {"success": True, "user_count": len(users)}
    except Exception as e:
        return {"success": False, "error": str(e)}
