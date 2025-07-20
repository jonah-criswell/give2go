import React, { useState, useEffect } from 'react';
import type { Student } from '../types';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
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
   const [currentPage, setCurrentPage] = useState(1);
   const studentsPerPage = 16;
   const navigate = useNavigate();

   // Update filtered students when the original students list changes
   useEffect(() => {
      setFilteredStudents(students);
      setCurrentPage(1); // Reset to first page when students change
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
         setCurrentPage(1); // Reset to first page when filters change
      } else {
         setFilteredStudents(students);
         setCurrentPage(1); // Reset to first page when filters clear
      }
   }, [students, searchParams]);

   // Calculate pagination
   const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);
   const startIndex = (currentPage - 1) * studentsPerPage;
   const endIndex = startIndex + studentsPerPage;
   const currentStudents = filteredStudents.slice(startIndex, endIndex);

   // Handle page changes
   const handlePageChange = (page: number) => {
      setCurrentPage(page);
      // Scroll to top of student list
      window.scrollTo({ top: 0, behavior: 'smooth' });
   };

   // Generate page numbers for pagination
   const getPageNumbers = () => {
      const pages = [];
      const maxVisiblePages = 5;

      if (totalPages <= maxVisiblePages) {
         // Show all pages if total is small
         for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
         }
      } else {
         // Show pages around current page
         let start = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
         let end = Math.min(totalPages, start + maxVisiblePages - 1);

         // Adjust start if we're near the end
         if (end === totalPages) {
            start = Math.max(1, end - maxVisiblePages + 1);
         }

         for (let i = start; i <= end; i++) {
            pages.push(i);
         }
      }

      return pages;
   };

   return (
      <div className="min-h-screen bg-gray-50">
         <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
               <div className="text-center mb-8">
                  <h1 className="text-4xl md:text-5xl text-gray-900 mb-6">Browse the complete list of students looking for support.</h1>
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
               </div>

               {/* Search and Filter Component */}
               <StudentSearch
                  students={students}
                  onFilteredStudentsChange={setFilteredStudents}
               />

               {/* Results count and pagination info */}
               {!loading && !error && filteredStudents.length > 0 && (
                  <div className="mb-6 text-center">
                     <p className="text-gray-600">
                        Showing {startIndex + 1}-{Math.min(endIndex, filteredStudents.length)} of {filteredStudents.length} students
                     </p>
                  </div>
               )}

               {/* Student Cards Grid */}
               {loading ? (
                  <div className="flex justify-center items-center py-12">
                     <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <div className="text-lg text-gray-600">Loading students...</div>
                     </div>
                  </div>
               ) : error ? (
                  <div className="flex justify-center items-center py-12">
                     <div className="text-center">
                        <div className="text-lg text-red-600 mb-2">Error loading students</div>
                        <div className="text-sm text-gray-500">{error}</div>
                     </div>
                  </div>
               ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                     {currentStudents.map((student) => {
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
                                    <Link
                                       to={`/donate/${student.id}`}
                                       className="w-full block bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-medium text-center hover:bg-blue-700 transition-colors duration-200"
                                    >
                                       Support {student.name.split(' ')[0]}
                                    </Link>
                                 </div>
                              )}
                           </div>
                        );
                     })}
                  </div>
               )}

               {/* Pagination Controls */}
               {!loading && !error && totalPages > 1 && (
                  <div className="mt-12 flex justify-center">
                     <nav className="flex items-center space-x-2">
                        {/* Previous button */}
                        <button
                           onClick={() => handlePageChange(currentPage - 1)}
                           disabled={currentPage === 1}
                           className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                           Previous
                        </button>

                        {/* Page numbers */}
                        {getPageNumbers().map((page) => (
                           <button
                              key={page}
                              onClick={() => handlePageChange(page)}
                              className={`px-3 py-2 text-sm font-medium rounded-md ${currentPage === page
                                 ? 'bg-blue-600 text-white'
                                 : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                                 }`}
                           >
                              {page}
                           </button>
                        ))}

                        {/* Next button */}
                        <button
                           onClick={() => handlePageChange(currentPage + 1)}
                           disabled={currentPage === totalPages}
                           className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                           Next
                        </button>
                     </nav>
                  </div>
               )}

               {/* Empty State */}
               {!loading && !error && filteredStudents.length === 0 && (
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

               {/* Other ways to donate section */}
               <div className="mt-16">
                  <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
                     <div className="text-center">
                        <h1 className="text-4xl md:text-5xl font-normal text-gray-900 mb-6">Other ways to give:</h1>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                           <button
                              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-8 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105 text-lg"
                              onClick={() => navigate('/donate/random')}
                           >
                              Donate to a Random Student
                           </button>
                           <button
                              className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105 text-lg"
                              onClick={() => navigate('/group-donate-info')}
                           >
                              Donate to Multiple Students
                           </button>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}; 