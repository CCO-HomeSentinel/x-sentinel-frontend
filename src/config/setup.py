import os
import sys
from dotenv import load_dotenv

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from api.app import create_app

load_dotenv()


def setup_api():
    app = create_app()
    return app