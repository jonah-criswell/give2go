import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import type { Student } from '../types';

interface DonateRevealPageProps {
   onStudentsUpdate?: () => void;
}

export const DonateRevealPage = ({ onStudentsUpdate }: DonateRevealPageProps) => {
   const { studentId } = useParams();
   const navigate = useNavigate();
   const location = useLocation();
   const [student, setStudent] = useState<Student | null>(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState('');
   // Get donation amount from state (passed via navigate)
   const donationAmount = location.state?.donationAmount ? Number(location.state.donationAmount) : null;

   useEffect(() => {
      setLoading(true);
      fetch('/api/v1/students')
         .then(res => res.json())
         .then(data => {
            const found = data.find((s: Student) => String(s.id) === studentId);
            if (found) setStudent(found);
            else setError('Student not found.');
         })
         .catch(() => setError('Failed to load student.'))
         .finally(() => setLoading(false));
   }, [studentId]);

   if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
   if (error || !student) return <div className="flex justify-center items-center min-h-screen text-red-600">{error || 'Student not found.'}</div>;

   // Calculate old/new balances and progress
   let oldBalance = null, newBalance = null, oldPercent: number = 0, newPercent: number = 0, goal = null;
   if (student.trip && student.trip.goal_amount && donationAmount !== null) {
      goal = Number(student.trip.goal_amount);
      oldBalance = Number(student.balance) - donationAmount;
      newBalance = Number(student.balance);
      oldPercent = Math.min((oldBalance / goal) * 100, 100);
      newPercent = Math.min((newBalance / goal) * 100, 100);
   }

   return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-0 py-4">
         <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl flex flex-col items-center overflow-hidden relative p-8">
            <h2 className="text-2xl font-bold text-center mb-4 text-blue-700">You Donated To:</h2>
            {student.profile_picture_url && (
               <img src={student.profile_picture_url} alt={student.name} className="w-28 h-28 rounded-full object-cover border-2 border-blue-300 mb-4" />
            )}
            <div className="text-2xl font-semibold text-gray-900 mb-2">{student.name}</div>
            <div className="text-base text-gray-600 mb-1">{student.university}</div>
            {student.headline && (
               <div className="text-base text-gray-500 italic mb-2">"{student.headline}"</div>
            )}
            {student.trip && (
               <div className="text-sm text-blue-700 mb-2">{student.trip.name} — {student.trip.location_city}, {student.trip.location_country}</div>
            )}
            {student.bio && (
               <div className="text-sm text-gray-700 italic mt-2 max-w-xs whitespace-pre-line text-center">{student.bio}</div>
            )}
            {goal && oldBalance !== null && newBalance !== null && (
               <div className="mt-6 w-full max-w-xs mx-auto bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <div className="flex justify-between text-sm mb-1">
                     <span className="text-gray-600">Old Balance:</span>
                     <span className="font-medium text-gray-900">${oldBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-1">
                     <span className="text-gray-600">New Balance:</span>
                     <span className="font-medium text-blue-700">${newBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-1">
                     <span className="text-gray-600">Old Progress:</span>
                     <span className="font-medium text-gray-900">{oldPercent.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between text-sm mb-1">
                     <span className="text-gray-600">New Progress:</span>
                     <span className="font-medium text-blue-700">{newPercent.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                     <span className="text-gray-600">Goal:</span>
                     <span className="font-medium text-green-700">${goal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
               </div>
            )}
         </div>
         <div className="w-full max-w-xl mx-auto text-center mt-6 mb-2">
            <p className="text-xs text-gray-400 italic">
               This is a demo of a random donation flow. You can now see the student you supported!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
               <button
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md shadow transition-colors duration-200"
                  onClick={() => {
                     if (onStudentsUpdate) {
                        onStudentsUpdate();
                     }
                     navigate(-1);
                  }}
               >
                  Ok
               </button>
               <button
                  className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-md shadow transition-colors duration-200"
                  onClick={() => navigate('/donate/random')}
               >
                  Make another random donation
               </button>
            </div>
         </div>
      </div>
   );
}; 