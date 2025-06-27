#!/usr/bin/env python3

from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from flask_migrate import Migrate
from flask_restful import Api, Resource
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from dotenv import load_dotenv
from datetime import datetime
import os

# Load environment variables
load_dotenv()

# App setup
app = Flask(
    __name__,
    static_url_path='',
    static_folder='../client/build',
    template_folder='../client/build'
)

# Config
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URI', 'sqlite:///app.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False

# DB & API setup
metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s"
})
db = SQLAlchemy(metadata=metadata)
migrate = Migrate(app, db)
api = Api(app)
CORS(app)

# Models
from models import Staff, Owner, Pet, Appointment, Treatment, PetTreatment, Medication, Billing

# === SERIALIZERS ===
# (Your existing serialize_* functions go here...)

# === RESOURCE CLASSES ===
# (Your existing StaffList, OwnerList, PetList, etc. go here...)

# === API ROUTES ===
api.add_resource(StaffList, '/api/staff')
api.add_resource(OwnerList, '/api/owners')
api.add_resource(PetList, '/api/pets')
api.add_resource(PetDetail, '/api/pets/<int:id>')
api.add_resource(AppointmentList, '/api/appointments')
api.add_resource(TreatmentList, '/api/treatments')
api.add_resource(MedicationList, '/api/medications')
api.add_resource(BillingList, '/api/billings')

# === REACT FRONTEND ROUTING ===

@app.route('/')
def serve_index():
    return render_template("index.html")

@app.errorhandler(404)
def catch_all(e):
    return render_template("index.html")

# Optional: for running locally
if __name__ == '__main__':
    app.run(port=5555, debug=True)
