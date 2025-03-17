from models.expense_schema import ExpenseSchema
from models.expense import Gasto
from database import db

def create_expense(data):
    try:
        valid_data = ExpenseSchema(**data)  # Valida los datos con Pydantic
        new_expense = Gasto(
            concepto=valid_data.concepto,
            cantidad=valid_data.cantidad,
            categoria_id=valid_data.categoria_id
        )
        db.session.add(new_expense)
        db.session.commit()
        return new_expense
    except Exception as e:
        return {"error": str(e)}
