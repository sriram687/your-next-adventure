import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTrips } from '@/contexts/TripContext';
import { useNavigate } from 'react-router-dom';
import TripCard from '@/components/trips/TripCard';
import CreateTripModal from '@/components/trips/CreateTripModal';
import { cn } from '@/lib/utils';

const MyTrips = () => {
  const { trips, deleteTrip } = useTrips();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredTrips = trips.filter(trip =>
    trip.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    trip.stops.some(stop => stop.city.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this trip?')) {
      deleteTrip(id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 pt-12 lg:pt-0"
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">My Trips</h1>
          <p className="text-muted-foreground">
            {trips.length} {trips.length === 1 ? 'trip' : 'trips'} planned
          </p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="btn-gradient-primary h-11 px-5 rounded-xl"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Trip
        </Button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search trips or destinations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11 bg-card border-border"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="h-11 px-4">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <div className="flex rounded-lg border border-border overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                "p-2.5 transition-colors",
                viewMode === 'grid' ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:text-foreground"
              )}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                "p-2.5 transition-colors",
                viewMode === 'list' ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:text-foreground"
              )}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Trips Grid/List */}
      {filteredTrips.length > 0 ? (
        <div className={cn(
          viewMode === 'grid'
            ? "grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
            : "space-y-4"
        )}>
          {filteredTrips.map((trip, index) => (
            <TripCard
              key={trip.id}
              trip={trip}
              index={index}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="card-elevated p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
            <Search className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="font-display font-bold text-lg text-foreground mb-2">
            {searchQuery ? 'No trips found' : 'No trips yet'}
          </h3>
          <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
            {searchQuery
              ? 'Try adjusting your search terms'
              : 'Start planning your first adventure and create lasting memories!'}
          </p>
          {!searchQuery && (
            <Button onClick={() => setShowCreateModal(true)} className="btn-gradient-primary">
              <Plus className="w-5 h-5 mr-2" />
              Create Your First Trip
            </Button>
          )}
        </div>
      )}

      <CreateTripModal open={showCreateModal} onOpenChange={setShowCreateModal} />
    </motion.div>
  );
};

export default MyTrips;
