
import { Student, Contest, Submission } from '@/types/Student';

export const mockStudents: Student[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice.johnson@email.com',
    phone: '+1-555-0123',
    codeforcesHandle: 'alice_codes',
    currentRating: 1547,
    maxRating: 1682,
    lastUpdated: '2024-01-15T10:30:00Z',
    reminderCount: 2,
    autoEmailEnabled: true,
  },
  {
    id: '2',
    name: 'Bob Smith',
    email: 'bob.smith@email.com',
    phone: '+1-555-0124',
    codeforcesHandle: 'bob_solver',
    currentRating: 1234,
    maxRating: 1456,
    lastUpdated: '2024-01-14T09:15:00Z',
    reminderCount: 0,
    autoEmailEnabled: true,
  },
  {
    id: '3',
    name: 'Charlie Brown',
    email: 'charlie.brown@email.com',
    phone: '+1-555-0125',
    codeforcesHandle: 'charlie_cp',
    currentRating: 1876,
    maxRating: 1923,
    lastUpdated: '2024-01-16T14:45:00Z',
    reminderCount: 1,
    autoEmailEnabled: false,
  },
];

export const mockContests: Contest[] = [
  {
    id: '1',
    name: 'Codeforces Round #920 (Div. 2)',
    date: '2024-01-10T17:35:00Z',
    rank: 1234,
    ratingChange: +45,
    newRating: 1547,
    problemsSolved: 3,
    totalProblems: 6,
  },
  {
    id: '2',
    name: 'Educational Codeforces Round 162',
    date: '2024-01-05T17:35:00Z',
    rank: 2156,
    ratingChange: -23,
    newRating: 1502,
    problemsSolved: 2,
    totalProblems: 7,
  },
  {
    id: '3',
    name: 'Codeforces Round #919 (Div. 2)',
    date: '2023-12-28T17:35:00Z',
    rank: 567,
    ratingChange: +78,
    newRating: 1525,
    problemsSolved: 4,
    totalProblems: 6,
  },
];

export const mockSubmissions: Submission[] = [
  {
    id: '1',
    problemName: 'Two Sum',
    rating: 800,
    verdict: 'ACCEPTED',
    submissionTime: '2024-01-15T08:30:00Z',
    language: 'C++17',
  },
  {
    id: '2',
    problemName: 'Binary Search',
    rating: 1200,
    verdict: 'ACCEPTED',
    submissionTime: '2024-01-14T19:45:00Z',
    language: 'Python3',
  },
  {
    id: '3',
    problemName: 'Graph Traversal',
    rating: 1600,
    verdict: 'WRONG_ANSWER',
    submissionTime: '2024-01-13T15:20:00Z',
    language: 'C++17',
  },
  {
    id: '4',
    problemName: 'Dynamic Programming',
    rating: 1400,
    verdict: 'ACCEPTED',
    submissionTime: '2024-01-12T11:15:00Z',
    language: 'Java',
  },
];
