import os
from src.config.setup import setup_database, setup_api
from src.config.logger import logger
from dotenv import load_dotenv

load_dotenv()
PORT = int(os.getenv("FLASK_PORT", 80))
FLASK_DEBUG = os.getenv("FLASK_DEBUG", "False").lower() == "true"


def main():
    logger.log("info", "Iniciando aplicação")
    
    setup_database()
    logger.log("info", "Banco de dados conectado com sucesso.")

    app = setup_api()
    app.run(debug=FLASK_DEBUG, port=PORT)
    logger.log("info", "Aplicação iniciada com sucesso.")


if __name__ == '__main__':
    main()    