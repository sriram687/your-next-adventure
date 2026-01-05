import React from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Copy,
  Share2,
  Globe,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTrips } from '@/contexts/TripContext';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import PageTransition from '@/components/layout/PageTransition';

const SharedItinerary = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { trips, addTrip } = useTrips();

  const trip = trips.find(t => t.id === tripId);

  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Globe className="w-16 h-16 mx-auto text-muted-foreground/40 mb-4" />
          <h2 className="text-2xl font-display font-bold text-foreground mb-2">Trip not found</h2>
          <p className="text-muted-foreground mb-6">This itinerary may have been removed or the link is incorrect.</p>
          <Button onClick={() => navigate('/')} className="btn-gradient-primary">
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  const activityTypeColors: Record<string, string> = {
    sightseeing: 'bg-tertiary text-tertiary-foreground',
    food: 'bg-accent text-accent-foreground',
    adventure: 'bg-success text-success-foreground',
    culture: 'bg-primary text-primary-foreground',
    relaxation: 'bg-warning text-warning-foreground',
  };

  const handleCopyToTrips = () => {
    const newTrip = {
      ...trip,
      id: `copy-${Date.now()}`,
      name: `${trip.name} (Copy)`,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    addTrip(newTrip);
    toast.success('Trip copied to your collection!', {
      description: 'You can now edit and customize this itinerary.',
    });
    navigate('/trips');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied!', {
      description: 'Share this link with friends and family.',
    });
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        {/* Hero Header */}
        <div className="relative h-64 overflow-hidden">
          {trip.coverPhoto ? (
            <img
              src={trip.coverPhoto}
              alt={trip.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary to-tertiary" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-2 mb-2">
                <Globe className="w-5 h-5 text-primary" />
                <span className="text-sm text-primary font-medium">Shared Itinerary</span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-display font-bold text-foreground mb-2">
                {trip.name}
              </h1>
              {trip.description && (
                <p className="text-muted-foreground">{trip.description}</p>
              )}
              <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <CalendarIcon className="w-4 h-4" />
                  {format(new Date(trip.startDate), 'MMM d')} - {format(new Date(trip.endDate), 'MMM d, yyyy')}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {trip.stops.length} {trip.stops.length === 1 ? 'stop' : 'stops'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Timeline */}
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />

            <div className="space-y-8">
              {trip.stops.map((stop, index) => (
                <motion.div
                  key={stop.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.15 }}
                  className="relative pl-16"
                >
                  {/* Dot */}
                  <div className="absolute left-4 w-4 h-4 rounded-full btn-gradient-primary border-4 border-background" />

                  {/* Stop Card */}
                  <div className="glass dark:glass-dark rounded-xl p-5 border border-white/20 dark:border-white/10">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2 mb-4">
                      <div>
                        <h3 className="font-display font-bold text-xl text-foreground">{stop.city}</h3>
                        <p className="text-muted-foreground">{stop.country}</p>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CalendarIcon className="w-4 h-4" />
                        {format(new Date(stop.arrivalDate), 'MMM d')} - {format(new Date(stop.departureDate), 'MMM d')}
                      </div>
                    </div>

                    {/* Activities */}
                    {stop.activities.length > 0 && (
                      <div className="space-y-2">
                        {stop.activities.map((activity, actIdx) => (
                          <motion.div
                            key={activity.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.15 + actIdx * 0.05 }}
                            className="flex items-center gap-3 p-3 rounded-lg bg-background/50"
                          >
                            <div className={cn(
                              "w-2 h-2 rounded-full",
                              activityTypeColors[activity.type]
                            )} />
                            <div className="flex items-center gap-2 text-sm text-muted-foreground min-w-[60px]">
                              <Clock className="w-3.5 h-3.5" />
                              {activity.time}
                            </div>
                            <span className="font-medium text-foreground flex-1">{activity.name}</span>
                            <span className="text-sm text-muted-foreground">
                              {Math.floor(activity.duration / 60)}h {activity.duration % 60 > 0 ? `${activity.duration % 60}m` : ''}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Floating Action Buttons */}
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="fixed bottom-6 right-6 flex gap-3"
        >
          <Button
            onClick={handleShare}
            variant="outline"
            className="glass dark:glass-dark border-white/20 shadow-lg"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button
            onClick={handleCopyToTrips}
            className="btn-gradient-primary shadow-lg hover:scale-105 transition-transform"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy to My Trips
          </Button>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default SharedItinerary;
