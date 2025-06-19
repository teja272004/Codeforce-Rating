
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Student } from '@/types/Student';
import { StudentFormDialog } from './StudentFormDialog';
import { Download, Plus, Edit, Trash2, Eye, Search, RefreshCw } from 'lucide-react';
import { useStudents } from '@/hooks/useStudents';
import { useToast } from '@/hooks/use-toast';

interface StudentTableProps {
  onSelectStudent: (student: Student) => void;
}

export const StudentTable = ({ onSelectStudent }: StudentTableProps) => {
  const { students, loading, addStudent, updateStudent, deleteStudent, syncStudentData } = useStudents();
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [syncingStudents, setSyncingStudents] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const filteredStudents = useMemo(() => {
    return students.filter(student =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.codeforcesHandle.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [students, searchTerm]);

  const handleAddStudent = async (studentData: Omit<Student, 'id' | 'lastUpdated' | 'reminderCount'>) => {
    try {
      await addStudent(studentData);
      toast({
        title: "Student added successfully",
        description: "Codeforces data sync has been initiated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add student",
        variant: "destructive",
      });
    }
  };

  const handleEditStudent = async (id: string, studentData: Omit<Student, 'id' | 'lastUpdated' | 'reminderCount'>) => {
    try {
      await updateStudent(id, studentData);
      toast({
        title: "Student updated successfully",
        description: "Codeforces data sync has been initiated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update student",
        variant: "destructive",
      });
    }
  };

  const handleDeleteStudent = async (id: string) => {
    try {
      await deleteStudent(id);
      toast({
        title: "Student deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete student",
        variant: "destructive",
      });
    }
  };

  const handleSyncStudent = async (studentId: string) => {
    setSyncingStudents(prev => new Set(prev).add(studentId));
    try {
      await syncStudentData(studentId);
      toast({
        title: "Sync initiated",
        description: "Codeforces data sync has been started for this student.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sync student data",
        variant: "destructive",
      });
    } finally {
      setSyncingStudents(prev => {
        const next = new Set(prev);
        next.delete(studentId);
        return next;
      });
    }
  };

  const downloadCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Codeforces Handle', 'Current Rating', 'Max Rating', 'Last Updated'];
    const csvContent = [
      headers.join(','),
      ...students.map(student => [
        student.name,
        student.email,
        student.phone,
        student.codeforcesHandle,
        student.currentRating,
        student.maxRating,
        new Date(student.lastUpdated).toLocaleDateString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'students.csv';
    link.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center h-32">
            <RefreshCw className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading students...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Students ({filteredStudents.length})</CardTitle>
          <div className="flex gap-2">
            <Button onClick={downloadCSV} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button onClick={() => setIsFormOpen(true)} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Student
            </Button>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-medium">Name</th>
                <th className="text-left py-3 px-4 font-medium">Email</th>
                <th className="text-left py-3 px-4 font-medium">Phone</th>
                <th className="text-left py-3 px-4 font-medium">CF Handle</th>
                <th className="text-left py-3 px-4 font-medium">Current Rating</th>
                <th className="text-left py-3 px-4 font-medium">Max Rating</th>
                <th className="text-left py-3 px-4 font-medium">Last Updated</th>
                <th className="text-left py-3 px-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{student.name}</td>
                  <td className="py-3 px-4 text-gray-600">{student.email}</td>
                  <td className="py-3 px-4 text-gray-600">{student.phone}</td>
                  <td className="py-3 px-4">
                    <Badge variant="secondary">{student.codeforcesHandle}</Badge>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant="outline">{student.currentRating}</Badge>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      {student.maxRating}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-gray-600 text-sm">
                    {new Date(student.lastUpdated).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onSelectStudent(student)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setEditingStudent(student);
                          setIsFormOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleSyncStudent(student.id)}
                        disabled={syncingStudents.has(student.id)}
                      >
                        <RefreshCw className={`h-4 w-4 ${syncingStudents.has(student.id) ? 'animate-spin' : ''}`} />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteStudent(student.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>

      <StudentFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={editingStudent 
          ? (data) => handleEditStudent(editingStudent.id, data)
          : handleAddStudent
        }
        initialData={editingStudent}
        onClose={() => {
          setEditingStudent(null);
          setIsFormOpen(false);
        }}
      />
    </Card>
  );
};
