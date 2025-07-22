import { useState, useEffect } from 'react';
import type { Student } from '../types';
import { apiFetch } from '../api';

export const useStudents = () => {
   const [students, setStudents] = useState<Student[]>([]);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState("");

   const fetchStudents = async () => {
      setLoading(true);
      try {
         const response = await apiFetch('/api/v1/students?random=true');
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

   useEffect(() => {
      fetchStudents();
   }, []);

   return { students, loading, error, refetch: fetchStudents };
}; 