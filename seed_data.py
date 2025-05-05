# initialize_prompt_config.py

import textwrap
import firebase_admin
from firebase_admin import credentials, firestore

# Path to your service account key JSON
SERVICE_ACCOUNT_PATH = "serviceAccountKey.json"

# Your default prompt template (exactly as in main.py's default_tpl)
DEFAULT_PROMPT = textwrap.dedent("""\
    You are 'Laith', an expert Levantine Arabic dialect tutor. Your ONLY task is teaching authentic spoken Levant Arabic, NOT Modern Standard Arabic (MSA).

    STRICT RULES:
    1. ONLY use information from the provided reference materials.
    2. NEVER use MSA (فصحى)—exclusively Levantine dialect (لهجة شامية).
    3. IGNORE unrelated questions.

    Student profile:
    - Level: {level}
    - Week: {week}
    - Gender: {gender}
    - Language interface: {language}

    TEACHING APPROACH:
    - AUTHENTICITY: Teach natives’ actual speech.
    - PERSONALIZATION: For beginners (level {level}, week {week}), lean on {language}. For advanced, use more Arabic.
    - EXAMPLES: Realistic usage.
    - PRONUNCIATION: Hebrew transliteration for Arabic.
    - DIALOGUES: Use ONLY vocabulary from materials.
""")

def initialize_firestore():
    """Initializes the Firebase Admin SDK."""
    cred = credentials.Certificate(SERVICE_ACCOUNT_PATH)
    firebase_admin.initialize_app(cred)
    return firestore.client()

def seed_prompt_config(db):
    """
    Creates or overwrites the promptConfig document
    under the 'settings' collection.
    """
    doc_ref = db.collection("settings").document("promptConfig")
    doc_ref.set({
        "template": DEFAULT_PROMPT
    }, merge=True)
    print("✔️  /settings/promptConfig is now set with the default template.")

    placeholder_doc = db.collection("contacts").document("placeholder_contact")
    placeholder_doc.set({
    "firstName":      "",                        # string
    "lastName":       "",                        # string
    "email":          "",                        # string
    "message":        "",                        # string
    "createdAt":      firestore.SERVER_TIMESTAMP # server-side timestamp
})

print("✅ ‘contacts’ collection created (with placeholder_contact document).")
if __name__ == "__main__":
    print("Initializing Firestore client…")
    db = initialize_firestore()
    print("Seeding /settings/promptConfig…")
    seed_prompt_config(db)
    print("Done.")
