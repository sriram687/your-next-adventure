import React from 'react';
import { Users } from 'lucide-react';

const SharedTrips: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-tertiary bg-clip-text text-transparent mb-2">
          Shared Trips
        </h1>
        <p className="text-muted-foreground">
          Trips shared with you by friends and family
        </p>
      </div>

      <div className="text-center py-12">
        <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground/40" />
        <h3 className="text-xl font-semibold mb-2">Sharing Feature Coming Soon</h3>
        <p className="text-muted-foreground mb-4">
          Trip sharing and collaboration features are being developed.
        </p>
        <p className="text-sm text-muted-foreground">
          In the meantime, enjoy planning your own amazing adventures!
        </p>
      </div>
    </div>
  );
};

export default SharedTrips;