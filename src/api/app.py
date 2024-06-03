from flask import Flask, render_template, request
import os
import sys
from flask import Flask, request, jsonify
from dotenv import load_dotenv

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from config.logger import logger

load_dotenv()

FLASK_ENDPOINT = os.getenv("FLASK_ENDPOINT")

def create_app():
    app = Flask(__name__)

    @app.route('/')
    def home():
        return render_template('index.html')

    return app

def accepted(message):
    return jsonify({"message": message}), 202

def bad_request(message):
    return jsonify({"error": message}), 400