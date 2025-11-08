# Otkkage (Customer Management SaaS Application)

## Project Overview

Otkkage is a lightweight customer-management system built for clothing store owners who need a fast, reliable solution.
I converted years of handwritten customer and purchase records into a simple digital dashboard, making it much easier for my mother to manage her clients.

The system supports multiple users with secure authentication, allowing each store owner to manage their own customer database independently.

---
 
## Key Features

- **User Authentication**
  - User registration with email verification
  - Secure login with Supabase Auth
  - Password reset functionality
  - Session-based authentication with PKCE flow

- **Customer Information Management**
  - Register/Edit/Delete customer basic information
  - Detailed customer notes (preferred styles, sizes, preferred/avoided colors, etc.)
  - Quick search by customer name and contact information

- **Purchase History Management**
  - Record purchase details
  - Date filtering (today/yesterday/day before/this week/last week)
  - Purchase count statistics
  - Purchase history tracking with edit capability
  - CSV export functionality for purchase records

---

## Tech Stack

- **Frontend**
  - React 19 + Vite
  - React Router DOM (client-side routing)
  - Zustand (state management)
  - React Hot Toast (notifications)
  - React Icons (icon library)

- **Backend & Database**
  - Supabase (Backend-as-a-Service)
    - PostgreSQL database
    - Row Level Security (RLS) policies
    - Real-time subscriptions ready

- **Authentication & Security**
  - Supabase Auth with PKCE flow
  - Email verification for new users
  - Password reset functionality
  - Session-based authentication

- **Additional Libraries**
  - XLSX (CSV export functionality)
  - bcryptjs (legacy password migration support)

- **Development Tools**
  - Postman (API testing)

---

## Project Architecture

![Architecture](/src/assets/ui/etc/architecture.png?v=2)

---

## Project Structure

```
iloveyoumom/
├── src/
│   ├── components/           # React components
│   │   ├── commons/          # Reusable common components
│   │   ├── layout/           # Layout components (Navbar, Footer)
│   │   └── routes/           # Route-related components
│   ├── pages/                # Page components
│   │   └── errors/           # Error pages
│   ├── routes/               # Route handlers
│   ├── stores/               # Zustand state management stores
│   ├── lib/                  # External library configs (Supabase client)
│   ├── assets/               # Static assets
│   │   ├── styles/           # CSS files organized by component/page
│   │   └── ui/               # UI screenshots and images
│   └── main.jsx              # Application entry point
├── supabase/
│   ├── migrations/           # Database migration files
│   └── seed/                 # Database seed files
└── public/                   # Public static files
```

---

## DB Schema

- **auth.users**: Supabase Auth users with custom metadata (`full_name`, `store_name`, `phone`)
- **customer**: Customer information with RLS policies (users can only access their own customers)
- **history**: Visit and purchase history records

![ERD](/src/assets/ui/etc/supabaseSchema.png?v=2)

---

## Security and Data Protection

- **Authentication**: Supabase Auth with PKCE flow and email verification
- **Authorization**: Row Level Security (RLS) policies enforce data isolation per user
- **Password Security**: Handled by Supabase Auth with industry-standard encryption
- **Environment Variables**: All sensitive credentials stored in `.env.local` file
- **Data Privacy**: Users can only access and modify their own customer data

---

## Deployment

- Deployed on Vercel: https://otkkage.vercel.app/

---

## Future Plan (Implementation)

- **Analytics Dashboard**: Sales statistics, customer insights, and reporting features
- **Notifications**: Email/SMS reminders for customer follow-ups

---

## UX/UI

- All the data is mock data for demo

### 1. Login & Registration

#### a. Login Page
![Login Page](/src/assets/ui/loginPage.png?v=2)
- Secure login with email and password
- New user registration with email verification
- Automatic redirection for authenticated users

#### b. Registration Page
![Register Page](/src/assets/ui/registerPage.png?v=2)
- User registration with email verification
- Input fields for name, store name, phone, email, and password
- Form validation for required fields

### 2. Main Dashboard

#### a. Main Page
![Main Page](/src/assets/ui/mainPage.png?v=2)
- Customer list with pagination
- Search by name or phone number
- Purchase record registration
- Password change button

#### b. Customer Information
![Customer Info](/src/assets/ui/customerInfo.png?v=2)
- Detailed customer profile view
- Display customer's basic information and preferences
- Access to edit and delete functions

#### c. Edit Customer Information
![Customer Info Edit](/src/assets/ui/mainPage_customerInfo_edit.png?v=2)
- Modal form for editing customer details
- Update customer information (name, phone, sizes, preferences)
- Save or cancel changes

#### d. Password Change Modal
![Password Change](/src/assets/ui/changePassword.png?v=2)
- Secure password change via email verification
- Email sent with password reset link

![Password Change Email](/src/assets/ui/changePasswordEmail.png?v=2)
- Password reset confirmation email
- Secure link for updating password

### 3. Customer Registration Page
![Customer Registration](/src/assets/ui/customerRegister.png?v=2)
- Basic information (name, contact, date of birth, gender)
- Additional information (sizes, preferences, notes)
- Form validation and required field indicators

### 4. Purchase History Page
#### a. Purchase History Page
![Purchase History Page](/src/assets/ui/historyPage.png?v=2)
- View all purchase records
- Filter by date/period (today, yesterday, this week, last week, etc.)
- Search by customer name
- Edit or delete history entries
- Track purchase details and amounts
- CSV download button

#### b. Edit Purchase Record
![Edit Purchase Record](/src/assets/ui/editPurchaseRecord.png?v=2)
- Modal form for editing purchase history
- Update visit date and purchase details
- Save or cancel modifications

#### c. CSV Download Modal
![CSV Download](/src/assets/ui/excelDownload.png?v=2)
- Export purchase records to CSV file
- Select date range for export

![CSV File](/src/assets/ui/excelFile.png?v=2)
- Example of exported CSV file with purchase data