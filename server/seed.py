#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc, uniform
from datetime import datetime, timedelta

# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import db, Staff, Owner, Pet, Appointment, Treatment, PetTreatment, Medication, Billing

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

        #Staff
        print("Seeding Staff...")
        staff_list = []
        receptionist = Staff(
            name=fake.name(),
            role="Receptionist",
            email=fake.unique.email(),
            phone=fake.phone_number()
        )
        accountant = Staff(
            name=fake.name(),
            role="Accountant",
            email=fake.unique.email(),
            phone=fake.phone_number()
        )
        db.session.add(receptionist)
        db.session.add(accountant)
        staff_list.extend([receptionist, accountant])

        roles = ['Veterinarian', 'Technician', 'Assistant']
        for _ in range(8):
            staff = Staff(
                name=fake.name(),
                role=rc(roles),
                email=fake.unique.email(),
                phone=fake.phone_number()
            )
            db.session.add(staff)
            staff_list.append(staff)
        db.session.commit()

        # Owners and Pets
        print("Seeding Owners and Pets...")
        species_list = ['Dog', 'Cat', 'Bird', 'Rabbit', 'Reptile']
        breeds = {
            'Dog': ['Labrador', 'German Shepherd', 'Beagle', 'Bulldog', 'Boerboel'],
            'Cat': ['Siamese', 'Persian', 'Maine Coon', 'Ragdoll', 'Sphynx'],
            'Bird': ['Parakeet', 'Canary', 'Cockatiel', 'Lovebird'],
            'Rabbit': ['Holland Lop', 'Netherland Dwarf', 'Mini Rex'],
            'Reptile': ['Leopard Gecko', 'Corn Snake', 'Bearded Dragon', 'Chameleon']
        }
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

            for _ in range(randint(1, 3)):
                species = rc(species_list)
                breed = rc(breeds[species])
                pet = Pet(
                    name=fake.first_name(),
                    species=species,
                    breed=breed,
                    sex=rc(sex_list),
                    color=rc(color_list),
                    dob=fake.date_of_birth(minimum_age=1, maximum_age=15),
                    medical_notes=fake.sentence(nb_words=10),
                    owner=owner
                )
                db.session.add(pet)
                pets_list.append(pet)
        db.session.commit()

        # Appointments
        print("Seeding Appointments...")
        appointment_reasons = [
            "Vaccination checkup", "Annual physical exam", "Dental cleaning",
            "Surgery consultation", "Skin condition evaluation", "Wound care follow-up",
            "Behavioral concern", "Nutritional advice", "Fever and lethargy", 
            "Limping and joint pain", "Flea infestation", "Routine blood work"
        ]
        appointments_list = []
        for _ in range(30):
            appointment = Appointment(
                date=fake.date_time_between(start_date='-1y', end_date='now'),
                reason=rc(appointment_reasons),
                pet=rc(pets_list),
                staff=rc(staff_list)
            )
            db.session.add(appointment)
            appointments_list.append(appointment)
        db.session.commit()

        # Seed Treatments and PetTreatments
        print("Seeding Treatments and PetTreatments...")
        treatment_descriptions = [
            "Antibiotic injection for infection",
            "Wound cleaning and dressing",
            "Dental extraction",
            "Vaccination administration",
            "Deworming treatment",
            "Ear infection treatment",
            "Spaying procedure",
            "Emergency care for trauma",
            "Anti-fungal application",
            "Post-op follow-up"
        ]
        treatments_list = []
        for _ in range(25):
            staff_member = rc(staff_list)
            treatment = Treatment(
                date=fake.date_time_between(start_date='-1y', end_date='now'),
                description=rc(treatment_descriptions),
                staff=staff_member
            )
            db.session.add(treatment)
            treatments_list.append(treatment)
        db.session.commit()

        pet_treatments_list = []
        for treatment in treatments_list:
            assigned_pets = set()
            for _ in range(randint(1, 2)):
                pet = rc(pets_list)
                if pet.id in assigned_pets:
                    continue
                assigned_pets.add(pet.id)
                pet_treatment = PetTreatment(
                    pet=pet,
                    treatment=treatment,
                    treatment_date=treatment.date,
                    notes=fake.sentence(nb_words=12)
                )
                db.session.add(pet_treatment)
                pet_treatments_list.append(pet_treatment)
        db.session.commit()

        # Medications
        print("Seeding Medications...")
        medication_names = ['Amoxicillin', 'Prednisone', 'Metronidazole', 'Carprofen', 'Enrofloxacin']
        frequencies = ["Once daily", "Twice daily", "Every 8 hours", "As needed"]
        for treatment in treatments_list:
            for _ in range(randint(0, 3)):
                medication = Medication(
                    name=rc(medication_names),
                    dosage=f"{randint(5, 500)} mg",
                    frequency=rc(frequencies),
                    treatment=treatment
                )
                db.session.add(medication)
        db.session.commit()

        # Seed Billings
        print("Seeding Billings...")
        billing_descriptions = [
            "Consultation fee", "Vaccination charge", "Dental procedure", 
            "Medication cost", "Minor surgery", "Follow-up appointment", 
            "Emergency service", "Hospitalization fee", "X-ray imaging"
        ]
        for pet in pets_list:
            for _ in range(randint(0, 3)):
                billing_date = rc([appt.date for appt in appointments_list]) if appointments_list else fake.date_time_between(start_date='-1y', end_date='now')
                billing = Billing(
                    date=billing_date,
                    amount=round(uniform(20.0, 500.0), 2),
                    description=rc(billing_descriptions),
                    paid=rc([True, False]),
                    pet=pet
                )
                db.session.add(billing)
        db.session.commit()

        print(f"Seeded {len(staff_list)} staff")
        print(f"Seeded {len(owners_list)} owners and {len(pets_list)} pets")
        print(f"Seeded {len(appointments_list)} appointments")
        print(f"Seeded {len(treatments_list)} treatments and {len(pet_treatments_list)} pet treatments")
        print(f"Seeded medications for treatments")
        print("Seeding complete.")
