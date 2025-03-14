from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class Gasto(Base):
    __tablename__ = 'gastos'
    id = Column(Integer, primary_key=True, autoincrement=True)
    fecha = Column(String, default=datetime.now().strftime('%d-%m-%Y'))
    concepto = Column(String(100))
    cantidad = Column(Float, nullable=False)
    categoria_id = Column(Integer)

    def __init__(self, fecha, concepto, cantidad, categoria_id):
        self.fecha = fecha
        self.concepto = concepto
        self.cantidad = cantidad
        self.categoria_id = categoria_id

    def __repr__(self):
        return "<Gasto(fecha='%s', concepto='%s', cantidad='%s', categoria_id='%s')>" % (self.fecha, self.concepto, self.cantidad, self.categoria_id)