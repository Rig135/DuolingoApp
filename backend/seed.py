import os
import sys
from datetime import datetime, timezone

# Add the parent directory to sys.path so we can import 'app'
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.database import SessionLocal, engine, Base
from app.models import User, Course, Unit, Skill, Lesson, Exercise, UserProgress, DailyActivity

def seed_db(force: bool = False):
    print("Creating tables...")
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    try:
        # Check if already seeded
        if not force and db.query(Course).first():
            print("Database already seeded. Run with a clean DB to re-seed.")
            return


        print("Seeding Users...")
        default_user = User(username="default_learner", xp=120, streak=3, hearts=5)
        leaderboard_users = [
            User(username="polyglot_pete", xp=4500, streak=120),
            User(username="spanish_sarah", xp=3200, streak=45),
            User(username="casual_carl", xp=50, streak=1),
        ]
        db.add(default_user)
        db.add_all(leaderboard_users)
        db.commit()

        print("Seeding Course Content...")
        course = Course(title="Spanish")
        db.add(course)
        db.commit()

        # Unit 1
        unit1 = Unit(course_id=course.id, title="Unit 1", description="Form basic sentences, greet people", order=1)
        # Unit 2
        unit2 = Unit(course_id=course.id, title="Unit 2", description="Get around town, order food", order=2)
        db.add_all([unit1, unit2])
        db.commit()

        # Skills for Unit 1
        skill_intro = Skill(unit_id=unit1.id, title="Intro", order=1)
        skill_phrases = Skill(unit_id=unit1.id, title="Phrases", order=2)
        # Skills for Unit 2
        skill_travel = Skill(unit_id=unit2.id, title="Travel", order=3)
        db.add_all([skill_intro, skill_phrases, skill_travel])
        db.commit()

        # Lessons for Skill 'Intro'
        lesson1 = Lesson(skill_id=skill_intro.id, order=1)
        lesson2 = Lesson(skill_id=skill_intro.id, order=2)
        
        # Lessons for Skill 'Phrases'
        lesson3 = Lesson(skill_id=skill_phrases.id, order=1)
        
        # Lessons for Skill 'Travel'
        lesson4 = Lesson(skill_id=skill_travel.id, order=1)
        
        db.add_all([lesson1, lesson2, lesson3, lesson4])
        db.commit()

        print("Seeding Exercises (All 5 Types)...")
        exercises = [
            # --- LESSON 1 (Intro 1) ---
            # 1. MULTIPLE_CHOICE
            Exercise(
                lesson_id=lesson1.id, type="MULTIPLE_CHOICE", order=1,
                question="Which of these is 'the apple'?",
                options=["la manzana", "el pan", "la leche", "el agua"],
                correct_answer="la manzana"
            ),
            # 2. TRANSLATE (Word Bank)
            Exercise(
                lesson_id=lesson1.id, type="TRANSLATE", order=2,
                question="I eat bread",
                options=["Yo", "como", "pan", "bebo", "agua", "el", "la"],
                correct_answer=["Yo", "como", "pan"]
            ),
            # 3. TYPE_ANSWER
            Exercise(
                lesson_id=lesson1.id, type="TYPE_ANSWER", order=3,
                question="Type the Spanish translation for: 'Hello'",
                options=None,
                correct_answer="Hola"
            ),
            # 4. MATCH_PAIRS
            Exercise(
                lesson_id=lesson1.id, type="MATCH_PAIRS", order=4,
                question="Match the pairs",
                options=[
                    {"en": "Hello", "es": "Hola"},
                    {"en": "Goodbye", "es": "Adiós"},
                    {"en": "Please", "es": "Por favor"},
                    {"en": "Thanks", "es": "Gracias"}
                ],
                correct_answer=[
                    {"en": "Hello", "es": "Hola"},
                    {"en": "Goodbye", "es": "Adiós"},
                    {"en": "Please", "es": "Por favor"},
                    {"en": "Thanks", "es": "Gracias"}
                ]
            ),
            # 5. FILL_BLANK
            Exercise(
                lesson_id=lesson1.id, type="FILL_BLANK", order=5,
                question="Yo ___ pan (I eat bread)",
                options=["como", "bebo", "soy"],
                correct_answer="como"
            ),

            # --- LESSON 2 (Intro 2) ---
            # 1. MULTIPLE_CHOICE
            Exercise(
                lesson_id=lesson2.id, type="MULTIPLE_CHOICE", order=1,
                question="Which of these is 'the woman'?",
                options=["la mujer", "el hombre", "el agua", "la manzana"],
                correct_answer="la mujer"
            ),
            # 2. TRANSLATE
            Exercise(
                lesson_id=lesson2.id, type="TRANSLATE", order=2,
                question="The woman drinks water",
                options=["La", "mujer", "bebe", "agua", "el", "pan", "come"],
                correct_answer=["La", "mujer", "bebe", "agua"]
            ),
            # 3. TYPE_ANSWER
            Exercise(
                lesson_id=lesson2.id, type="TYPE_ANSWER", order=3,
                question="Type the Spanish translation for: 'Good morning'",
                options=None,
                correct_answer="Buenos días"
            ),
            # 4. MATCH_PAIRS
            Exercise(
                lesson_id=lesson2.id, type="MATCH_PAIRS", order=4,
                question="Match the pairs",
                options=[
                    {"en": "Woman", "es": "Mujer"},
                    {"en": "Man", "es": "Hombre"},
                    {"en": "Water", "es": "Agua"},
                    {"en": "Bread", "es": "Pan"}
                ],
                correct_answer=[
                    {"en": "Woman", "es": "Mujer"},
                    {"en": "Man", "es": "Hombre"},
                    {"en": "Water", "es": "Agua"},
                    {"en": "Bread", "es": "Pan"}
                ]
            ),
            # 5. FILL_BLANK
            Exercise(
                lesson_id=lesson2.id, type="FILL_BLANK", order=5,
                question="El hombre ___ leche (The man drinks milk)",
                options=["bebe", "come", "soy"],
                correct_answer="bebe"
            ),

            # --- LESSON 3 (Phrases 1) ---
            Exercise(
                lesson_id=lesson3.id, type="MULTIPLE_CHOICE", order=1,
                question="How do you say 'Thank you'?",
                options=["Gracias", "Por favor", "Hola", "Adiós"],
                correct_answer="Gracias"
            ),
            Exercise(
                lesson_id=lesson3.id, type="TRANSLATE", order=2,
                question="Yes, please",
                options=["Sí", "por", "favor", "gracias", "no", "hola"],
                correct_answer=["Sí", "por", "favor"]
            ),
            Exercise(
                lesson_id=lesson3.id, type="TYPE_ANSWER", order=3,
                question="Type the Spanish translation for: 'You are welcome'",
                options=None,
                correct_answer="De nada"
            ),
            Exercise(
                lesson_id=lesson3.id, type="MATCH_PAIRS", order=4,
                question="Match the pairs",
                options=[
                    {"en": "Yes", "es": "Sí"},
                    {"en": "No", "es": "No"},
                    {"en": "Please", "es": "Por favor"},
                    {"en": "Thanks", "es": "Gracias"}
                ],
                correct_answer=[
                    {"en": "Yes", "es": "Sí"},
                    {"en": "No", "es": "No"},
                    {"en": "Please", "es": "Por favor"},
                    {"en": "Thanks", "es": "Gracias"}
                ]
            ),
            Exercise(
                lesson_id=lesson3.id, type="FILL_BLANK", order=5,
                question="Muchas ___ (Thank you very much)",
                options=["gracias", "favor", "nada"],
                correct_answer="gracias"
            ),

            # --- LESSON 4 (Travel 1) ---
            Exercise(
                lesson_id=lesson4.id, type="MULTIPLE_CHOICE", order=1,
                question="Which of these is 'the airport'?",
                options=["el aeropuerto", "el hotel", "el taxi", "el tren"],
                correct_answer="el aeropuerto"
            ),
            Exercise(
                lesson_id=lesson4.id, type="TRANSLATE", order=2,
                question="Where is the hotel?",
                options=["Dónde", "está", "el", "hotel", "aeropuerto", "un"],
                correct_answer=["Dónde", "está", "el", "hotel"]
            ),
            Exercise(
                lesson_id=lesson4.id, type="TYPE_ANSWER", order=3,
                question="Type the Spanish translation for: 'A taxi, please'",
                options=None,
                correct_answer="Un taxi, por favor"
            ),
            Exercise(
                lesson_id=lesson4.id, type="MATCH_PAIRS", order=4,
                question="Match the pairs",
                options=[
                    {"en": "Hotel", "es": "Hotel"},
                    {"en": "Airport", "es": "Aeropuerto"},
                    {"en": "Taxi", "es": "Taxi"},
                    {"en": "Train", "es": "Tren"}
                ],
                correct_answer=[
                    {"en": "Hotel", "es": "Hotel"},
                    {"en": "Airport", "es": "Aeropuerto"},
                    {"en": "Taxi", "es": "Taxi"},
                    {"en": "Train", "es": "Tren"}
                ]
            ),
            Exercise(
                lesson_id=lesson4.id, type="FILL_BLANK", order=5,
                question="Necesito un ___ (I need a taxi)",
                options=["taxi", "hotel", "hola"],
                correct_answer="taxi"
            )
        ]
        db.add_all(exercises)
        db.commit()

        print("Seeding User Progress...")
        # Give default user unlocked access to Unit 1, Intro
        progress = UserProgress(user_id=default_user.id, skill_id=skill_intro.id, is_unlocked=True, completed_lessons=0)
        db.add(progress)
        
        # Add some daily activity for the leaderboard
        today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
        activity = DailyActivity(user_id=default_user.id, date=today, xp_earned=40)
        db.add(activity)

        db.commit()
        print("Database seeded successfully!")

    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()
