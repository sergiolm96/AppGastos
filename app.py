from flask import Flask, render_template, redirect, url_for, request 
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models.expense import Base, Gasto


app = Flask(__name__)

DATABASE_URL = 'sqlite:///database.db'
engine = create_engine(DATABASE_URL, echo=True)

Base.metadata.create_all(engine)

Session = sessionmaker(bind=engine)
session = Session()

@app.route('/')
def home():
    expenses = session.query(Gasto).all()
    return render_template('index.html', expenses=expenses)

@app.route('/gastos')
def list_expenses():
    expenses = session.query(Gasto).all()
    return render_template('expenses.html', expenses=expenses)

@app.route('/gasto/nuevo', methods=['GET', 'POST'])
def new_expense():
    if request.method == 'POST':
        categoria_id = request.form['category']
        cantidad = float(request.form['cantidad'])
        concepto = request.form['concepto']

        expense = Gasto(cantidad=cantidad, concepto=concepto, categoria_id=categoria_id)
        session.add(expense)
        session.commit()

        return redirect(url_for('list_expenses'))
    
    return render_template('new_expense.html')

@app.route('/gasto/editar', methods=['GET', 'POST'])
def edit_expense():
    if request.method == 'POST':
        gasto_id = request.form['gasto_id']
        categoria_id = request.form['category']
        cantidad = float(request.form['cantidad'])
        concepto = request.form['concepto']

        expense = session.query(Gasto).filter_by(id=gasto_id).first()
        expense.cantidad = cantidad
        expense.concepto = concepto
        expense.categoria_id = categoria_id
        session.commit()

        return redirect(url_for('list_expenses'))
    
    gasto_id = request.args.get('id')
    expense = session.query(Gasto).filter_by(id=gasto_id).first()
    return render_template('edit_expense.html', expense=expense)

@app.route('/gasto/eliminar')
def delete_expense():
    gasto_id = request.args.get('id')
    expense = session.query(Gasto).filter_by(id=gasto_id).first()
    session.delete(expense)
    session.commit()

    return redirect(url_for('list_expenses'))

if __name__ == '__main__':
    app.run(debug=True)