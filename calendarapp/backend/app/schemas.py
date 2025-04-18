from pydantic import BaseModel
from datetime import datetime
from typing import Union, List, Optional


# User Schema
class UserBase(BaseModel):
    email: str

class UserCreate(UserBase):
    pass

class UserResponse(UserBase):
    uid: str
    created_at: datetime

    class Config:
        orm_mode = True


# Goal Schema
class GoalBase(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None

class GoalCreate(GoalBase):
    startDate: Union[datetime, str]
    endDate: Union[datetime, str]
    userId: str

class GoalResponse(GoalBase):
    goalId: int
    startDate: datetime
    endDate: datetime
    userId: str

    class Config:
        orm_mode = True

# EventAttendee Schema
class EventAttendeeBase(BaseModel):
    status: Optional[str] = "invited"

class EventAttendeeCreate(EventAttendeeBase):
    userId: str
    eventId: int

class EventAttendeeResponse(EventAttendeeBase):
    userId: str
    eventId: int
    status: str
    userEmail: Optional[str] = None 

    class Config:
        orm_mode = True

class StatusUpdate(BaseModel):
    userId: str
    status: str

# Event Schema
class EventBase(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    eventType: Optional[str] = None
    locationLatitude: Optional[float] = None
    locationLongitude: Optional[float] = None

class EventCreate(EventBase):
    startDate: Union[datetime, str]
    endDate: Union[datetime, str]
    creatorId: str
    invitees: Optional[List[str]] = []

class EventResponse(EventBase):
    eventId: int
    startDate: datetime
    endDate: datetime
    creatorId: str
    invitees: Optional[List[EventAttendeeResponse]] = []
    attendees: List[EventAttendeeResponse] = []

    class Config:
        orm_mode = True