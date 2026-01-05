import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserPlus, 
  Mail, 
  Send, 
  X, 
  Eye, 
  Edit3, 
  Trash2, 
  Clock, 
  CheckCircle,
  AlertCircle 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { collaborationService } from '@/services/collaborationService';

interface Collaborator {
  id: string;
  email: string;
  user_id?: string;
  status: 'pending' | 'accepted';
  role: 'viewer' | 'editor';
  invited_at: string;
  accepted_at?: string;
  profile?: {
    name: string;
    avatar_url?: string;
  };
}

interface InviteCollaboratorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tripId: string;
  tripTitle: string;
  isOwner: boolean;
}

const InviteCollaboratorModal: React.FC<InviteCollaboratorModalProps> = ({
  open,
  onOpenChange,
  tripId,
  tripTitle,
  isOwner
}) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'viewer' | 'editor'>('viewer');
  const [isLoading, setIsLoading] = useState(false);
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [loadingCollaborators, setLoadingCollaborators] = useState(false);
  const { toast } = useToast();

  const loadCollaborators = async () => {
    setLoadingCollaborators(true);
    try {
      const data = await collaborationService.getTripCollaborators(tripId);
      setCollaborators(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load collaborators',
        variant: 'destructive'
      });
    } finally {
      setLoadingCollaborators(false);
    }
  };

  useEffect(() => {
    if (open) {
      loadCollaborators();
    }
  }, [open, tripId]);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleInvite = async () => {
    if (!email.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter an email address',
        variant: 'destructive'
      });
      return;
    }

    if (!validateEmail(email)) {
      toast({
        title: 'Error',
        description: 'Please enter a valid email address',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    try {
      await collaborationService.inviteUser(tripId, email.toLowerCase(), role);
      
      toast({
        title: 'Invite sent!',
        description: `Invitation sent to ${email}`,
      });
      
      setEmail('');
      setRole('viewer');
      await loadCollaborators(); // Refresh the list
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to send invitation',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveCollaborator = async (collaboratorId: string, email: string) => {
    try {
      await collaborationService.removeCollaborator(tripId, collaboratorId);
      
      toast({
        title: 'Collaborator removed',
        description: `${email} has been removed from the trip`,
      });
      
      await loadCollaborators(); // Refresh the list
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove collaborator',
        variant: 'destructive'
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case 'accepted':
        return (
          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Active
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            <AlertCircle className="w-3 h-3 mr-1" />
            Unknown
          </Badge>
        );
    }
  };

  const getRoleIcon = (role: string) => {
    return role === 'editor' ? (
      <Edit3 className="w-4 h-4 text-blue-600" />
    ) : (
      <Eye className="w-4 h-4 text-gray-600" />
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl glass-card border-white/20">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <UserPlus className="w-6 h-6 text-primary" />
            Share "{tripTitle}"
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Invite New User Section */}
          {isOwner && (
            <div className="space-y-4 p-4 rounded-xl bg-gradient-to-br from-primary/5 to-tertiary/5 border border-primary/10">
              <h3 className="font-medium text-foreground">Invite a Friend</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="friend@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 glass-card border-white/30"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Access Level</Label>
                  <Select value={role} onValueChange={(value: 'viewer' | 'editor') => setRole(value)}>
                    <SelectTrigger className="glass-card border-white/30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="viewer">
                        <div className="flex items-center gap-2">
                          <Eye className="w-4 h-4 text-gray-600" />
                          <span>Viewer</span>
                          <span className="text-xs text-muted-foreground">(View only)</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="editor">
                        <div className="flex items-center gap-2">
                          <Edit3 className="w-4 h-4 text-blue-600" />
                          <span>Editor</span>
                          <span className="text-xs text-muted-foreground">(Can modify)</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                onClick={handleInvite}
                disabled={isLoading || !email.trim()}
                className="w-full btn-gradient-primary"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                ) : (
                  <Send className="w-4 h-4 mr-2" />
                )}
                Send Invitation
              </Button>
            </div>
          )}

          {/* Current Collaborators List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-foreground">
                Current Collaborators ({collaborators.length})
              </h3>
              {loadingCollaborators && (
                <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              )}
            </div>

            {collaborators.length === 0 && !loadingCollaborators ? (
              <div className="text-center py-8 text-muted-foreground">
                <UserPlus className="w-12 h-12 mx-auto mb-3 opacity-40" />
                <p>No collaborators yet</p>
                <p className="text-sm">Invite friends to share this trip!</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                <AnimatePresence>
                  {collaborators.map((collaborator, index) => (
                    <motion.div
                      key={collaborator.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 rounded-lg glass-card border border-white/10"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={collaborator.profile?.avatar_url} />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {collaborator.profile?.name?.[0] || collaborator.email[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">
                              {collaborator.profile?.name || collaborator.email}
                            </span>
                            {getRoleIcon(collaborator.role)}
                          </div>
                          {collaborator.profile?.name && (
                            <p className="text-xs text-muted-foreground">{collaborator.email}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {getStatusBadge(collaborator.status)}
                        
                        {isOwner && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveCollaborator(collaborator.id, collaborator.email)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Footer Info */}
          <div className="text-xs text-muted-foreground p-3 rounded-lg bg-muted/30 border border-border/50">
            <p className="font-medium mb-1">Access Levels:</p>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Eye className="w-3 h-3" />
                <span><strong>Viewer:</strong> Can view trip details, itinerary, and budget</span>
              </div>
              <div className="flex items-center gap-2">
                <Edit3 className="w-3 h-3" />
                <span><strong>Editor:</strong> Can modify stops, activities, and budget items</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InviteCollaboratorModal;