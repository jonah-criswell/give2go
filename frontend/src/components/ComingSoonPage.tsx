import { useNavigate } from 'react-router-dom';

interface ComingSoonPageProps {
   feature: string;
   description: string;
}

export const ComingSoonPage = ({ feature, description }: ComingSoonPageProps) => {
   const navigate = useNavigate();

   return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
         <div className="max-w-md mx-auto text-center px-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8">
               <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
               </div>
               <h1 className="text-2xl font-bold text-gray-900 mb-4">
                  {feature} Coming Soon!
               </h1>
               <p className="text-gray-600 mb-8">
                  {description}
               </p>
               <div className="space-y-3">
                  <button
                     onClick={() => navigate('/')}
                     className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                  >
                     Back to Home
                  </button>
                  <button
                     onClick={() => navigate('/students')}
                     className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                  >
                     Browse Students
                  </button>
               </div>
            </div>
         </div>
      </div>
   );
}; 