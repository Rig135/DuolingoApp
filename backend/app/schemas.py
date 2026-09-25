from pydantic import BaseModel
from typing import List, Optional, Any, Dict
from datetime import datetime

# User Schemas
class UserSummary(BaseModel):
    id: int
    username: str
    xp: int
    streak: int
    hearts: int
    gems: int

    class Config:
        from_attributes = True

# Exercise Schemas (NOTICE: correct_answer is strictly omitted for client queries)
class ExercisePublic(BaseModel):
    id: int
    lesson_id: int
    type: str
    question: str
    options: Optional[Any] = None
    order: int

    class Config:
        from_attributes = True

class LessonDetail(BaseModel):
    id: int
    skill_id: int
    order: int
    exercises: List[ExercisePublic]

    class Config:
        from_attributes = True

# Path & Dashboard Schemas
class SkillSummary(BaseModel):
    id: int
    unit_id: int
    title: str
    order: int
    is_unlocked: bool
    completed_lessons: int
    total_lessons: int
    next_lesson_id: Optional[int] = None

class UnitSummary(BaseModel):
    id: int
    title: str
    description: str
    order: int
    skills: List[SkillSummary]

class DashboardResponse(BaseModel):
    user: UserSummary
    units: List[UnitSummary]

# Exercise Validation
class CheckAnswerRequest(BaseModel):
    user_answer: Any

class CheckAnswerResponse(BaseModel):
    is_correct: bool
    hearts_remaining: int
    correct_answer: Any
    message: str

# Lesson Completion
class CompleteLessonResponse(BaseModel):
    success: bool
    xp_awarded: int
    total_xp: int
    streak: int
    skill_completed: bool
    next_skill_unlocked: bool
    message: str

# Profile & Leaderboard
class DailyActivityItem(BaseModel):
    date: str
    xp_earned: int

class ProfileResponse(BaseModel):
    user: UserSummary
    total_lessons_completed: int
    daily_history: List[DailyActivityItem]

class LeaderboardEntry(BaseModel):
    rank: int
    username: str
    xp: int
    streak: int
    is_current_user: bool

class LeaderboardResponse(BaseModel):
    entries: List[LeaderboardEntry]

class RefillHeartsResponse(BaseModel):
    hearts: int
    message: str
