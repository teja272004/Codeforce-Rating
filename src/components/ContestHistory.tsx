
import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Contest } from '@/types/Student';
import { useStudentData } from '@/hooks/useStudentData';

interface ContestHistoryProps {
  studentId: string;
  filter: string;
}

export const ContestHistory = ({ studentId, filter }: ContestHistoryProps) => {
  const { contests, loading, fetchContests } = useStudentData(studentId);

  const filteredContests = useMemo(() => {
    const days = parseInt(filter);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return contests.filter(contest => 
      new Date(contest.date) >= cutoffDate
    ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [contests, filter]);

  const chartData = useMemo(() => {
    return filteredContests.map(contest => ({
      date: new Date(contest.date).toLocaleDateString(),
      rating: contest.newRating,
      name: contest.name
    }));
  }, [filteredContests]);

  // Trigger refetch when filter changes
  useMemo(() => {
    if (studentId) {
      fetchContests(parseInt(filter));
    }
  }, [filter, fetchContests, studentId]);

  if (loading) {
    return <div className="flex items-center justify-center h-32">Loading contests...</div>;
  }

  if (contests.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No contest data available. Try syncing the student's Codeforces data.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Rating Graph */}
      <div>
        <h3 className="text-lg font-medium mb-4">Rating Progress</h3>
        {chartData.length > 0 ? (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="rating" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center text-gray-500">
            No contest data for the selected period
          </div>
        )}
      </div>

      {/* Contest List */}
      <div>
        <h3 className="text-lg font-medium mb-4">Recent Contests ({filteredContests.length})</h3>
        {filteredContests.length > 0 ? (
          <div className="space-y-3">
            {filteredContests.map((contest) => (
              <div key={contest.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium">{contest.name}</h4>
                    <p className="text-sm text-gray-600">
                      {new Date(contest.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Rank: {contest.rank}</Badge>
                      <Badge 
                        variant={contest.ratingChange >= 0 ? "default" : "destructive"}
                        className={contest.ratingChange >= 0 ? "bg-green-600" : ""}
                      >
                        {contest.ratingChange >= 0 ? '+' : ''}{contest.ratingChange}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600">
                      Problems: {contest.problemsSolved}/{contest.totalProblems}
                    </div>
                    <div className="text-sm font-medium">
                      New Rating: {contest.newRating}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500">
            No contests found for the selected period
          </div>
        )}
      </div>
    </div>
  );
};
