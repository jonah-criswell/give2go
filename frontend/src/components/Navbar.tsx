import type { Student } from '../types';

interface NavbarProps {
   currentStudent: Student | null;
   onNavigate: (page: 'index' | 'login' | 'register' | 'profile') => void;
   onLogout: () => void;
   onHomeClick?: () => void;
}

export const Navbar = ({ currentStudent, onNavigate, onLogout, onHomeClick }: NavbarProps) => {
   return (
      <nav className="bg-white shadow-lg">
         <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between h-16">
               <div className="flex items-center">
                  <img
                     src="/give2go-logo.svg"
                     alt="Give2Go"
                     className="h-10 w-auto cursor-pointer hover:opacity-80 transition-opacity duration-200"
                     onClick={onHomeClick}
                  />
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