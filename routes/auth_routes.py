from flask import Blueprint, request, jsonify, render_template
from services.user_service import create_user

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