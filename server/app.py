#!/usr/bin/env python3
import os
from datetime import datetime
from flask import request, jsonify, render_template
from flask_restful import Resource
from flask_cors import CORS
from config import app, db, api
from models import Staff, Owner, Pet, Appointment, Treatment, PetTreatment, Medication, Billing
from sqlalchemy.orm import joinedload

# --- CORS Configuration ---
env = os.getenv("FLASK_ENV", "development")
if env == "production":
    CORS(app, resources={r"/api/*": {"origins": ["https://duncare.onrender.com"]}}, supports_credentials=True)
else:
    CORS(app, resources={r"/api/*": {"origins": "*"}})

# --- Serializers ---
def serialize_staff(staff):
    return {
        "id": staff.id,
        "name": staff.name,
        "role": staff.role,
        "email": staff.email,
        "phone": staff.phone
    }

def serialize_owner(owner):
    return {
        "id": owner.id,
        "name": owner.name,
        "email": owner.email,
        "phone": owner.phone
    }

def serialize_pet(pet):
    return {
        "id": pet.id,
        "name": pet.name,
        "species": pet.species,
        "breed": pet.breed,
        "sex": pet.sex,
        "owner_id": pet.owner_id,
        "treatments": [
            {
                "treatment_id": pt.treatment.id,
                "description": pt.treatment.description,
                "treatment_date": pt.treatment_date.isoformat() if pt.treatment_date else None,
                "notes": pt.notes
            } for pt in pet.pet_treatments
        ]
    }

def serialize_appointment(appt):
    return {
        "id": appt.id,
        "date": appt.date.isoformat() if appt.date else None,
        "reason": appt.reason,
        "pet_id": appt.pet_id,
        "staff_id": appt.staff_id
    }

def serialize_treatment(treat):
    return {
        "id": treat.id,
        "date": treat.date.isoformat() if treat.date else None,
        "description": treat.description,
        "staff_id": treat.staff_id,
        "medications": [serialize_medication(m) for m in treat.medications],
        "pets": [{"id": p.id, "name": p.name} for p in treat.pets]
    }

def serialize_medication(med):
    return {
        "id": med.id,
        "name": med.name,
        "dosage": med.dosage,
        "frequency": med.frequency,
        "treatment_id": med.treatment_id
    }

def serialize_billing(b):
    return {
        "id": b.id,
        "date": b.date.isoformat() if b.date else None,
        "amount": b.amount,
        "description": b.description,
        "paid": b.paid,
        "pet_id": b.pet_id
    }

# --- API Resources ---
class StaffList(Resource):
    def get(self):
        return [serialize_staff(s) for s in Staff.query.all()], 200

    def post(self):
        try:
            data = request.get_json()
            staff = Staff(**data)
            db.session.add(staff)
            db.session.commit()
            return serialize_staff(staff), 201
        except Exception as e:
            db.session.rollback()
            return {"error": str(e)}, 400

class OwnerList(Resource):
    def get(self):
        return [serialize_owner(o) for o in Owner.query.all()], 200

    def post(self):
        try:
            data = request.get_json()
            owner = Owner(**data)
            db.session.add(owner)
            db.session.commit()
            return serialize_owner(owner), 201
        except Exception as e:
            db.session.rollback()
            return {"error": str(e)}, 400

class PetList(Resource):
    def get(self):
        query = Pet.query
        for param in ['species', 'breed', 'sex', 'owner_id']:
            value = request.args.get(param)
            if value:
                query = query.filter(getattr(Pet, param) == value)
        return [serialize_pet(p) for p in query.all()], 200

    def post(self):
        try:
            data = request.get_json()
            pet = Pet(
                name=data["name"],
                species=data["species"],
                breed=data["breed"],
                sex=data["sex"],
                owner_id=int(data["owner_id"]) if data.get("owner_id") else None
            )
            db.session.add(pet)
            db.session.flush()
            for t in data.get("treatments", []):
                pt = PetTreatment(
                    pet=pet,
                    treatment_id=t["treatment_id"],
                    treatment_date=datetime.fromisoformat(t["treatment_date"]) if t.get("treatment_date") else None,
                    notes=t.get("notes")
                )
                db.session.add(pt)
            db.session.commit()
            return serialize_pet(pet), 201
        except Exception as e:
            db.session.rollback()
            return {"error": str(e)}, 400

