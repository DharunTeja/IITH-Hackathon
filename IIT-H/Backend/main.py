from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
from config import settings
from database import engine, Base
from app.api import (
    auth,
    patients,
    doctors,
    medications,
    reminders,
    symptom_diary,
    messages,
    appointments,
    health_records,
    prescriptions,
)

# Create database tables
Base.metadata.create_all(bind=engine)

# Create uploads directory
os.makedirs("uploads/prescriptions", exist_ok=True)
os.makedirs("uploads/lab_reports", exist_ok=True)
os.makedirs("uploads/medical_documents", exist_ok=True)

app = FastAPI(
    title="Healthcare Prototyper API",
    description="IIT-H Hackathon - Healthcare Management System",
    version="1.0.0",
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files for uploads
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(patients.router, prefix="/api/patients", tags=["Patients"])
app.include_router(doctors.router, prefix="/api/doctors", tags=["Doctors"])
app.include_router(medications.router, prefix="/api/medications", tags=["Medications"])
app.include_router(reminders.router, prefix="/api/reminders", tags=["Reminders"])
app.include_router(
    symptom_diary.router, prefix="/api/symptom-diary", tags=["Symptom Diary"]
)
app.include_router(messages.router, prefix="/api/messages", tags=["Messages"])
app.include_router(
    appointments.router, prefix="/api/appointments", tags=["Appointments"]
)
app.include_router(
    health_records.router, prefix="/api/health-records", tags=["Health Records"]
)
app.include_router(
    prescriptions.router, prefix="/api/prescriptions", tags=["Prescriptions"]
)


@app.get("/")
async def root():
    return {
        "message": "Healthcare Prototyper API",
        "version": "1.0.0",
        "docs": "/docs",
        "hackathon": "IIT-H",
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host=settings.HOST, port=settings.PORT, reload=True)
