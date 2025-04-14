from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from datetime import datetime
from .. import models
from ..database import get_db
from ..models import Event
from ..schemas import EventCreate
from typing import List
from ..schemas import EventResponse
from ..models import EventAttendee
from fastapi import Query
from typing import Optional
from ..schemas import StatusUpdate

router = APIRouter()

# Get all events
@router.get("/events", response_model=List[EventResponse])
def get_events(
    user_id: Optional[str] = Query(None),  # Changed from creator_id to user_id
    db: Session = Depends(get_db)
):
    try:
        query = db.query(Event).outerjoin(
            EventAttendee, 
            Event.eventId == EventAttendee.eventId
        ).filter(
            (Event.creatorId == user_id) | 
            (EventAttendee.userId == user_id)
        ).options(joinedload(Event.attendees)).distinct()

        events = query.all()
        return events
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")
    
# Create new event
@router.post("/events", response_model=EventResponse)
def create_event(event: EventCreate, db: Session = Depends(get_db)):
    try:
        
        # Create event in the database
        db_event = Event(
            title=event.title,
            description=event.description,
            startDate=event.startDate, 
            endDate=event.endDate,
            eventType=event.eventType,
            creatorId=event.creatorId,
            locationLatitude=event.locationLatitude,
            locationLongitude=event.locationLongitude
        )
        
        
        db.add(db_event)
        db.commit()
        db.refresh(db_event)

        # Add the creator as an attendee
        creator_attendee = EventAttendee(
            userId=event.creatorId,
            eventId=db_event.eventId,
            status="confirmed"
        )
        db.add(creator_attendee)
        
        if event.invitees:
            for invitee_email in event.invitees:
                user = db.query(models.User).filter(models.User.email == invitee_email).first()
                if user:
                    invitee_attendee = EventAttendee(
                        userId=user.uid,
                        eventId=db_event.eventId,
                        status="pending"
                    )
                    db.add(invitee_attendee)
                else:
                    # Handle case where the user is not found
                    raise HTTPException(status_code=404, detail=f"User with email {invitee_email} not found")

        # Commit all attendee changes
        db.commit()

        return db_event
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    
@router.post("/events/{event_id}/status")
def update_event_status(event_id: int, status_update: StatusUpdate, db: Session = Depends(get_db)):
    try:
        event = db.query(Event).filter(Event.eventId == event_id).first()
        if not event:
            raise HTTPException(status_code=404, detail="Event not found")

        attendee = db.query(EventAttendee).filter(
            EventAttendee.eventId == event_id,
            EventAttendee.userId == status_update.userId
        ).first()

        if not attendee:
            raise HTTPException(status_code=404, detail="User is not an attendee of this event")

        attendee.status = status_update.status
        db.commit()

        return {"message": "Event status updated successfully", "status": status_update.status}

    except Exception as e:
        db.rollback()  # Rollback transaction in case of error
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

