from flask import Blueprint, request, jsonify, render_template, session, redirect, url_for, flash
from flask_login import login_required, logout_user, login_user
from services.user_service import create_user
from models.user import Usuario

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['GET', 'POST'])
def register_user():
    if request.method == 'GET':
        return render_template('register_user.html') 
    if request.method == 'POST':
        data = {
            'usuario': request.form.get('usuario'),
            'email': request.form.get('email'),
            'password': request.form.get('password')
        }
        
        result = create_user(data)
        if isinstance(result, dict) and "error" in result:
            flash(result["error"], "danger")
            return redirect(url_for('auth.register_user'))
        
        flash("Usuario registrado correctamente. Ahora puedes iniciar sesión.", "success")
        return redirect(url_for('auth.login_user'))

    

@auth_bp.route('/login', methods=['GET', 'POST'])
def login_user():
    if request.method == 'GET':
        return render_template('login.html')  
    
    if request.method == 'POST':
        data = request.form.to_dict()
        usuario = data.get('usuario')
        password = data.get('password')

        if not usuario or not password:
            flash("Faltan credenciales", "danger")
            return redirect(url_for('auth.login_user'))

        user = Usuario.query.filter_by(usuario=usuario).first()
        if user and user.check_password(password):
            session['user_id'] = user.id
            login_user(user)
            flash("Inicio de sesión exitoso", "success")
            return redirect(url_for('index'))  
        else:
            flash("Usuario o contraseña incorrectos", "danger")

    return render_template('login.html')  # Si falla, recarga la misma página

        
@auth_bp.route('/logout')
@login_required
def logout():
    logout_user()
    flash('Sesión cerrada', 'success')
    return redirect(url_for('auth.login_user'))