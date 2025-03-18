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

# Categorias de gastos
EXPENSE_CATEGORIES = [
    {"id": "1", "name": "Comida"},
    {"id": "2", "name": "Limpieza"},
    {"id": "3", "name": "Coche"},
    {"id": "4", "name": "Ocio"},
    {"id": "5", "name": "Salud"},
    {"id": "6", "name": "Educación"},
    {"id": "7", "name": "Gatos"},
    {"id": "8", "name": "Otros"}
]