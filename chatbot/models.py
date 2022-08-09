from datetime import datetime
from chatbot import db


class SignUp(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), index=True, unique=True)
    email = db.Column(db.String(150), unique=True, index=True)
    age = db.Column(db.Integer(), index=True, default=None)
    created_at = db.Column(db.DateTime(), default=datetime.now(), index=True)
