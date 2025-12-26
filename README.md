## IITH-Hackathon

# 1. Frontend setup 
```sh
# Step 1: Clone the repository using the project's Git URL.
git clone https://github.com/DharunTeja/IITH-Hackathon.git

# Step 2: Navigate to the project directory.
cd Frontend

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

# 2. Creaet Database

```bash
   # Open PowerShell as Administrator
   # Login to PostgreSQL
   psql -U postgres
   
   # Create database
   CREATE DATABASE healthcare_db;
   
   # Create user (optional, for better security)
   CREATE USER healthcare_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE healthcare_db TO healthcare_user;
   
   # Exit
   \q
```
# 3. Create Initial Migration
```bash
# Generate migration from models
alembic revision --autogenerate -m "Initial tables"

# Apply migration
alembic upgrade head
```

# 4. Backend setup
```sh
cd Backend

#Create Virtual Environment
python -m venv venv

#Activate environment
venv\Scripts\activate

#Install Dependancies
pip install -r requirements.txt

#copy example env file
cp .env.example .env

#edit .env with your configuration
nano .env
```

### Run the API Server
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Access the API
- API Documentation: http://localhost:8000/docs
- Alternative Docs: http://localhost:8000/redoc
- Health Check: http://localhost:8000/

## API Endpoints 
Authentication

- POST ```/api/auth/register``` - Register user
- POST ```/api/auth/login``` - Login user
- GET ```/api/auth/me``` - Get current user

Patient Support

- GET ```/api/medications``` - List medications
- POST ```/api/medications``` - Add medication
- PUT ```/api/medications/{id}``` - Update medication
- DELETE ```/api/medications/{id}``` - Delete medication
- POST ```/api/symptom-diary``` - Add symptom entry
- GET ```/api/symptom-diary``` - View symptom history
- GET ```/api/reminders``` - List reminders
- POST ```/api/reminders``` - Create reminder
- GET ```/api/patients/dashboard``` - Patient dashboard

Communication

- GET ```/api/messages``` - Get messages
- POST ```/api/messages``` - Send message
- GET ```/api/messages/chat/{user_id}``` - Chat history

Healthcare Management

- GET ```/api/appointments``` - List appointments
- POST ```/api/appointments``` - Request appointment
- PUT ```/api/appointments/{id}``` - Update status (doctor)
- GET ```/api/health-records``` - View records
- POST ```/api/health-records``` - Upload record
- GET ```/api/prescriptions``` - List prescriptions
- POST ```/api/prescriptions``` - Create prescription (doctor)

Doctor Features

- GET ```/api/doctors/patients``` - List patients

- GET ```/api/doctors/patient/{id}/records``` - Patient history


