
import { useState } from 'react';
import { StudentTable } from '@/components/StudentTable';
import { StudentProfile } from '@/components/StudentProfile';
import { Student } from '@/types/Student';

const Index = () => {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Student Progress Management System
          </h1>
          <p className="text-gray-600">
            Track and manage competitive programming progress of your students
          </p>
        </div>
        
        {selectedStudent ? (
          <StudentProfile 
            student={selectedStudent} 
            onBack={() => setSelectedStudent(null)} 
          />
        ) : (
          <StudentTable onSelectStudent={setSelectedStudent} />
        )}
      </div>
    </div>
  );
};

export default Index;