class PetDetail(Resource):
    def get(self, id):
        pet = Pet.query.get_or_404(id)
        return serialize_pet(pet), 200

    def patch(self, id):
        try:
            pet = Pet.query.get_or_404(id)
            data = request.get_json()
            for field in ["name", "species", "breed", "sex", "color", "medical_notes", "owner_id"]:
                setattr(pet, field, data.get(field, getattr(pet, field)))
            pet.pet_treatments.clear()
            for t in data.get("treatments", []):
                pt = PetTreatment(
                    pet=pet,
                    treatment_id=t["treatment_id"],
                    treatment_date=datetime.fromisoformat(t["treatment_date"]) if t.get("treatment_date") else None,
                    notes=t.get("notes")
                )
                db.session.add(pt)
            db.session.commit()
            return serialize_pet(pet), 200
        except Exception as e:
            db.session.rollback()
            return {"error": str(e)}, 400

    def delete(self, id):
        pet = Pet.query.get_or_404(id)
        db.session.delete(pet)
        db.session.commit()
        return {"message": "Pet deleted"}, 200

class AppointmentList(Resource):
    def get(self):
        return [serialize_appointment(a) for a in Appointment.query.all()], 200

    def post(self):
        try:
            data = request.get_json()
            appt = Appointment(
                date=datetime.fromisoformat(data["date"]) if data.get("date") else None,
                reason=data.get("reason"),
                pet_id=data.get("pet_id"),
                staff_id=data.get("staff_id")
            )
            db.session.add(appt)
            db.session.commit()
            return serialize_appointment(appt), 201
        except Exception as e:
            db.session.rollback()
            return {"error": str(e)}, 400

class TreatmentList(Resource):
    def get(self):
        treatments = Treatment.query.options(joinedload(Treatment.pets)).all()
        return [serialize_treatment(t) for t in treatments], 200

    def post(self):
        try:
            data = request.get_json()
            date_str = data.get("date")
            treat = Treatment(
                date=datetime.fromisoformat(date_str) if date_str else None,
                description=data.get("description"),
                staff_id=data.get("staff_id")
            )
            db.session.add(treat)
            db.session.flush()

            pet_id = data.get("pet_id")
            if pet_id:
                pet_treatment = PetTreatment(
                    pet_id=pet_id,
                    treatment_id=treat.id,
                    treatment_date=datetime.fromisoformat(date_str) if date_str else None
                )
                db.session.add(pet_treatment)

            db.session.commit()
            return serialize_treatment(treat), 201
        except Exception as e:
            db.session.rollback()
            return {"error": str(e)}, 400

class MedicationList(Resource):
    def get(self):
        return [serialize_medication(m) for m in Medication.query.all()], 200

    def post(self):
        try:
            data = request.get_json()
            med = Medication(**data)
            db.session.add(med)
            db.session.commit()
            return serialize_medication(med), 201
        except Exception as e:
            db.session.rollback()
            return {"error": str(e)}, 400

class BillingList(Resource):
    def get(self):
        return [serialize_billing(b) for b in Billing.query.all()], 200

    def post(self):
        try:
            data = request.get_json()
            bill = Billing(
                pet_id=data["pet_id"],
                date=datetime.fromisoformat(data["date"]) if data.get("date") else None,
                amount=data["amount"],
                description=data["description"],
                paid=data.get("paid", False)
            )
            db.session.add(bill)
            db.session.commit()
            return serialize_billing(bill), 201
        except Exception as e:
            db.session.rollback()
            return {"error": str(e)}, 400

class BillingDetail(Resource):
    def patch(self, id):
        bill = Billing.query.get(id)
        if not bill:
            return {"error": "Not found"}, 404
        try:
            data = request.get_json()
            if "paid" in data:
                bill.paid = data["paid"]
            db.session.commit()
            return serialize_billing(bill), 200
        except Exception as e:
            db.session.rollback()
            return {"error": str(e)}, 400

class BillingDetail(Resource):
    def delete(self, id):
        bill = Billing.query.get(id)
        if not bill:
            return {"error": "Not found"}, 404
        try:
            db.session.delete(bill)
            db.session.commit()
            return {"message": "Billing record deleted"}, 200
        except Exception as e:
            db.session.rollback()
            return {"error": str(e)}, 400

        bill = Billing.query.get(id)
        if not bill:
            return {"error": "Not found"}, 404
        try:
            db.session.delete(bill)
            db.session.commit()
            return {"message": "Billing record deleted"}, 200
        except Exception as e:
            db.session.rollback()
            return {"error": str(e)}, 400

    def options(self, id):
        return '', 200

# --- API Routes ---
api.add_resource(StaffList, '/api/staff')
api.add_resource(OwnerList, '/api/owners')
api.add_resource(PetList, '/api/pets')
api.add_resource(PetDetail, '/api/pets/<int:id>')
api.add_resource(AppointmentList, '/api/appointments')
api.add_resource(TreatmentList, '/api/treatments')
api.add_resource(MedicationList, '/api/medications')
api.add_resource(BillingList, '/api/billings')
api.add_resource(BillingDetail, '/api/billings/<int:id>')

# --- Home and Error Routes ---
@app.route('/')
def index():
    return render_template("index.html")

@app.errorhandler(404)
def not_found(e):
    if request.path.startswith('/api/'):
        return jsonify({"error": "Not Found"}), 404
    return render_template("404.html"), 404
