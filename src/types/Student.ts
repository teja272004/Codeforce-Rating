
export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  codeforcesHandle: string;
  currentRating: number;
  maxRating: number;
  lastUpdated: string;
  reminderCount: number;
  autoEmailEnabled: boolean;
}

export interface Contest {
  id: string;
  name: string;
  date: string;
  rank: number;
  ratingChange: number;
  newRating: number;
  problemsSolved: number;
  totalProblems: number;
}

export interface Submission {
  id: string;
  problemName: string;
  rating: number;
  verdict: string;
  submissionTime: string;
  language: string;
}

export interface ProblemStats {
  totalSolved: number;
  averageRating: number;
  averagePerDay: number;
  mostDifficult: {
    name: string;
    rating: number;
  };
  ratingBuckets: { [rating: string]: number };
}
