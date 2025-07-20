import type { Student } from '../types';

interface NavbarProps {
   currentStudent: Student | null;
   onNavigate: (page: 'index' | 'login' | 'register' | 'profile') => void;
   onLogout: () => void;
   onHomeClick?: () => void;
   showCruLogo?: boolean;
}

export const Navbar = ({ currentStudent, onNavigate, onLogout, onHomeClick, showCruLogo }: NavbarProps) => {
   return (
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
                           onClick={onLogout}
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
   );
}; 