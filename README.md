# 📘 EduLens – AI-Powered Educational Assistance Platform

EduLens is an AI-powered educational assistance platform designed to simplify learning, assessment, and academic management for students, teachers, and administrators.

## 🌟 Overview

EduLens leverages artificial intelligence to transform traditional learning experiences by providing smart note summarization, automated quiz generation, personalized learning recommendations, and comprehensive performance analytics.

## 🎯 Uses & Applications

### 👩‍🎓 Student Uses

#### 1. Smart Notes Summarization
- Converts long study materials into short, easy-to-understand summaries
- Saves revision time before exams
- Helps students focus on key concepts only

#### 2. AI-Based Quiz Generation
- Automatically generates quizzes from notes
- Supports MCQs, true/false, and short questions
- Improves self-assessment and exam preparation

#### 3. Personalized Learning Experience
- Learns from student interaction and performance
- Recommends quizzes and revision material accordingly
- Reduces dependency on coaching institutes

#### 4. Anytime, Anywhere Learning
- Fully web-based platform
- Accessible from laptops, tablets, and mobiles
- Useful for remote learning and self-study

### 👨‍🏫 Teacher Uses

#### 5. Automatic Question Paper Creation
- Teachers can generate quizzes instantly
- Reduces manual effort in preparing assessments
- Useful for unit tests, practice tests, and assignments

#### 6. Student Performance Analysis
- Tracks quiz scores and activity
- Helps identify weak students or difficult topics
- Enables data-driven teaching decisions

#### 7. Content Management
- Upload notes once and reuse multiple times
- Helps maintain consistency in teaching materials

### 🏫 Admin Uses

#### 8. Role-Based Access Control
- Separate dashboards for Admin, Teacher, and Student
- Secure authentication and authorization
- Prevents unauthorized access

#### 9. User & Content Monitoring
- Monitor registered users
- Manage notes, quizzes, and system activity
- Useful for institutional deployment

### 🔐 Security & System Uses

#### 10. Secure Authentication System
- Login & registration with role verification
- Protects user data and academic content

#### 11. Scalable Architecture
- Backend APIs allow future expansion
- Can integrate:
  - Video lectures
  - Attendance systems
  - LMS platforms

### 🌐 Real-World Applications

#### 12. Schools & Colleges
- Smart learning management system
- Reduces teacher workload
- Enhances student engagement

#### 13. Competitive Exam Preparation
- Useful for JEE, NEET, GATE, UPSC aspirants
- Fast revision and practice quizzes

#### 14. Online Education Platforms
- Can be integrated into EdTech startups
- Supports AI-based learning solutions

#### 15. Corporate Training & Certification
- Generate training quizzes
- Assess employee learning outcomes
- Useful for HR and onboarding programs

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling framework
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Recharts** - Data visualization
- **React Toastify** - Notifications

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database (via Mongoose)
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Nodemailer** - Email service

### ML Service
- **Flask** - Python web framework
- **OpenAI API** - AI-powered summarization and quiz generation
- **scikit-learn** - Machine learning for performance prediction
- **PyPDF** - PDF text extraction

## 📁 Project Structure

```
EduLens/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── admin_components/    # Admin UI components
│   │   ├── admin_pages/         # Admin pages
│   │   ├── authentication_pages/ # Login, Register, VerifyEmail
│   │   ├── teacher_components/   # Teacher UI components
│   │   ├── teacher_pages/        # Teacher pages
│   │   ├── user_components/      # Student UI components
│   │   └── user_pages/           # Student pages
│   └── package.json
│
├── server/                 # Node.js backend API
│   ├── Controllers/        # Business logic
│   ├── Models/             # Database models
│   ├── Routes/             # API routes
│   ├── Middleware/         # Authentication middleware
│   └── index.js            # Server entry point
│
├── ml-service/             # Python Flask ML service
│   ├── route-ml.py         # Performance prediction API
│   ├── summerizer&quiz.py  # Summarization & quiz generation
│   ├── performance_model.pkl  # Trained ML model
│   └── requirements.txt
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher)
- **Python** (v3.8 or higher)
- **MongoDB** (local or cloud instance)
- **OpenAI API Key** (for AI features)

### Installation

#### 1. Clone the Repository
```bash
git clone <repository-url>
cd EduLens
```

#### 2. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory:
```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
```

Start the backend server:
```bash
npm run dev
```

#### 3. ML Service Setup

```bash
cd ml-service
pip install -r requirements.txt
```

Update the OpenAI API key in `summerizer&quiz.py`:
```python
client = OpenAI(api_key="your_openai_api_key")
```

Start the ML service:
```bash
python summerizer&quiz.py
# In another terminal:
python route-ml.py
```

#### 4. Frontend Setup

```bash
cd client
npm install
```

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/verify-email` - Email verification

### Student Routes
- `GET /api/student/dashboard` - Student dashboard data
- `POST /api/student/notes` - Upload notes
- `GET /api/student/notes` - Get student notes
- `POST /api/student/quiz` - Take quiz
- `GET /api/student/performance` - Get performance data

### Teacher Routes
- `GET /api/teacher/dashboard` - Teacher dashboard
- `POST /api/teacher/notes` - Upload teaching notes
- `POST /api/teacher/quiz` - Create quiz
- `GET /api/teacher/students` - View student performance

### Admin Routes
- `GET /api/admin/dashboard` - Admin dashboard
- `GET /api/admin/users` - Manage users
- `GET /api/admin/analytics` - System analytics

### ML Service
- `POST /summarize_pdf` - Summarize PDF notes
- `POST /quiz_from_pdf` - Generate quiz from PDF
- `POST /predict_performance` - Predict student performance

## 🔑 Features

### ✅ Implemented
- User authentication (Login, Register, Email Verification)
- Role-based access control (Admin, Teacher, Student)
- PDF note upload and management
- AI-powered note summarization
- AI-powered quiz generation
- Quiz taking and scoring
- Performance tracking and analytics
- ML-based performance prediction
- Responsive dashboard for all user types

### 🚧 Future Enhancements
- Video lecture integration
- Attendance system
- Advanced analytics and reporting
- Mobile app development
- Real-time notifications
- Collaborative learning features

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based authorization
- CORS protection
- Secure session management
- Email verification

## 📝 License

This project is licensed under the ISC License.

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

For questions or support, please open an issue in the repository.

---

**Built with ❤️ for the education community**
