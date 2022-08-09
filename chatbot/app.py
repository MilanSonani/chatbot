import re
import json
from flask import render_template, redirect, session, Blueprint, request, make_response
# from chatbot.pre_train import send_message
from chatbot.utills import send_response
from chatbot.forms import RegistrationForm
from chatbot.models import SignUp
from chatbot import db

api = Blueprint("api", __name__)


@api.route("/")
def home():
    return render_template("index.html")


# @api.route("/pre-train")
# def get_pre_train_bot_response():
#     received_message = request.args.get('msg')
#     try:
#         response = send_message(received_message)
#     except:
#         response = "Sorry, I didn't Get You"
#     return str(response)


regex = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'


@api.route("/self-train")
def get_self_train_bot_response():
    received_message = request.args.get('msg')
    user_data = json.loads(request.cookies['userData'])
    count = user_data['count']
    user = request.cookies.get('user', None)
    if not user:
        if count == 0:
            try:
                response = send_response(received_message)
                data = {'message': response, 'status': 200}
            except:
                with open('questions.txt', 'a') as f:
                    f.write(received_message + "\n")
                response = "Sorry, I didn't Get You"
                data = {'message': response, 'status': 422}
            return data
        if count == 1:
            if received_message.isalnum():
                if SignUp.query.filter_by(username=received_message).first():
                    data = {'message': "This username is already Taken", 'status': 422}
                    return data

                data = {'value': received_message, 'message': "Enter your valid email address", 'status': 200}
                return data
            else:
                data = {'message': "Please enter valid username", 'status': 422}
                return data
        elif count == 2:
            if re.fullmatch(regex, received_message):
                if SignUp.query.filter_by(email=received_message).first():
                    data = {'message': "This email is already Taken", 'status': 422}
                    return data

                data = {'value': received_message, 'message': "Enter your age", 'status': 200}
                return data
            else:
                data = {'message': "Please enter valid email address", 'status': 422}
                return data
        elif count == 3:
            if int(received_message) <= 100:
                user = SignUp(username=user_data['username'], email=user_data['email'], age=int(received_message))
                db.session.add(user)
                db.session.commit()
                data = {'value': received_message, 'message': "You are registered successfully!!!", 'status': 200}
                response = make_response(data)
                response.set_cookie('user', user_data['email'])
                return response
            else:
                data = {'message': "Please enter valid age", 'status': 422}
                return data
    else:
        try:
            response = send_response(received_message)
        except:
            with open('questions.txt', 'a') as f:
                f.write(received_message + "\n")
            response = "Sorry, I didn't Get You"
        data = {'message': response, 'status': 200}
        return data

# @api.route('/register', methods=['POST', 'GET'])
# def register():
#     if 'response' in session:
#         return redirect('/chatbot')
#     form = RegistrationForm()
#     if form.validate_on_submit():
#         user = SignUp(username=form.username.data, email=form.email.data, age=form.age.data)
#         db.session.add(user)
#         db.session.commit()
#         session['response'] = form.username.data
#         return redirect('/')
#     return render_template('registration.html', form=form)
