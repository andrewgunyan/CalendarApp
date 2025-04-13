from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Text, DECIMAL
from .database import Base

class User(Base):
    __tablename__ = "User"
    userId = Column(String(128), primary_key=True)
    username = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, nullable=False)

class Goal(Base):
    __tablename__ = "Goal"
    goalId = Column(Integer, primary_key=True, autoincrement=True)
    startDate = Column(DateTime, nullable=False)
    endDate = Column(DateTime, nullable=False)
    title = Column(String(255))
    description = Column(Text)
    userId = Column(String(128), ForeignKey("User.userId"))

class Event(Base):
    __tablename__ = "Event"
    eventId = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(255))
    description = Column(Text)
    startDate = Column(DateTime, nullable=False)
    endDate = Column(DateTime, nullable=False)
    eventType = Column(String(50))
    creatorId = Column(String(128), ForeignKey("User.userId"))
    locationLatitude = Column(DECIMAL(9,6))
    locationLongitude = Column(DECIMAL(9,6))

class EventAttendee(Base):
    __tablename__ = "Event_Attendee"
    userId = Column(String(128), ForeignKey("User.userId"), primary_key=True)
    eventId = Column(Integer, ForeignKey("Event.eventId"), primary_key=True)
    status = Column(String(50), default="invited")
