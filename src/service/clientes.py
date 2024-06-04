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
            "foto_url": item[2],
            "residencia": item[3],
            "residencia_id": item[4],
            "latitude": float(item[5]),
            "longitude": float(item[6]),
            "bairro": item[7],
            "cidade": item[8],
            "estado": item[9]
        }
        lista_json.append(dicionario)
    return lista_json


def get_mapeamento():
    connection = MySQLConnection()
    mapeamento = connection.get_mapping()

    mapeamento_json = converter_para_json(mapeamento)
    return mapeamento_json


def logar(email, senha):
    connection = MySQLConnection()
    cliente = connection.get_login(email, senha)

    if cliente:
        return cliente
    else:
        return None