from flask import Flask, render_template
from config import Config, db, login_manager

# Crear la aplicación Flask
app = Flask(__name__)
app.config.from_object(Config)

# Inicializar extensiones con el contexto de la aplicación
db.init_app(app)
login_manager.init_app(app)

# Configurar Flask-Login
login_manager.init_app(app)
login_manager.login_view = "auth.login_user" 

# Registrar los Blueprints (rutas separadas)
from routes.expenses_routes import expense_bp
from routes.auth_routes import auth_bp
app.register_blueprint(expense_bp, url_prefix="/api")
app.register_blueprint(auth_bp)

# Cargar usuario desde la base de datos
from models.user import Usuario
@login_manager.user_loader
def load_user(user_id):
    return Usuario.query.get(int(user_id))

# Crear las tablas si no existen
with app.app_context():
    db.create_all()

@app.route('/')
def index():
    return render_template('base.html')  

if __name__ == "__main__":
    app.run(debug=True)