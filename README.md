# 🐾 pet.gov — Pet Health Monitoring & Registration Platform

A full-featured web application built with **React** and **JSON Server** for managing pet health records, veterinary appointments, and lost & found reports. Developed as a university Human-Computer Interaction project (ΥΣ08, University of Athens, 2025–2026).
You can view the website in the demo video available on my university's official YouTube channel.Check here -> https://youtu.be/fcQR_kGM0_Y?si=zjoA_h_6fOcEr7Yo
---

## 📌 Overview

**pet.gov** is a civic digital platform that connects **pet owners** and **licensed veterinarians**, enabling streamlined management of pet health data, medical records, and appointment scheduling — all in one place.

The platform supports three distinct user roles, each with a personalized experience:

- 🐶 **Pet Owners** — manage their pets' health passports, report lost/found animals, and book vet appointments
- 🩺 **Veterinarians** — register pets, log medical procedures, manage availability, and handle appointment requests
- 👤 **Guests / Citizens** — browse lost pet reports and submit found-pet notifications without needing an account

---

## ✨ Key Features

### For Pet Owners
- View and print the **health passport** (βιβλιάριο υγείας) for each registered pet
- **Report a lost pet** with draft/submit states (editable until final submission)
- **Report a found pet** with location, photo, date, and finder details
- Browse the **history of submitted reports**
- **Search for veterinarians** by area, availability (day/time), specialty, education, and experience
- **Book appointments** for pet registration or medical procedures
  - Appointment states: Confirmed / Pending / Cancelled
  - Cancellation notifies the vet; confirmation/cancellation by vet notifies the owner
  - Cancelled appointments cannot be modified
- View **appointment history**
- **Rate and review** veterinarians after visits

### For Veterinarians
- Create and manage a **professional profile** (VAT number, name, gender, education, experience, clinic address)
- **Register a new pet** (microchip number, species, gender, name, date of birth) — draft or final submission
- Log **life events** for pets: loss, found, transfer, adoption, fostering
- Record **medical procedures**: vaccinations, spaying/neutering, surgeries, and more
- View and print the pet's **full medical history**
- Set **availability slots** (days, times, procedure types)
- **Manage appointment requests** — confirm or reject; receive cancellation notifications
- View **ratings and reviews** left by owners

### For All Users
- Browse **lost pet listings** without an account
- Submit a **found-pet report** linked to an existing lost-pet listing
- **Edit profile** after login

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Create React App) |
| UI Components | Material UI |
| Backend (mock) | JSON Server |
| State Management | React Hooks + REST calls to JSON Server |
| Routing | React Router |

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 14
- npm

### Run the app

Start the mock backend (JSON Server) and the React app in two separate terminals:

```bash
# Terminal 1 – mock API
npx json-server --watch db.json --port 3001

# Terminal 2 – React app
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
src/
├── components/       # Reusable UI components
├── pages/            # Page-level components per role
├── services/         # API call helpers (JSON Server)
└── App.js            # Routing & role-based navigation
public/
db.json               # Mock database (JSON Server)
```

---

## 🎓 Academic Context

This project was built for the **Human-Computer Interaction (ΥΣ08)** course at the **Department of Informatics & Telecommunications, University of Athens**, as part of a three-phase assignment:

- **A1** — Requirements analysis & user personas
- **A2** — Illustrated scenario (storyboard / wireframes)
- **A3** — Full frontend implementation *(this repository)*

> Note: This is a frontend-only implementation. The backend is simulated using JSON Server for demonstration purposes.
