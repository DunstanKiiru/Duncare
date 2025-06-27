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
class Owner(db.model):
    __tablename__ = "owners"
    
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable= False)
    phone = Column(String, nullable= False)

    pets = relationship("Pet", back_populates="owner", cascade="all, delete-orphan")