import { useNavigate } from 'react-router-dom';
import { Navbar } from './Navbar';
import type { Student } from '../types';

interface LandingPageProps {
   currentStudent: Student | null;
   onNavigate: (page: 'index' | 'login' | 'register' | 'profile') => void;
   onLogout: () => void;
   onHomeClick?: () => void;
}

export const LandingPage = ({ currentStudent, onNavigate, onLogout, onHomeClick }: LandingPageProps) => {
   const navigate = useNavigate();

   return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
         <Navbar currentStudent={currentStudent} onNavigate={onNavigate} onLogout={onLogout} onHomeClick={onHomeClick} />
         {/* Hero Section */}
         <div className="relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
               <div className="text-center">
                  <h1
                     className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 cursor-pointer hover:text-blue-600 transition-colors duration-200"
                     onClick={() => navigate('/')}
                  >
                     Give2Go
                  </h1>
                  <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                     Empowering students to make a global impact through mission trips.
                     Connect with passionate students and support their journey to serve communities around the world.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                     <button
                        onClick={() => navigate('/students')}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg text-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                     >
                        Browse Students
                     </button>
                     <button
                        onClick={() => navigate('/donate/random')}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-4 px-8 rounded-lg text-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                     >
                        Donate Randomly
                     </button>
                  </div>
               </div>
            </div>
         </div>

         {/* Features Section */}
         <div className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               <div className="text-center mb-16">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                     How It Works
                  </h2>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                     Our platform connects generous donors with students who are passionate about making a difference through mission trips.
                  </p>
               </div>

               <div className="grid md:grid-cols-3 gap-8 mb-16">
                  <div className="text-center p-6">
                     <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                     </div>
                     <h3 className="text-xl font-semibold text-gray-900 mb-2">Connect with Students</h3>
                     <p className="text-gray-600">
                        Browse profiles of students from universities across the country who are fundraising for mission trips.
                     </p>
                  </div>

                  <div className="text-center p-6">
                     <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                     </div>
                     <h3 className="text-xl font-semibold text-gray-900 mb-2">Support Their Mission</h3>
                     <p className="text-gray-600">
                        Make a donation to help students reach their fundraising goals and participate in life-changing mission trips.
                     </p>
                  </div>

                  <div className="text-center p-6">
                     <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                     </div>
                     <h3 className="text-xl font-semibold text-gray-900 mb-2">Global Impact</h3>
                     <p className="text-gray-600">
                        Your support enables students to serve communities worldwide and make a lasting difference.
                     </p>
                  </div>
               </div>
            </div>
         </div>

         {/* Action Cards Section */}
         <div className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                     Get Started Today
                  </h2>
                  <p className="text-lg text-gray-600">
                     Choose how you'd like to make a difference
                  </p>
               </div>

               <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Browse Students */}
                  <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                     <div className="p-6 text-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                           <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                           </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Browse Students</h3>
                        <p className="text-gray-600 text-sm mb-4">
                           Explore student profiles and find someone to support
                        </p>
                        <button
                           onClick={() => navigate('/students')}
                           className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                        >
                           View All Students
                        </button>
                     </div>
                  </div>

                  {/* Random Donation */}
                  <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                     <div className="p-6 text-center">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                           <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                           </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Random Donation</h3>
                        <p className="text-gray-600 text-sm mb-4">
                           Let us choose a student for you to support
                        </p>
                        <button
                           onClick={() => navigate('/donate/random')}
                           className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                        >
                           Donate Randomly
                        </button>
                     </div>
                  </div>

                  {/* Group Donate */}
                  <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                     <div className="p-6 text-center">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                           <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                           </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Group Donate</h3>
                        <p className="text-gray-600 text-sm mb-4">
                           Organize group donations with friends and family
                        </p>
                        <button
                           onClick={() => navigate('/group-donate')}
                           className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                        >
                           Coming Soon
                        </button>
                     </div>
                  </div>

                  {/* Search */}
                  <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                     <div className="p-6 text-center">
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                           <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                           </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Search</h3>
                        <p className="text-gray-600 text-sm mb-4">
                           Find students by university, trip, or location
                        </p>
                        <button
                           onClick={() => navigate('/search')}
                           className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                        >
                           Coming Soon
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* Stats Section */}
         <div className="py-16 bg-blue-600">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                     Making a Difference Together
                  </h2>
                  <p className="text-xl text-blue-100">
                     Join thousands of donors supporting students worldwide
                  </p>
               </div>

               <div className="grid md:grid-cols-3 gap-8 text-center">
                  <div>
                     <div className="text-4xl font-bold text-white mb-2">500+</div>
                     <div className="text-blue-100">Students Supported</div>
                  </div>
                  <div>
                     <div className="text-4xl font-bold text-white mb-2">$2M+</div>
                     <div className="text-blue-100">Total Raised</div>
                  </div>
                  <div>
                     <div className="text-4xl font-bold text-white mb-2">50+</div>
                     <div className="text-blue-100">Countries Served</div>
                  </div>
               </div>
            </div>
         </div>

         {/* Footer */}
         <div className="bg-gray-900 text-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
               <p className="text-gray-400">
                  © 2025 Give2Go. Empowering students to make a global impact through mission trips.
               </p>
            </div>
         </div>
      </div>
   );
}; 