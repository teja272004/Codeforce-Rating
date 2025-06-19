
-- Create students table
CREATE TABLE public.students (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  codeforces_handle TEXT UNIQUE NOT NULL,
  current_rating INTEGER DEFAULT 0,
  max_rating INTEGER DEFAULT 0,
  auto_email_enabled BOOLEAN DEFAULT true,
  reminder_count INTEGER DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create contests table
CREATE TABLE public.contests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  contest_id TEXT NOT NULL,
  name TEXT NOT NULL,
  contest_date TIMESTAMP WITH TIME ZONE NOT NULL,
  rank INTEGER,
  rating_change INTEGER,
  new_rating INTEGER,
  problems_solved INTEGER DEFAULT 0,
  total_problems INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create submissions table
CREATE TABLE public.submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  submission_id TEXT UNIQUE NOT NULL,
  problem_name TEXT NOT NULL,
  rating INTEGER,
  verdict TEXT NOT NULL,
  submission_time TIMESTAMP WITH TIME ZONE NOT NULL,
  language TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create sync_logs table to track data updates
CREATE TABLE public.sync_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  sync_type TEXT NOT NULL, -- 'scheduled' or 'manual'
  status TEXT NOT NULL, -- 'success' or 'error'
  error_message TEXT,
  synced_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create email_logs table to track sent emails
CREATE TABLE public.email_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  email_type TEXT NOT NULL, -- 'inactivity_reminder'
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  status TEXT NOT NULL -- 'sent' or 'failed'
);

-- Enable RLS on all tables
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sync_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for students table
CREATE POLICY "Allow all operations on students" ON public.students FOR ALL USING (true);

-- Create policies for contests table
CREATE POLICY "Allow all operations on contests" ON public.contests FOR ALL USING (true);

-- Create policies for submissions table
CREATE POLICY "Allow all operations on submissions" ON public.submissions FOR ALL USING (true);

-- Create policies for sync_logs table
CREATE POLICY "Allow all operations on sync_logs" ON public.sync_logs FOR ALL USING (true);

-- Create policies for email_logs table
CREATE POLICY "Allow all operations on email_logs" ON public.email_logs FOR ALL USING (true);

-- Create indexes for better performance
CREATE INDEX idx_students_codeforces_handle ON public.students(codeforces_handle);
CREATE INDEX idx_contests_student_id ON public.contests(student_id);
CREATE INDEX idx_contests_contest_date ON public.contests(contest_date);
CREATE INDEX idx_submissions_student_id ON public.submissions(student_id);
CREATE INDEX idx_submissions_submission_time ON public.submissions(submission_time);
CREATE INDEX idx_submissions_verdict ON public.submissions(verdict);
CREATE INDEX idx_sync_logs_student_id ON public.sync_logs(student_id);
CREATE INDEX idx_email_logs_student_id ON public.email_logs(student_id);
