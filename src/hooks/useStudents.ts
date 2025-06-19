
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Student } from '@/types/Student';

export const useStudents = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('name');

      if (error) throw error;

      const formattedStudents: Student[] = data.map(student => ({
        id: student.id,
        name: student.name,
        email: student.email,
        phone: student.phone || '',
        codeforcesHandle: student.codeforces_handle,
        currentRating: student.current_rating || 0,
        maxRating: student.max_rating || 0,
        lastUpdated: student.last_updated,
        reminderCount: student.reminder_count || 0,
        autoEmailEnabled: student.auto_email_enabled || false,
      }));

      setStudents(formattedStudents);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  const addStudent = async (studentData: Omit<Student, 'id' | 'lastUpdated' | 'reminderCount'>) => {
    try {
      const { data, error } = await supabase
        .from('students')
        .insert({
          name: studentData.name,
          email: studentData.email,
          phone: studentData.phone,
          codeforces_handle: studentData.codeforcesHandle,
          current_rating: studentData.currentRating,
          max_rating: studentData.maxRating,
          auto_email_enabled: studentData.autoEmailEnabled,
        })
        .select()
        .single();

      if (error) throw error;

      // Trigger sync for new student
      await syncStudentData(data.id);
      
      await fetchStudents();
      return data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to add student');
    }
  };

  const updateStudent = async (id: string, studentData: Omit<Student, 'id' | 'lastUpdated' | 'reminderCount'>) => {
    try {
      const { error } = await supabase
        .from('students')
        .update({
          name: studentData.name,
          email: studentData.email,
          phone: studentData.phone,
          codeforces_handle: studentData.codeforcesHandle,
          current_rating: studentData.currentRating,
          max_rating: studentData.maxRating,
          auto_email_enabled: studentData.autoEmailEnabled,
        })
        .eq('id', id);

      if (error) throw error;

      // Trigger sync if handle changed
      await syncStudentData(id);
      
      await fetchStudents();
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update student');
    }
  };

  const deleteStudent = async (id: string) => {
    try {
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      await fetchStudents();
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to delete student');
    }
  };

  const syncStudentData = async (studentId: string) => {
    try {
      const { error } = await supabase.functions.invoke('sync-codeforces-data', {
        body: { studentId }
      });

      if (error) throw error;
    } catch (err) {
      console.error('Failed to sync student data:', err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return {
    students,
    loading,
    error,
    addStudent,
    updateStudent,
    deleteStudent,
    syncStudentData,
    refetch: fetchStudents,
  };
};
