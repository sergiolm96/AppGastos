from datetime import datetime
from database import db  
class Gasto(db.Model):
    __tablename__ = 'gastos'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    fecha = db.Column(db.String, default=datetime.now().strftime('%d-%m-%Y'))
    concepto = db.Column(db.String(100))
    cantidad = db.Column(db.Float, nullable=False)
    categoria_id = db.Column(db.Integer)

    def __init__(self, fecha, concepto, cantidad, categoria_id):
        self.fecha = fecha
        self.concepto = concepto
        self.cantidad = cantidad
        self.categoria_id = categoria_id

    def __repr__(self):
        return f"<Gasto(fecha='{self.fecha}', concepto='{self.concepto}', cantidad={self.cantidad}, categoria_id={self.categoria_id})>"
