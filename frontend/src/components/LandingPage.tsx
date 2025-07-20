import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Navbar } from './Navbar';
import type { Student } from '../types';

interface LandingPageProps {
   currentStudent: Student | null;
   onNavigate: (page: 'index' | 'login' | 'register' | 'profile') => void;
   onLogout: () => void;
   onHomeClick?: () => void;
   onRandomDonation?: () => void;
   onGroupDonation?: () => void;
}

export const LandingPage = ({ currentStudent, onNavigate, onLogout, onHomeClick, onRandomDonation, onGroupDonation }: LandingPageProps) => {
   const navigate = useNavigate();
   const [featuredStudents, setFeaturedStudents] = useState<Student[]>([]);
   const [loading, setLoading] = useState(false);
   const [searchTerm, setSearchTerm] = useState('');
   const [selectedUniversity, setSelectedUniversity] = useState('');
   const [selectedTrip, setSelectedTrip] = useState('');
   const [universities, setUniversities] = useState<string[]>([]);
   const [trips, setTrips] = useState<string[]>([]);

   // Scroll to top when component mounts
   useEffect(() => {
      window.scrollTo(0, 0);
   }, []);

   // Fetch and select featured students
   useEffect(() => {
      const fetchFeaturedStudents = async () => {
         setLoading(true);
         try {
            const response = await fetch('/api/v1/students');
            if (response.ok) {
               const students: Student[] = await response.json();

               // Filter students below 25% of their goal and exclude those at 100%
               const lowProgressStudents = students.filter(student => {
                  if (!student.trip?.goal_amount) return false;
                  const progressPercentage = (student.balance / student.trip.goal_amount) * 100;
                  return progressPercentage < 25;
               });

               // Filter out students at 100% for random selection
               const eligibleStudents = students.filter(student => {
                  if (!student.trip?.goal_amount) return false;
                  const progressPercentage = (student.balance / student.trip.goal_amount) * 100;
                  return progressPercentage < 100;
               });

               // Select 4 students: 3 below 25%, 1 random
               let selectedStudents: Student[] = [];

               if (lowProgressStudents.length >= 3) {
                  // Take 3 low progress students
                  const lowProgressSelected = lowProgressStudents
                     .sort(() => Math.random() - 0.5)
                     .slice(0, 3);

                  // Get 1 random student from remaining eligible students
                  const remainingStudents = eligibleStudents.filter(student =>
                     !lowProgressSelected.includes(student)
                  );
                  const randomStudent = remainingStudents
                     .sort(() => Math.random() - 0.5)
                     .slice(0, 1);

                  selectedStudents = [...lowProgressSelected, ...randomStudent];
               } else if (lowProgressStudents.length > 0) {
                  // Take all low progress students and fill with random ones
                  selectedStudents = [...lowProgressStudents];
                  const remainingStudents = eligibleStudents.filter(student =>
                     !lowProgressStudents.includes(student)
                  );
                  const randomStudents = remainingStudents
                     .sort(() => Math.random() - 0.5)
                     .slice(0, 4 - lowProgressStudents.length);
                  selectedStudents.push(...randomStudents);
               } else {
                  // No low progress students, select 4 random from eligible students
                  selectedStudents = eligibleStudents
                     .sort(() => Math.random() - 0.5)
                     .slice(0, 4);
               }

               console.log('Selected students:', selectedStudents.length, selectedStudents.map(s => s.name));
               setFeaturedStudents(selectedStudents);
            }
         } catch (error) {
            console.error('Failed to fetch featured students:', error);
         } finally {
            setLoading(false);
         }
      };

      fetchFeaturedStudents();
   }, []);

   // Fetch all students to get universities and trips for search dropdowns
   useEffect(() => {
      const fetchSearchData = async () => {
         try {
            const response = await fetch('/api/v1/students');
            if (response.ok) {
               const students: Student[] = await response.json();

               // Extract unique universities
               const uniqueUniversities = [...new Set(students.map(s => s.university).filter((u): u is string => Boolean(u)))];
               setUniversities(uniqueUniversities.sort());

               // Extract unique trips
               const uniqueTrips = [...new Set(students.map(s => s.trip?.name).filter((t): t is string => Boolean(t)))];
               setTrips(uniqueTrips.sort());
            }
         } catch (error) {
            console.error('Failed to fetch search data:', error);
         }
      };

      fetchSearchData();
   }, []);

   return (
      <div className="min-h-screen">
         <Navbar currentStudent={currentStudent} onNavigate={onNavigate} onLogout={onLogout} onHomeClick={onHomeClick} showCruLogo={true} onRandomDonation={onRandomDonation} onGroupDonation={onGroupDonation} />
         {/* Hero Section */}
         <div className="relative overflow-hidden bg-gray-50" style={{
            backgroundImage: 'url(/another-wonderful-sunset-sky.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
         }}>
            {/* Spring foreground overlay */}
            <div className="absolute inset-0" style={{
               backgroundImage: 'url(/spring-foreground.png)',
               backgroundSize: 'cover',
               backgroundPosition: 'center',
               backgroundRepeat: 'no-repeat',
               pointerEvents: 'none'
            }}></div>

            {/* Gradient transition overlay */}
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent opacity-60"></div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8 relative z-10">
               {/* Dark overlay for better text contrast */}
               <div className="absolute inset-0 bg-black bg-opacity-5 rounded-lg"></div>
               <div className="text-center relative z-20">
                  <div className="flex flex-col items-center mb-6">
                     <img
                        src="/Give2Go_Logo_Design-removebg-preview.png"
                        alt="Give2Go"
                        className="h-48 md:h-64 w-auto mb-2"
                     />
                     <p className="text-xs md:text-sm text-gray-600 font-light italic tracking-wide">
                        A Cru Digital Service
                     </p>
                  </div>
                  <p className="text-xl md:text-2xl text-white mb-8 max-w-3xl mx-auto leading-relaxed">
                     Empowering students to make a global impact through mission trips.
                     Connect with passionate students and support their journey to serve communities around the world.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto mb-12">
                     <button
                        onClick={() => navigate('/students')}
                        className="group relative overflow-hidden bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 text-white font-bold py-6 px-6 rounded-2xl text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 border-2 border-blue-400/20"
                     >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                        <div className="relative flex flex-col items-center">
                           <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-3 group-hover:bg-white/30 transition-colors duration-300">
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                           </div>
                           <span className="text-center">Browse All Students</span>
                        </div>
                     </button>

                     <button
                        onClick={() => navigate('/donate/random')}
                        className="group relative overflow-hidden bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 text-white font-bold py-6 px-6 rounded-2xl text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 border-2 border-purple-400/20"
                     >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                        <div className="relative flex flex-col items-center">
                           <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-3 group-hover:bg-white/30 transition-colors duration-300">
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                              </svg>
                           </div>
                           <span className="text-center">Random Donation</span>
                        </div>
                     </button>

                     <button
                        onClick={() => navigate('/group-donate-info')}
                        className="group relative overflow-hidden bg-gradient-to-br from-green-500 via-green-600 to-green-700 text-white font-bold py-6 px-6 rounded-2xl text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-green-500/25 border-2 border-green-400/20"
                     >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                        <div className="relative flex flex-col items-center">
                           <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-3 group-hover:bg-white/30 transition-colors duration-300">
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                           </div>
                           <span className="text-center">Donate to a Group</span>
                        </div>
                     </button>

                     <button
                        onClick={() => {
                           const searchSection = document.getElementById('search-section');
                           if (searchSection) {
                              searchSection.scrollIntoView({ behavior: 'smooth' });
                           }
                        }}
                        className="group relative overflow-hidden bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 text-white font-bold py-6 px-6 rounded-2xl text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/25 border-2 border-orange-400/20"
                     >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                        <div className="relative flex flex-col items-center">
                           <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-3 group-hover:bg-white/30 transition-colors duration-300">
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                              </svg>
                           </div>
                           <span className="text-center">Search Students</span>
                        </div>
                     </button>
                  </div>


               </div>
            </div>
         </div>

         {/* Features Section */}
         <div className="pt-16 pb-8 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               <div className="text-center mb-16">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                     How It Works:
                  </h2>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                     Our platform connects generous donors with students who are passionate about making a difference through Cru's mission trips.
                  </p>
               </div>

               <div className="grid md:grid-cols-3 gap-8 mb-16">
                  <div className="text-center p-6">
                     <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                     </div>
                     <h3 className="text-xl font-semibold text-gray-900 mb-2">Expand Student Networks</h3>
                     <p className="text-gray-600">
                        Our platform is tailored towards students with smaller networks, with the goal of empowering them to leverage online tools to accelerate their fundraising efforts.
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
                     <h3 className="text-xl font-semibold text-gray-900 mb-2">Live out the Great Commission</h3>
                     <p className="text-gray-600">
                        Connect with the next generation of the Body of Christ by equipping them with the resources they need to live out the Great Commission and make a lasting impact internationally
                     </p>
                  </div>
               </div>
            </div>
         </div>

         {/* Search Section */}
         <div id="search-section" className="py-16 bg-blue-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               <div className="text-center mb-8">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                     Find Students to Support
                  </h2>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                     Search and filter students by name, university, or trip name
                  </p>
               </div>

               <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                     <div>
                        <label htmlFor="quick-search" className="block text-sm font-medium text-gray-700 mb-2">
                           Search by Name
                        </label>
                        <input
                           type="text"
                           id="quick-search"
                           value={searchTerm}
                           onChange={(e) => setSearchTerm(e.target.value)}
                           placeholder="Enter student name..."
                           className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                     </div>
                     <div>
                        <label htmlFor="quick-university" className="block text-sm font-medium text-gray-700 mb-2">
                           University
                        </label>
                        <select
                           id="quick-university"
                           value={selectedUniversity}
                           onChange={(e) => setSelectedUniversity(e.target.value)}
                           className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                           <option value="">All Universities</option>
                           {universities.map(university => (
                              <option key={university} value={university}>{university}</option>
                           ))}
                        </select>
                     </div>
                     <div>
                        <label htmlFor="quick-trip" className="block text-sm font-medium text-gray-700 mb-2">
                           Trip Name
                        </label>
                        <select
                           id="quick-trip"
                           value={selectedTrip}
                           onChange={(e) => setSelectedTrip(e.target.value)}
                           className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                           <option value="">All Trips</option>
                           {trips.map(trip => (
                              <option key={trip} value={trip}>{trip}</option>
                           ))}
                        </select>
                     </div>
                  </div>
                  <div className="text-center">
                     <button
                        onClick={() => {
                           const params = new URLSearchParams();
                           if (searchTerm) params.append('search', searchTerm);
                           if (selectedUniversity) params.append('university', selectedUniversity);
                           if (selectedTrip) params.append('trip', selectedTrip);
                           navigate(`/students?${params.toString()}`);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg text-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                     >
                        Search Students
                     </button>
                  </div>
               </div>
            </div>
         </div>

         {/* Featured Students Section */}
         <div className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Students</h2>
                  <p className="text-lg text-gray-600">Support these students who are working hard to reach their mission trip goals</p>
               </div>

               {loading ? (
                  <div className="flex justify-center">
                     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  </div>
               ) : featuredStudents.length > 0 ? (
                  <div className="grid grid-cols-4 gap-6">
                     {featuredStudents.map((student) => {
                        const percent = Math.floor((parseFloat(student.balance.toString()) / (student.trip?.goal_amount || 5000)) * 100);
                        const percentDisplay = (percent >= 100 ? 100 : percent) + '% Complete';
                        return (
                           <div key={student.id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
                              {/* Student Profile Picture Header */}
                              <div className="w-full aspect-square bg-gray-300 relative overflow-hidden">
                                 {student.profile_picture_url ? (
                                    <img
                                       src={student.profile_picture_url}
                                       alt={student.name}
                                       className="w-full h-full object-contain"
                                       onError={(e) => {
                                          // Hide the broken image and show the fallback
                                          e.currentTarget.style.display = 'none';
                                          const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                                          if (fallback) {
                                             fallback.style.display = 'flex';
                                          }
                                       }}
                                    />
                                 ) : null}
                                 <div className="absolute inset-0 flex items-center justify-center text-white text-6xl font-bold" style={{ display: student.profile_picture_url ? 'none' : 'flex' }}>
                                    {student.name.charAt(0).toUpperCase()}
                                 </div>
                              </div>
                              {/* Student Name and University below image */}
                              <div className="w-full text-center mt-2 mb-1 min-h-[60px] flex flex-col justify-center">
                                 <div className="text-3xl md:text-4xl font-normal text-gray-900 truncate">{student.name}</div>
                                 <div className="min-h-[40px] flex items-center justify-center">
                                    {student.headline ? (
                                       <div className="text-sm text-gray-500 font-normal mt-1 whitespace-pre-line break-words leading-snug" style={{ wordBreak: 'break-word', whiteSpace: 'pre-line' }}>
                                          "{student.headline}"
                                       </div>
                                    ) : (
                                       <div className="text-sm text-gray-500 font-normal mt-1 opacity-0">Placeholder</div>
                                    )}
                                 </div>
                                 <div className="text-xs md:text-sm text-gray-500 mt-1 truncate font-semibold">{student.university}</div>
                              </div>

                              {/* Trip Information */}
                              <div className="px-4 py-3 bg-gray-50 flex flex-col justify-center min-h-[60px]">
                                 <div className="text-base font-semibold text-gray-800 truncate">{student.trip?.name || 'Mission Trip'}</div>
                                 <div className="flex items-center text-xs text-gray-500 mt-0.5 truncate">
                                    <svg className="w-4 h-4 text-blue-500 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span>{student.trip?.location_city}, {student.trip?.location_country}</span>
                                 </div>
                              </div>

                              {/* Fundraising Progress */}
                              <div className="p-4">
                                 <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-medium text-gray-700">Fundraising Progress</span>
                                    <span className="text-sm text-gray-500">
                                       ${parseFloat(student.balance.toString()).toLocaleString()}
                                    </span>
                                 </div>

                                 {/* Progress Bar */}
                                 <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                                    <div
                                       className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-300"
                                       style={{
                                          width: `${Math.min((parseFloat(student.balance.toString()) / (student.trip?.goal_amount || 5000)) * 100, 100)}%`
                                       }}
                                    ></div>
                                 </div>

                                 {/* Goal Display */}
                                 <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-500">Raised</span>
                                    <span className="text-xs text-gray-500">
                                       Goal: ${(student.trip?.goal_amount || 5000).toLocaleString()}
                                    </span>
                                 </div>

                                 {/* Percentage */}
                                 <div className="text-center mt-2">
                                    <span className="text-sm font-semibold text-green-600">{percentDisplay}</span>
                                 </div>
                              </div>

                              {/* Support Button */}
                              {percent < 100 && (
                                 <div className="p-4 pt-0">
                                    <button
                                       onClick={() => navigate(`/donate/${student.id}`)}
                                       className="w-full block bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-medium text-center hover:bg-blue-700 transition-colors duration-200"
                                    >
                                       Support {student.name.split(' ')[0]}
                                    </button>
                                 </div>
                              )}
                           </div>
                        );
                     })}
                  </div>
               ) : (
                  <div className="text-center text-gray-500">
                     <p>No students available at the moment.</p>
                  </div>
               )}
            </div>
         </div>

         {/* Testimonials Section */}
         <div className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               <div className="text-center mb-16">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                     Student Success Stories
                  </h2>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                     Hear from students who overcame their worries and successfully raised support for their mission trips.
                  </p>
               </div>

               {/* Testimonial 1 - Image Left */}
               <div className="mb-20">
                  <div className="flex flex-col lg:flex-row items-center gap-12">
                     <div className="lg:w-1/2">
                        <img
                           src="/MissionTrip.jpeg"
                           alt="Student testimonial"
                           className="w-full h-80 object-cover rounded-2xl shadow-lg"
                        />
                     </div>
                     <div className="lg:w-1/2">
                        <div className="bg-gray-50 p-8 rounded-2xl">
                           <div className="flex items-center mb-4">
                              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                                 <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                                 </svg>
                              </div>
                              <div>
                                 <h3 className="text-xl font-semibold text-gray-900">Michael Chen</h3>
                                 <p className="text-gray-600">University of Georgia</p>
                              </div>
                           </div>
                           <blockquote className="text-lg text-gray-700 italic leading-relaxed">
                              "I was very intimidated by the fact I needed to raise support for my mission trip. Give2Go made fundraising feel natural and meaningful.
                              I raised $4,200 for my mission trip to Kenya and discovered that people actually want to support
                              students making a difference. The platform gave me confidence I never knew I had."
                           </blockquote>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Testimonial 2 - Image Right */}
               <div className="mb-20">
                  <div className="flex flex-col lg:flex-row-reverse items-center gap-12">
                     <div className="lg:w-1/2">
                        <img
                           src="/Homepage-Hero.jpg"
                           alt="Student testimonial"
                           className="w-full h-80 object-cover rounded-2xl shadow-lg"
                        />
                     </div>
                     <div className="lg:w-1/2">
                        <div className="bg-gray-50 p-8 rounded-2xl">
                           <div className="flex items-center mb-4">
                              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                                 <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                                 </svg>
                              </div>
                              <div>
                                 <h3 className="text-xl font-semibold text-gray-900">Emily Barentt</h3>
                                 <p className="text-gray-600">Baylor University</p>
                              </div>
                           </div>
                           <blockquote className="text-lg text-gray-700 italic leading-relaxed">
                              "The finaical situation made me very hesitant - I almost didn't go on my mission trip, but learning about Give2Go changed
                              everything. The platform made it easy to share my passion and connect with people who wanted to
                              support my journey. I raised $5,100 and had the most incredible experience in Costa Rica!"
                           </blockquote>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Testimonial 3 - Image Left */}
               <div className="mb-20">
                  <div className="flex flex-col lg:flex-row items-center gap-12">
                     <div className="lg:w-1/2">
                        <img
                           src="/article-most-affordable-mission-trips-for-youth-adults-and-groups-01.jpg"
                           alt="Student testimonial"
                           className="w-full h-80 object-cover rounded-2xl shadow-lg"
                        />
                     </div>
                     <div className="lg:w-1/2">
                        <div className="bg-gray-50 p-8 rounded-2xl">
                           <div className="flex items-center mb-4">
                              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                                 <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                                 </svg>
                              </div>
                              <div>
                                 <h3 className="text-xl font-semibold text-gray-900">Brett Fisher</h3>
                                 <p className="text-gray-600">Texas A&M University</p>
                              </div>
                           </div>
                           <blockquote className="text-lg text-gray-700 italic leading-relaxed">
                              "The thought of fundraising was overwhelming. I don't have a large network of potiental supporters I could tap into, but Give2Go filled in the gaps and made ministry partner development feel not just possible, but encouraging. Because of the supporters I got from Give2Go, I raised $3,800 for my trip to Guatemala, and got to witness the Lord work in incredible ways.
                           </blockquote>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* Action Cards Section */}
         <div className="py-16 bg-blue-50">
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
                           Random Donation
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
                           Donate to multiple students at once and automatically split the donation
                        </p>
                        <button
                           onClick={() => navigate('/group-donate-info')}
                           className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                        >
                           Learn More
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
                           onClick={() => {
                              const searchSection = document.getElementById('search-section');
                              if (searchSection) {
                                 searchSection.scrollIntoView({ behavior: 'smooth' });
                              }
                           }}
                           className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                        >
                           Search
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* Stats Section */}
         <div className="py-16 relative overflow-hidden">
            <div
               className="absolute inset-0 bg-cover bg-center"
               style={{ backgroundImage: 'url(/48_backpack-a276a7d04730ffe72d53c7be1836b47fa0c30e516ef3c0b74be0e7b9ded41bfe.jpg)' }}
            />
            <div className="absolute inset-0 bg-blue-600/50" />
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                     <div className="text-4xl font-bold text-white mb-2">4500+</div>
                     <div className="text-blue-100">Students Supported</div>
                  </div>
                  <div>
                     <div className="text-4xl font-bold text-white mb-2">$2M+</div>
                     <div className="text-blue-100">Total Raised</div>
                  </div>
                  <div>
                     <div className="text-4xl font-bold text-white mb-2">60+</div>
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
               <p className="text-gray-400 text-sm mt-2">
                  This is a demo project for the OSM HQ internship design sprint week. Any financial transactions and data are fake and merely for demonstrational purposes.
               </p>
            </div>
         </div>
      </div>
   );
}; 