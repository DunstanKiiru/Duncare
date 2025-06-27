from config import db
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text, Float, Boolean
from sqlalchemy.orm import relationship

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

    # Many-to-many relationship with Treatment via association table with extra fields
    pet_treatments = db.relationship("PetTreatment", back_populates="pet", cascade="all, delete-orphan")
    treatments = db.relationship("Treatment", secondary="pet_treatments", back_populates="pets")

    billings = db.relationship("Billing", back_populates="pet", cascade="all, delete")

