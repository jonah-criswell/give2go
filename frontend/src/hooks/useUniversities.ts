import { useState, useEffect } from 'react';

export interface University {
   id: number;
   name: string;
   abbreviation?: string;
}

export const useUniversities = () => {
   const [universities, setUniversities] = useState<University[]>([]);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState("");

   useEffect(() => {
      const fetchUniversities = async () => {
         setLoading(true);
         try {
            const response = await fetch('/api/v1/universities');
            if (response.ok) {
               const data = await response.json();
               setUniversities(data);
            } else {
               console.error('Failed to fetch universities:', response.status, response.statusText);
               setError('Failed to fetch universities');
            }
         } catch (error) {
            console.error('Failed to fetch universities:', error);
            setError('Failed to fetch universities');
         } finally {
            setLoading(false);
         }
      };

      fetchUniversities();
   }, []);

   return { universities, loading, error };
}; 