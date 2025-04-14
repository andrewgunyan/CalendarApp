from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from ..database import get_db
from ..models import Goal
from typing import List
from ..schemas import GoalResponse, GoalCreate
from fastapi import Query
from typing import Optional

router = APIRouter()

@router.get("/goals", response_model=List[GoalResponse])
def get_goals(user_id: Optional[str] = Query(None), db: Session = Depends(get_db)):
    try:
        query = db.query(Goal)
        if user_id:
            query = query.filter(Goal.userId == user_id)
        goals = query.all()
        return goals
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching goals: {str(e)}")
    
@router.post("/goals", response_model=GoalResponse)
def create_goal(goal: GoalCreate, db: Session = Depends(get_db)):
    try:
        db_goal = Goal(
            title=goal.title,
            description=goal.description,
            startDate=goal.startDate, 
            endDate=goal.endDate,
            userId=goal.userId
        )
        db.add(db_goal)
        db.commit()
        db.refresh(db_goal)
        return db_goal
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    
@router.delete("/goals/{goal_id}")
def delete_goal(goal_id: int, db: Session = Depends(get_db)):
    try:
        goal = db.query(Goal).filter(Goal.goalId == goal_id).first()
        if not goal:
            raise HTTPException(status_code=404, detail="Goal not found")
        
        db.delete(goal)
        db.commit()
        return {"message": "Goal deleted successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))