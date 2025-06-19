
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Student } from '@/types/Student';

interface StudentFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Omit<Student, 'id' | 'lastUpdated' | 'reminderCount'>) => Promise<void>;
  initialData?: Student | null;
  onClose: () => void;
}

export const StudentFormDialog = ({ 
  open, 
  onOpenChange, 
  onSubmit, 
  initialData, 
  onClose 
}: StudentFormDialogProps) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    codeforcesHandle: initialData?.codeforcesHandle || '',
    currentRating: initialData?.currentRating || 0,
    maxRating: initialData?.maxRating || 0,
    autoEmailEnabled: initialData?.autoEmailEnabled ?? true,
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await onSubmit(formData);
      onClose();
      setFormData({
        name: '',
        email: '',
        phone: '',
        codeforcesHandle: '',
        currentRating: 0,
        maxRating: 0,
        autoEmailEnabled: true,
      });
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? 'Edit Student' : 'Add New Student'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="codeforcesHandle">Codeforces Handle</Label>
            <Input
              id="codeforcesHandle"
              value={formData.codeforcesHandle}
              onChange={(e) => setFormData({ ...formData, codeforcesHandle: e.target.value })}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="currentRating">Current Rating</Label>
              <Input
                id="currentRating"
                type="number"
                value={formData.currentRating}
                onChange={(e) => setFormData({ ...formData, currentRating: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div>
              <Label htmlFor="maxRating">Max Rating</Label>
              <Input
                id="maxRating"
                type="number"
                value={formData.maxRating}
                onChange={(e) => setFormData({ ...formData, maxRating: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="autoEmailEnabled"
              checked={formData.autoEmailEnabled}
              onCheckedChange={(checked) => setFormData({ ...formData, autoEmailEnabled: checked })}
            />
            <Label htmlFor="autoEmailEnabled">Enable Auto Email Reminders</Label>
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : (initialData ? 'Update' : 'Add')} Student
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
