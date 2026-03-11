import configparser
import os

config = configparser.ConfigParser()
config.read(os.path.join(os.path.dirname(__file__), "../recipe-app.ini"))

DB_HOST = config["rds"]["DB_HOST"]
DB_PORT = config["rds"]["DB_PORT"]
DB_NAME = config["rds"]["DB_NAME"]
DB_USER = config["rds"]["DB_USER"]
DB_PASSWORD = config["rds"]["DB_PASSWORD"]
