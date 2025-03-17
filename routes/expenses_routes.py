from flask import Blueprint, request, jsonify, render_template
from models.expense import Gasto  
from config import db  
from datetime import datetime
from flask_login import login_required


expense_bp = Blueprint("expenses", __name__)

@expense_bp.route("/gasto/nuevo", methods=["GET", "POST"])
@login_required
def add_expense():
    if request.method == "GET":
        return render_template("new_expense.html")
    
    if request.method == "POST":
        
        categoria_id = request.form.get('categoria_id')
        cantidad = request.form.get('cantidad')
        concepto = request.form.get('concepto')
  
        if not categoria_id or not cantidad:
            return jsonify({"error": "Faltan datos requeridos"}), 400
        
        # Crea una nueva instancia de Gasto
        nuevo_gasto = Gasto(
            fecha=datetime.now().strftime('%d-%m-%Y'),
            concepto=concepto,
            cantidad=float(cantidad),
            categoria_id=categoria_id
        )
        
        # Guarda el nuevo gasto en la base de datos
        db.session.add(nuevo_gasto)
        db.session.commit()
        
        return jsonify({"message": "Gasto registrado correctamente"}), 201
