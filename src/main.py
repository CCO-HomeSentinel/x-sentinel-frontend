import os
from config.setup import setup_api
from config.logger import logger
from dotenv import load_dotenv

load_dotenv()
PORT = int(os.getenv("FLASK_PORT", 80))
FLASK_DEBUG = os.getenv("FLASK_DEBUG", "False").lower() == "true"


def main():
    logger.log("info", "Iniciando aplicação")
    
    app = setup_api()
    app.run(host="0.0.0.0", debug=FLASK_DEBUG, port=PORT)
    logger.log("info", "Aplicação iniciada com sucesso.")


if __name__ == '__main__':
    main()    