
import { useState, useEffect } from "react";

interface Student {
  id: number;
  name: string;
  email: string;
  university: string;
  year: string;
  balance: number;
  formatted_balance: string;
}

interface AuthResponse {
  token: string;
  student: Student;
}

function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    university: "",
    year: ""
  });

  const [availableTrips, setAvailableTrips] = useState([]);
  const [selectedTripId, setSelectedTripId] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleTripSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTripId(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const endpoint = isLogin ? "/api/v1/login" : "/api/v1/register";
      const payload = isLogin
        ? { email: formData.email, password: formData.password }
        : { student: formData };

      const response = await fetch(`http://localhost:3001${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        if (!isLogin && selectedTripId) {
          // Link student to selected trip after successful registration
          try {
            const tripResponse = await fetch(`http://localhost:3001/api/v1/trips`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${data.token}`
              },
              body: JSON.stringify({ trip_id: selectedTripId }),
            });

            if (!tripResponse.ok) {
              console.warn("Trip linking failed:", await tripResponse.text());
            }
          } catch (tripErr) {
            console.warn("Trip linking error:", tripErr);
          }
        }

        setSuccess(isLogin ? "Login successful!" : "Registration successful!");
        setCurrentStudent(data.student);
        localStorage.setItem("token", data.token);
        localStorage.setItem("student", JSON.stringify(data.student));
      } else {
        setError(data.error || data.errors?.join(", ") || "Something went wrong");
      }
    } catch (err) {
      setError("Network error. Please check if the backend server is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setCurrentStudent(null);
    localStorage.removeItem("token");
    localStorage.removeItem("student");
    setFormData({
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
      university: "",
      year: ""
    });
    setSelectedTripId("");
  };

  // Check for existing session on load
  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedStudent = localStorage.getItem("student");

    if (token && savedStudent) {
      // Load from localStorage first for immediate display
      setCurrentStudent(JSON.parse(savedStudent));

      // Then fetch fresh data from API
      const fetchFreshData = async () => {
        try {
          const response = await fetch('http://localhost:3001/api/v1/student/profile', {
            headers: {
              "Authorization": `Bearer ${token}`
            }
          });

          if (response.ok) {
            const data = await response.json();
            setCurrentStudent(data.student);
            localStorage.setItem("student", JSON.stringify(data.student));
          } else {
            // If token is invalid, logout
            handleLogout();
          }
        } catch (error) {
          console.error('Failed to fetch fresh student data:', error);
        }
      };

      fetchFreshData();
    }
  }, []);

  // Fetch available trips on component load
  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/v1/trips');
        if (response.ok) {
          const trips = await response.json();
          setAvailableTrips(trips);
        }
      } catch (error) {
        console.error('Failed to fetch trips:', error);
      }
    };

    fetchTrips();
  }, []);

  if (currentStudent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back!</h1>
            <p className="text-gray-600">You're successfully logged in</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Student Profile</h2>
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-500">Name:</span>
                <p className="text-gray-900">{currentStudent.name}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Email:</span>
                <p className="text-gray-900">{currentStudent.email}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">University:</span>
                <p className="text-gray-900">{currentStudent.university}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Year:</span>
                <p className="text-gray-900">{currentStudent.year}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Balance:</span>
                <p className="text-gray-900">{currentStudent.formatted_balance}</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Give2Go</h1>
          <p className="text-gray-600">Student Mission Trip Fundraising</p>
        </div>

        {/* Toggle between Login and Register */}
        <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${isLogin
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
              }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${!isLogin
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
              }`}
          >
            Register
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="John Doe"
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="john@example.com"
            />
          </div>

          {!isLogin && (
            <>
              <div>
                <label htmlFor="university" className="block text-sm font-medium text-gray-700 mb-1">
                  University
                </label>
                <input
                  type="text"
                  id="university"
                  name="university"
                  value={formData.university}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="University of Texas"
                />
              </div>

              <div>
                <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
                  Year
                </label>
                <select
                  id="year"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select your year</option>
                  <option value="1st">1st Year</option>
                  <option value="2nd">2nd Year</option>
                  <option value="3rd">3rd Year</option>
                  <option value="4th">4th Year</option>
                  <option value="5th">5th Year</option>
                  <option value="grad_student">Graduate Student</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </>
          )}

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>

          {!isLogin && (
            <div>
              <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                id="password_confirmation"
                name="password_confirmation"
                value={formData.password_confirmation}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>
          )}

          {!isLogin && (
            <div className="border-t border-gray-200 pt-6 mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Select Your Mission Trip</h3>

              <div>
                <label htmlFor="trip_selection" className="block text-sm font-medium text-gray-700 mb-1">
                  Choose a Trip
                </label>
                <select
                  id="trip_selection"
                  name="trip_id"
                  value={selectedTripId}
                  onChange={handleTripSelection}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a mission trip...</option>
                  {availableTrips.map((trip: any) => (
                    <option key={trip.id} value={trip.id}>
                      {trip.name} - {trip.location_city}, {trip.location_country} (Goal: ${trip.goal_amount})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Loading..." : (isLogin ? "Login" : "Register")}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              {isLogin ? "Register here" : "Login here"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;

