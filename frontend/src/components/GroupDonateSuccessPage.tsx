import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import type { Student } from '../types';

interface GroupDonateSuccessPageProps {
   currentStudent: Student | null;
   onNavigate: (page: 'index' | 'login' | 'register' | 'profile') => void;
   onLogout: () => void;
   onHomeClick?: () => void;
   refetchStudents: () => Promise<void>;
}

export const GroupDonateSuccessPage = ({ currentStudent, onNavigate, onLogout, onHomeClick, refetchStudents }: GroupDonateSuccessPageProps) => {
   const navigate = useNavigate();
   const location = useLocation();
   const { donationAmount, studentCount, averageAmount } = location.state || {};

   // Ensure averageAmount is a number
   const avgAmountNum = typeof averageAmount === 'number' ? averageAmount : Number(averageAmount);
   const avgAmountDisplay = !isNaN(avgAmountNum) ? avgAmountNum.toFixed(2) : '0.00';
   const donationAmountDisplay = typeof donationAmount === 'number' ? donationAmount.toLocaleString() : Number(donationAmount).toLocaleString();

   // Refetch students on mount
   useEffect(() => {
      refetchStudents();
   }, [refetchStudents]);

   return (
      <div className="min-h-screen bg-gray-50">
         <Navbar currentStudent={currentStudent} onNavigate={onNavigate} onLogout={onLogout} onHomeClick={onHomeClick} showCruLogo={true} />

         <div className="max-w-2xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
            <div className="text-center">
               {/* Success Icon */}
               <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                  <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
               </div>

               {/* Success Message */}
               <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  Thank You for Your Group Donation!
               </h1>

               <p className="text-lg text-gray-600 mb-8">
                  Your generous donation has been distributed to support students on their mission trips.
               </p>

               {/* Donation Details */}
               <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     <div className="text-center">
                        <div className="text-3xl font-bold text-green-600 mb-2">
                           ${donationAmountDisplay || '0'}
                        </div>
                        <div className="text-sm text-gray-600">Total Donated</div>
                     </div>
                     <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600 mb-2">
                           {studentCount || 0}
                        </div>
                        <div className="text-sm text-gray-600">Students Supported</div>
                     </div>
                     <div className="text-center">
                        <div className="text-3xl font-bold text-purple-600 mb-2">
                           ${avgAmountDisplay}
                        </div>
                        <div className="text-sm text-gray-600">Average per Student</div>
                     </div>
                  </div>
               </div>

               {/* Impact Message */}
               <div className="bg-blue-50 p-6 rounded-lg mb-8">
                  <h2 className="text-xl font-semibold text-blue-900 mb-3">
                     Your Impact
                  </h2>
                  <p className="text-blue-800">
                     Your donation will help these students reach their fundraising goals and participate in life-changing mission trips.
                     Each student will receive support to make a difference in communities around the world.
                  </p>
               </div>

               {/* Action Buttons */}
               <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                     onClick={() => navigate('/')}
                     className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                  >
                     Return to Home
                  </button>
                  <button
                     onClick={() => navigate('/students')}
                     className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                  >
                     Browse More Students
                  </button>
                  <button
                     onClick={() => navigate('/group-donate-info')}
                     className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                  >
                     Make Another Group Donation
                  </button>
               </div>
            </div>
         </div>
      </div>
   );
}; 