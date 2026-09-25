from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, JSON, UniqueConstraint
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    xp = Column(Integer, default=0)
    streak = Column(Integer, default=0)
    hearts = Column(Integer, default=5)
    last_active_date = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    
    progress = relationship("UserProgress", back_populates="user")
    completions = relationship("LessonCompletion", back_populates="user")
    activities = relationship("DailyActivity", back_populates="user")

class Course(Base):
    __tablename__ = "courses"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    
    units = relationship("Unit", back_populates="course", order_by="Unit.order")

class Unit(Base):
    __tablename__ = "units"
    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"))
    title = Column(String)
    description = Column(String)
    order = Column(Integer)

    course = relationship("Course", back_populates="units")
    skills = relationship("Skill", back_populates="unit", order_by="Skill.order")

class Skill(Base):
    __tablename__ = "skills"
    id = Column(Integer, primary_key=True, index=True)
    unit_id = Column(Integer, ForeignKey("units.id"))
    title = Column(String)
    order = Column(Integer)

    unit = relationship("Unit", back_populates="skills")
    lessons = relationship("Lesson", back_populates="skill", order_by="Lesson.order")

class Lesson(Base):
    __tablename__ = "lessons"
    id = Column(Integer, primary_key=True, index=True)
    skill_id = Column(Integer, ForeignKey("skills.id"))
    order = Column(Integer)

    skill = relationship("Skill", back_populates="lessons")
    exercises = relationship("Exercise", back_populates="lesson", order_by="Exercise.order")

class Exercise(Base):
    __tablename__ = "exercises"
    id = Column(Integer, primary_key=True, index=True)
    lesson_id = Column(Integer, ForeignKey("lessons.id"))
    type = Column(String) # 'MULTIPLE_CHOICE', 'TRANSLATE', 'MATCH_PAIRS', 'FILL_BLANK', 'TYPE_ANSWER'
    question = Column(String)
    options = Column(JSON, nullable=True) 
    correct_answer = Column(JSON) # Can be string or list depending on type
    order = Column(Integer)

    lesson = relationship("Lesson", back_populates="exercises")

class UserProgress(Base):
    __tablename__ = "user_progress"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    skill_id = Column(Integer, ForeignKey("skills.id"))
    is_unlocked = Column(Boolean, default=False)
    completed_lessons = Column(Integer, default=0)

    user = relationship("User", back_populates="progress")
    skill = relationship("Skill")
    
    __table_args__ = (UniqueConstraint('user_id', 'skill_id', name='uix_user_skill'),)

class LessonCompletion(Base):
    __tablename__ = "lesson_completions"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    lesson_id = Column(Integer, ForeignKey("lessons.id"))
    completed_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="completions")
    lesson = relationship("Lesson")

class DailyActivity(Base):
    __tablename__ = "daily_activities"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    date = Column(String) # YYYY-MM-DD format for easy querying
    xp_earned = Column(Integer, default=0)

    user = relationship("User", back_populates="activities")
    __table_args__ = (UniqueConstraint('user_id', 'date', name='uix_user_date'),)
