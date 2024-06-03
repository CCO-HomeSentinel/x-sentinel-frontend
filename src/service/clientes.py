import os
import sys
from decimal import Decimal
import json

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from config.logger import logger
from connection.MySQLConnection import MySQLConnection


def converter_para_json(dados):
    lista_json = []
    for item in dados:
        dicionario = {
            "id_cliente": item[0],
            "nome": item[1],
            "residencia": item[2],
            "latitude": float(item[3]),
            "longitude": float(item[4]),
            "bairro": item[5],
            "cidade": item[6]
        }
        lista_json.append(dicionario)
    return lista_json


def get_mapeamento():
    connection = MySQLConnection()
    mapeamento = connection.get_mapping()

    mapeamento_json = converter_para_json(mapeamento)
    return mapeamento_json
