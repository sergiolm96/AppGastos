from config import db, login_manager
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash

class Usuario(db.Model, UserMixin):
    __tablename__ = 'usuarios'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    usuario = db.Column(db.String(100), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)    
    
    def __init__(self, usuario, email, password):
        self.usuario = usuario
        self.email = email
        self.password = generate_password_hash(password)  

    def check_password(self, password):
        return check_password_hash(self.password, password)
    
    def __repr__(self):
        return super().__repr__() + f"<Usuario(usuario='{self.usuario}', email='{self.email}')>"
    
@login_manager.user_loader
def load_user(user_id):
    return Usuario.query.get(int(user_id))  