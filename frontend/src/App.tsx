
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams, useLocation } from 'react-router-dom';
import { useEffect, useState } from "react";
import { Navbar } from "./components/Navbar";
import { StudentList } from "./components/StudentList";
import { AuthForm } from "./components/AuthForm";
import { Profile } from "./components/Profile";
import { useAuth } from "./hooks/useAuth";
import { useStudents } from "./hooks/useStudents";
import { DonatePage } from "./components/DonatePage";
import type { Student } from "./types";

function DonatePageWrapper() {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    fetch(`/api/v1/students`)
      .then(res => res.json())
      .then(data => {
        // data is the array itself
        const found = data.find((s: Student) => String(s.id) === studentId);
        if (found) setStudent(found);
        else setError("Student not found");
      })
      .catch(() => setError("Failed to load student."))
      .finally(() => setLoading(false));
  }, [studentId]);

  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  if (error || !student) return <div className="flex justify-center items-center min-h-screen text-red-600">{error || "Student not found."}</div>;
  return <DonatePage student={student} onBack={() => navigate('/')} />;
}

function App() {
  const {
    currentStudent,
    loading: authLoading,
    error: authError,
    success: authSuccess,
    handleLogout,
    handleAuthSubmit,
    setError,
    setSuccess
  } = useAuth();

  const { students, loading: studentsLoading, error: studentsError } = useStudents();

  // Wrapper for main page to provide navigation handler
  function MainPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const handleNavbarNavigate = (page: 'index' | 'login' | 'register' | 'profile') => {
      if (page === 'index') navigate('/');
      else if (page === 'login') navigate('/login', { state: { from: location } });
      else if (page === 'register') navigate('/register', { state: { from: location } });
      else if (page === 'profile') navigate('/profile');
    };
    return (
      <>
        <Navbar currentStudent={currentStudent} onNavigate={handleNavbarNavigate} onLogout={handleLogout} />
        <StudentList
          students={students}
          loading={studentsLoading}
          error={studentsError}
        />
      </>
    );
  }

  // Wrapper for login page to provide navigation handler
  function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';
    return (
      <AuthForm
        isLogin
        loading={authLoading}
        error={authError}
        success={authSuccess}
        onSubmit={(formData, selectedTripId) => handleAuthSubmit(formData, true, selectedTripId, () => navigate(from))}
        onToggleMode={() => navigate('/register', { state: { from: location.state?.from || { pathname: '/' } } })}
        onBackToIndex={() => navigate('/')}
      />
    );
  }
  // Wrapper for register page to provide navigation handler
  function RegisterPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';
    return (
      <AuthForm
        isLogin={false}
        loading={authLoading}
        error={authError}
        success={authSuccess}
        onSubmit={(formData, selectedTripId) => handleAuthSubmit(formData, false, selectedTripId, () => navigate(from))}
        onToggleMode={() => navigate('/login', { state: { from: location.state?.from || { pathname: '/' } } })}
        onBackToIndex={() => navigate('/')}
      />
    );
  }

  // Wrapper for profile page to provide navigation handler
  function ProfilePage() {
    const navigate = useNavigate();
    return (
      <Profile
        currentStudent={currentStudent}
        onNavigate={page => {
          if (page === 'index') navigate('/');
          else if (page === 'login') navigate('/login');
          else if (page === 'register') navigate('/register');
          else if (page === 'profile') navigate('/profile');
        }}
      />
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/donate/:studentId" element={<DonatePageWrapper />} />
      </Routes>
    </Router>
  );
}

export default App;

