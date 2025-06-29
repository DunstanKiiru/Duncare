# Duncare - Pet Care Management Application

## Live Demo

Check out the live application here: [Duncare Live](https://duncare.onrender.com/)

---

## Introduction

Duncare is a full-stack web application designed to help veterinary clinics manage pet care services efficiently. It provides a comprehensive platform to manage pet owners, pets, clinic staff, appointments, treatments, medications, and billing — all in one place. The backend is built with Flask, providing a RESTful API, while the frontend is developed using React for a responsive and dynamic user experience.

---

## Project Structure

The project is divided into two main directories:

- `server/`: Contains the Flask backend API, database models, migrations, and seed data.
- `client/`: Contains the React frontend application, components, pages, and styles.

---

## Features

- Manage pet owners and their pets with detailed profiles.
- Schedule and track appointments for pets with clinic staff.
- Assign treatments and manage medications for pets.
- Maintain billing records and payment status.
- Responsive and user-friendly interface for easy navigation.
- Search and pagination support for large datasets.

---

## Setup Instructions

### Backend (server)

The backend is a Flask application that serves the API.

To install dependencies and activate the virtual environment, run:

```bash
pipenv install
pipenv shell
```

To start the Flask server on [http://localhost:5555](http://localhost:5555), run:

```bash
python server/app.py
```

### Frontend (client)

The frontend is a React application.

To install dependencies, run:

```bash
npm install --prefix client
```

To start the React development server on [http://localhost:3000](http://localhost:3000), run:

```bash
npm start --prefix client
```

---

## Database Setup

To initialize the database and migrations, navigate to the `server` directory and run:

```bash
flask db init
flask db upgrade head
```

You can create and apply migrations as you develop your models.

To seed the database with initial data, run the `seed.py` script:

```bash
python server/seed.py
```

---

## API Endpoints

The backend exposes the following RESTful API endpoints:

- `/api/staff` - Manage clinic staff members.
- `/api/owners` - Manage pet owners.
- `/api/pets` - Manage pets and their treatments.
- `/api/appointments` - Manage appointments between pets and staff.
- `/api/treatments` - Manage treatments assigned to pets.
- `/api/medications` - Manage medications related to treatments.
- `/api/billings` - Manage billing records and payments.

---

## Frontend Pages

- **Home**: Landing page with navigation and key features overview.
- **Pets**: View and manage pet profiles.
- **Owners**: Add and view pet owners with search and pagination.
- **Staff**: Manage clinic staff members.
- **Appointments**: Schedule and view appointments.
- **Treatments**: Manage treatments and associated medications.
- **Billing**: View and manage billing records.
- **Error**: Error handling page for invalid routes.

---

## Technologies Used

- Backend: Python, Flask, Flask-RESTful, Flask-SQLAlchemy, Flask-Migrate, Flask-CORS
- Frontend: React, React Router DOM, Vite
- Database: SQLite (default, can be changed)
- Other: Pipenv for Python dependency management, npm for frontend packages

---

## License

This project is licensed under the MIT License. See the [LICENSE.md](LICENSE.md) file for details.
