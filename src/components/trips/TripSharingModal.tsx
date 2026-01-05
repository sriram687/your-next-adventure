import React from 'react';
import { UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface TripSharingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tripId: string;
  tripTitle: string;
}

const TripSharingModal: React.FC<TripSharingModalProps> = ({
  open,
  onOpenChange,
  tripId,
  tripTitle
}) => {
  const { toast } = useToast();

  const handleComingSoon = () => {
    toast({
      title: 'Coming Soon!',
      description: 'Trip sharing feature will be available in a future update.',
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Share "{tripTitle}"
          </DialogTitle>
        </DialogHeader>

        <div className="text-center py-8">
          <UserPlus className="w-16 h-16 mx-auto mb-4 text-muted-foreground/40" />
          <h3 className="text-lg font-semibold mb-2">Sharing Coming Soon</h3>
          <p className="text-muted-foreground mb-6">
            Trip sharing and collaboration features are being developed and will be available in a future update.
          </p>
          
          <div className="flex gap-3">
            <Button
              onClick={() => onOpenChange(false)}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleComingSoon}
              className="flex-1"
            >
              Got it
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TripSharingModal;
