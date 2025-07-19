import { useState, useEffect } from 'react';
import type { Student, ProfileFormData, Donation } from '../types';

interface ProfileProps {
   currentStudent: Student | null;
   setCurrentStudent: (student: Student) => void;
   onNavigate: (page: 'index' | 'login' | 'register' | 'profile') => void;
}

export const Profile = ({ currentStudent, setCurrentStudent, onNavigate }: ProfileProps) => {
   const [isEditing, setIsEditing] = useState(false);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState('');
   const [success, setSuccess] = useState('');
   const [formData, setFormData] = useState<ProfileFormData>({
      bio: '',
      headline: '',
      major: '',
      profile_picture: undefined
   });
   const [selectedFile, setSelectedFile] = useState<File | null>(null);
   const [previewUrl, setPreviewUrl] = useState<string | null>(null);
   const [donations, setDonations] = useState<Donation[]>([]);
   const [donationsLoading, setDonationsLoading] = useState(false);
   const [donationsError, setDonationsError] = useState('');

   useEffect(() => {
      if (currentStudent) {
         setFormData({
            bio: currentStudent.bio || '',
            headline: currentStudent.headline || '',
            major: currentStudent.major || '',
            profile_picture: undefined
         });
         setPreviewUrl(currentStudent.profile_picture_url || null);

         // Fetch donations for this student
         setDonationsLoading(true);
         setDonationsError('');
         fetch(`/api/v1/donations?student_id=${currentStudent.id}`)
            .then(res => {
               if (!res.ok) throw new Error('Failed to fetch donations');
               return res.json();
            })
            .then(data => setDonations(data))
            .catch(() => setDonationsError('Could not load donors.'))
            .finally(() => setDonationsLoading(false));
      }
   }, [currentStudent]);

   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({
         ...prev,
         [name]: value
      }));
   };

   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
         setSelectedFile(file);
         setFormData(prev => ({
            ...prev,
            profile_picture: file
         }));

         // Create preview URL
         const url = URL.createObjectURL(file);
         setPreviewUrl(url);
      }
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError('');
      setSuccess('');

      try {
         const token = localStorage.getItem('token');
         const formDataToSend = new FormData();

         formDataToSend.append('student[bio]', formData.bio);
         formDataToSend.append('student[headline]', formData.headline);
         formDataToSend.append('student[major]', formData.major);

         if (selectedFile) {
            formDataToSend.append('student[profile_picture]', selectedFile);
         }

         const response = await fetch('/api/v1/student/profile', {
            method: 'PATCH',
            headers: {
               'Authorization': `Bearer ${token}`
            },
            body: formDataToSend
         });

         if (response.ok) {
            const data = await response.json();
            // Update localStorage with new student data
            localStorage.setItem('student', JSON.stringify(data.student));
            setCurrentStudent(data.student);
            setSuccess('Profile updated successfully!');
            setIsEditing(false);
            setSelectedFile(null);
            // Update the UI with the new student data
            if (data.student) {
               // Update formData and previewUrl with new data
               setFormData({
                  bio: data.student.bio || '',
                  headline: data.student.headline || '',
                  major: data.student.major || '',
                  profile_picture: undefined
               });
               setPreviewUrl(data.student.profile_picture_url || null);
            }
         } else {
            const errorData = await response.json();
            setError(errorData.errors?.join(', ') || 'Failed to update profile');
         }
      } catch (err) {
         setError('Network error. Please try again.');
      } finally {
         setLoading(false);
      }
   };

   const handleCancel = () => {
      if (currentStudent) {
         setFormData({
            bio: currentStudent.bio || '',
            headline: currentStudent.headline || '',
            major: currentStudent.major || '',
            profile_picture: undefined
         });
         setPreviewUrl(currentStudent.profile_picture_url || null);
      }
      setSelectedFile(null);
      setIsEditing(false);
      setError('');
   };

   if (!currentStudent) {
      return (
         <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
               <p className="text-gray-600 mb-4">Please log in to view your profile.</p>
               <button
                  onClick={() => onNavigate('login')}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
               >
                  Go to Login
               </button>
            </div>
         </div>
      );
   }

   return (
      <div className="min-h-screen bg-gray-50">
         {/* Back Button */}
         <div className="absolute top-6 left-6">
            <button
               onClick={() => onNavigate('index')}
               className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
            >
               <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
               </svg>
               Back to Students
            </button>
         </div>

         <div className="max-w-4xl mx-auto pt-20 pb-8 px-4">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
               {/* Header */}
               <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-12 text-white">
                  <div className="flex items-center space-x-6">
                     <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center text-3xl font-bold overflow-hidden">
                        {previewUrl ? (
                           <img
                              src={previewUrl}
                              alt={currentStudent.name}
                              className="w-24 h-24 rounded-full object-cover"
                           />
                        ) : (
                           currentStudent.name.charAt(0).toUpperCase()
                        )}
                     </div>
                     <div>
                        <h1 className="text-3xl font-bold">{currentStudent.name}</h1>
                        {currentStudent.headline && (
                           <div className="text-base text-gray-200 font-normal mt-2 mb-2 italic whitespace-pre-line break-words leading-snug" style={{ wordBreak: 'break-word', whiteSpace: 'pre-line' }}>
                              "{currentStudent.headline}"
                           </div>
                        )}
                        {currentStudent.trip && (
                           <div className="text-base text-blue-100 font-medium mb-1">
                              {currentStudent.trip.name}
                              <span className="text-blue-200"> — {currentStudent.trip.location_city}, {currentStudent.trip.location_country}</span>
                           </div>
                        )}
                        <p className="text-blue-100 text-lg">{currentStudent.university}</p>
                        {currentStudent.major && (
                           <p className="text-blue-100">{currentStudent.major}</p>
                        )}
                     </div>
                  </div>
               </div>

               {/* Content */}
               <div className="px-8 py-8">
                  {error && (
                     <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                        {error}
                     </div>
                  )}

                  {success && (
                     <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                        {success}
                     </div>
                  )}

                  <div className="grid md:grid-cols-2 gap-8">
                     {/* Basic Info */}
                     <div>
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Basic Information</h2>
                        <div className="space-y-3">
                           <div>
                              <label className="block text-sm font-medium text-gray-600">Email</label>
                              <p className="text-gray-800">{currentStudent.email}</p>
                           </div>
                           <div>
                              <label className="block text-sm font-medium text-gray-600">University</label>
                              <p className="text-gray-800">{currentStudent.university}</p>
                           </div>
                           <div>
                              <label className="block text-sm font-medium text-gray-600">Year</label>
                              <p className="text-gray-800">{currentStudent.year}</p>
                           </div>
                           <div>
                              <label className="block text-sm font-medium text-gray-600">Funds Raised</label>
                              <p className="text-2xl font-bold text-green-600">{currentStudent.formatted_balance}</p>
                           </div>
                        </div>
                     </div>

                     {/* Profile Details */}
                     <div>
                        <div className="flex items-center justify-between mb-4">
                           <h2 className="text-xl font-semibold text-gray-800">Profile Details</h2>
                           {!isEditing && (
                              <button
                                 onClick={() => setIsEditing(true)}
                                 className="text-blue-600 hover:text-blue-700 font-medium"
                              >
                                 Edit
                              </button>
                           )}
                        </div>

                        {isEditing ? (
                           <form onSubmit={handleSubmit} className="space-y-4">
                              <div>
                                 <label className="block text-sm font-medium text-gray-600 mb-2">
                                    Profile Picture
                                 </label>
                                 <div className="space-y-2">
                                    <input
                                       type="file"
                                       name="profile_picture"
                                       accept="image/*"
                                       onChange={handleFileChange}
                                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    <p className="text-xs text-gray-500">
                                       Accepted formats: JPG, PNG, GIF. Max size: 5MB
                                    </p>
                                 </div>
                              </div>

                              <div>
                                 <label className="block text-sm font-medium text-gray-600 mb-2">
                                    Headline <span className="text-gray-400">({formData.headline.length}/100)</span>
                                 </label>
                                 <input
                                    type="text"
                                    name="headline"
                                    value={formData.headline}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Excited for my first mission trip!"
                                    maxLength={100}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                 />
                              </div>

                              <div>
                                 <label className="block text-sm font-medium text-gray-600 mb-2">
                                    Major
                                 </label>
                                 <input
                                    type="text"
                                    name="major"
                                    value={formData.major}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Computer Science"
                                    maxLength={100}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                 />
                              </div>

                              <div>
                                 <label className="block text-sm font-medium text-gray-600 mb-2">
                                    Bio <span className="text-gray-400">({formData.bio.length}/400)</span>
                                 </label>
                                 <textarea
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleInputChange}
                                    placeholder="Tell us about yourself, your mission trip goals, or why you're fundraising..."
                                    maxLength={400}
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                 />
                              </div>

                              <div className="flex space-x-3 pt-4">
                                 <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                 >
                                    {loading ? 'Saving...' : 'Save Changes'}
                                 </button>
                                 <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                                 >
                                    Cancel
                                 </button>
                              </div>
                           </form>
                        ) : (
                           <div className="space-y-4">
                              {currentStudent.bio ? (
                                 <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-2">Bio</label>
                                    <p className="text-gray-800 leading-relaxed">{currentStudent.bio}</p>
                                 </div>
                              ) : (
                                 <div className="text-gray-500 italic">No bio added yet.</div>
                              )}

                              {currentStudent.major && (
                                 <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-2">Major</label>
                                    <p className="text-gray-800">{currentStudent.major}</p>
                                 </div>
                              )}
                           </div>
                        )}
                     </div>
                  </div>
               </div>
            </div>
            {/* Donor List */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden mt-8">
               <div className="px-8 py-8">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Donors</h2>
                  {donationsLoading ? (
                     <div className="text-gray-500">Loading donors...</div>
                  ) : donationsError ? (
                     <div className="text-red-600">{donationsError}</div>
                  ) : donations.length === 0 ? (
                     <div className="text-gray-500 italic">No donations yet.</div>
                  ) : (
                     <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                           <thead>
                              <tr>
                                 <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                                 <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                 <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                 <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                 <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                                 <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Note</th>
                              </tr>
                           </thead>
                           <tbody className="bg-white divide-y divide-gray-100">
                              {donations.map(donation => (
                                 <tr key={donation.id}>
                                    <td className="px-4 py-2 font-semibold text-green-700">${Number(donation.amount).toFixed(2)}</td>
                                    <td className="px-4 py-2 text-gray-600">{new Date(donation.created_at).toLocaleString()}</td>
                                    <td className="px-4 py-2">{donation.name}</td>
                                    <td className="px-4 py-2">{donation.email || <span className="text-gray-400 italic">—</span>}</td>
                                    <td className="px-4 py-2">{donation.phone || <span className="text-gray-400 italic">—</span>}</td>
                                    <td className="px-4 py-2">{donation.note ? <span className="whitespace-pre-line">{donation.note}</span> : <span className="text-gray-400 italic">—</span>}</td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                  )}
               </div>
            </div>
         </div>
         <div className="w-full max-w-4xl mx-auto text-center mt-6 mb-2">
            <p className="text-xs text-gray-400 italic">
               A lot of information here is already shown on smapp.cru.org when a student applies, so this is more for demo purposes. There is a lot of flexibility here!
            </p>
         </div>
      </div>
   );
}; 