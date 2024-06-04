import os
import sys
from decimal import Decimal
import json

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from config.logger import logger
from connection.MySQLConnection import MySQLConnection


def converter_mapeamento_para_json(dados):
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


def converter_residencia_para_json(dados):
    if dados:
        dicionario = {
            "cliente": {
                "id": dados[0],
                "nome": dados[1],
                "sobrenome": dados[2],
                "cpf": dados[3],
                "rg": dados[4],
                "email": dados[5],
                "senha": dados[6],
                "foto_url": dados[7],
                "habilitado": dados[8]
            },
            "residencia": {
                "id": dados[9],
                "nome": dados[10],
                "habilitado": dados[11],
                "cliente_id": dados[12]
            },
            "endereco": {
                "id": dados[13],
                "latitude": float(dados[14]),
                "longitude": float(dados[15]),
                "logradouro": dados[16],
                "numero": dados[17],
                "bairro": dados[18],
                "cidade": dados[19],
                "estado": dados[20],
                "cep": dados[21],
                "referencia": dados[22],
                "habilitado": dados[23],
                "residencia_id": dados[24]
            }
        }
        
        return dicionario


def get_mapeamento():
    connection = MySQLConnection()
    mapeamento = connection.get_mapping()

    mapeamento_json = converter_mapeamento_para_json(mapeamento)
    return mapeamento_json


def logar(email, senha):
    connection = MySQLConnection()
    cliente = connection.get_login(email, senha)

    if cliente:
        return cliente
    else:
        return None
    

def get_residencia(id):
    connection = MySQLConnection()
    residencia = connection.get_residencia(id)
    residencia_json = converter_residencia_para_json(residencia)

    if residencia_json:
        return residencia_json
    else:
        return None