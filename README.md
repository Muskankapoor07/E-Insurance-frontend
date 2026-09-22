# E-Insurance Management System – Frontend

## 📌 Overview

The E-Insurance Management System Frontend is a web application developed using Angular and TypeScript. It provides a simple, user-friendly interface for customers, insurance agents, employees, and administrators to manage insurance-related activities efficiently.

The frontend is integrated with the Spring Boot backend through REST APIs for authentication, user management, insurance policies, claims, payments, and other insurance services.

---

## 🚀 Features

### 🔐 Authentication
- User Login
- User Registration
- JWT-based authentication
- Remember Me functionality
- Forgot Password
- Role-based access

### 👤 Customer
- Customer Dashboard
- View Insurance Plans
- Purchase Insurance Policy
- View My Policies
- Submit Claims
- Make Payments
- View Policy Details
- Manage Profile

### 🤝 Insurance Agent
- Agent Dashboard
- Manage Customers
- Sell Insurance Policies
- View Policies
- Manage Claims
- Customer Follow-up
- View Reports

### 👨‍💼 Employee
- Employee Dashboard
- Manage Customer Requests
- Process Claims
- Update Policy Details
- View Assigned Tasks
- Customer Support

### 🛡️ Admin
- Admin Dashboard
- Manage Users
- Manage Policies
- Manage Claims
- View Reports
- Monitor System Activities

---

## 🛠️ Technologies Used

- Angular
- TypeScript
- HTML5
- CSS3
- REST APIs
- JWT Authentication
- Angular Router
- HTTP Client
- Git & GitHub

---

## 📂 Project Structure

```text
src/
├── app/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── guards/
│   ├── models/
│   ├── interceptors/
│   └── app.routes.ts
│
├── assets/
├── styles.css
└── main.ts
🔗 Backend Integration

The frontend communicates with the E-Insurance Spring Boot backend using REST APIs.

Main API Modules
Authentication
Customer Management
Employee Management
Insurance Agent Management
Insurance Plans
Policies
Claims
Payments
Reports
🔑 Authentication & Authorization

JWT tokens are used for secure authentication.

After successful login:

User credentials are sent to the backend.
Backend validates the credentials.
JWT token is generated.
Frontend stores the token.
Token is sent with authenticated API requests.
Access to pages and features is controlled according to the user's role.

Supported roles:

ADMIN
EMPLOYEE
AGENT
CUSTOMER
🎨 UI Design

The application follows a clean and responsive design approach with:

Simple navigation
Responsive layouts
Dashboard-based interfaces
Reusable components
Form validation
User-friendly cards and tables
Consistent E-Insurance branding
⚙️ Installation & Setup
1. Clone the Repository
git clone <your-github-repository-url>
2. Navigate to the Project
cd E-Insurance-Frontend
3. Install Dependencies
npm install
4. Start the Development Server
ng serve
5. Open in Browser
http://localhost:4200
🔗 Backend Configuration

Make sure the Spring Boot backend is running before using the application.

Update the API base URL in the Angular environment/configuration according to the backend server.

Example:

http://localhost:8080
🧪 Testing

The application can be tested by:

Registering a user
Logging in with valid credentials
Testing role-based dashboards
Viewing insurance plans
Creating and viewing policies
Submitting claims
Testing payment functionality
Testing API integration
📌 Project Status

🚧 Under Development

The frontend is being developed incrementally with Angular and integrated with the E-Insurance Spring Boot backend.

👩‍💻 Author

Muskan Kapoor

Java Full Stack Development Project

📄 License

This project is developed for learning and project implementation purposes.
