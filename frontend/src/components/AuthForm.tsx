import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { FormData, Trip } from '../types';
import { useUniversities } from '../hooks/useUniversities';

interface AuthFormProps {
   isLogin: boolean;
   loading: boolean;
   error: string;
   success: string;
   onSubmit: (formData: FormData, selectedTripId: string) => void;
   onToggleMode: () => void;
   onBackToIndex: () => void;
}

export const AuthForm = ({
   isLogin,
   loading,
   error,
   success,
   onSubmit,
   onToggleMode,
   onBackToIndex
}: AuthFormProps) => {
   const navigate = useNavigate();
   const [formData, setFormData] = useState<FormData>({
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
      university_id: "",
      year: ""
   });
   const [availableTrips, setAvailableTrips] = useState<Trip[]>([]);
   const [selectedTripId, setSelectedTripId] = useState("");
   const { universities, loading: universitiesLoading } = useUniversities();

   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setFormData({
         ...formData,
         [e.target.name]: e.target.value
      });
   };

   const handleTripSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedTripId(e.target.value);
   };

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit(formData, selectedTripId);
   };

   // Fetch available trips on component load
   useEffect(() => {
      const fetchTrips = async () => {
         try {
            const response = await fetch('/api/v1/trips');
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

   return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 relative">
         {/* Back Button */}
         <button
            onClick={() => navigate(-1)}
            className="absolute top-6 left-6 flex items-center text-gray-600 hover:text-gray-800 transition-colors"
         >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm font-medium">Back to Students</span>
         </button>

         <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
            <div className="text-center mb-8">
               <h1 className="text-3xl font-bold text-gray-900 mb-2">Give2Go</h1>
               <p className="text-gray-600">Student Mission Trip Fundraising</p>
               <p className="text-lg font-medium text-gray-800 mt-4">
                  {isLogin ? 'Welcome Back!' : 'Join Our Mission'}
               </p>
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
                        <label htmlFor="university_id" className="block text-sm font-medium text-gray-700 mb-1">
                           University
                        </label>
                        <select
                           id="university_id"
                           name="university_id"
                           value={formData.university_id}
                           onChange={handleInputChange}
                           required
                           disabled={universitiesLoading}
                           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                           <option value="">Select your university</option>
                           {universities.map((university) => (
                              <option key={university.id} value={university.id}>
                                 {university.abbreviation ? `${university.name} (${university.abbreviation})` : university.name}
                              </option>
                           ))}
                        </select>
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
                           {availableTrips.map((trip) => (
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
               <p className="text-sm text-gray-600 mb-3">
                  {isLogin ? "Don't have an account?" : "Already have an account?"}
               </p>
               <button
                  onClick={onToggleMode}
                  className="text-blue-600 hover:text-blue-700 font-medium underline"
               >
                  {isLogin ? "Create an account" : "Sign in to your account"}
               </button>
            </div>
         </div>
      </div>
   );
}; 