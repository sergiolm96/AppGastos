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
        today = datetime.now().strftime('%Y-%m-%d')
        return render_template("new_expense.html", categories=EXPENSE_CATEGORIES)
    
    if request.method == "POST":
        
        categoria = request.form.get('categoria')
        cantidad = request.form.get('cantidad')
        concepto = request.form.get('concepto')
        fecha_str = request.form.get('fecha')
  
        if not categoria or not cantidad or not concepto:
            flash("Todos los campos son requeridos", "danger")
            return redirect(url_for('nuevo_gasto'))
        
        if fecha_str:
            try:
                fecha_obj = datetime.strptime(fecha_str, '%Y-%m-%d')
                fecha_formateada = fecha_obj.strftime('%d-%m-%Y')
            except ValueError:
                fecha_formateada = datetime.now().strftime('%d-%m-%Y')
        else:
            fecha_formateada = datetime.now().strftime('%d-%m-%Y')


        nuevo_gasto = Gasto(
            fecha=fecha_formateada,
            concepto=concepto,
            cantidad=float(cantidad),
            categoria=categoria,
            usuario_email=current_user.email
        )
        
        db.session.add(nuevo_gasto)
        db.session.commit()
        
        flash("Gasto registrado correctamente", "success")
        return redirect(url_for('index'))

@expense_bp.route('/gastos', methods=['GET'])
@login_required
def see_expenses():
    from config import EXPENSE_CATEGORIES
    inicio = request.args.get('inicio', None)
    fin = request.args.get('fin', None)

    query = Gasto.query.filter_by(usuario_email=current_user.email)

    categoria_id = {cat['name']: cat['id'] for cat in EXPENSE_CATEGORIES}

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
            'cantidad': float(gasto.cantidad),
            'categoria': gasto.categoria,
            'categoria_id': categoria_id.get(gasto.categoria, '8')
        }
        for gasto in gastos
    ]
    
    categorias_gasto = set([gasto['categoria'] for gasto in gastos_serializados])
    
    return render_template('see_expenses.html', gastos=gastos_serializados, categorias=categorias_gasto)