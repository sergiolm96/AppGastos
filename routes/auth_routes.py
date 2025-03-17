from flask import Blueprint, request, jsonify, render_template, session, redirect, url_for
from services.user_service import create_user
from models.user import Usuario

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['GET', 'POST'])
def register_user():
    if request. method == 'GET':
        return render_template('register_user.html')
    
    if request.method == 'POST':
        data = {
            'nombre_usuario': request.form.get('nombre_usuario'),
            'email': request.form.get('email'),
            'password': request.form.get('password')
        }
        
        result = create_user(data)
        if isinstance(result, dict) and "error" in result:
            return jsonify(result), 400
        
        return jsonify({"message": "Usuario registrado correctamente"}), 201
    

@auth_bp.route('/login', methods=['GET', 'POST'])
def login_user():
    if request.method == 'GET':
        return render_template('login.html')
    
    if request.method == 'POST':
        data = request.form.to_dict()
        username = data.get('nombre_usuario')
        password = data.get('password')

        if not username or not password:
            return jsonify({"error": "Faltan credenciales"}), 400
        
        user = Usuario.query.filter_by(nombre_usuario=username).first()
        if user and user.check_password(password):
            session['user_id'] = user.id
            return jsonify({"message": "Bienvenido"}), 200
        else:
            return jsonify({"error": "Credenciales incorrectas"}), 401