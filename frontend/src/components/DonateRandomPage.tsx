import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Student, Trip } from '../types';
import { useUniversities } from '../hooks/useUniversities';
import { apiFetch } from '../api';

export const DonateRandomPage = () => {
   const navigate = useNavigate();
   const [students, setStudents] = useState<Student[]>([]);
   const [trips, setTrips] = useState<Trip[]>([]);
   const { universities, loading: universitiesLoading } = useUniversities();
   const [filterType, setFilterType] = useState<'any' | 'trip' | 'university'>('any');
   const [selectedTrip, setSelectedTrip] = useState<string>('');
   const [selectedUniversity, setSelectedUniversity] = useState<string>('');
   const [randomStudent, setRandomStudent] = useState<Student | null>(null);
   const [amount, setAmount] = useState('');
   const [sliderAmount, setSliderAmount] = useState('1');
   const [name, setName] = useState('');
   const [email, setEmail] = useState('');
   const [phone, setPhone] = useState('');
   const [note, setNote] = useState('');
   const [error, setError] = useState('');
   const [success, setSuccess] = useState('');
   const [loading, setLoading] = useState(false);
   const [revealed, setRevealed] = useState(false);

   useEffect(() => {
      apiFetch('/api/v1/students')
         .then(res => res.json())
         .then(data => setStudents(data));
      apiFetch('/api/v1/trips')
         .then(res => res.json())
         .then(data => setTrips(data));
   }, []);

   // Pick a random student based on filter
   const pickRandomStudent = () => {
      let filtered = students;

      // First, filter by trip or university if specified
      if (filterType === 'trip' && selectedTrip) {
         filtered = students.filter(s => s.trip && String(s.trip.id) === selectedTrip);
      } else if (filterType === 'university' && selectedUniversity) {
         filtered = students.filter(s => s.university === selectedUniversity);
      }

      // Check if there are any students after initial filtering
      if (filtered.length === 0) {
         setRandomStudent(null);
         if (filterType === 'university' && selectedUniversity) {
            setError(`There are no students from ${selectedUniversity} who need funds right now.`);
         } else if (filterType === 'trip' && selectedTrip) {
            const trip = trips.find(t => String(t.id) === selectedTrip);
            setError(`There are no students on the ${trip?.name || 'selected trip'} who need funds right now.`);
         } else {
            setError('There are no students who need funds right now.');
         }
         return;
      }

      // Then filter out students where donation would exceed their goal
      const donationAmt = Number(amount) || 0;
      const availableStudents = filtered.filter(s => {
         if (s.trip && s.trip.goal_amount) {
            const goal = Number(s.trip.goal_amount);
            const bal = Number(s.balance);
            return bal + donationAmt <= goal;
         }
         // If no trip/goal, allow
         return true;
      });

      if (availableStudents.length === 0) {
         setRandomStudent(null);
         const donationAmt = Number(amount) || 0;

         if (filterType === 'university' && selectedUniversity) {
            setError(`No students from ${selectedUniversity} need $${donationAmt.toFixed(2)} or more. Try a smaller donation amount.`);
         } else if (filterType === 'trip' && selectedTrip) {
            const trip = trips.find(t => String(t.id) === selectedTrip);
            setError(`No students on the ${trip?.name || 'selected trip'} need $${donationAmt.toFixed(2)} or more. Try a smaller donation amount.`);
         } else {
            setError(`No students need $${donationAmt.toFixed(2)} or more. Try a smaller donation amount.`);
         }
         return;
      }

      setRandomStudent(availableStudents[Math.floor(Math.random() * availableStudents.length)]);
      setError('');
   };

   useEffect(() => {
      setRandomStudent(null);
      setRevealed(false);
      setError('');
      if (students.length > 0) {
         pickRandomStudent();
      }
      // eslint-disable-next-line
   }, [filterType, selectedTrip, selectedUniversity, students.length]);

   // Re-pick random student when amount changes
   useEffect(() => {
      if (students.length > 0) {
         pickRandomStudent();
      }
      // eslint-disable-next-line
   }, [amount]);

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

   const amt = Number(amount) || 0;
   const maxDonation = 10000; // Arbitrary high limit for demo
   const sliderMax = 1000; // Slider goes up to $1000, larger amounts via manual input

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');
      setSuccess('');
      if (!amount || isNaN(amt) || amt < 1 || amt > maxDonation) {
         setError(`Please enter a valid donation amount between $1 and $${maxDonation.toFixed(2)}.`);
         return;
      }
      if (!randomStudent) {
         // Re-run the pickRandomStudent logic to get the appropriate error message
         let filtered = students;
         if (filterType === 'trip' && selectedTrip) {
            filtered = students.filter(s => s.trip && String(s.trip.id) === selectedTrip);
         } else if (filterType === 'university' && selectedUniversity) {
            filtered = students.filter(s => s.university === selectedUniversity);
         }

         if (filtered.length === 0) {
            if (filterType === 'university' && selectedUniversity) {
               setError(`There are no students from ${selectedUniversity} who need funds right now.`);
            } else if (filterType === 'trip' && selectedTrip) {
               const trip = trips.find(t => String(t.id) === selectedTrip);
               setError(`There are no students on the ${trip?.name || 'selected trip'} who need funds right now.`);
            } else {
               setError('There are no students who need funds right now.');
            }
         } else {
            const donationAmt = Number(amount) || 0;
            if (filterType === 'university' && selectedUniversity) {
               setError(`No students from ${selectedUniversity} need $${donationAmt.toFixed(2)} or more. Try a smaller donation amount.`);
            } else if (filterType === 'trip' && selectedTrip) {
               const trip = trips.find(t => String(t.id) === selectedTrip);
               setError(`No students on the ${trip?.name || 'selected trip'} need $${donationAmt.toFixed(2)} or more. Try a smaller donation amount.`);
            } else {
               setError(`No students need $${donationAmt.toFixed(2)} or more. Try a smaller donation amount.`);
            }
         }
         return;
      }
      if (note.length > 300) {
         setError('Note must be 300 characters or less.');
         return;
      }
      setLoading(true);
      try {
         const res = await apiFetch('/api/v1/donations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
               donation: {
                  amount: amt,
                  name: name.trim() || undefined,
                  email: email.trim() || undefined,
                  phone: phone.trim() || undefined,
                  note: note.trim() || undefined,
                  student_id: randomStudent.id
               }
            })
         });
         const data = await res.json();
         if (!res.ok) {
            setError(data.errors?.join(', ') || 'Failed to submit donation.');
         } else {
            setSuccess('Thank you for your support!');
            navigate(`/donate/reveal/${randomStudent.id}`, { state: { donationAmount: amt } });
         }
      } catch (err) {
         setError('Network error. Please try again.');
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-0 py-4">
         <button
            className="mb-4 self-start text-gray-500 hover:text-blue-600 text-sm font-medium px-2 py-1 rounded transition-colors"
            onClick={() => navigate(-1)}
         >
            &lt; Back
         </button>

         {/* Give2Go Logo */}
         <div className="w-full max-w-6xl mb-6 text-center">
            <img
               src="/Give2Go_Logo_Design-removebg-preview.png"
               alt="Give2Go Logo"
               className="h-32 mx-auto mb-6"
            />
         </div>

         {/* Title and Explanatory Text */}
         <div className="w-full max-w-6xl mb-6 text-center">
            <h2 className="text-7xl text-gray-900 mb-4 whitespace-nowrap">Donate to a Random Student</h2>
            <div className="max-w-2xl mx-auto">
               <p className="text-gray-700 text-sm leading-relaxed">
                  We get it, there are a lot of different students that need support, how do you pick just one? Let us choose for you: we will make sure your donation is given to a student where their balance would exceed their goal. If you are passionate about a specific trip or university, your random student can be from that trip or university! Bless a complete stranger today with a small gift, and heaven will rejoice.
               </p>
            </div>
         </div>

         <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden relative p-8">
            <div className="flex flex-col md:flex-row gap-4 mb-6 items-center justify-center">
               <label className="font-medium text-gray-700">Choose Student:</label>
               <select
                  className="border border-gray-300 rounded-md px-3 py-2"
                  value={filterType}
                  onChange={e => setFilterType(e.target.value as any)}
               >
                  <option value="any">Completely Random Student</option>
                  <option value="trip">Random Student on a Specific Trip</option>
                  <option value="university">Random Student from a University</option>
               </select>
            </div>
            {filterType === 'trip' && (
               <div className="mb-4 flex justify-center">
                  <select
                     className="border border-gray-300 rounded-md px-3 py-2"
                     value={selectedTrip}
                     onChange={e => setSelectedTrip(e.target.value)}
                  >
                     <option value="">Select Trip</option>
                     {trips.map(trip => (
                        <option key={trip.id} value={trip.id}>{trip.name} ({trip.location_city}, {trip.location_country})</option>
                     ))}
                  </select>
               </div>
            )}
            {filterType === 'university' && (
               <div className="mb-4 flex justify-center">
                  <select
                     className="border border-gray-300 rounded-md px-3 py-2"
                     value={selectedUniversity}
                     onChange={e => setSelectedUniversity(e.target.value)}
                  >
                     <option value="">Select University</option>
                     {universities.map(u => (
                        <option key={u.id} value={u.name}>{u.abbreviation ? `${u.name} (${u.abbreviation})` : u.name}</option>
                     ))}
                  </select>
               </div>
            )}
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
                  />
               </div>
               {/* Error message for no available students */}
               {(!randomStudent && error) && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                     <div className="text-yellow-800 text-sm font-medium mb-1">No Students Available</div>
                     <div className="text-yellow-700 text-sm">{error}</div>
                     <div className="text-yellow-600 text-xs mt-2">
                        Try selecting a different university.
                     </div>
                  </div>
               )}
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
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-blue-700 transition-colors duration-200 disabled:opacity-60 mb-3"
                  disabled={loading || !randomStudent}
               >
                  {loading ? 'Processing...' : 'Donate to a Random Student'}
               </button>
               <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="w-full bg-gray-500 text-white py-2 px-4 rounded-md font-semibold hover:bg-gray-600 transition-colors duration-200"
               >
                  Cancel
               </button>
            </form>
            <div className="w-full max-w-2xl mx-auto text-center mt-6 mb-2">
               <p className="text-xs text-gray-400 italic">
                  This is a demo of a random donation flow. The student you donate to is hidden until after your donation is processed!
               </p>
            </div>
         </div>
      </div>
   );
}; 