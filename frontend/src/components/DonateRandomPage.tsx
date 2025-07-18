import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Student, Trip } from '../types';

export const DonateRandomPage = () => {
   const navigate = useNavigate();
   const [students, setStudents] = useState<Student[]>([]);
   const [trips, setTrips] = useState<Trip[]>([]);
   const [universities, setUniversities] = useState<string[]>([]);
   const [filterType, setFilterType] = useState<'any' | 'trip' | 'university'>('any');
   const [selectedTrip, setSelectedTrip] = useState<string>('');
   const [selectedUniversity, setSelectedUniversity] = useState<string>('');
   const [randomStudent, setRandomStudent] = useState<Student | null>(null);
   const [amount, setAmount] = useState('');
   const [sliderAmount, setSliderAmount] = useState('1.00');
   const [name, setName] = useState('');
   const [email, setEmail] = useState('');
   const [phone, setPhone] = useState('');
   const [note, setNote] = useState('');
   const [error, setError] = useState('');
   const [success, setSuccess] = useState('');
   const [loading, setLoading] = useState(false);
   const [revealed, setRevealed] = useState(false);

   useEffect(() => {
      fetch('/api/v1/students')
         .then(res => res.json())
         .then(data => {
            setStudents(data);
            // Collect unique universities
            setUniversities(Array.from(new Set(data.map((s: Student) => s.university).filter(Boolean))));
         });
      fetch('/api/v1/trips')
         .then(res => res.json())
         .then(data => setTrips(data));
   }, []);

   // Pick a random student based on filter
   const pickRandomStudent = () => {
      let filtered = students;
      if (filterType === 'trip' && selectedTrip) {
         filtered = students.filter(s => s.trip && String(s.trip.id) === selectedTrip);
      } else if (filterType === 'university' && selectedUniversity) {
         filtered = students.filter(s => s.university === selectedUniversity);
      }
      // Filter out students where donation would exceed their goal
      const donationAmt = Number(amount) || 0;
      filtered = filtered.filter(s => {
         if (s.trip && s.trip.goal_amount) {
            const goal = Number(s.trip.goal_amount);
            const bal = Number(s.balance);
            return bal + donationAmt <= goal;
         }
         // If no trip/goal, allow
         return true;
      });
      if (filtered.length === 0) {
         setRandomStudent(null);
         setError('This is an amazing amount of funds, but no student needs that much right now!');
         return;
      }
      setRandomStudent(filtered[Math.floor(Math.random() * filtered.length)]);
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
      setSliderAmount(val);
   };

   const amt = Number(amount) || 0;
   const maxDonation = 10000; // Arbitrary high limit for demo

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');
      setSuccess('');
      if (!amount || isNaN(amt) || amt < 0.01 || amt > maxDonation) {
         setError(`Please enter a valid donation amount between $0.01 and $${maxDonation.toFixed(2)}.`);
         return;
      }
      if (!randomStudent) {
         setError('This is an amazing amount of funds, but no student needs that much right now!');
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
            onClick={() => navigate('/')}
         >
            &larr; Back
         </button>
         <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden relative p-8">
            <h2 className="text-2xl font-bold text-center mb-4">Donate to a Random Student</h2>
            <div className="flex flex-col md:flex-row gap-4 mb-6 items-center justify-center">
               <label className="font-medium text-gray-700">Choose Randomization:</label>
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
                        <option key={u} value={u}>{u}</option>
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
                        min="0.01"
                        max={maxDonation}
                        step="0.01"
                        value={sliderAmount}
                        onChange={e => handleSliderChange(e.target.value)}
                        className="w-full accent-blue-600"
                     />
                     <span className="text-xs text-gray-500 w-16 text-right">${Number(sliderAmount).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                     <span>${(0.01).toFixed(2)}</span>
                     <span>Max: ${maxDonation.toFixed(2)}</span>
                  </div>
                  <input
                     type="number"
                     min="0.01"
                     max={maxDonation}
                     step="0.01"
                     className="w-full border border-gray-300 rounded-md px-3 py-2 mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                     placeholder="Enter amount (USD)"
                     value={amount}
                     onChange={e => handleAmountChange(e.target.value)}
                  />
               </div>
               {/* Error message for too large donation */}
               {(!randomStudent && error) && (
                  <div className="text-red-600 text-center text-sm font-medium">{error}</div>
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
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-blue-700 transition-colors duration-200 disabled:opacity-60"
                  disabled={loading || !randomStudent}
               >
                  {loading ? 'Processing...' : 'Donate to a Random Student'}
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