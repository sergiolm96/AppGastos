from models.user import Usuario
from models.user_schema import UserSchema
from database import db


def create_user(data):
    """
    Recibe un diccionario con los datos del usuario: username, email, password.
    Valida y crea un nuevo usuario en la base de datos.
    """
    try:
        valid_data = UserSchema(**data) 

        if Usuario.query.filter_by(Usuario.nombre_usuario == valid_data.nombre_usuario).first():
            return {"error": "El nombre de usuario no está disponible"}
        if Usuario.query.filter_by(Usuario.email == valid_data.email).first():
            return {"error": "El email ya está en uso"}
        
        new_user = Usuario(
            nombre_usuario=valid_data.nombre_usuario,
            email=valid_data.email,
            password=valid_data.password
        )
        db.session.add(new_user)
        db.session.commit()
        return new_user
        
    except Exception as e:
        return {"error": str(e)}
