from flask import Blueprint, request, flash, render_template, redirect, url_for
from models.expense import Gasto  
from config import db  
from datetime import datetime
from flask_login import login_required, current_user
import json


expense_bp = Blueprint("expenses", __name__)

@expense_bp.route("/gasto/nuevo", methods=["GET", "POST"])
@login_required
def add_expense():
    if request.method == "GET":
        from config import EXPENSE_CATEGORIES
        return render_template("new_expense.html", categories=EXPENSE_CATEGORIES)
    
    if request.method == "POST":
        
        categoria = request.form.get('categoria')
        cantidad = request.form.get('cantidad')
        concepto = request.form.get('concepto')
  
        if not categoria or not cantidad:
            flash("Todos los campos son requeridos", "danger")
            return redirect(url_for('nuevo_gasto'))

        nuevo_gasto = Gasto(
            fecha=datetime.now().strftime('%d-%m-%Y'),
            concepto=concepto,
            cantidad=float(cantidad),
            categoria=categoria,
            usuario_id=current_user.id
        )
        
        db.session.add(nuevo_gasto)
        db.session.commit()
        
        flash("Gasto registrado correctamente", "success")
        return redirect(url_for('index'))

@expense_bp.route('/gastos', methods=['GET'])
@login_required
def see_expenses():
    
    inicio = request.args.get('inicio', None)
    fin = request.args.get('fin', None)

    query = Gasto.query.filter_by(usuario_id=current_user.id)

    if inicio:
        inicio = datetime.strptime(inicio, '%Y-%m-%d')
        query = query.filter(Gasto.fecha >= inicio)
    if fin:
        fin = datetime.strptime(fin, '%Y-%m-%d')
        query = query.filter(Gasto.fecha <= fin)

    gastos = query.all()

    gastos_serializados = [
        {
            'fecha': gasto.fecha,
            'descripcion': gasto.concepto,
            'cantidad': float(gasto.cantidad)
        }
        for gasto in gastos
    ]
    
    return render_template('see_expenses.html', gastos=gastos_serializados)