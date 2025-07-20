import React, { useState, useMemo, useEffect } from 'react';
import type { Student } from '../types';
import { useSearchParams } from 'react-router-dom';

interface StudentSearchProps {
   students: Student[];
   onFilteredStudentsChange: (students: Student[]) => void;
}

export const StudentSearch = ({ students, onFilteredStudentsChange }: StudentSearchProps) => {
   const [searchParams] = useSearchParams();
   const [searchTerm, setSearchTerm] = useState('');
   const [selectedUniversity, setSelectedUniversity] = useState('');
   const [selectedTrip, setSelectedTrip] = useState('');
   const [progressFilter, setProgressFilter] = useState('');
   const [sortBy, setSortBy] = useState('name');
   // Add a random seed that changes on mount and when search/filter criteria change
   const [randomSeed, setRandomSeed] = useState(() => Math.random());

   // Initialize search state from URL parameters
   useEffect(() => {
      const urlSearch = searchParams.get('search') || '';
      const urlUniversity = searchParams.get('university') || '';
      const urlTrip = searchParams.get('trip') || '';

      setSearchTerm(urlSearch);
      setSelectedUniversity(urlUniversity);
      setSelectedTrip(urlTrip);
      setRandomSeed(Math.random()); // Change the seed when search params change
   }, [searchParams]);

   // Also update the seed when students, progressFilter, or sortBy change (for full re-randomization)
   useEffect(() => {
      setRandomSeed(Math.random());
   }, [students, progressFilter, sortBy]);

   // Get unique universities and trips for filter options
   const universities = useMemo(() => {
      const unique = [...new Set(students.map(s => s.university).filter(Boolean))];
      return unique.sort();
   }, [students]);

   const trips = useMemo(() => {
      const unique = [...new Set(students.map(s => s.trip?.name).filter(Boolean))];
      return unique.sort();
   }, [students]);

   // Filter and sort students
   const filteredAndSortedStudents = useMemo(() => {
      let filtered = students.filter(student => {
         // Name search
         if (searchTerm && !student.name.toLowerCase().includes(searchTerm.toLowerCase())) {
            return false;
         }

         // University filter
         if (selectedUniversity && student.university !== selectedUniversity) {
            return false;
         }

         // Trip filter
         if (selectedTrip && student.trip?.name !== selectedTrip) {
            return false;
         }

         // Progress filter
         if (progressFilter) {
            const progressPercentage = student.trip?.goal_amount
               ? (student.balance / student.trip.goal_amount) * 100
               : 0;

            switch (progressFilter) {
               case '0-25':
                  if (progressPercentage >= 25) return false;
                  break;
               case '25-50':
                  if (progressPercentage < 25 || progressPercentage >= 50) return false;
                  break;
               case '50-75':
                  if (progressPercentage < 50 || progressPercentage >= 75) return false;
                  break;
               case '75-100':
                  if (progressPercentage < 75 || progressPercentage >= 100) return false;
                  break;
               case '100':
                  if (progressPercentage < 100) return false;
                  break;
            }
         }

         return true;
      });

      // Always randomize order (but 100%+ last) if sortBy is 'name', regardless of filters
      if (sortBy === 'name') {
         // Separate students at 100%+
         const notComplete = filtered.filter(s => {
            const goal = s.trip?.goal_amount || 0;
            return !(goal > 0 && s.balance >= goal);
         });
         const complete = filtered.filter(s => {
            const goal = s.trip?.goal_amount || 0;
            return goal > 0 && s.balance >= goal;
         });
         // Shuffle notComplete using the randomSeed
         function seededRandom(seed: number) {
            var x = Math.sin(seed++) * 10000;
            return x - Math.floor(x);
         }
         for (let i = notComplete.length - 1; i > 0; i--) {
            const j = Math.floor(seededRandom(randomSeed * 10000 + i) * (i + 1));
            [notComplete[i], notComplete[j]] = [notComplete[j], notComplete[i]];
         }
         return [...notComplete, ...complete];
      }

      // Otherwise, sort by selected option
      filtered.sort((a, b) => {
         switch (sortBy) {
            case 'progress':
               const progressA = a.trip?.goal_amount ? (a.balance / a.trip.goal_amount) * 100 : 0;
               const progressB = b.trip?.goal_amount ? (b.balance / b.trip.goal_amount) * 100 : 0;
               return progressA - progressB;
            case 'goal':
               const goalA = a.trip?.goal_amount || 0;
               const goalB = b.trip?.goal_amount || 0;
               return goalA - goalB;
            default:
               return 0;
         }
      });

      return filtered;
   }, [students, searchTerm, selectedUniversity, selectedTrip, progressFilter, sortBy, randomSeed]);

   // Update parent component when filtered results change
   React.useEffect(() => {
      onFilteredStudentsChange(filteredAndSortedStudents);
   }, [filteredAndSortedStudents, onFilteredStudentsChange]);

   const clearFilters = () => {
      setSearchTerm('');
      setSelectedUniversity('');
      setSelectedTrip('');
      setProgressFilter('');
      setSortBy('name');
   };

   const hasActiveFilters = searchTerm || selectedUniversity || selectedTrip || progressFilter || sortBy !== 'name';

   return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
         <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Search & Filter Students</h2>

            {/* Search Bar */}
            <div className="mb-4">
               <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                  Search by Name
               </label>
               <input
                  type="text"
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Enter student name..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
               />
            </div>

            {/* Filters Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
               {/* University Filter */}
               <div>
                  <label htmlFor="university" className="block text-sm font-medium text-gray-700 mb-2">
                     University
                  </label>
                  <select
                     id="university"
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

               {/* Trip Filter */}
               <div>
                  <label htmlFor="trip" className="block text-sm font-medium text-gray-700 mb-2">
                     Trip Name
                  </label>
                  <select
                     id="trip"
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

               {/* Progress Filter */}
               <div>
                  <label htmlFor="progress" className="block text-sm font-medium text-gray-700 mb-2">
                     Progress
                  </label>
                  <select
                     id="progress"
                     value={progressFilter}
                     onChange={(e) => setProgressFilter(e.target.value)}
                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                     <option value="">All Progress</option>
                     <option value="0-25">0-25%</option>
                     <option value="25-50">25-50%</option>
                     <option value="50-75">50-75%</option>
                     <option value="75-100">75-100%</option>
                     <option value="100">100% Complete</option>
                  </select>
               </div>

               {/* Sort By */}
               <div>
                  <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-2">
                     Sort By
                  </label>
                  <select
                     id="sort"
                     value={sortBy}
                     onChange={(e) => setSortBy(e.target.value)}
                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                     <option value="name">Name (A-Z)</option>
                     <option value="progress">Progress (Low to High)</option>
                     <option value="goal">Goal Amount (Low to High)</option>
                  </select>
               </div>
            </div>

            {/* Results and Clear Filters */}
            <div className="flex justify-between items-center">
               <div className="text-sm text-gray-600">
                  Showing {filteredAndSortedStudents.length} of {students.length} students
               </div>
               {hasActiveFilters && (
                  <button
                     onClick={clearFilters}
                     className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                     Clear All Filters
                  </button>
               )}
            </div>
         </div>
      </div>
   );
}; 