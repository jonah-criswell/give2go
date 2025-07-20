import React, { useState, useEffect } from 'react';
import type { Student } from '../types';
import { Link, useSearchParams } from 'react-router-dom';
import { StudentSearch } from './StudentSearch';

interface StudentListProps {
   students: Student[];
   loading: boolean;
   error: string;
   // onSupportStudent?: (student: Student) => void;
}

export const StudentList = ({ students, loading, error }: StudentListProps) => {
   const [filteredStudents, setFilteredStudents] = useState<Student[]>(students);
   const [searchParams] = useSearchParams();

   // Update filtered students when the original students list changes
   useEffect(() => {
      setFilteredStudents(students);
   }, [students]);

   // Apply URL search parameters when component mounts or URL changes
   useEffect(() => {
      const urlSearch = searchParams.get('search') || '';
      const urlUniversity = searchParams.get('university') || '';
      const urlTrip = searchParams.get('trip') || '';

      if (urlSearch || urlUniversity || urlTrip) {
         let filtered = students.filter(student => {
            // Name search
            if (urlSearch && !student.name.toLowerCase().includes(urlSearch.toLowerCase())) {
               return false;
            }

            // University filter
            if (urlUniversity && student.university !== urlUniversity) {
               return false;
            }

            // Trip filter
            if (urlTrip && student.trip?.name !== urlTrip) {
               return false;
            }

            return true;
         });

         setFilteredStudents(filtered);
      } else {
         setFilteredStudents(students);
      }
   }, [students, searchParams]);

   if (loading) {
      return (
         <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-lg text-gray-600">Loading students...</div>
         </div>
      );
   }

   if (error) {
      return (
         <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-lg text-red-600">Error: {error}</div>
         </div>
      );
   }

   return (
      <div className="min-h-screen bg-gray-50">
         <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
               <div className="text-center mb-8">
                  <h1 className="text-4xl md:text-5xl text-gray-900 mb-6">Browse the complete list of students looking for support:</h1>
                  {searchParams.get('search') || searchParams.get('university') || searchParams.get('trip') ? (
                     <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800">
                           Showing results for:
                           {searchParams.get('search') && ` Name: "${searchParams.get('search')}"`}
                           {searchParams.get('university') && ` University: ${searchParams.get('university')}`}
                           {searchParams.get('trip') && ` Trip: ${searchParams.get('trip')}`}
                        </p>
                     </div>
                  ) : null}
                  <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center items-center">
                     <button
                        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-8 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105 text-lg"
                        onClick={() => window.location.href = '/donate/random'}
                     >
                        Donate to a Random Student
                     </button>
                     <button
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105 text-lg"
                        onClick={() => window.location.href = '/group-donate-info'}
                     >
                        Donate to Multiple Students
                     </button>
                  </div>
               </div>

               {/* Search and Filter Component */}
               <StudentSearch
                  students={students}
                  onFilteredStudentsChange={setFilteredStudents}
               />

               {/* Student Cards Grid */}
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredStudents.map((student) => {
                     const percent = Math.floor((parseFloat(student.balance.toString()) / (student.trip?.goal_amount || 5000)) * 100);
                     const percentDisplay = (percent >= 100 ? 100 : percent) + '% Complete';
                     return (
                        <div key={student.id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
                           {/* Student Profile Picture Header */}
                           <div className="w-full aspect-square bg-gradient-to-br from-blue-500 to-purple-600 relative overflow-hidden">
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
                           <div className="w-full text-center mt-2 mb-1">
                              <div className="text-3xl md:text-4xl font-normal text-gray-900 truncate">{student.name}</div>
                              {student.headline && (
                                 <div className="text-sm text-gray-500 font-normal mt-1 whitespace-pre-line break-words leading-snug" style={{ wordBreak: 'break-word', whiteSpace: 'pre-line' }}>
                                    "{student.headline}"
                                 </div>
                              )}
                              <div className="text-xs md:text-sm text-gray-500 mt-1 truncate">{student.university}</div>
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
                           <div className="p-4 pt-0">
                              <Link
                                 to={`/donate/${student.id}`}
                                 className="w-full block bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-medium text-center hover:bg-blue-700 transition-colors duration-200"
                              >
                                 Support {student.name.split(' ')[0]}
                              </Link>
                           </div>
                        </div>
                     );
                  })}
               </div>

               {/* Empty State */}
               {filteredStudents.length === 0 && (
                  <div className="text-center py-12">
                     <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                        </svg>
                     </div>
                     <h3 className="text-lg font-medium text-gray-900 mb-2">No students found</h3>
                     <p className="text-gray-500">
                        {students.length === 0
                           ? "Students will appear here once they register for mission trips."
                           : "Try adjusting your search criteria or filters."
                        }
                     </p>
                  </div>
               )}
            </div>
         </div>
      </div>
   );
}; 