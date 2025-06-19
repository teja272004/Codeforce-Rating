
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CodeforcesUser {
  handle: string;
  rating?: number;
  maxRating?: number;
}

interface CodeforcesContest {
  contestId: number;
  contestName: string;
  handle: string;
  rank: number;
  ratingUpdateTimeSeconds: number;
  oldRating: number;
  newRating: number;
}

interface CodeforcesSubmission {
  id: number;
  contestId: number;
  creationTimeSeconds: number;
  problem: {
    name: string;
    rating?: number;
  };
  programmingLanguage: string;
  verdict: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { studentId } = await req.json();
    console.log('Starting sync for student:', studentId);

    // Get student data
    const { data: student, error: studentError } = await supabase
      .from('students')
      .select('*')
      .eq('id', studentId)
      .single();

    if (studentError || !student) {
      console.error('Student not found:', studentError);
      return new Response(
        JSON.stringify({ error: 'Student not found' }),
        { status: 404, headers: corsHeaders }
      );
    }

    const handle = student.codeforces_handle;
    console.log('Syncing data for handle:', handle);

    // Fetch user info from Codeforces
    const userResponse = await fetch(`https://codeforces.com/api/user.info?handles=${handle}`);
    const userData = await userResponse.json();

    if (userData.status !== 'OK') {
      throw new Error(`Codeforces API error: ${userData.comment}`);
    }

    const user: CodeforcesUser = userData.result[0];
    console.log('User data:', user);

    // Update student ratings
    const { error: updateError } = await supabase
      .from('students')
      .update({
        current_rating: user.rating || 0,
        max_rating: user.maxRating || user.rating || 0,
        last_updated: new Date().toISOString()
      })
      .eq('id', studentId);

    if (updateError) {
      console.error('Error updating student:', updateError);
      throw updateError;
    }

    // Fetch contest history
    try {
      const contestResponse = await fetch(`https://codeforces.com/api/user.rating?handle=${handle}`);
      const contestData = await contestResponse.json();

      if (contestData.status === 'OK' && contestData.result.length > 0) {
        console.log('Found', contestData.result.length, 'contests');
        
        // Clear existing contests for this student
        await supabase
          .from('contests')
          .delete()
          .eq('student_id', studentId);

        // Insert new contest data
        const contests = contestData.result.map((contest: CodeforcesContest) => ({
          student_id: studentId,
          contest_id: contest.contestId.toString(),
          name: contest.contestName,
          contest_date: new Date(contest.ratingUpdateTimeSeconds * 1000).toISOString(),
          rank: contest.rank,
          rating_change: contest.newRating - contest.oldRating,
          new_rating: contest.newRating,
          problems_solved: 0, // Will be updated if we can get this data
          total_problems: 0
        }));

        const { error: contestError } = await supabase
          .from('contests')
          .insert(contests);

        if (contestError) {
          console.error('Error inserting contests:', contestError);
        }
      }
    } catch (error) {
      console.error('Error fetching contests:', error);
    }

    // Fetch submission history
    try {
      const submissionResponse = await fetch(`https://codeforces.com/api/user.status?handle=${handle}&from=1&count=1000`);
      const submissionData = await submissionResponse.json();

      if (submissionData.status === 'OK' && submissionData.result.length > 0) {
        console.log('Found', submissionData.result.length, 'submissions');
        
        // Clear existing submissions for this student
        await supabase
          .from('submissions')
          .delete()
          .eq('student_id', studentId);

        // Insert new submission data
        const submissions = submissionData.result.map((submission: CodeforcesSubmission) => ({
          student_id: studentId,
          submission_id: submission.id.toString(),
          problem_name: submission.problem.name,
          rating: submission.problem.rating || 0,
          verdict: submission.verdict,
          submission_time: new Date(submission.creationTimeSeconds * 1000).toISOString(),
          language: submission.programmingLanguage
        }));

        const { error: submissionError } = await supabase
          .from('submissions')
          .insert(submissions);

        if (submissionError) {
          console.error('Error inserting submissions:', submissionError);
        }
      }
    } catch (error) {
      console.error('Error fetching submissions:', error);
    }

    // Log successful sync
    await supabase
      .from('sync_logs')
      .insert({
        student_id: studentId,
        sync_type: 'manual',
        status: 'success'
      });

    console.log('Sync completed successfully for student:', studentId);

    return new Response(
      JSON.stringify({ success: true, message: 'Data synced successfully' }),
      { status: 200, headers: corsHeaders }
    );

  } catch (error) {
    console.error('Sync error:', error);

    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: corsHeaders }
    );
  }
});
