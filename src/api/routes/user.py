from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
import bcrypt
from flask import Blueprint, jsonify, request
import re
from api.database.db import db
from api.models.User import User

api = Blueprint('api/user', __name__)


def validate_email(email):
    pattern = r'^[\w\.-]+@[\w\.-]+\.\w+$'
    return re.match(pattern, email) is not None


def validate_password(password):
    if len(password) < 8:
        return False
    if not re.search(r'[A-Z]', password):
        return False
    if not re.search(r'[a-z]', password):
        return False
    if not re.search(r'\d', password):
        return False
    return True


@api.route('/signup', methods=['POST'])
def signup():
    try:
        body = request.get_json()
        required_fields = ['email', 'password']

        for field in required_fields:
            if field not in body or not body[field]:
                return jsonify({'error': f'El campo {field} es requerido'}), 400

        if not validate_email(body['email']):
            return jsonify({'error': f'Formato del email invalido'}), 400

        if not validate_password(body['password']):
            return jsonify({'error': 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número'}), 400

        existing_user = User.query.filter_by(email=body['email']).first()
        if existing_user:
            return jsonify({'error': 'El usuario ya existe'}), 400

        new_pass = bcrypt.hashpw(body['password'].encode(), bcrypt.gensalt())

        new_user = User()
        new_user.email = body['email']
        new_user.password = new_pass.decode()

        db.session.add(new_user)
        db.session.commit()

        return jsonify({'message': 'Usuario creado exitosamente'}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@api.route('/login', methods=['POST'])
def login():
    try:
        body = request.get_json()
        required_fields = ['email', 'password']

        for field in required_fields:
            if field not in body or not body[field]:
                return jsonify({'error': f'El campo {field} es requerido'}), 400

        user = User.query.filter_by(email=body['email']).first()
        if not user:
            return jsonify({'error': 'Usuario no encontrado'}), 404

        if not bcrypt.checkpw(body['password'].encode(), user.password.encode()):
            return jsonify({'error': 'Contraseña incorrecta'}), 401

        access_token = create_access_token(identity=str(user.id))

        return jsonify({
            'message': 'Login exitoso',
            'token': access_token,
            'user': user.serialize()
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@api.route('/welcome', methods=['GET'])
@jwt_required()
def protected_page():

    try:
        current_user_id = int(get_jwt_identity())
        user = User.query.get(current_user_id)
        if not user:
            return jsonify({'error': 'Usuario no encontrado'}), 404
        
        return jsonify({'message': 'Usuario con permiso de acceso'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500