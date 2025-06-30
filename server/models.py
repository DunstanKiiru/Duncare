
from config import db
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text, Float, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime


class Staff(db.Model):
    __tablename__ = "staff"
    
    id = db.Column(Integer, primary_key=True)
    name = db.Column(String, nullable = False)
    role = db.Column(String, nullable = False)
    email = db.Column(String, nullable = False)
    phone = db.Column(String, nullable = False)
    
    appointments = relationship("Appointment", back_populates="staff", cascade="all, delete")
    treatments = relationship("Treatment", back_populates="staff", cascade="all, delete")
    
# ----- One-to-Many: Owner → Pets -----
class Owner(db.Model):
    __tablename__ = "owners"
    
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable= False)
    phone = Column(String, nullable= False)

    pets = relationship("Pet", back_populates="owner", cascade="all, delete-orphan")

class Pet(db.Model):
    __tablename__ = "pets"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable = False)
    species = db.Column(db.String)
    breed = db.Column(db.String)
    sex = db.Column(db.String)
    color = db.Column(db.String)
    dob = db.Column(db.DateTime)
    medical_notes = db.Column(db.Text)

    owner_id = db.Column(db.Integer, db.ForeignKey("owners.id"))
    owner = db.relationship("Owner", back_populates="pets")

    appointments = db.relationship("Appointment", back_populates="pet", cascade="all, delete")

    pet_treatments = db.relationship("PetTreatment", back_populates="pet", cascade="all, delete-orphan")
    treatments = db.relationship("Treatment", secondary="pet_treatments", back_populates="pets")

    billings = db.relationship("Billing", back_populates="pet", cascade="all, delete")

class Appointment(db.Model):
    __tablename__ = "appointments"

    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.DateTime)
    reason = db.Column(db.String)

    pet_id = db.Column(db.Integer, db.ForeignKey("pets.id"))
    pet = db.relationship("Pet", back_populates="appointments")

    staff_id = db.Column(db.Integer, db.ForeignKey("staff.id"))
    staff = db.relationship("Staff", back_populates="appointments")

class Treatment(db.Model):
    __tablename__ = "treatments"

    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.DateTime)
    description = db.Column(db.Text)

    staff_id = db.Column(db.Integer, db.ForeignKey("staff.id"))
    staff = db.relationship("Staff", back_populates="treatments")

    medications = db.relationship("Medication", back_populates="treatment", cascade="all, delete")

    # Many-to-many relationship with Pet via association table
    pet_treatments = db.relationship("PetTreatment", back_populates="treatment", cascade="all, delete-orphan")
    pets = db.relationship("Pet", secondary="pet_treatments", back_populates="treatments")
    
class PetTreatment(db.Model):
    __tablename__ = "pet_treatments"
    
    pet_id = db.Column(db.Integer, db.ForeignKey("pets.id"), primary_key=True)
    treatment_id = db.Column(db.Integer, db.ForeignKey("treatments.id"), primary_key=True)
    
    treatment_date = db.Column(db.DateTime, default=datetime.utcnow)
    notes = db.Column(db.Text)
    
    pet = db.relationship("Pet", back_populates="pet_treatments")
    treatment = db.relationship("Treatment", back_populates="pet_treatments")
    
class Medication(db.Model):
    __tablename__ = "medications"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    dosage = db.Column(db.String)
    frequency = db.Column(db.String)

    treatment_id = db.Column(db.Integer, db.ForeignKey("treatments.id"))
    treatment = db.relationship("Treatment", back_populates="medications")


class Billing(db.Model):
    __tablename__ = "billings"

    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.DateTime)
    amount = db.Column(db.Float)
    description = db.Column(db.String)
    paid = db.Column(db.Boolean, default=False)

    pet_id = db.Column(db.Integer, db.ForeignKey("pets.id"))
    pet = db.relationship("Pet", back_populates="billings")
