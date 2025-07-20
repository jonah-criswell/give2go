import { useState } from 'react';
import type { Student } from '../types';

interface NavbarProps {
   currentStudent: Student | null;
   onNavigate: (page: 'index' | 'login' | 'register' | 'profile') => void;
   onLogout: () => void;
   onHomeClick?: () => void;
   showCruLogo?: boolean;
   onRandomDonation?: () => void;
   onGroupDonation?: () => void;
}

export const Navbar = ({ currentStudent, onNavigate, onLogout, onHomeClick, showCruLogo, onRandomDonation, onGroupDonation }: NavbarProps) => {
   const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

   const handleLogoutClick = () => {
      setShowLogoutConfirm(true);
   };

   const handleLogoutConfirm = () => {
      setShowLogoutConfirm(false);
      onLogout();
   };

   const handleLogoutCancel = () => {
      setShowLogoutConfirm(false);
   };
   return (
      <>
         <nav className="bg-white shadow-lg border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4">
               <div className="flex justify-between h-16">
                  <div className="flex items-center">
                     {showCruLogo ? (
                        <img
                           src="/cru-logo-rgb (1).jpg"
                           alt="Cru"
                           className="h-16 w-auto cursor-pointer hover:opacity-80 transition-opacity duration-200"
                           onClick={onHomeClick}
                        />
                     ) : (
                        <img
                           src="/Give2Go_Logo_Design-removebg-preview.png"
                           alt="Give2Go"
                           className="h-14 w-auto cursor-pointer hover:opacity-80 transition-opacity duration-200"
                           onClick={onHomeClick}
                        />
                     )}
                  </div>
                  <div className="flex items-center space-x-4">
                     <button
                        onClick={() => onNavigate('index')}
                        className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                     >
                        Students
                     </button>
                     {onRandomDonation && (
                        <button
                           onClick={onRandomDonation}
                           className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                        >
                           Random Donation
                        </button>
                     )}
                     {onGroupDonation && (
                        <button
                           onClick={onGroupDonation}
                           className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                        >
                           Group Donation
                        </button>
                     )}
                     {currentStudent ? (
                        <>
                           <button
                              onClick={() => onNavigate('profile')}
                              className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                           >
                              Profile
                           </button>
                           <span className="text-gray-700 text-sm">
                              Welcome, {currentStudent.name}
                           </span>
                           <button
                              onClick={handleLogoutClick}
                              className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700"
                           >
                              Logout
                           </button>
                        </>
                     ) : (
                        <>
                           <button
                              onClick={() => onNavigate('login')}
                              className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                           >
                              Login
                           </button>
                           <button
                              onClick={() => onNavigate('register')}
                              className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                           >
                              Register
                           </button>
                        </>
                     )}
                  </div>
               </div>
            </div>
         </nav>

         {/* Logout Confirmation Modal */}
         {
            showLogoutConfirm && (
               <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
                     <div className="text-center">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                           Confirm Logout
                        </h3>
                        <p className="text-gray-600 mb-6">
                           Are you sure you want to log out?
                        </p>
                        <div className="flex space-x-3">
                           <button
                              onClick={handleLogoutCancel}
                              className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md text-sm font-medium hover:bg-gray-300 transition-colors"
                           >
                              Cancel
                           </button>
                           <button
                              onClick={handleLogoutConfirm}
                              className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
                           >
                              Logout
                           </button>
                        </div>
                     </div>
                  </div>
               </div>
            )
         }
      </>
   );
}; 