
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Mail, Phone, User, Trophy } from 'lucide-react';
import { Student } from '@/types/Student';
import { ContestHistory } from './ContestHistory';
import { ProblemSolvingData } from './ProblemSolvingData';

interface StudentProfileProps {
  student: Student;
  onBack: () => void;
}

export const StudentProfile = ({ student, onBack }: StudentProfileProps) => {
  const [contestFilter, setContestFilter] = useState('365');
  const [problemFilter, setProblemFilter] = useState('30');

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Students
        </Button>
        <h2 className="text-2xl font-bold">{student.name}'s Profile</h2>
      </div>

      {/* Student Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Student Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">{student.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">{student.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-gray-500" />
              <Badge variant="secondary">{student.codeforcesHandle}</Badge>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline">Current: {student.currentRating}</Badge>
              <Badge variant="outline" className="text-green-600 border-green-600">
                Max: {student.maxRating}
              </Badge>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
            <span>Last Updated: {new Date(student.lastUpdated).toLocaleDateString()}</span>
            <span>Reminder Emails Sent: {student.reminderCount}</span>
            <Badge variant={student.autoEmailEnabled ? "default" : "secondary"}>
              Auto Email: {student.autoEmailEnabled ? "Enabled" : "Disabled"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Contest History Section */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Contest History</CardTitle>
            <Select value={contestFilter} onValueChange={setContestFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
                <SelectItem value="365">Last 365 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <ContestHistory studentId={student.id} filter={contestFilter} />
        </CardContent>
      </Card>

      {/* Problem Solving Data Section */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Problem Solving Data</CardTitle>
            <Select value={problemFilter} onValueChange={setProblemFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <ProblemSolvingData studentId={student.id} filter={problemFilter} />
        </CardContent>
      </Card>
    </div>
  );
};
