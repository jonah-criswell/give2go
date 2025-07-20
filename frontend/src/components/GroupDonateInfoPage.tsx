import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from './Navbar';
import type { Student } from '../types';

interface GroupDonateInfoPageProps {
   currentStudent: Student | null;
   onNavigate: (page: 'index' | 'login' | 'register' | 'profile') => void;
   onLogout: () => void;
   onHomeClick?: () => void;
}

export const GroupDonateInfoPage = ({ currentStudent, onNavigate, onLogout, onHomeClick }: GroupDonateInfoPageProps) => {
   const navigate = useNavigate();

   return (
      <div className="min-h-screen bg-gray-50">
         <Navbar currentStudent={currentStudent} onNavigate={onNavigate} onLogout={onLogout} onHomeClick={onHomeClick} showCruLogo={true} />

         <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
               <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Group Donations
               </h1>
               <p className="text-lg text-gray-600">
                  Support multiple students with a single donation
               </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
               <div className="prose prose-lg max-w-none">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">How Group Donations Work</h2>

                  <div className="space-y-6">
                     <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                           <span className="text-blue-600 font-bold">1</span>
                        </div>
                        <div>
                           <h3 className="text-lg font-semibold text-gray-900 mb-2">Choose Your Group</h3>
                           <p className="text-gray-600">
                              Select from three options: <strong>All Students</strong>, students from a specific <strong>University</strong>,
                              or students on a specific <strong>Trip</strong>. This determines which students will receive your donation.
                           </p>
                        </div>
                     </div>

                     <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                           <span className="text-green-600 font-bold">2</span>
                        </div>
                        <div>
                           <h3 className="text-lg font-semibold text-gray-900 mb-2">Set Your Donation Amount</h3>
                           <p className="text-gray-600">
                              Enter the total amount you want to donate. Our system will automatically calculate the maximum
                              amount that can be distributed without any student exceeding their fundraising goal.
                           </p>
                        </div>
                     </div>

                     <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                           <span className="text-purple-600 font-bold">3</span>
                        </div>
                        <div>
                           <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Distribution</h3>
                           <p className="text-gray-600">
                              Your donation is evenly divided among eligible students. If some students are close to their goal,
                              excess funds are automatically redistributed to other students who still need support.
                           </p>
                        </div>
                     </div>

                     <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                           <span className="text-orange-600 font-bold">4</span>
                        </div>
                        <div>
                           <h3 className="text-lg font-semibold text-gray-900 mb-2">Complete Your Donation</h3>
                           <p className="text-gray-600">
                              Optionally provide your name, email, phone, and a note. Then complete your donation to support
                              multiple students at once!
                           </p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-6 mb-8">
               <h3 className="text-xl font-semibold text-blue-900 mb-4">Key Benefits</h3>
               <ul className="space-y-3 text-blue-800">
                  <li className="flex items-start">
                     <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                     </svg>
                     <span><strong>Maximum Impact:</strong> Support multiple students with a single donation</span>
                  </li>
                  <li className="flex items-start">
                     <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                     </svg>
                     <span><strong>Smart Distribution:</strong> Funds are automatically redistributed to maximize impact</span>
                  </li>
                  <li className="flex items-start">
                     <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                     </svg>
                     <span><strong>No Waste:</strong> No student receives more than they need to reach their goal</span>
                  </li>
                  <li className="flex items-start">
                     <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                     </svg>
                     <span><strong>Flexible Groups:</strong> Choose to support all students, specific universities, or specific trips</span>
                  </li>
               </ul>
            </div>

            <div className="bg-green-50 rounded-lg p-6 mb-8">
               <h3 className="text-xl font-semibold text-green-900 mb-4">Example Scenario</h3>
               <div className="text-green-800">
                  <p className="mb-3">
                     Let's say you donate <strong>$100</strong> to a group of <strong>4 students</strong>:
                  </p>
                  <div className="mb-3">
                     <p className="font-semibold text-sm mb-2">Initial Distribution ($25 each):</p>
                     <ul className="space-y-1 text-sm">
                        <li>• Student A needs $20 → receives $20 (excess: $5)</li>
                        <li>• Student B needs $30 → receives $25 (still needs: $5)</li>
                        <li>• Student C needs $25 → receives $25 (goal reached!)</li>
                        <li>• Student D needs $50 → receives $25 (still needs: $25)</li>
                     </ul>
                  </div>
                  <div>
                     <p className="font-semibold text-sm mb-2">Redistribution of Excess ($5):</p>
                     <ul className="space-y-1 text-sm">
                        <li>• Student B receives $2.50 more (total: $27.50)</li>
                        <li>• Student D receives $2.50 more (total: $27.50)</li>
                        <li>• Student C and Student A have already reached their goal, so they don't receive more.</li>
                     </ul>
                  </div>
                  <p className="mt-3 text-sm">
                     <span className="font-semibold">Our system is smart:</span> The excess $5 from Student A is automatically redistributed evenly among the other students who still need funds, ensuring the best possible distribution without any student exceeding their goal!
                  </p>
               </div>
            </div>

            <div className="flex justify-center space-x-4">
               <button
                  onClick={() => navigate('/group-donate')}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200 transform hover:scale-105"
               >
                  Start Group Donation
               </button>
               <button
                  onClick={() => navigate('/students')}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200"
               >
                  Browse Students Instead
               </button>
            </div>
         </div>
      </div>
   );
}; 