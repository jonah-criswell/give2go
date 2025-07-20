import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import type { Student } from '../types';

interface DonateThankYouPageProps {
   currentStudent: Student | null;
   onNavigate: (page: 'index' | 'login' | 'register' | 'profile') => void;
   onLogout: () => void;
   onHomeClick?: () => void;
   onRandomDonation?: () => void;
   onGroupDonation?: () => void;
}

export const DonateThankYouPage = ({ currentStudent, onNavigate, onLogout, onHomeClick, onRandomDonation, onGroupDonation }: DonateThankYouPageProps) => {
   const navigate = useNavigate();
   const location = useLocation();
   const { student, donationAmount, oldBalance, newBalance, oldPercent, newPercent } = location.state || {};

   // Scroll to top when component mounts
   useEffect(() => {
      window.scrollTo(0, 0);
   }, []);

   // If no state data, redirect to students page
   useEffect(() => {
      if (!student || !donationAmount) {
         navigate('/students');
      }
   }, [student, donationAmount, navigate]);

   if (!student || !donationAmount) {
      return null;
   }

   const goal = student.trip?.goal_amount || 5000;

   return (
      <div className="min-h-screen bg-gray-50">
         <Navbar currentStudent={currentStudent} onNavigate={onNavigate} onLogout={onLogout} onHomeClick={onHomeClick} showCruLogo={false} onRandomDonation={onRandomDonation} onGroupDonation={onGroupDonation} />

         <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
            <div className="text-center">
               {/* Success Icon */}
               <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                  <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
               </div>

               {/* Success Message */}
               <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  Thank You for Your Donation!
               </h1>

               <p className="text-lg text-gray-600 mb-8">
                  Your generous donation has been processed successfully.
               </p>

               {/* Student Info Card */}
               <div className="bg-white rounded-lg shadow-lg p-8 mb-8 max-w-2xl mx-auto">
                  <div className="flex items-center space-x-6 mb-6">
                     <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-2xl font-bold text-white overflow-hidden">
                        {student.profile_picture_url ? (
                           <img
                              src={student.profile_picture_url}
                              alt={student.name}
                              className="w-20 h-20 rounded-full object-cover"
                           />
                        ) : (
                           student.name.charAt(0).toUpperCase()
                        )}
                     </div>
                     <div className="text-left">
                        <h2 className="text-2xl font-bold text-gray-900">{student.name}</h2>
                        {student.trip && (
                           <p className="text-blue-600 font-medium">{student.trip.name}</p>
                        )}
                        <p className="text-gray-600">{student.university}</p>
                     </div>
                  </div>

                  {/* Donation Amount */}
                  <div className="text-center mb-8">
                     <div className="text-4xl font-bold text-green-600 mb-2">
                        ${Number(donationAmount).toFixed(2)}
                     </div>
                     <div className="text-lg text-gray-600">Donation Amount</div>
                  </div>

                  {/* Progress Comparison */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                     {/* Before */}
                     <div className="bg-gray-50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Before Donation</h3>
                        <div className="space-y-3">
                           <div className="flex justify-between">
                              <span className="text-gray-600">Balance:</span>
                              <span className="font-semibold">${oldBalance.toFixed(2)}</span>
                           </div>
                           <div className="flex justify-between">
                              <span className="text-gray-600">Progress:</span>
                              <span className="font-semibold text-blue-600">{oldPercent.toFixed(1)}%</span>
                           </div>
                           <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                 className="bg-blue-400 h-2 rounded-full transition-all duration-300"
                                 style={{ width: `${Math.min(oldPercent, 100)}%` }}
                              ></div>
                           </div>
                        </div>
                     </div>

                     {/* After */}
                     <div className="bg-green-50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">After Donation</h3>
                        <div className="space-y-3">
                           <div className="flex justify-between">
                              <span className="text-gray-600">Balance:</span>
                              <span className="font-semibold text-green-700">${newBalance.toFixed(2)}</span>
                           </div>
                           <div className="flex justify-between">
                              <span className="text-gray-600">Progress:</span>
                              <span className="font-semibold text-green-600">{newPercent.toFixed(1)}%</span>
                           </div>
                           <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                 className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                 style={{ width: `${Math.min(newPercent, 100)}%` }}
                              ></div>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Goal Information */}
                  <div className="text-center">
                     <div className="text-lg text-gray-600 mb-2">
                        Fundraising Goal: <span className="font-semibold">${goal.toLocaleString()}</span>
                     </div>
                     {newPercent >= 100 ? (
                        <div className="text-green-600 font-semibold text-lg">
                           🎉 Goal reached! Thank you for your support!
                        </div>
                     ) : (
                        <div className="text-gray-600">
                           {goal - newBalance > 0 ? (
                              <span>Still needs <span className="font-semibold">${(goal - newBalance).toFixed(2)}</span> to reach the goal</span>
                           ) : (
                              <span>Goal exceeded by <span className="font-semibold">${(newBalance - goal).toFixed(2)}</span></span>
                           )}
                        </div>
                     )}
                  </div>
               </div>

               {/* Impact Message */}
               <div className="bg-blue-50 p-6 rounded-lg mb-8 max-w-2xl mx-auto">
                  <h2 className="text-xl font-semibold text-blue-900 mb-3">
                     Your Impact
                  </h2>
                  <p className="text-blue-800">
                     Your donation will help {student.name} reach their fundraising goal and participate in their mission trip.
                     Every contribution makes a difference in their journey to serve others.
                  </p>
               </div>

               {/* Return Button */}
               <div className="flex justify-center">
                  <button
                     onClick={() => navigate('/')}
                     className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
                  >
                     Return
                  </button>
               </div>
            </div>
         </div>
      </div>
   );
}; 