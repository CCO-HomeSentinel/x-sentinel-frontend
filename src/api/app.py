from flask import Flask, render_template, request
import os
import sys
from flask import Flask, render_template, request, redirect, url_for, jsonify
from dotenv import load_dotenv
from config.auth import generate_token, token_required


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
        email = request.form['email']
        password = request.form['password']

        cliente = logar(email, password)
        if cliente:
            return redirect(url_for('main'))
        else:
            return redirect(url_for('home', error=1))
        
    @app.route('/main')
    def main():
        return render_template('main.html')

    return app


def accepted(message):
    return jsonify({"message": message}), 202


def bad_request(message):
    return jsonify({"error": message}), 400