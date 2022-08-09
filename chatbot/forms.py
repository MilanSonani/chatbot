from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField, IntegerField, ValidationError
from wtforms.validators import DataRequired, Email
from chatbot.models import SignUp


class RegistrationForm(FlaskForm):
    username = StringField('username', validators =[DataRequired()])
    email = StringField('Email', validators=[DataRequired(),Email()])
    age = IntegerField('Age', validators=[DataRequired()])
    submit = SubmitField('Register')

    def validate_username(self, username):
        user = SignUp.query.filter_by(username=username.data).first()
        if user:
            raise ValidationError('That username is taken. Please choose another.')

    def validate_email(self, email):
        user = SignUp.query.filter_by(email=email.data).first()
        if user:
            raise ValidationError('That email is taken. Please choose another.')