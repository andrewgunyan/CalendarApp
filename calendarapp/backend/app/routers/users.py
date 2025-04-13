from fastapi import APIRouter, HTTPException, Depends, Request
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User
from fastapi.responses import JSONResponse
from datetime import datetime
from firebase_admin import auth as firebase_auth
from fastapi.security import OAuth2PasswordRequestForm
from ..auth import create_access_token, get_current_user

router = APIRouter()

@router.post("/auth/verify")
async def verify_token(request: Request, db: Session = Depends(get_db)):
    body = await request.json()
    id_token = body.get("token")
    
    try:
        decoded_token = firebase_auth.verify_id_token(id_token)
        uid = decoded_token["uid"]
        email = decoded_token.get("email")

        user = db.query(User).filter_by(uid=uid).first()

        if not user:
            new_user = User(uid=uid, email=email, created_at=datetime.utcnow())
            db.add(new_user)
            db.commit()
            db.refresh(new_user)
            user = new_user

        token = create_access_token(data={"sub": user.uid})

        return {"access_token": token, "token_type": "bearer", "email": user.email}
    
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid Firebase token")

@router.get("/me")
def get_me(user=Depends(get_current_user)):
    return {"user": user["sub"]}