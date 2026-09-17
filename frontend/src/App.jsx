import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import useAuth from './hooks/useAuth';

// Layouts
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Common Route Guards
import ProtectedRoute from './components/common/ProtectedRoute';
import RoleProtectedRoute from './components/common/RoleProtectedRoute';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import AdmissionApply from './pages/student/AdmissionApply';
import UploadDocuments from './pages/student/UploadDocuments';
import MyApplicationStatus from './pages/student/MyApplicationStatus';
import AvailableCourses from './pages/student/AvailableCourses';
import CourseRegistration from './pages/student/CourseRegistration';
import MyCourses from './pages/student/MyCourses';
import Timetable from './pages/student/Timetable';
import Results from './pages/student/Results';
import Profile from './pages/student/Profile';

// Admission Officer Pages
import OfficerDashboard from './pages/officer/OfficerDashboard';
import ApplicationList from './pages/officer/ApplicationList';
import ApplicationDetails from './pages/officer/ApplicationDetails';
import DocumentReview from './pages/officer/DocumentReview';

// Faculty Pages
import FacultyDashboard from './pages/faculty/FacultyDashboard';
import AssignedCourses from './pages/faculty/AssignedCourses';
import StudentList from './pages/faculty/StudentList';
import EnterResults from './pages/faculty/EnterResults';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ManageCourses from './pages/admin/ManageCourses';
import ManageFaculty from './pages/admin/ManageFaculty';
import ManageTimetable from './pages/admin/ManageTimetable';
import SystemReports from './pages/admin/SystemReports';

// 404
import NotFound from './pages/NotFound';

// Root redirector based on authenticated role
const RootRedirector = () => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) return null;
  if (!isAuthenticated || !user) return <Navigate to="/login" replace />;

  const role = (user.role || '').toUpperCase();
  switch (role) {
    case 'STUDENT':
      return <Navigate to="/student/dashboard" replace />;
    case 'FACULTY':
      return <Navigate to="/faculty/dashboard" replace />;
    case 'ADMIN':
      return <Navigate to="/admin/dashboard" replace />;
    case 'ADMISSION_OFFICER':
      return <Navigate to="/officer/dashboard" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Root Route */}
            <Route path="/" element={<RootRedirector />} />

            {/* Public Auth Routes */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>

            {/* Protected Dashboard Routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                {/* 1. STUDENT ROUTES */}
                <Route element={<RoleProtectedRoute allowedRoles={['STUDENT']} />}>
                  <Route path="/student/dashboard" element={<StudentDashboard />} />
                  <Route path="/student/admission-apply" element={<AdmissionApply />} />
                  <Route path="/student/upload-documents" element={<UploadDocuments />} />
                  <Route path="/student/my-application" element={<MyApplicationStatus />} />
                  <Route path="/student/courses" element={<AvailableCourses />} />
                  <Route path="/student/course-registration" element={<CourseRegistration />} />
                  <Route path="/student/my-courses" element={<MyCourses />} />
                  <Route path="/student/timetable" element={<Timetable />} />
                  <Route path="/student/results" element={<Results />} />
                  <Route path="/student/profile" element={<Profile />} />
                </Route>

                {/* 2. ADMISSION OFFICER ROUTES */}
                <Route element={<RoleProtectedRoute allowedRoles={['ADMISSION_OFFICER']} />}>
                  <Route path="/officer/dashboard" element={<OfficerDashboard />} />
                  <Route path="/officer/applications" element={<ApplicationList />} />
                  <Route path="/officer/applications/:id" element={<ApplicationDetails />} />
                  <Route path="/officer/documents" element={<DocumentReview />} />
                </Route>

                {/* 3. FACULTY ROUTES */}
                <Route element={<RoleProtectedRoute allowedRoles={['FACULTY']} />}>
                  <Route path="/faculty/dashboard" element={<FacultyDashboard />} />
                  <Route path="/faculty/courses" element={<AssignedCourses />} />
                  <Route path="/faculty/students" element={<StudentList />} />
                  <Route path="/faculty/enter-results" element={<EnterResults />} />
                </Route>

                {/* 4. ADMIN ROUTES */}
                <Route element={<RoleProtectedRoute allowedRoles={['ADMIN']} />}>
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/admin/users" element={<ManageUsers />} />
                  <Route path="/admin/courses" element={<ManageCourses />} />
                  <Route path="/admin/faculty" element={<ManageFaculty />} />
                  <Route path="/admin/timetable" element={<ManageTimetable />} />
                  <Route path="/admin/reports" element={<SystemReports />} />
                </Route>

                {/* 404 Catch-All inside layout */}
                <Route path="*" element={<NotFound />} />
              </Route>
            </Route>
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
