
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Contest, Submission } from '@/types/Student';

export const useStudentData = (studentId: string) => {
  const [contests, setContests] = useState<Contest[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContests = async (days: number = 365) => {
    try {
      console.log('Fetching contests for student:', studentId, 'days:', days);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      const { data, error } = await supabase
        .from('contests')
        .select('*')
        .eq('student_id', studentId)
        .gte('contest_date', cutoffDate.toISOString())
        .order('contest_date', { ascending: false });

      if (error) {
        console.error('Error fetching contests:', error);
        throw error;
      }

      console.log('Raw contest data:', data);

      const formattedContests: Contest[] = (data || []).map(contest => ({
        id: contest.id,
        name: contest.name,
        date: contest.contest_date,
        rank: contest.rank || 0,
        ratingChange: contest.rating_change || 0,
        newRating: contest.new_rating || 0,
        problemsSolved: contest.problems_solved || 0,
        totalProblems: contest.total_problems || 0,
      }));

      console.log('Formatted contests:', formattedContests);
      setContests(formattedContests);
    } catch (err) {
      console.error('Contest fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch contests');
    }
  };

  const fetchSubmissions = async (days: number = 90) => {
    try {
      console.log('Fetching submissions for student:', studentId, 'days:', days);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .eq('student_id', studentId)
        .gte('submission_time', cutoffDate.toISOString())
        .order('submission_time', { ascending: false });

      if (error) {
        console.error('Error fetching submissions:', error);
        throw error;
      }

      console.log('Raw submission data:', data);

      const formattedSubmissions: Submission[] = (data || []).map(submission => ({
        id: submission.id,
        problemName: submission.problem_name,
        rating: submission.rating || 0,
        verdict: submission.verdict,
        submissionTime: submission.submission_time,
        language: submission.language || '',
      }));

      console.log('Formatted submissions:', formattedSubmissions);
      setSubmissions(formattedSubmissions);
    } catch (err) {
      console.error('Submission fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch submissions');
    }
  };

  const fetchData = async () => {
    if (!studentId) {
      console.log('No student ID provided');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      await Promise.all([
        fetchContests(),
        fetchSubmissions()
      ]);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('useStudentData effect triggered for studentId:', studentId);
    fetchData();
  }, [studentId]);

  return {
    contests,
    submissions,
    loading,
    error,
    fetchContests,
    fetchSubmissions,
    refetch: fetchData,
  };
};
