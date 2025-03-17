from flask import Flask, render_template
from database import db
import os
from routes.expenses_routes import expense_bp
from routes.auth_routes import auth_bp

app = Flask(__name__)

# Configuración de la base de datos (SQLite en este caso)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///expenses.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

app.secret_key = os.environ.get('SECRET_KEY', 'una_clave_secreta_por_defecto')

# Inicializar la base de datos
db.init_app(app)

# Registrar los Blueprints (rutas separadas)
app.register_blueprint(expense_bp, url_prefix="/api")
app.register_blueprint(auth_bp)

# Crear las tablas si no existen
with app.app_context():
    db.create_all()

@app.route('/')
def index():
    return render_template('index.html')  

if __name__ == "__main__":
    app.run(debug=True)