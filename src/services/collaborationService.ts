// Temporary placeholder - sharing disabled
export const collaborationService = {
  inviteUser: async () => {
    throw new Error('Sharing feature is temporarily disabled');
  },
  getTripCollaborators: async () => [],
  removeCollaborator: async () => {},
  acceptInvitation: async () => {},
  getSharedTrips: async () => [],
  getPendingInvitations: async () => [],
  canEditTrip: async () => true,
  canViewTrip: async () => true,
  getUserRole: async () => 'owner' as const
};
