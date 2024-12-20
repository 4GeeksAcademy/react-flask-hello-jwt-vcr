"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity


api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)

# Fazer login
@api.route("/token", methods=["POST"])
def create_token():
    email = request.json.get("email", None)
    password = request.json.get("password", None)
    if not email or not password: 
        return jsonify({"msg": "Email and password required"})
    user = User.query.filter_by(email = email, password = password).first()
    if not user: 
        return jsonify({"msg": "Email or password incorrect"})
    

    access_token = create_access_token(identity=email)
    return jsonify(access_token=access_token)

# Criar user
@api.route("/register", methods=["POST"])
def register():
    email = request.json.get("email", None)
    password = request.json.get("password", None)
    if not email or not password:
        return jsonify({"msg": "Email and password are required"}), 400

    user_exists = User.query.filter_by(email=email).first()
    if user_exists:
        return jsonify({"msg": "User already exists"}), 409

    new_user = User(email=email, password=password)
    db.session.add(new_user)
    db.session.commit()

    # Gera o token JWT para o novo usuário
    access_token = create_access_token(identity=email)

    return jsonify({
        "msg": "User registered successfully",
        "access_token": access_token
    }), 201


# Validar o token
@api.route("/validate-token", methods=["POST"])
@jwt_required()
def validate_token():
    current_user = get_jwt_identity()
    return jsonify({"msg": "Token is valid", "user": current_user}), 200


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200
