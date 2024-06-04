from flask import Flask, render_template, request
import os
import sys
from flask import Flask, render_template, request, redirect, url_for, jsonify, make_response
from dotenv import load_dotenv
from .config.auth import generate_token, token_required


sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from config.logger import logger
from service.clientes import get_mapeamento, logar

load_dotenv()

FLASK_ENDPOINT = os.getenv("FLASK_ENDPOINT")

def create_app():
    app = Flask(__name__)

    @app.route('/')
    def home():
        logger.log("info", "Endpoint / acessado.")
        mapeamento = get_mapeamento()
        return render_template('index.html')
    
    @app.route('/login', methods=['POST'])
    def login():
        data = request.get_json()
        email = data['email']
        password = data['password']

        cliente = logar(email, password)

        if cliente:
            token = generate_token(email)
            return jsonify({'token': token}), 200

        return jsonify({"message": "Usuário ou senha inválidos."}), 401

    
    @app.route('/main')
    def main():
        return render_template('main.html')

    return app


def accepted(message):
    return jsonify({"message": message}), 202


def bad_request(message):
    return jsonify({"error": message}), 400