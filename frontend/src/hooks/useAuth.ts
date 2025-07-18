import { useState, useEffect } from 'react';
import type { Student, FormData } from '../types';

export const useAuth = () => {
   const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState("");
   const [success, setSuccess] = useState("");

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

   const handleLogout = () => {
      setCurrentStudent(null);
      localStorage.removeItem("token");
      localStorage.removeItem("student");
   };

   const handleAuthSubmit = async (
      formData: FormData,
      isLogin: boolean,
      selectedTripId: string,
      onSuccess: () => void
   ) => {
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

            setCurrentStudent(data.student);
            localStorage.setItem("token", data.token);
            localStorage.setItem("student", JSON.stringify(data.student));
            onSuccess();
         } else {
            setError(data.error || data.errors?.join(", ") || "Something went wrong");
         }
      } catch (err) {
         setError("Network error. Please check if the backend server is running.");
      } finally {
         setLoading(false);
      }
   };

   return {
      currentStudent,
      loading,
      error,
      success,
      handleLogout,
      handleAuthSubmit,
      setError,
      setSuccess
   };
}; 