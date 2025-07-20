import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from './Navbar';
import type { Student } from '../types';

interface GroupDonatePageProps {
   currentStudent: Student | null;
   onNavigate: (page: 'index' | 'login' | 'register' | 'profile') => void;
   onLogout: () => void;
   onHomeClick?: () => void;
}

export const GroupDonatePage = ({ currentStudent, onNavigate, onLogout, onHomeClick }: GroupDonatePageProps) => {
   const navigate = useNavigate();
   const [loading, setLoading] = useState(false);
   const [students, setStudents] = useState<Student[]>([]);
   const [universities, setUniversities] = useState<string[]>([]);
   const [trips, setTrips] = useState<string[]>([]);
   const [selectedGroup, setSelectedGroup] = useState<'all' | 'university' | 'trip'>('all');
   const [selectedUniversity, setSelectedUniversity] = useState('');
   const [selectedTrip, setSelectedTrip] = useState('');
   const [donationAmount, setDonationAmount] = useState('');
   const [donorName, setDonorName] = useState('');
   const [donorEmail, setDonorEmail] = useState('');
   const [donorPhone, setDonorPhone] = useState('');
   const [note, setNote] = useState('');
   const [errors, setErrors] = useState<Record<string, string>>({});

   // Fetch all students to get universities and trips
   useEffect(() => {
      const fetchStudents = async () => {
         try {
            const response = await fetch('/api/v1/students');
            if (response.ok) {
               const studentsData: Student[] = await response.json();
               setStudents(studentsData);

               // Extract unique universities
               const uniqueUniversities = [...new Set(studentsData.map(s => s.university).filter((u): u is string => Boolean(u)))];
               setUniversities(uniqueUniversities.sort());

               // Extract unique trips
               const uniqueTrips = [...new Set(studentsData.map(s => s.trip?.name).filter((t): t is string => Boolean(t)))];
               setTrips(uniqueTrips.sort());
            }
         } catch (error) {
            console.error('Failed to fetch students:', error);
         }
      };

      fetchStudents();
   }, []);

   // Calculate which students will receive the donation
   const getEligibleStudents = () => {
      let eligibleStudents = students;

      switch (selectedGroup) {
         case 'university':
            if (selectedUniversity) {
               eligibleStudents = students.filter(student => student.university === selectedUniversity);
            }
            break;
         case 'trip':
            if (selectedTrip) {
               eligibleStudents = students.filter(student => student.trip?.name === selectedTrip);
            }
            break;
         case 'all':
         default:
            eligibleStudents = students;
            break;
      }

      // Filter out students who have already reached their goal
      return eligibleStudents.filter(student => {
         if (!student.trip?.goal_amount) return false;
         const progressPercentage = (student.balance / student.trip.goal_amount) * 100;
         return progressPercentage < 100;
      });
   };

   const eligibleStudents = getEligibleStudents();

   // Calculate maximum distributable amount
   const calculateMaxDistributableAmount = () => {
      if (eligibleStudents.length === 0) return 0;

      // Calculate how much each student can receive before reaching their goal
      const maxPerStudent = eligibleStudents.map(student => {
         const goalAmount = student.trip?.goal_amount || 5000;
         const currentBalance = student.balance;
         return Math.max(0, goalAmount - currentBalance);
      });

      // The maximum distributable amount is the sum of what each student can receive
      return maxPerStudent.reduce((sum, max) => sum + max, 0);
   };

   const maxDistributableAmount = calculateMaxDistributableAmount();

   const validateForm = () => {
      const newErrors: Record<string, string> = {};

      if (!donationAmount || parseFloat(donationAmount) <= 0) {
         newErrors.donationAmount = 'Please enter a valid donation amount';
      } else if (parseFloat(donationAmount) > maxDistributableAmount) {
         newErrors.donationAmount = `Maximum distributable amount is $${maxDistributableAmount.toFixed(2)}`;
      }

      if (selectedGroup === 'university' && !selectedUniversity) {
         newErrors.university = 'Please select a university';
      }

      if (selectedGroup === 'trip' && !selectedTrip) {
         newErrors.trip = 'Please select a trip';
      }

      if (eligibleStudents.length === 0) {
         newErrors.group = 'No eligible students found for the selected criteria';
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateForm()) {
         return;
      }

      setLoading(true);

      try {
         const response = await fetch('/api/v1/group_donations', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({
               amount: parseFloat(donationAmount),
               group_type: selectedGroup,
               university: selectedGroup === 'university' ? selectedUniversity : null,
               trip_name: selectedGroup === 'trip' ? selectedTrip : null,
               donor_name: donorName || null,
               donor_email: donorEmail || null,
               donor_phone: donorPhone || null,
               note: note || null,
            }),
         });

         if (response.ok) {
            const result = await response.json();
            // Redirect to a success page or show success message
            navigate('/group-donate/success', {
               state: {
                  donationAmount: parseFloat(donationAmount),
                  studentCount: result.student_count,
                  averageAmount: result.average_amount_per_student
               }
            });
         } else {
            const errorData = await response.json();
            setErrors({ submit: errorData.error || 'Failed to process donation' });
         }
      } catch (error) {
         setErrors({ submit: 'Network error. Please try again.' });
      } finally {
         setLoading(false);
      }
   };

   const calculatePreview = () => {
      if (!donationAmount || eligibleStudents.length === 0) return null;

      const amount = parseFloat(donationAmount);
      const baseAmountPerStudent = amount / eligibleStudents.length;

      // Calculate how much each student would receive
      const distribution = eligibleStudents.map(student => {
         const goalAmount = student.trip?.goal_amount || 5000;
         const remaining = Math.max(0, goalAmount - student.balance);
         const wouldReceive = Math.min(baseAmountPerStudent, remaining);

         return {
            student,
            wouldReceive,
            remaining,
            goalAmount
         };
      });

      const totalDistributed = distribution.reduce((sum, d) => sum + d.wouldReceive, 0);
      const excess = amount - totalDistributed;

      return {
         distribution,
         totalDistributed,
         excess,
         baseAmountPerStudent
      };
   };

   const preview = calculatePreview();

   return (
      <div className="min-h-screen bg-gray-50">
         <Navbar currentStudent={currentStudent} onNavigate={onNavigate} onLogout={onLogout} onHomeClick={onHomeClick} showCruLogo={true} />

         <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
               <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Group Donation
               </h1>
               <p className="text-lg text-gray-600">
                  Support multiple students at once by donating to a group
               </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8">
               <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Group Selection */}
                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-3">
                        Select Group to Support
                     </label>
                     <div className="space-y-3">
                        <label className="flex items-center">
                           <input
                              type="radio"
                              name="groupType"
                              value="all"
                              checked={selectedGroup === 'all'}
                              onChange={(e) => setSelectedGroup(e.target.value as 'all')}
                              className="mr-3"
                           />
                           <span className="text-gray-700">All Students</span>
                        </label>
                        <label className="flex items-center">
                           <input
                              type="radio"
                              name="groupType"
                              value="university"
                              checked={selectedGroup === 'university'}
                              onChange={(e) => setSelectedGroup(e.target.value as 'university')}
                              className="mr-3"
                           />
                           <span className="text-gray-700">Students from a specific university</span>
                        </label>
                        <label className="flex items-center">
                           <input
                              type="radio"
                              name="groupType"
                              value="trip"
                              checked={selectedGroup === 'trip'}
                              onChange={(e) => setSelectedGroup(e.target.value as 'trip')}
                              className="mr-3"
                           />
                           <span className="text-gray-700">Students on a specific trip</span>
                        </label>
                     </div>
                     {errors.group && <p className="text-red-600 text-sm mt-1">{errors.group}</p>}
                  </div>

                  {/* University Selection */}
                  {selectedGroup === 'university' && (
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
                           <option value="">Select a university</option>
                           {universities.map(university => (
                              <option key={university} value={university}>{university}</option>
                           ))}
                        </select>
                        {errors.university && <p className="text-red-600 text-sm mt-1">{errors.university}</p>}
                     </div>
                  )}

                  {/* Trip Selection */}
                  {selectedGroup === 'trip' && (
                     <div>
                        <label htmlFor="trip" className="block text-sm font-medium text-gray-700 mb-2">
                           Trip
                        </label>
                        <select
                           id="trip"
                           value={selectedTrip}
                           onChange={(e) => setSelectedTrip(e.target.value)}
                           className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                           <option value="">Select a trip</option>
                           {trips.map(trip => (
                              <option key={trip} value={trip}>{trip}</option>
                           ))}
                        </select>
                        {errors.trip && <p className="text-red-600 text-sm mt-1">{errors.trip}</p>}
                     </div>
                  )}

                  {/* Eligible Students Count */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                     <p className="text-blue-800">
                        <strong>{eligibleStudents.length}</strong> students will receive this donation
                        {selectedGroup === 'university' && selectedUniversity && (
                           <span> from {selectedUniversity}</span>
                        )}
                        {selectedGroup === 'trip' && selectedTrip && (
                           <span> on the {selectedTrip} trip</span>
                        )}
                     </p>
                     {maxDistributableAmount > 0 && (
                        <p className="text-blue-700 text-sm mt-2">
                           <strong>${maxDistributableAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong> is needed across {eligibleStudents.length} students
                        </p>
                     )}
                  </div>

                  {/* Donation Amount */}
                  <div>
                     <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                        Donation Amount ($) - Max: ${maxDistributableAmount.toFixed(2)}
                     </label>
                     <input
                        type="number"
                        id="amount"
                        value={donationAmount}
                        onChange={(e) => setDonationAmount(e.target.value)}
                        min="0"
                        max={maxDistributableAmount}
                        step="0.01"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder={`Enter amount (max: $${maxDistributableAmount.toFixed(2)})`}
                     />
                     {errors.donationAmount && <p className="text-red-600 text-sm mt-1">{errors.donationAmount}</p>}
                     {maxDistributableAmount > 0 && (
                        <p className="text-gray-500 text-sm mt-1">
                           This amount will be distributed evenly among {eligibleStudents.length} students
                        </p>
                     )}
                  </div>

                  {/* Donation Preview */}
                  {preview && (
                     <div className="bg-green-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-green-800 mb-2">Donation Preview</h3>
                        <p className="text-green-700 text-sm">
                           Each student will receive approximately <strong>${preview.baseAmountPerStudent.toFixed(2)}</strong>
                        </p>
                        {preview.excess > 0 && (
                           <p className="text-green-700 text-sm mt-1">
                              <strong>${preview.excess.toFixed(2)}</strong> will be redistributed to students who haven't reached their goal
                           </p>
                        )}
                     </div>
                  )}

                  {/* Donor Information */}
                  <div className="border-t pt-6">
                     <h3 className="text-lg font-medium text-gray-900 mb-4">Donor Information (Optional)</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                           <label htmlFor="donorName" className="block text-sm font-medium text-gray-700 mb-2">
                              Name
                           </label>
                           <input
                              type="text"
                              id="donorName"
                              value={donorName}
                              onChange={(e) => setDonorName(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Your name"
                           />
                        </div>
                        <div>
                           <label htmlFor="donorEmail" className="block text-sm font-medium text-gray-700 mb-2">
                              Email
                           </label>
                           <input
                              type="email"
                              id="donorEmail"
                              value={donorEmail}
                              onChange={(e) => setDonorEmail(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="your.email@example.com"
                           />
                        </div>
                        <div>
                           <label htmlFor="donorPhone" className="block text-sm font-medium text-gray-700 mb-2">
                              Phone Number
                           </label>
                           <input
                              type="tel"
                              id="donorPhone"
                              value={donorPhone}
                              onChange={(e) => setDonorPhone(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="(555) 123-4567"
                           />
                        </div>
                        <div>
                           <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-2">
                              Note
                           </label>
                           <input
                              type="text"
                              id="note"
                              value={note}
                              onChange={(e) => setNote(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Optional message"
                           />
                        </div>
                     </div>
                  </div>

                  {/* Submit Error */}
                  {errors.submit && (
                     <div className="bg-red-50 p-4 rounded-lg">
                        <p className="text-red-600">{errors.submit}</p>
                     </div>
                  )}

                  {/* Submit Button */}
                  <div className="flex justify-center space-x-4">
                     <button
                        type="button"
                        onClick={() => navigate('/')}
                        className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200"
                     >
                        Cancel
                     </button>
                     <button
                        type="submit"
                        disabled={loading || eligibleStudents.length === 0}
                        className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200 disabled:cursor-not-allowed"
                     >
                        {loading ? 'Processing...' : `Donate $${donationAmount || '0'} to ${eligibleStudents.length} Students`}
                     </button>
                  </div>
               </form>
            </div>
         </div>
      </div>
   );
}; 