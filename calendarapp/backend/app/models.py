from sqlalchemy import Column, String, Integer, DateTime, Text, DECIMAL, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base

class User(Base):
    __tablename__ = "user"
    __table_args__ = {"schema": "calendar_app"}
    uid = Column(String(100), primary_key=True) 
    email = Column(String(255), unique=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Goal(Base):
    __tablename__ = "goal"
    __table_args__ = {"schema": "calendar_app"}
    goalId = Column(Integer, primary_key=True, autoincrement=True)
    startDate = Column(DateTime, nullable=False)
    endDate = Column(DateTime, nullable=False)
    title = Column(String(255))
    description = Column(Text)
    userId = Column(String(128), ForeignKey("calendar_app.user.uid"))

class Event(Base):
    __tablename__ = "event"
    __table_args__ = {"schema": "calendar_app"}
    eventId = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(255))
    description = Column(Text)
    startDate = Column(DateTime, nullable=False)
    endDate = Column(DateTime, nullable=False)
    eventType = Column(String(50))
    creatorId = Column(String(128), ForeignKey("calendar_app.user.uid"))
    locationLatitude = Column(DECIMAL(9,6))
    locationLongitude = Column(DECIMAL(9,6))

class EventAttendee(Base):
    __tablename__ = "event_attendee"
    __table_args__ = {"schema": "calendar_app"}
    userId = Column(String(128), ForeignKey("calendar_app.user.uid"), primary_key=True)
    eventId = Column(Integer, ForeignKey("calendar_app.event.eventId"), primary_key=True)
    status = Column(String(50), default="invited")
