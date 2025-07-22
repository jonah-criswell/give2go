
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams, useLocation } from 'react-router-dom';
import { useEffect, useState } from "react";
import { Navbar } from "./components/Navbar";
import { StudentList } from "./components/StudentList";
import { AuthForm } from "./components/AuthForm";
import { Profile } from "./components/Profile";
import { useAuth } from "./hooks/useAuth";
import { useStudents } from "./hooks/useStudents";
import { DonatePage } from "./components/DonatePage";
import { DonateRandomPage } from "./components/DonateRandomPage";
import { DonateRevealPage } from "./components/DonateRevealPage";
import { LandingPage } from "./components/LandingPage";
import { ComingSoonPage } from "./components/ComingSoonPage";
import { GroupDonatePage } from "./components/GroupDonatePage";
import { GroupDonateSuccessPage } from "./components/GroupDonateSuccessPage";
import { GroupDonateInfoPage } from "./components/GroupDonateInfoPage";
import { DonateThankYouPage } from "./components/DonateThankYouPage";
import type { Student } from "./types";
import { apiFetch } from './api';


function App() {
  const {
    currentStudent,
    loading: authLoading,
    error: authError,
    success: authSuccess,
    handleLogout,
    handleAuthSubmit,
    setError,
    setSuccess,
    setCurrentStudent
  } = useAuth();

  const { students, loading: studentsLoading, error: studentsError, refetch: refetchStudents } = useStudents();

  // Wrapper for donate page to provide navigation handler and refresh function
  function DonatePageWrapper() {
    const { studentId } = useParams();
    const navigate = useNavigate();
    const [student, setStudent] = useState<Student | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
      setLoading(true);
      apiFetch(`/api/v1/students`)
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
    return <DonatePage student={student} onBack={() => navigate(-1)} onDonationSuccess={refetchStudents} />;
  }

  // Wrapper for landing page to provide navigation handler
  function LandingPageWrapper() {
    const navigate = useNavigate();
    const location = useLocation();
    const handleNavbarNavigate = (page: 'index' | 'login' | 'register' | 'profile') => {
      if (page === 'index') navigate('/students');
      else if (page === 'login') navigate('/login', { state: { from: location } });
      else if (page === 'register') navigate('/register', { state: { from: location } });
      else if (page === 'profile') navigate('/profile');
    };
    return (
      <LandingPage
        currentStudent={currentStudent}
        onNavigate={handleNavbarNavigate}
        onLogout={handleLogout}
        onHomeClick={() => navigate('/')}
        onRandomDonation={() => navigate('/donate/random')}
        onGroupDonation={() => navigate('/group-donate-info')}
      />
    );
  }

  // Wrapper for students page to provide navigation handler
  function StudentsPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const handleNavbarNavigate = (page: 'index' | 'login' | 'register' | 'profile') => {
      if (page === 'index') navigate('/students');
      else if (page === 'login') navigate('/login', { state: { from: location } });
      else if (page === 'register') navigate('/register', { state: { from: location } });
      else if (page === 'profile') navigate('/profile');
    };
    return (
      <>
        <Navbar currentStudent={currentStudent} onNavigate={handleNavbarNavigate} onLogout={handleLogout} onHomeClick={() => navigate('/')} onRandomDonation={() => navigate('/donate/random')} onGroupDonation={() => navigate('/group-donate-info')} />
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
    const from = location.state?.from?.pathname || '/students';
    return (
      <AuthForm
        isLogin
        loading={authLoading}
        error={authError}
        success={authSuccess}
        onSubmit={(formData, selectedTripId) => handleAuthSubmit(formData, true, selectedTripId, () => navigate(from), refetchStudents)}
        onToggleMode={() => navigate('/register', { state: { from: location.state?.from || { pathname: '/students' } } })}
        onBackToIndex={() => navigate(-1)}
      />
    );
  }
  // Wrapper for register page to provide navigation handler
  function RegisterPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/students';
    return (
      <AuthForm
        isLogin={false}
        loading={authLoading}
        error={authError}
        success={authSuccess}
        onSubmit={(formData, selectedTripId) => handleAuthSubmit(formData, false, selectedTripId, () => navigate(from), refetchStudents)}
        onToggleMode={() => navigate('/login', { state: { from: location.state?.from || { pathname: '/students' } } })}
        onBackToIndex={() => navigate(-1)}
      />
    );
  }

  // Wrapper for profile page to provide navigation handler
  function ProfilePage() {
    const navigate = useNavigate();
    return (
      <Profile
        currentStudent={currentStudent}
        setCurrentStudent={setCurrentStudent}
        onNavigate={page => {
          if (page === 'index') navigate('/students');
          else if (page === 'login') navigate('/login');
          else if (page === 'register') navigate('/register');
          else if (page === 'profile') navigate('/profile');
        }}
      />
    );
  }

  // Wrapper for group donate info page to provide navigation handler
  function GroupDonateInfoPageWrapper() {
    const navigate = useNavigate();
    const location = useLocation();
    const handleNavbarNavigate = (page: 'index' | 'login' | 'register' | 'profile') => {
      if (page === 'index') navigate('/');
      else if (page === 'login') navigate('/login', { state: { from: location } });
      else if (page === 'register') navigate('/register', { state: { from: location } });
      else if (page === 'profile') navigate('/profile');
    };
    return (
      <GroupDonateInfoPage
        currentStudent={currentStudent}
        onNavigate={handleNavbarNavigate}
        onLogout={handleLogout}
        onHomeClick={() => navigate('/')}
        onRandomDonation={() => navigate('/donate/random')}
        onGroupDonation={() => navigate('/group-donate-info')}
      />
    );
  }

  // Wrapper for group donate page to provide navigation handler
  function GroupDonatePageWrapper() {
    const navigate = useNavigate();
    const location = useLocation();
    const handleNavbarNavigate = (page: 'index' | 'login' | 'register' | 'profile') => {
      if (page === 'index') navigate('/');
      else if (page === 'login') navigate('/login', { state: { from: location } });
      else if (page === 'register') navigate('/register', { state: { from: location } });
      else if (page === 'profile') navigate('/profile');
    };
    return (
      <GroupDonatePage
        currentStudent={currentStudent}
        onNavigate={handleNavbarNavigate}
        onLogout={handleLogout}
        onHomeClick={() => navigate('/')}
        onRandomDonation={() => navigate('/donate/random')}
        onGroupDonation={() => navigate('/group-donate-info')}
      />
    );
  }

  // Wrapper for group donate success page to provide navigation handler
  function GroupDonateSuccessPageWrapper() {
    const navigate = useNavigate();
    const location = useLocation();
    const handleNavbarNavigate = (page: 'index' | 'login' | 'register' | 'profile') => {
      if (page === 'index') navigate('/');
      else if (page === 'login') navigate('/login', { state: { from: location } });
      else if (page === 'register') navigate('/register', { state: { from: location } });
      else if (page === 'profile') navigate('/profile');
    };
    return (
      <GroupDonateSuccessPage
        currentStudent={currentStudent}
        onNavigate={handleNavbarNavigate}
        onLogout={handleLogout}
        onHomeClick={() => navigate('/')}
        refetchStudents={refetchStudents}
        onRandomDonation={() => navigate('/donate/random')}
        onGroupDonation={() => navigate('/group-donate-info')}
      />
    );
  }

  // Wrapper for donate thank you page to provide navigation handler
  function DonateThankYouPageWrapper() {
    const navigate = useNavigate();
    const location = useLocation();
    const handleNavbarNavigate = (page: 'index' | 'login' | 'register' | 'profile') => {
      if (page === 'index') navigate('/students');
      else if (page === 'login') navigate('/login', { state: { from: location } });
      else if (page === 'register') navigate('/register', { state: { from: location } });
      else if (page === 'profile') navigate('/profile');
    };
    return (
      <DonateThankYouPage
        currentStudent={currentStudent}
        onNavigate={handleNavbarNavigate}
        onLogout={handleLogout}
        onHomeClick={() => navigate('/')}
        onRandomDonation={() => navigate('/donate/random')}
        onGroupDonation={() => navigate('/group-donate-info')}
      />
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPageWrapper />} />
        <Route path="/students" element={<StudentsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/donate/random" element={<DonateRandomPage />} />
        <Route path="/donate/reveal/:studentId" element={<DonateRevealPage onStudentsUpdate={refetchStudents} />} />
        <Route path="/donate/:studentId" element={<DonatePageWrapper />} />
        <Route path="/donate/thank-you" element={<DonateThankYouPageWrapper />} />
        <Route path="/group-donate" element={<GroupDonatePageWrapper />} />
        <Route path="/group-donate/success" element={<GroupDonateSuccessPageWrapper />} />
        <Route path="/group-donate-info" element={<GroupDonateInfoPageWrapper />} />
        <Route path="/search" element={<ComingSoonPage feature="Search" description="Find students by university, trip, or location. Advanced search and filtering capabilities are coming soon." />} />
      </Routes>
    </Router>
  );
}

export default App;

