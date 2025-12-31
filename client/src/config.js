// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
export const ML_SERVICE_URL = import.meta.env.VITE_ML_SERVICE_URL || 'http://127.0.0.1:5000';

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    SIGNUP: `${API_BASE_URL}/auth/signup`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
    VERIFY_EMAIL: `${API_BASE_URL}/auth/verify-email`,
    CHECK_VERIFICATION: `${API_BASE_URL}/auth/check-verification`,
  },
  // Student
  STUDENT: {
    QUIZZES: `${API_BASE_URL}/student/quizzes`,
    QUIZ_BY_ID: (id) => `${API_BASE_URL}/student/quizzes/${id}`,
    QUIZ_ATTEMPT: `${API_BASE_URL}/student/quizzes/attempt`,
    PERFORMANCE: `${API_BASE_URL}/student/performance`,
    ATTEMPTS: `${API_BASE_URL}/student/attempts`,
    RECOMMENDATIONS: `${API_BASE_URL}/student/recommendations`,
    NOTES: `${API_BASE_URL}/student/notes`,
  },
  // Teacher
  TEACHER: {
    QUIZZES: `${API_BASE_URL}/teacher/quizzes`,
    QUIZ_BY_ID: (id) => `${API_BASE_URL}/teacher/quizzes/${id}`,
    QUIZ_PERFORMANCE: (quizId) => `${API_BASE_URL}/teacher/quizzes/${quizId}/performance`,
    NOTES: `${API_BASE_URL}/teacher/notes`,
    UPLOAD_NOTE_FILE: `${API_BASE_URL}/teacher/notes/upload-file`,
  },
  // Admin
  ADMIN: {
    USERS: `${API_BASE_URL}/admin/users`,
    USER_STATS: `${API_BASE_URL}/admin/users/stats`,
    USER_ROLE: (userId) => `${API_BASE_URL}/admin/users/${userId}/role`,
    DELETE_USER: (userId) => `${API_BASE_URL}/admin/users/${userId}`,
    CONTENT: `${API_BASE_URL}/admin/content`,
    DELETE_CONTENT: (type, id) => `${API_BASE_URL}/admin/content/${type}/${id}`,
    ACTIVITY: `${API_BASE_URL}/admin/activity`,
    ANALYTICS: `${API_BASE_URL}/admin/analytics`,
  },
  // ML Service
  ML: {
    SUMMARIZE: `${ML_SERVICE_URL}/summarize_pdf`,
    QUIZ_FROM_PDF: `${ML_SERVICE_URL}/quiz_from_pdf`,
    EXTRACT_TEXT: `${ML_SERVICE_URL}/extract_text`,
    FLASHCARDS: `${ML_SERVICE_URL}/generate_flashcards`,
    EXPLAIN_CONCEPT: `${ML_SERVICE_URL}/explain_concept`,
    STUDY_PLAN: `${ML_SERVICE_URL}/generate_study_plan`,
    GENERATE_NOTES: `${ML_SERVICE_URL}/generate_notes`,
    EXPLAIN_ANSWER: `${ML_SERVICE_URL}/explain_answer`,
    AI_CHAT: `${ML_SERVICE_URL}/ai_chat`,
    ANALYZE_DIFFICULTY: `${ML_SERVICE_URL}/analyze_difficulty`,
  },
  FILES: {
    BASE_URL: 'http://localhost:3000',
  },
};

// File Base URL for serving uploaded files
export const FILE_BASE_URL = import.meta.env.VITE_FILE_BASE_URL || 'http://localhost:3000';

