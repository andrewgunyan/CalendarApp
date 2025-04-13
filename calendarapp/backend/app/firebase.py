import firebase_admin
from firebase_admin import credentials

cred = credentials.Certificate("app/firebase-key.json")  # Get this from Firebase Console
firebase_admin.initialize_app(cred)
