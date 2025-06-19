
import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useStudentData } from '@/hooks/useStudentData';

interface ProblemSolvingDataProps {
  studentId: string;
  filter: string;
}

export const ProblemSolvingData = ({ studentId, filter }: ProblemSolvingDataProps) => {
  const { submissions, loading, fetchSubmissions } = useStudentData(studentId);

  const stats = useMemo(() => {
    const days = parseInt(filter);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    const filteredSubmissions = submissions.filter(submission => 
      new Date(submission.submissionTime) >= cutoffDate &&
      submission.verdict === 'OK'
    );

    const totalSolved = filteredSubmissions.length;
    const averageRating = totalSolved > 0 
      ? filteredSubmissions.reduce((sum, sub) => sum + sub.rating, 0) / totalSolved 
      : 0;
    
    const averagePerDay = totalSolved / days;
    
    const mostDifficult = filteredSubmissions.reduce((max, sub) => 
      sub.rating > max.rating ? sub : max, 
      { problemName: 'None', rating: 0 }
    );

    // Group by rating buckets
    const ratingBuckets: { [rating: string]: number } = {};
    filteredSubmissions.forEach(sub => {
      const bucket = Math.floor(sub.rating / 200) * 200;
      const bucketKey = `${bucket}-${bucket + 199}`;
      ratingBuckets[bucketKey] = (ratingBuckets[bucketKey] || 0) + 1;
    });

    return {
      totalSolved,
      averageRating: Math.round(averageRating),
      averagePerDay: Math.round(averagePerDay * 100) / 100,
      mostDifficult,
      ratingBuckets,
    };
  }, [submissions, filter]);

  const chartData = useMemo(() => {
    return Object.entries(stats.ratingBuckets).map(([range, count]) => ({
      range,
      count,
    }));
  }, [stats.ratingBuckets]);

  const heatmapData = useMemo(() => {
    // Generate last 7 days for heatmap
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const daySubmissions = submissions.filter(sub => {
        const subDate = new Date(sub.submissionTime);
        return subDate.toDateString() === date.toDateString() && sub.verdict === 'OK';
      });
      days.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        count: daySubmissions.length,
      });
    }
    return days;
  }, [submissions]);

  // Trigger refetch when filter changes
  useMemo(() => {
    fetchSubmissions(parseInt(filter));
  }, [filter, fetchSubmissions]);

  if (loading) {
    return <div className="flex items-center justify-center h-32">Loading problem data...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.totalSolved}</div>
            <p className="text-sm text-muted-foreground">Total Problems Solved</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.averageRating}</div>
            <p className="text-sm text-muted-foreground">Average Rating</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.averagePerDay}</div>
            <p className="text-sm text-muted-foreground">Problems per Day</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.mostDifficult.rating}</div>
            <p className="text-sm text-muted-foreground">Hardest Problem</p>
            <p className="text-xs text-gray-500">{stats.mostDifficult.problemName}</p>
          </CardContent>
        </Card>
      </div>

      {/* Rating Distribution Chart */}
      <div>
        <h3 className="text-lg font-medium mb-4">Problems by Rating Range</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Submission Heatmap */}
      <div>
        <h3 className="text-lg font-medium mb-4">Submission Activity (Last 7 Days)</h3>
        <div className="flex gap-2">
          {heatmapData.map((day, index) => (
            <div key={index} className="text-center">
              <div
                className={`w-12 h-12 rounded border flex items-center justify-center text-sm font-medium ${
                  day.count === 0
                    ? 'bg-gray-100 text-gray-400'
                    : day.count <= 2
                    ? 'bg-green-100 text-green-700'
                    : day.count <= 5
                    ? 'bg-green-300 text-green-800'
                    : 'bg-green-500 text-white'
                }`}
              >
                {day.count}
              </div>
              <div className="text-xs text-gray-600 mt-1">{day.date}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
