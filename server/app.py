#!/usr/bin/env python3
import os
from datetime import datetime
from flask import Flask, request, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_restful import Api, Resource
from flask_cors import CORS
from sqlalchemy.orm import joinedload

# --- App Initialization ---
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("DATABASE_URL", "sqlite:///app.db")
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
migrate = Migrate(app, db)
api = Api(app)

# --- CORS ---
env = os.getenv("FLASK_ENV", "development")

if env == "production":
    CORS(app, origins=["https://duncare.onrender.com"])
else:
    CORS(app, origins=["http://localhost:5173", "https://duncare-backend.onrender.com"])

# --- Models ---
class Staff(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    role = db.Column(db.String)
    email = db.Column(db.String)
    phone = db.Column(db.String)
    appointments = db.relationship("Appointment", backref="staff", cascade="all, delete")
    treatments = db.relationship("Treatment", backref="staff", cascade="all, delete")

class Owner(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    email = db.Column(db.String)
    phone = db.Column(db.String)
    pets = db.relationship("Pet", backref="owner", cascade="all, delete")

class Pet(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    species = db.Column(db.String)
    breed = db.Column(db.String)
    sex = db.Column(db.String)
    color = db.Column(db.String)
    dob = db.Column(db.Date)
    medical_notes = db.Column(db.Text)
    owner_id = db.Column(db.Integer, db.ForeignKey('owner.id'))
    appointments = db.relationship("Appointment", backref="pet", cascade="all, delete")
    billings = db.relationship("Billing", backref="pet", cascade="all, delete")
    pet_treatments = db.relationship("PetTreatment", backref="pet", cascade="all, delete")

class Appointment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.DateTime)
    reason = db.Column(db.String)
    pet_id = db.Column(db.Integer, db.ForeignKey('pet.id'))
    staff_id = db.Column(db.Integer, db.ForeignKey('staff.id'))

class Treatment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.DateTime)
    description = db.Column(db.Text)
    staff_id = db.Column(db.Integer, db.ForeignKey('staff.id'))
    pet_treatments = db.relationship("PetTreatment", backref="treatment", cascade="all, delete")
    medications = db.relationship("Medication", backref="treatment", cascade="all, delete")

class PetTreatment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    pet_id = db.Column(db.Integer, db.ForeignKey('pet.id'))
    treatment_id = db.Column(db.Integer, db.ForeignKey('treatment.id'))
    treatment_date = db.Column(db.DateTime)
    notes = db.Column(db.Text)

class Medication(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    dosage = db.Column(db.String)
    frequency = db.Column(db.String)
    treatment_id = db.Column(db.Integer, db.ForeignKey('treatment.id'))

class Billing(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    pet_id = db.Column(db.Integer, db.ForeignKey('pet.id'))
    date = db.Column(db.DateTime)
    amount = db.Column(db.Float)
    description = db.Column(db.String)
    paid = db.Column(db.Boolean, default=False)


# --- Register API Routes ---
api.add_resource(StaffList, '/api/staff')
api.add_resource(OwnerList, '/api/owners')
api.add_resource(PetList, '/api/pets')
api.add_resource(PetDetail, '/api/pets/<int:id>')
api.add_resource(AppointmentList, '/api/appointments')
api.add_resource(TreatmentList, '/api/treatments')
api.add_resource(MedicationList, '/api/medications')
api.add_resource(BillingList, '/api/billings')
api.add_resource(BillingDetail, '/api/billings/<int:id>')

# --- Routes ---
@app.route('/')
def index():
    return render_template("index.html")

@app.errorhandler(404)
def not_found(e):
    if request.path.startswith('/api/'):
        return jsonify({"error": "Not Found"}), 404
    return render_template("index.html"), 404

# --- Entry Point ---
if __name__ == '__main__':
    app.run(debug=True, port=5555)
