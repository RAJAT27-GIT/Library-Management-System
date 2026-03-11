# 📚 Library Management System (MERN)

A full-stack Library Management application built to streamline book inventory, user memberships, and administrative reporting.

## 🚀 Key Features

### 🔐 Authentication & Roles
- **Admin Dashboard:** Full control over books, users, and system reports.
- **User Dashboard:** Students can view issued books, check due dates, and manage profiles.

### 📖 Core Library Logic
- **Inventory Management:** Add, update, and track books in real-time.
- **Issue/Return System:** Seamlessly manage book circulation with automated status updates.
- **Dynamic Membership:** - Support for **Basic, Premium, and Elite** plans.
    - Automatic **Active/Expired** status tracking based on dates.
- **Live Reports:** Detailed admin panel showing total books, active users, and student-wise detailed summaries.

### 🎨 Modern UI
- Clean, responsive React interfaces.
- Color-coded status badges (Active/Expired, Clear/Overdue).
- Modern CSS-in-JS styling for a professional look.

## 🛠️ Tech Stack
- **Frontend:** React.js, Context API/Hooks, Axios
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Security:** JWT Authentication, Password Hashing

## 📂 Project Structure
```text
├── backend/          # Node/Express API
│   ├── controllers/  # Business logic (Auth, Book, Report)
│   ├── models/       # Mongoose Schemas (User, Book, Issue)
│   └── routes/       # API Endpoints
└── frontend/         # React Application
    ├── src/
    │   ├── api/      # Axios configurations
    │   └── components/ # UI Components


⚙️ Installation & Setup
Clone the repository:

Bash
git clone <your-repo-link>
Setup Backend:

Bash
cd backend
npm install
# Create a .env file with PORT and MONGO_URI
npm start
Setup Frontend:

Bash
cd frontend
npm install
npm run dev
📊 Roadmap & Future Enhancements
[x] Membership Management

[x] Admin Reporting

[ ] Email notifications for overdue books

[ ] Integration of a PDF generator for reports
