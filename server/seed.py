#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc, uniform

# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import db, Staff, Owner, Pet, Appointment, Treatment, PetTreatment, Medication, Billing
from datetime import datetime, timedelta

if __name__ == '__main__':
    fake = Faker()
    with app.app_context():
        print("Starting seed...")

        # Clear existing data
        print("Deleting existing data...")
        db.session.query(PetTreatment).delete()
        db.session.query(Medication).delete()
        db.session.query(Appointment).delete()
        db.session.query(Treatment).delete()
        db.session.query(Billing).delete()
        db.session.query(Pet).delete()
        db.session.query(Owner).delete()
        db.session.query(Staff).delete()
        db.session.commit()

        # Seed Staff
        print("Seeding Staff...")
        roles = ['Veterinarian', 'Receptionist', 'Technician', 'Assistant']
        staff_list = []
        for _ in range(10):
            staff = Staff(
                name=fake.name(),
                role=rc(roles),
                email=fake.unique.email(),
                phone=fake.phone_number()
            )
            db.session.add(staff)
            staff_list.append(staff)
        db.session.commit()

        # Seed Owners and Pets
        print("Seeding Owners and Pets...")
        species_list = ['Dog', 'Cat', 'Bird', 'Rabbit', 'Reptile']
        sex_list = ['Male', 'Female']
        color_list = ['Black', 'White', 'Brown', 'Golden', 'Spotted', 'Gray']
        owners_list = []
        pets_list = []
        for _ in range(20):
            owner = Owner(
                name=fake.name(),
                email=fake.unique.email(),
                phone=fake.phone_number()
            )
            db.session.add(owner)
            owners_list.append(owner)
            # Each owner has 1-3 pets
            for _ in range(randint(1, 3)):
                pet = Pet(
                    name=fake.first_name(),
                    species=rc(species_list),
                    breed=fake.word().capitalize(),
                    sex=rc(sex_list),
                    color=rc(color_list),
                    dob=fake.date_of_birth(tzinfo=None, minimum_age=1, maximum_age=15),
                    medical_notes=fake.text(max_nb_chars=200),
                    owner=owner
                )
                db.session.add(pet)
                pets_list.append(pet)
        db.session.commit()

        # Seed Appointments
        print("Seeding Appointments...")
        appointments_list = []
        for _ in range(30):
            appointment = Appointment(
                date=fake.date_time_between(start_date='-1y', end_date='now'),
                reason=fake.sentence(nb_words=6),
                pet=rc(pets_list),
                staff=rc(staff_list)
            )
            db.session.add(appointment)
            appointments_list.append(appointment)
        db.session.commit()

        # Seed Treatments and PetTreatments
        print("Seeding Treatments and PetTreatments...")
        treatments_list = []
        for _ in range(25):
            staff_member = rc(staff_list)
            treatment = Treatment(
                date=fake.date_time_between(start_date='-1y', end_date='now'),
                description=fake.text(max_nb_chars=200),
                staff=staff_member
            )
            db.session.add(treatment)
            treatments_list.append(treatment)
        db.session.commit()

        pet_treatments_list = []
        for treatment in treatments_list:
            # Assign 1-2 pets to each treatment
            assigned_pets = set()
            for _ in range(randint(1, 2)):
                pet = rc(pets_list)
                # Avoid duplicate pet-treatment pairs
                if pet.id in assigned_pets:
                    continue
                assigned_pets.add(pet.id)
                pet_treatment = PetTreatment(
                    pet=pet,
                    treatment=treatment,
                    treatment_date=treatment.date,
                    notes=fake.text(max_nb_chars=100)
                )
                db.session.add(pet_treatment)
                pet_treatments_list.append(pet_treatment)
        db.session.commit()

        # Seed Medications
        print("Seeding Medications...")
        medication_names = ['Amoxicillin', 'Prednisone', 'Metronidazole', 'Carprofen', 'Enrofloxacin']
        for treatment in treatments_list:
            # Each treatment has 0-3 medications
            for _ in range(randint(0, 3)):
                medication = Medication(
                    name=rc(medication_names),
                    dosage=f"{randint(1, 500)} mg",
                    frequency=f"{randint(1, 3)} times a day",
                    treatment=treatment
                )
                db.session.add(medication)
        db.session.commit()

        # Seed Billings
        print("Seeding Billings...")
        for pet in pets_list:
            # Each pet has 0-3 billings
            for _ in range(randint(0, 3)):
                billing = Billing(
                    date=fake.date_time_between(start_date='-1y', end_date='now'),
                    amount=round(uniform(20.0, 500.0), 2),
                    description=fake.sentence(nb_words=6),
                    paid=rc([True, False]),
                    pet=pet
                )
                db.session.add(billing)
        db.session.commit()

        print("Seeding complete.")
