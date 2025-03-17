from models.user import Usuario
from models.user_schema import UserSchema
from config import db
from sqlalchemy.exc import IntegrityError


def create_user(data):
    """
    Recibe un diccionario con los datos del usuario: username, email, password.
    Valida y crea un nuevo usuario en la base de datos.
    """
    try:
        valid_data = UserSchema(**data) 

        if Usuario.query.filter(Usuario.usuario == valid_data.usuario).first():
            return {"error": "El nombre de usuario no está disponible"}
        if Usuario.query.filter(Usuario.email == valid_data.email).first():
            return {"error": "El email ya está en uso"}
        
        new_user = Usuario(
            usuario=valid_data.usuario,
            email=valid_data.email,
            password=valid_data.password # NO ENCRIPTAR AQUI, LO HACE EL MODELO
        )
        db.session.add(new_user)
        db.session.commit()
        return {"message": "Usuario registrado exitosamente"}
        
    except IntegrityError:
        db.session.rollback()  # Importante para evitar bloqueos en la BD
        return {"error": "Este usuario o email ya están en uso"}
    except Exception as e:
        return {"error": str(e)}
