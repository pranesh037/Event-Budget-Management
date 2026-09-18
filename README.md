College Budget Management System
Phase 1: Authentication & Faculty Management

Phase 1 establishes the basic authentication system and faculty management functionality for the College Budget Management System.

🎯 Objective

The main objective of Phase 1 is to provide:

Secure Admin login
Faculty registration by Admin
Faculty login
Basic role-based access
Basic faculty information management
🛠️ Tech Stack
Technology	Purpose
React.js	Frontend UI
Tailwind CSS	Styling
Node.js	Backend runtime
Express.js	REST API
Supabase	Database & Authentication
PostgreSQL	Database
Git & GitHub	Version control
👥 User Roles
Admin

The Admin can:

Login to the system
Access the Admin Dashboard
Add faculty members
View faculty members
Logout
Faculty

Faculty members can:

Login to the system
Access the Faculty Dashboard
View their basic profile
Logout
📋 Faculty Details

Only basic information is stored in Phase 1:

Faculty ID
Name
Email
Department
Designation
Role

Example:

Faculty ID: FAC001
Name: Kumar
Email: kumar@college.edu
Department: CSE
Designation: Assistant Professor
Role: faculty
👨‍💼 Admin Details

Basic admin information:

Admin ID
Name
Email
Role

Example:

Admin ID: ADM001
Name: Admin
Email: admin@college.edu
Role: admin

Passwords are handled by Supabase Authentication and are not stored directly in the application database.

🗄️ Database
profiles
Column	Type	Description
id	UUID	Supabase Auth user ID
faculty_id	VARCHAR	Unique faculty ID
name	VARCHAR	User's name
email	VARCHAR	Login email
department	VARCHAR	Faculty department
designation	VARCHAR	Faculty designation
role	VARCHAR	admin or faculty

faculty_id can be NULL for Admin users.

🔐 Authentication Flow
User
  │
  ▼
Login Page
  │
  │ Email + Password
  ▼
Supabase Authentication
  │
  ▼
User Authenticated
  │
  ▼
Check User Role
  │
  ├───────────────┐
  ▼               ▼
Admin           Faculty
  │               │
  ▼               ▼
Admin           Faculty
Dashboard       Dashboard
📁 Project Structure
college-budget-management/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── lib/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   ├── server.js
│   └── package.json
│
└── README.md
🔌 Backend API
Add Faculty
POST /api/faculty

Used by the Admin to create a new faculty account.

Get Faculty
GET /api/faculty

Used to retrieve the faculty list for the Admin Dashboard.

🖥️ Phase 1 Pages
1. Login Page

Common login page for Admin and Faculty.

Email
Password
[ Login ]
2. Admin Dashboard

Contains:

Admin Dashboard

[ Add Faculty ]

Faculty List
--------------------------------
Faculty ID | Name | Department
--------------------------------
FAC001     | Kumar | CSE
FAC002     | Priya | ECE
3. Add Faculty
Faculty ID
Name
Email
Department
Designation
Password

[ Add Faculty ]
4. Faculty Dashboard

Displays basic faculty information:

Faculty Dashboard

Name: Kumar
Faculty ID: FAC001
Department: CSE
Designation: Assistant Professor

[ Logout ]
🔒 Security
Authentication is handled using Supabase Auth.
Passwords are not stored manually in the profiles table.
Role-based access is used for Admin and Faculty.
Supabase Row Level Security (RLS) should be enabled for database protection.
Supabase Service Role Key must remain on the backend and must never be exposed in the React frontend.
🚫 Phase 1 Exclusions

The following features are intentionally not included in Phase 1:

Budget allocation
Expense tracking
Budget approval
Financial reports
Charts and analytics
Notifications
File/document uploads
Advanced faculty information

These can be implemented in subsequent phases.

✅ Phase 1 Completion Criteria

Phase 1 is complete when:

 Admin can log in
 Admin Dashboard works
 Admin can add a faculty member
 Faculty account is created successfully
 Faculty can log in
 Faculty Dashboard works
 Faculty details are displayed
 Admin can view faculty list
 Admin and Faculty have separate access
 Logout works
 Database and authentication are connected to Supabase
🚀 Getting Started
Frontend
cd frontend
npm install
npm run dev
Backend
cd backend
npm install
npm run dev

The frontend communicates with the Node.js/Express backend, while Supabase provides the authentication and PostgreSQL database layer.

📌 Phase 1 Summary

Phase 1 builds the foundation of the College Budget Management System by implementing Admin authentication, Faculty registration, Faculty authentication, and basic role-based access using React.js, Node.js, Express.js, Tailwind CSS, and Supabase.