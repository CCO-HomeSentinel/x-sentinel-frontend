import os
import sys
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from config.logger import logger

load_dotenv()

MYSQL_HOST = os.getenv("MYSQL_HOST")
MYSQL_PORT = int(os.getenv("MYSQL_PORT"))
MYSQL_DATABASE = os.getenv("MYSQL_DATABASE")
MYSQL_USERNAME = os.getenv("MYSQL_USERNAME")
MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD")


class MySQLConnection:
    def __init__(self):
        try:
            self.engine = create_engine(
                f"mysql://{MYSQL_USERNAME}:{MYSQL_PASSWORD}@"
                f"{MYSQL_HOST}:{MYSQL_PORT}"
            )

        except Exception as e:
            logger.log("error", f"Erro ao conectar com o banco de dados. {e}")


    def get_database(self):
        return MYSQL_DATABASE


    def close_connection(self):
        self.engine.dispose()


    def return_dict(self, obj):
        return {col.name: getattr(obj, col.name) for col in obj.__table__.columns}


    def execute_select_query(self, query):
        try:
            with self.engine.connect() as connection:
                result = connection.execute(text(query))
                results = result.fetchall()
                return results
        except Exception as e:
            logger.log("error", f"Erro ao executar query de select. {e}")
            return []


    def execute_single_select_query(self, query):
        try:
            with self.engine.connect() as connection:
                result = connection.execute(text(query))
                results = result.fetchone()
                return results
        except Exception as e:
            logger.log("error", f"Erro ao executar query de select. {e}")
            return []


    def get_mapping(self):
        query = """
            SELECT 
            	cl.id, 
                CONCAT(cl.nome, ' ', cl.sobrenome) nome,
                cl.foto_url,
                re.nome,
                re.id,
                en.latitude, 
                en.longitude, 
                en.bairro,
                en.cidade,
                en.estado
            FROM home_sentinel.cliente cl
                JOIN home_sentinel.residencia re ON re.cliente_id = cl.id
            	JOIN home_sentinel.endereco en ON en.residencia_id = re.id
            ORDER BY cl.id;"""

        return self.execute_select_query(query)


    def get_login(self, email, senha):
        query = f"""
            SELECT id, nome, email
            FROM x_sentinel.usuario
            WHERE email = '{email}' AND senha = MD5('{senha}');
        """

        result = self.execute_single_select_query(query)

        if result:
            return result
        else:
            return None

    def get_residencia(self, id):
        query = f"""
            SELECT 
	            cl.*,
                re.*, 
                en.*,
                CONCAT(tl.codigo_discagem, ' (', tl.codigo_area, ') ', tl.numero) telefone
            FROM home_sentinel.cliente cl
                JOIN home_sentinel.residencia re ON re.cliente_id = cl.id
	            JOIN home_sentinel.endereco en ON en.residencia_id = re.id
                JOIN home_sentinel.telefone tl ON tl.cliente_id = cl.id
                        WHERE re.id = {id};
        """

        result = self.execute_single_select_query(query)

        if result:
            return result
        else:
            return None

    
    def get_tweets_by_residencia_id(self, residencia_id):
        query = f"""
            SELECT 
                tw.id,
                tw.nome,
                tw.texto,
                tw.data_post,
                tw.palavra_chave,
                tw.is_palavrao,
                tw.residencia_id
            FROM x_sentinel.tweet tw
            WHERE tw.residencia_id = {residencia_id};
        """

        return self.execute_select_query(query)
    

    def get_tweets_by_residencia_id_and_palavras(self, residencia_id, palavras):
        like_clauses = ' OR '.join([f"tw.texto LIKE '%{palavra}%'" for palavra in palavras])
    
        query = f"""
            SELECT 
                tw.id,
                tw.nome,
                tw.texto,
                tw.data_post,
                tw.palavra_chave,
                tw.is_palavrao,
                tw.residencia_id
            FROM x_sentinel.tweet tw
            WHERE tw.residencia_id = {residencia_id} AND ({like_clauses});
        """

        return self.execute_select_query(query)
    

    def get_tweets_by_residencia_id_and_palavra(self, residencia_id, palavra):
        query = f"""
            SELECT 
                tw.id,
                tw.nome,
                tw.texto,
                tw.data_post,
                tw.palavra_chave,
                tw.is_palavrao,
                tw.residencia_id
            FROM x_sentinel.tweet tw
            WHERE tw.residencia_id = {residencia_id} AND tw.texto LIKE '%{palavra}%';
        """

        return self.execute_select_query(query)
