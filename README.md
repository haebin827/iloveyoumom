# Mungyeong’s Closet (Customer Management System)

## Project Overview

Mungyeong’s Closet is a lightweight customer-management MVP built for a single clothing store owner who needed a solution fast.
I converted years of handwritten customer and purchase records into a simple digital dashboard, making it much easier for my mother to manage her clients.

---

## Key Features

- **Customer Information Management**
  - Register/Edit/Delete customer basic information
  - Detailed customer notes (preferred styles, sizes, preferred/avoided colors, etc.)
  - Quick search by customer name and contact information

- **Visit History Management**
  - Record visit dates
  - Date filtering (today/yesterday/day before/this week/last week)
  - Visit count statistics

---

## Tech Stack

- **Frontend**
  - React + Vite
  - React Router

- **Backend**
  - Supabase

- **Authentication/Security**
  - Password encryption (bcrypt)
  - Session-based authentication

- **Testing**
  - Postman (API testing)

---

## Installation and Setup

1. Clone Repository
```bash
git clone https://github.com/yourusername/iloveyoumom.git
cd iloveyoumom
```

2. Environment Variables Setup
- Create a `.env.local` file and add the following:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. Install Dependencies and Run
```bash
npm install
npm run dev
```

4. Migration & Seeder
```bash
npx supabase db push

npx supabase db execute --file supabase/seed/001_base.sql --linked
npx supabase db execute --file supabase/seed/010_demo.sql --linked
```
---

## Project Structure

```
iloveyoumom/
├── src/
│   ├── components/     # Reusable components
│   ├── contexts/       # Context API related files
│   ├── pages/         # Page components
│   ├── styles/        # CSS style files
│   ├── assets/        # Images and static files
│   └── configs/       # Configuration files
└── public/            # Static files
```

---

## DB Schema

- **users**: System user information
- **customers**: Customer information
- **history**: Visit history records

---

## Security and Data Protection

- All passwords are encrypted and stored using bcrypt
- Sensitive information managed through environment variables

---

## Deployment

- Deployed on Vercel: ***URL IS PRIVATE***
- Environment variables managed through Vercel dashboard

---

## Future Plans

- System expansion for multi-user support
- Add inventory management system
- Sales statistics and reporting features
- Mobile app version development
- Online shop integration

---

## UX/UI

### 1. Login Page
![Login Page](/src/assets/ui/loginPage.png)
- Single user login
- Simple password-based authentication

### 2. Main Page
![Main Page](/src/assets/ui/mainPage.png)
- Customer list and search
- Quick visit record registration
- Password change functionality
![Password Change](/src/assets/ui/changePassword.png)
- Customer information editing
![Customer Edit](/src/assets/ui/mainPage_customerInfo_edit.png)

### 3. Customer Details
![Customer Details](/src/assets/ui/mainPage_customerInfo.png)
- View detailed customer information
- Notes and visit history

### 4. Customer Registration
![Customer Registration - Basic Info](/src/assets/ui/registerPage1.png)
![Customer Registration - Additional Info](/src/assets/ui/registerPage2.png)
- Basic information (name, contact, date of birth, gender)
- Additional information (sizes, preferences, notes)

### 5. Visit History
![Visit History Page](/src/assets/ui/historyPage.png)
- View all visit records
- Filter by date/period
