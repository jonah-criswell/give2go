import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Student } from '../types';

interface DonatePageProps {
   student: Student;
   onBack: () => void;
   onDonationSuccess?: () => void;
}

export const DonatePage = ({ student, onBack, onDonationSuccess }: DonatePageProps) => {
   // Calculate max donation (goal - balance, at least $0.01)
   const goal = student.trip?.goal_amount || 5000;
   const balance = Number(student.balance) || 0;
   const maxDonation = Math.max(goal - balance, 0.01);
   const sliderMax = Math.min(1000, Math.max(1, maxDonation)); // Slider goes up to $1000 or maxDonation, whichever is smaller, but at least $1

   const [amount, setAmount] = useState('');
   const [sliderAmount, setSliderAmount] = useState('1');
   const [name, setName] = useState('');
   const [email, setEmail] = useState('');
   const [phone, setPhone] = useState('');
   const [note, setNote] = useState('');
   const [error, setError] = useState('');
   const [success, setSuccess] = useState('');
   const [loading, setLoading] = useState(false);
   const [localBalance, setLocalBalance] = useState(Number(student.balance) || 0);

   const redirectToIndex = () => {
      if (typeof window !== 'undefined') {
         window.location.href = '/';
      }
   };

   // Sync slider and input
   const handleSliderChange = (val: string) => {
      setSliderAmount(val);
      setAmount(val);
   };
   const handleAmountChange = (val: string) => {
      setAmount(val);
      // Only update slider if the amount is within slider range
      const numVal = Number(val);
      if (numVal <= sliderMax) {
         setSliderAmount(val);
      } else {
         // If amount exceeds slider max, set slider to max
         setSliderAmount(sliderMax.toString());
      }
   };

   // Calculate new balance and percentages
   const amt = Number(amount) || 0;
   const prevBalance = localBalance;
   const newBalance = Math.min(localBalance + amt, goal);
   const prevPercent = Math.min((prevBalance / goal) * 100, 100);
   const newPercent = Math.min((newBalance / goal) * 100, 100);

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');
      setSuccess('');
      if (!amount || isNaN(amt) || amt < 1 || amt > maxDonation) {
         setError(`Please enter a valid donation amount between $1 and $${maxDonation.toFixed(2)}.`);
         return;
      }
      if (note.length > 300) {
         setError('Note must be 300 characters or less.');
         return;
      }
      setLoading(true);
      try {
         const res = await fetch('/api/v1/donations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
               donation: {
                  amount: amt,
                  name: name.trim() || undefined,
                  email: email.trim() || undefined,
                  phone: phone.trim() || undefined,
                  note: note.trim() || undefined,
                  student_id: student.id
               }
            })
         });
         const data = await res.json();
         if (!res.ok) {
            console.error('Donation error response:', data);
            setError(data.errors?.join(', ') || 'Failed to submit donation.');
         } else {
            setSuccess('Thank you for your support!');
            setAmount('');
            setSliderAmount('1.00');
            setName('');
            setEmail('');
            setPhone('');
            setNote('');
            // Update local balance for immediate UI feedback
            setLocalBalance(prev => Math.min(prev + amt, goal));
            // Trigger students refresh
            if (onDonationSuccess) {
               onDonationSuccess();
            }
            setTimeout(redirectToIndex, 1200);
         }
      } catch (err) {
         setError('Network error. Please try again.');
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-0 py-4">
         {/* Back Button moved above the box */}
         <button
            className="mb-4 self-start text-gray-500 hover:text-blue-600 text-sm font-medium px-2 py-1 rounded transition-colors"
            onClick={() => navigate(-1)}
         >
            &larr; Back
         </button>
         <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden relative">
            {/* Left: Student Info */}
            <div className="md:w-5/12 w-full bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col justify-start p-0 md:p-0 border-b md:border-b-0 md:border-r border-gray-100 min-h-[500px]">
               {/* Square image container */}
               <div className="w-full aspect-square bg-white overflow-hidden shadow-lg flex items-center justify-center">
                  {student.profile_picture_url ? (
                     <img src={student.profile_picture_url} alt={student.name} className="w-full h-full object-cover bg-white" />
                  ) : (
                     <div className="w-full h-full flex items-center justify-center text-gray-300 text-7xl font-bold bg-gray-100">
                        {student.name.charAt(0).toUpperCase()}
                     </div>
                  )}
               </div>
               {/* Text content below image, no extra margin above */}
               <div className="flex-1 w-full flex flex-col items-center justify-start p-4 md:p-6 mt-0">
                  {/* Student Name - most prominent */}
                  <div className="text-4xl md:text-5xl text-gray-900 mb-2 text-center max-w-[90%] break-words">{student.name}</div>
                  {/* Trip Name and Location */}
                  {student.trip && (
                     <div className="mb-2 flex flex-col items-center max-w-[90%]">
                        <div className="text-lg md:text-xl font-semibold text-blue-700 text-center break-words">{student.trip.name}</div>
                        <div className="text-base text-gray-600 text-center break-words">{student.trip.location_city}, {student.trip.location_country}</div>
                     </div>
                  )}
                  <div className="text-base text-blue-700 font-medium mb-1 text-center max-w-[90%] break-words">{student.university}</div>
                  {student.major && (
                     <div className="text-sm text-purple-700 font-medium mb-2 text-center max-w-[90%] break-words">Major: {student.major}</div>
                  )}
                  {student.bio && (
                     <div className="text-sm text-gray-700 italic mb-2 text-center max-w-[90%] mx-auto break-words">"{student.bio}"</div>
                  )}
                  {/* Fundraising Progress - Compact */}
                  <div className="mt-3 w-full max-w-[90%]">
                     {/* Goal and Progress Combined */}
                     <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
                        <div className="text-center mb-2">
                           <div className="text-xl md:text-2xl font-bold text-green-700">
                              ${goal.toLocaleString()}
                           </div>
                           <div className="text-xs text-gray-600">Goal</div>
                        </div>
                        <div className="flex justify-between items-center text-sm mb-2">
                           <span className="text-gray-600">Raised:</span>
                           <span className="font-bold text-blue-700">${balance.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm mb-2">
                           <span className="text-gray-600">Progress:</span>
                           <span className="font-bold text-green-600">{prevPercent.toFixed(1)}%</span>
                        </div>
                        {/* Progress Bar */}
                        <div className="w-full bg-gray-200 rounded-full h-2">
                           <div
                              className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${prevPercent}%` }}
                           ></div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
            {/* Right: Donation Form */}
            <div className="md:w-7/12 w-full flex flex-col justify-center p-6 md:p-10">
               {/* Progress Preview */}
               <div className="mb-6 bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <div className="flex flex-col gap-2">
                     <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Current:</span>
                        <span className="font-medium text-gray-900">${prevBalance.toLocaleString()} ({prevPercent.toFixed(1)}%)</span>
                     </div>
                     <div className="flex justify-between text-sm">
                        <span className="text-gray-600">After Donation:</span>
                        <span className="font-medium text-blue-700">${newBalance.toLocaleString()} ({newPercent.toFixed(1)}%)</span>
                     </div>
                     <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div
                           className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-300"
                           style={{ width: `${newPercent}%` }}
                        ></div>
                     </div>
                  </div>
               </div>
               <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                     <label className="block text-gray-700 font-medium mb-1">Donation Amount <span className="text-red-500">*</span></label>
                     <div className="flex items-center gap-2">
                        <input
                           type="range"
                           min="1"
                           max={sliderMax}
                           step="1"
                           value={sliderAmount}
                           onChange={e => handleSliderChange(e.target.value)}
                           className="w-full accent-blue-600"
                           disabled={maxDonation <= 1}
                        />
                        <span className="text-xs text-gray-500 w-16 text-right">${Number(sliderAmount).toFixed(0)}</span>
                     </div>
                     <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>$1</span>
                        <span>${sliderMax.toFixed(0)}</span>
                     </div>
                     <input
                        type="number"
                        min="1"
                        max={maxDonation}
                        step="0.01"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter amount (USD)"
                        value={amount}
                        onChange={e => handleAmountChange(e.target.value)}
                        required
                     />
                  </div>
                  <div>
                     <label className="block text-gray-700 font-medium mb-1">Your Name (optional)</label>
                     <input
                        type="text"
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        placeholder="Name (or leave blank to be anonymous)"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        maxLength={100}
                     />
                  </div>
                  <div>
                     <label className="block text-gray-700 font-medium mb-1">Email (optional)</label>
                     <input
                        type="email"
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        placeholder="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        maxLength={100}
                     />
                  </div>
                  <div>
                     <label className="block text-gray-700 font-medium mb-1">Phone (optional)</label>
                     <input
                        type="tel"
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        placeholder="Phone number"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        maxLength={30}
                     />
                  </div>
                  <div>
                     <label className="block text-gray-700 font-medium mb-1">Note (optional, max 300 chars)</label>
                     <textarea
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        placeholder="Leave a note for the student"
                        value={note}
                        onChange={e => setNote(e.target.value)}
                        maxLength={300}
                        rows={3}
                     />
                     <div className="text-xs text-gray-400 text-right">{note.length}/300</div>
                  </div>
                  {error && <div className="text-red-600 text-sm text-center">{error}</div>}
                  {success && <div className="text-green-600 text-sm text-center">{success}</div>}
                  <button
                     type="submit"
                     className="w-full bg-blue-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-blue-700 transition-colors duration-200 disabled:opacity-60"
                     disabled={loading}
                  >
                     {loading ? 'Processing...' : `Donate to ${student.name.split(' ')[0]}`}
                  </button>
               </form>
            </div>
         </div>
         <div className="w-full max-w-4xl mx-auto text-center mt-6 mb-2">
            <p className="text-xs text-gray-400 italic">
               This page is more for demo purposes, as cru.give.org already sets up how to donate. The donate button here can just route to the student's give site. There is no credit card payment API implemented; the button simply does the donation for free. There is a lot of flexibility in how to implement this, and this is just one way. This platform can be closely integrated with cru.give.org, or be a completely seperate platform!
            </p>
         </div>
      </div>
   );
}; 