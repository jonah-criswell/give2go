import { useState, useEffect } from 'react';
import type { Student } from '../types';

export const useStudents = () => {
   const [students, setStudents] = useState<Student[]>([]);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState("");

   useEffect(() => {
      const fetchStudents = async () => {
         setLoading(true);
         try {
            const response = await fetch('http://localhost:3001/api/v1/students');
            if (response.ok) {
               const data = await response.json();
               setStudents(data);
            } else {
               console.error('Failed to fetch students:', response.status, response.statusText);
               setError('Failed to fetch students');
            }
         } catch (error) {
            console.error('Failed to fetch students:', error);
            setError('Failed to fetch students');
         } finally {
            setLoading(false);
         }
      };

      fetchStudents();
   }, []);

   return { students, loading, error };
}; 