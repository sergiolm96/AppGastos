from datetime import datetime
from config import db  
class Gasto(db.Model):
    __tablename__ = 'gastos'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    fecha = db.Column(db.String, default=datetime.now().strftime('%d-%m-%Y'))
    concepto = db.Column(db.String(100))
    cantidad = db.Column(db.Float, nullable=False)
    categoria_id = db.Column(db.Integer)
    usuario_id = db.Column(db.Integer, db.ForeignKey('usuarios.id'), nullable=False)

    usuario = db.relationship('Usuario', backref='gastos')

    def __init__(self, fecha, concepto, cantidad, categoria_id, usuario_id):
        self.fecha = fecha
        self.concepto = concepto
        self.cantidad = cantidad
        self.categoria_id = categoria_id
        self.usuario_id = usuario_id

    def __repr__(self):
        return f"<Gasto(fecha='{self.fecha}', concepto='{self.concepto}', cantidad={self.cantidad}, categoria_id={self.categoria_id})>"
