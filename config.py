import os
from dotenv import load_dotenv
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager

# Cargar variables de entorno
load_dotenv()

class Config:
    """Configuración de la aplicación"""
    SECRET_KEY = os.getenv("SECRET_KEY", "una_clave_por_defecto")
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "sqlite:///database.db")
    SQLALCHEMY_TRACK_MODIFICATIONS = False

# Inicializar extensiones
db = SQLAlchemy()
login_manager = LoginManager()
login_manager.login_view = "auth.login"
