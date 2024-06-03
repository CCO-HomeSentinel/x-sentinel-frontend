import os
import sys
import jwt
import datetime
from flask import request, jsonify
from functools import wraps
from dotenv import load_dotenv

load_dotenv()

JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM")
SECRET_KEY = os.getenv
JWT_SECONDS = os.getenv("JWT_SECONDS")


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'x-access-token' in request.headers:
            token = request.headers['x-access-token']
        if not token:
            return jsonify({'message': 'Token requerido!'}), 401
        try:
            data = jwt.decode(token, JWT_SECRET_KEY, algorithms=["HS256"])
            current_user = data['email']
        except:
            return jsonify({'message': 'Token inválido!'}), 401
        return f(current_user, *args, **kwargs)
    return decorated


def generate_token(email):
    token = jwt.encode({
        'email': email,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(seconds=int(JWT_SECONDS))
    }, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)
    return token


def get_email_from_token(token):
    try:
        data = jwt.decode(token, JWT_SECRET_KEY, algorithms=["HS256"])
        return data['email']
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None