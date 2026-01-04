import React, { useState } from 'react';
import { Clock, DollarSign, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTrips } from '@/contexts/TripContext';
import { Activity } from '@/types/trip';
import { cn } from '@/lib/utils';

interface AddActivityModalProps {
  tripId: string;
  stopId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const activityTypes: { value: Activity['type']; label: string; color: string }[] = [
  { value: 'sightseeing', label: 'Sightseeing', color: 'bg-tertiary/10 text-tertiary border-tertiary/20' },
  { value: 'food', label: 'Food & Dining', color: 'bg-accent/10 text-accent border-accent/20' },
  { value: 'adventure', label: 'Adventure', color: 'bg-success/10 text-success border-success/20' },
  { value: 'culture', label: 'Culture', color: 'bg-primary/10 text-primary border-primary/20' },
  { value: 'relaxation', label: 'Relaxation', color: 'bg-warning/10 text-warning border-warning/20' },
];

const AddActivityModal = ({ tripId, stopId, open, onOpenChange }: AddActivityModalProps) => {
  const { addActivity } = useTrips();
  const [name, setName] = useState('');
  const [type, setType] = useState<Activity['type']>('sightseeing');
  const [time, setTime] = useState('09:00');
  const [duration, setDuration] = useState('60');
  const [cost, setCost] = useState('0');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !stopId) return;

    addActivity(tripId, stopId, {
      name,
      type,
      time,
      duration: parseInt(duration),
      cost: parseFloat(cost) || 0,
    });

    onOpenChange(false);
    resetForm();
  };

  const resetForm = () => {
    setName('');
    setType('sightseeing');
    setTime('09:00');
    setDuration('60');
    setCost('0');
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      onOpenChange(isOpen);
      if (!isOpen) resetForm();
    }}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-display">Add Activity</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 pt-2">
          {/* Activity Name */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Activity Name *</Label>
            <Input
              placeholder="e.g., Visit Eiffel Tower"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-11 bg-secondary/50"
              required
            />
          </div>

          {/* Activity Type */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Type</Label>
            <div className="flex flex-wrap gap-2">
              {activityTypes.map((activityType) => (
                <button
                  key={activityType.value}
                  type="button"
                  onClick={() => setType(activityType.value)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-sm font-medium border transition-all",
                    type === activityType.value
                      ? activityType.color + ' ring-2 ring-offset-2'
                      : 'bg-muted text-muted-foreground border-border hover:border-primary/50'
                  )}
                >
                  {activityType.label}
                </button>
              ))}
            </div>
          </div>

          {/* Time and Duration */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Start Time</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="pl-9 h-11 bg-secondary/50"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Duration (min)</Label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger className="h-11 bg-secondary/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 min</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="90">1.5 hours</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                  <SelectItem value="180">3 hours</SelectItem>
                  <SelectItem value="240">4 hours</SelectItem>
                  <SelectItem value="360">6 hours</SelectItem>
                  <SelectItem value="480">Full day</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Cost */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Estimated Cost ($)</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="number"
                min="0"
                step="0.01"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                className="pl-9 h-11 bg-secondary/50"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 h-11"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!name}
              className="flex-1 h-11 btn-gradient-primary"
            >
              Add Activity
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddActivityModal;
