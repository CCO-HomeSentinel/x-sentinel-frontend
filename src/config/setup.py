import os
import sys
from dotenv import load_dotenv

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from connection.MySQLConnection import MySQLConnection
from api.app import create_app
from connection.MySQLConnection import MySQLConnection

load_dotenv()

def setup_database():
    mysql = MySQLConnection()
    global connection
    connection = mysql.get_connection()

    
def get_connection():
    return connection


def setup_api():
    app = create_app()
    return app