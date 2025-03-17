from database import db

class Usuario(db.Model):
    __tablename__ = 'usuarios'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nombre_usuario = db.Column(db.String(100), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)    
    
    def __init__(self, nombre_usuario, email, password):
        self.nombre_usuario = nombre_usuario
        self.email = email
        self.password = password
    
    def check_password(self, password):
        return self.password == password
    
    def __repr__(self):
        return super().__repr__() + f"<Usuario(nombre='{self.nombre_usuario}', email='{self.email}')>"