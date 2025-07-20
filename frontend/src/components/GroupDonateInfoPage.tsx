import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from './Navbar';
import type { Student } from '../types';
import { useState } from 'react';

interface GroupDonateInfoPageProps {
   currentStudent: Student | null;
   onNavigate: (page: 'index' | 'login' | 'register' | 'profile') => void;
   onLogout: () => void;
   onHomeClick?: () => void;
   onRandomDonation?: () => void;
   onGroupDonation?: () => void;
}

export const GroupDonateInfoPage = ({ currentStudent, onNavigate, onLogout, onHomeClick, onRandomDonation, onGroupDonation }: GroupDonateInfoPageProps) => {
   const navigate = useNavigate();
   const [showExample, setShowExample] = useState(false);
   const [showBiasExample, setShowBiasExample] = useState(false);
   const [selectedBias, setSelectedBias] = useState(0.7);

   // Scroll to top when component mounts
   useEffect(() => {
      window.scrollTo(0, 0);
   }, []);

   const StaticStudentCard = ({ name, goal, current, newBalance, received, needs, highlight }: {
      name: string;
      goal: number;
      current: number;
      newBalance?: number;
      received?: number;
      needs?: number;
      highlight?: boolean;
   }) => {
      return (
         <div className={`rounded-lg shadow-md transition-all duration-300 flex flex-col items-center overflow-hidden border ${highlight ? 'bg-green-100 border-green-400' : 'bg-white border-gray-200'}`} style={{ minWidth: 0 }}>
            {/* Profile Initial */}
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-xl font-bold text-white mt-3 mb-1">
               {name}
            </div>
            {/* Name */}
            <div className="text-base font-semibold text-gray-900 mb-0.5">Student {name}</div>
            {/* Goal and Balances */}
            <div className="text-xs text-gray-500">Goal: ${goal}</div>
            {typeof newBalance === 'number' ? (
               <div className="text-xs text-gray-700">New: ${newBalance.toFixed(2)}</div>
            ) : (
               <div className="text-xs text-gray-700">Current: ${current.toFixed(2)}</div>
            )}
            {/* Needs or Received */}
            {typeof needs === 'number' && (
               <div className="text-xs text-green-700 font-bold">Needs: ${needs}</div>
            )}
            {typeof received === 'number' && (
               <div className="text-xs text-green-700 font-bold">Received: ${received.toFixed(2)}</div>
            )}
            <div className="flex-1" />
            {/* Progress Bar */}
            <div className="w-4/5 bg-gray-200 rounded-full h-1.5 my-2">
               <div
                  className="bg-gradient-to-r from-green-400 to-green-600 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(((typeof newBalance === 'number' ? newBalance : current) / goal) * 100, 100)}%` }}
               ></div>
            </div>
         </div>
      );
   };

   return (
      <div className="min-h-screen bg-gray-50">
         <Navbar currentStudent={currentStudent} onNavigate={onNavigate} onLogout={onLogout} onHomeClick={onHomeClick} showCruLogo={false} onRandomDonation={onRandomDonation} onGroupDonation={onGroupDonation} />

         {/* Back Button */}
         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
            <button
               className="text-gray-500 hover:text-blue-600 text-sm font-medium px-2 py-1 rounded transition-colors"
               onClick={() => navigate(-1)}
            >
               &lt; Back
            </button>
         </div>

         <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
               <h1 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-4">
                  Group Donations
               </h1>
               <p className="text-lg text-gray-600 mb-2">
                  Whether you are a passionate alumni who wants to support the students at the university where you completed your degree, you want to support a trip you've been apart of during a previous year, or you are apart of a large organization/church who wants to give to the entire student base, simply make one donation to Give2Go, and we'll take care of the rest.
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
                              Your donation gets divided up between multiple students, and you as the donor can configure how the funds are distributed. Whether you want funds to be distributed equally, or whether you want to skew the distribution to favor students falling behind, you can tailor the distribution to your liking.
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

                  {/* Example Scenario - Collapsible */}
                  <div className="mt-12">
                     <button
                        className="flex items-center w-full text-left text-2xl font-bold text-gray-900 mb-4 p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 cursor-pointer"
                        onClick={() => setShowExample((prev) => !prev)}
                        aria-expanded={showExample}
                        aria-controls="example-scenario-content"
                     >
                        <span className="mr-3">Equal Distribution Example</span>
                        <span className="text-sm text-gray-500 font-normal">(Click to expand)</span>
                        <svg
                           className={`w-6 h-6 transform transition-transform duration-200 ml-auto ${showExample ? 'rotate-90' : ''}`}
                           fill="none"
                           stroke="currentColor"
                           viewBox="0 0 24 24"
                        >
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                     </button>
                     {showExample && (
                        <div id="example-scenario-content" className="space-y-6">
                           <div className="p-6 bg-gray-50 rounded-lg">
                              <h3 className="text-lg font-semibold text-gray-900 mb-4">How Equal Distribution Works</h3>
                              <div className="text-gray-700">
                                 <p className="mb-3">
                                    Let's say you donate <strong>$100</strong> to a group of <strong>4 students</strong>:
                                 </p>
                                 <div className="mb-3">
                                    <p className="font-semibold text-gray-900 mb-2">Initial Distribution ($25 each):</p>
                                    <ul className="space-y-1 text-gray-700">
                                       <li>• Student A needs $20 → receives $20 (excess: $5)</li>
                                       <li>• Student B needs $30 → receives $25 (still needs: $5)</li>
                                       <li>• Student C needs $25 → receives $25 (goal reached!)</li>
                                       <li>• Student D needs $50 → receives $25 (still needs: $25)</li>
                                    </ul>
                                 </div>
                                 <div>
                                    <p className="font-semibold text-gray-900 mb-2">Redistribution of Excess ($5):</p>
                                    <ul className="space-y-1 text-gray-700">
                                       <li>• Student B receives $2.50 more (total: $27.50)</li>
                                       <li>• Student D receives $2.50 more (total: $27.50)</li>
                                       <li>• Student C and Student A have already reached their goal, so they don't receive more.</li>
                                    </ul>
                                 </div>
                                 <p className="mt-3 text-gray-700">
                                    <span className="font-semibold text-gray-900">Our system is smart:</span> The excess $5 from Student A is automatically redistributed evenly among the other students who still need funds, ensuring the best possible distribution without any student exceeding their goal!
                                 </p>
                              </div>
                           </div>
                           {/* Visual Before/After Cards */}
                           <div className="p-6 bg-gray-50 rounded-lg">
                              <div className="mt-4">
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Before */}
                                    <div>
                                       <div className="text-center font-semibold text-gray-900 mb-2">Before Donation</div>
                                       <div className="grid grid-cols-2 gap-4">
                                          <StaticStudentCard name="A" goal={100} current={80} needs={20} />
                                          <StaticStudentCard name="B" goal={100} current={70} needs={30} />
                                          <StaticStudentCard name="C" goal={100} current={75} needs={25} />
                                          <StaticStudentCard name="D" goal={100} current={50} needs={50} />
                                       </div>
                                    </div>
                                    {/* After */}
                                    <div>
                                       <div className="text-center font-semibold text-gray-900 mb-2">After Group Donation</div>
                                       <div className="grid grid-cols-2 gap-4">
                                          <StaticStudentCard name="A" goal={100} current={80} newBalance={100} received={20} highlight />
                                          <StaticStudentCard name="B" goal={100} current={70} newBalance={97.5} received={27.5} highlight />
                                          <StaticStudentCard name="C" goal={100} current={75} newBalance={100} received={25} highlight />
                                          <StaticStudentCard name="D" goal={100} current={50} newBalance={77.5} received={27.5} highlight />
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                     )}
                  </div>

                  {/* Bias Factor Example - Collapsible */}
                  <div className="mt-8">
                     <button
                        className="flex items-center w-full text-left text-2xl font-bold text-gray-900 mb-4 p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 cursor-pointer"
                        onClick={() => setShowBiasExample((prev) => !prev)}
                        aria-expanded={showBiasExample}
                        aria-controls="bias-example-scenario-content"
                     >
                        <span className="mr-3">Bias Factor Distribution Example</span>
                        <span className="text-sm text-gray-500 font-normal">(Click to expand)</span>
                        <svg
                           className={`w-6 h-6 transform transition-transform duration-200 ml-auto ${showBiasExample ? 'rotate-90' : ''}`}
                           fill="none"
                           stroke="currentColor"
                           viewBox="0 0 24 24"
                        >
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                     </button>
                     {showBiasExample && (
                        <div id="bias-example-scenario-content" className="space-y-6">
                           <div className="p-6 bg-gray-50 rounded-lg">
                              <h3 className="text-lg font-semibold text-gray-900 mb-4">How Bias Factor Distribution Works</h3>
                              <div className="text-gray-700">
                                 <p className="mb-3">
                                    With a <strong>$800 donation</strong> and <strong>3 students</strong> with different needs:
                                 </p>
                                 <div className="mb-3">
                                    <p className="font-semibold text-gray-900 mb-2">Student Needs:</p>
                                    <ul className="space-y-1 text-gray-700">
                                       <li>• Student A: Needs $200 (20% of total need)</li>
                                       <li>• Student B: Needs $300 (30% of total need)</li>
                                       <li>• Student C: Needs $500 (50% of total need)</li>
                                    </ul>
                                 </div>
                                 <div className="mb-3">
                                    <p className="font-semibold text-gray-900 mb-2">Different Distribution Methods:</p>
                                    <ul className="space-y-1 text-gray-700">
                                       <li>• <strong>Equal (bias=0.0):</strong> $200, $300, $300 (A and B reach goals, C gets rest)</li>
                                       <li>• <strong>Custom Skew (bias=0.3):</strong> $200, $264.77, $335.24 (A capped, B and C get rest proportionally)</li>
                                       <li>• <strong>Custom Skew (bias=0.7):</strong> $192, $248, $360 (24%, 31%, 45%)</li>
                                       <li>• <strong>Proportional (bias=1.0):</strong> $160, $240, $400 (20%, 30%, 50%)</li>
                                    </ul>
                                 </div>
                                 <p className="mt-3 text-gray-700">
                                    <span className="font-semibold text-gray-900">The bias factor:</span> A mathematical forumla that controls the balance between equal distribution and need-based proportional distribution. Higher bias values favor students with greater fundraising needs, while lower values ensure more equal treatment.
                                 </p>
                              </div>
                           </div>
                           {/* Visual Before/After Cards for Bias Example */}
                           <div className="p-6 bg-gray-50 rounded-lg">
                              <div className="mt-4">
                                 {/* Bias Factor Selector */}
                                 <div className="mb-6 text-center">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                       Choose Bias Factor to Visualize:
                                    </label>
                                    <div className="flex justify-center space-x-2">
                                       {[0, 0.3, 0.7, 1].map((bias) => (
                                          <button
                                             key={bias}
                                             onClick={() => setSelectedBias(bias)}
                                             className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${selectedBias === bias
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                                }`}
                                          >
                                             {bias === 0 ? 'Equal (0.0)' : bias === 1 ? 'Proportional (1.0)' : `Bias ${bias}`}
                                          </button>
                                       ))}
                                    </div>
                                 </div>

                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Before */}
                                    <div>
                                       <div className="text-center font-semibold text-gray-900 mb-2">Before Donation</div>
                                       <div className="grid grid-cols-1 gap-4">
                                          <StaticStudentCard name="A" goal={200} current={0} needs={200} />
                                          <StaticStudentCard name="B" goal={300} current={0} needs={300} />
                                          <StaticStudentCard name="C" goal={500} current={0} needs={500} />
                                       </div>
                                    </div>
                                    {/* After - Dynamic based on selected bias */}
                                    <div>
                                       <div className="text-center font-semibold text-gray-900 mb-2">
                                          After Group Donation (bias={selectedBias})
                                       </div>
                                       <div className="grid grid-cols-1 gap-4">
                                          {(() => {
                                             // Calculate amounts based on selected bias
                                             let amounts = { A: 0, B: 0, C: 0 };

                                             if (selectedBias === 0) {
                                                // Equal distribution with redistribution
                                                amounts = { A: 200, B: 300, C: 300 };
                                             } else if (selectedBias === 1) {
                                                // Pure proportional
                                                amounts = { A: 160, B: 240, C: 400 };
                                             } else if (selectedBias === 0.7) {
                                                // Custom skew 0.7
                                                amounts = { A: 192, B: 248, C: 360 };
                                             } else if (selectedBias === 0.3) {
                                                // Custom skew 0.3
                                                amounts = { A: 200, B: 264.77, C: 335.24 };
                                             }

                                             return (
                                                <>
                                                   <StaticStudentCard name="A" goal={200} current={0} newBalance={amounts.A} received={amounts.A} highlight />
                                                   <StaticStudentCard name="B" goal={300} current={0} newBalance={amounts.B} received={amounts.B} highlight />
                                                   <StaticStudentCard name="C" goal={500} current={0} newBalance={amounts.C} received={amounts.C} highlight />
                                                </>
                                             );
                                          })()}
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                     )}
                  </div>

                  {/* Key Benefits */}
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 mt-12">Key Benefits</h2>
                  <div className="space-y-4">
                     <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                           <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                           </svg>
                        </div>
                        <div>
                           <h3 className="text-lg font-semibold text-gray-900 mb-2">Maximum Impact</h3>
                           <p className="text-gray-600">Support multiple students with a single donation</p>
                        </div>
                     </div>
                     <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                           <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                           </svg>
                        </div>
                        <div>
                           <h3 className="text-lg font-semibold text-gray-900 mb-2">Flexible Distribution</h3>
                           <p className="text-gray-600">Funds are automatically redistributed according to your preferences</p>
                        </div>
                     </div>
                     <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                           <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                           </svg>
                        </div>
                        <div>
                           <h3 className="text-lg font-semibold text-gray-900 mb-2">No Waste</h3>
                           <p className="text-gray-600">No student receives more than they need to reach their goal</p>
                        </div>
                     </div>
                     <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                           <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                           </svg>
                        </div>
                        <div>
                           <h3 className="text-lg font-semibold text-gray-900 mb-2">Flexible Groups</h3>
                           <p className="text-gray-600">Choose to support all students, specific universities, or specific trips</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         <div className="bg-gray-50 pb-12">
            <div className="flex justify-center mt-0">
               <button
                  onClick={() => navigate('/group-donate')}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-12 rounded-lg transition-colors duration-200 transform hover:scale-105 text-lg"
               >
                  Start Group Donation
               </button>
            </div>
         </div>
      </div>
   );
}; 