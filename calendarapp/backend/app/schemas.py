from pydantic import BaseModel
from datetime import datetime
from typing import Optional


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
    startDate: datetime
    endDate: datetime
    userId: str

class GoalResponse(GoalBase):
    goalId: int
    startDate: datetime
    endDate: datetime
    userId: str

    class Config:
        orm_mode = True


# Event Schema
class EventBase(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    eventType: Optional[str] = None
    locationLatitude: Optional[float] = None
    locationLongitude: Optional[float] = None

class EventCreate(EventBase):
    startDate: datetime
    endDate: datetime
    creatorId: str

class EventResponse(EventBase):
    eventId: int
    startDate: datetime
    endDate: datetime
    creatorId: str

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

    class Config:
        orm_mode = True
