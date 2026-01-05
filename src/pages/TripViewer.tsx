import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Edit2,
  DollarSign,
  List,
  CalendarDays,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTrips } from '@/contexts/TripContext';
import { format, eachDayOfInterval, isSameDay } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import PageTransition from '@/components/layout/PageTransition';

type ViewMode = 'timeline' | 'calendar';

const TripViewer = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { trips } = useTrips();
  const [viewMode, setViewMode] = useState<ViewMode>('timeline');

  const trip = trips.find(t => t.id === tripId);

  if (!trip) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Trip not found</p>
          <Button onClick={() => navigate('/trips')} variant="outline">
            Back to Trips
          </Button>
        </div>
      </div>
    );
  }

  const tripDays = eachDayOfInterval({
    start: new Date(trip.startDate),
    end: new Date(trip.endDate),
  });

  const activityTypeColors: Record<string, string> = {
    sightseeing: 'bg-tertiary text-tertiary-foreground',
    food: 'bg-accent text-accent-foreground',
    adventure: 'bg-success text-success-foreground',
    culture: 'bg-primary text-primary-foreground',
    relaxation: 'bg-warning text-warning-foreground',
  };

  return (
    <PageTransition>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6 pt-12 lg:pt-0"
      >
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="flex items-start gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/trips')}
              className="rounded-full mt-1 btn-press"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl lg:text-3xl font-display font-bold text-foreground">
                {trip.name}
              </h1>
              {trip.description && (
                <p className="text-muted-foreground mt-1">{trip.description}</p>
              )}
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
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
          <div className="flex flex-wrap gap-3">
            {/* View Toggle */}
            <div className="flex rounded-lg border border-border overflow-hidden glass dark:glass-dark">
              <button
                onClick={() => setViewMode('timeline')}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-200",
                  viewMode === 'timeline' ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <List className="w-4 h-4" />
                Timeline
              </button>
              <button
                onClick={() => setViewMode('calendar')}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-200",
                  viewMode === 'calendar' ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <CalendarDays className="w-4 h-4" />
                Calendar
              </button>
            </div>
            <Button onClick={() => navigate(`/trips/${tripId}/edit`)} variant="outline" className="btn-press">
              <Edit2 className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button onClick={() => navigate(`/trips/${tripId}/budget`)} className="btn-gradient-accent">
              <DollarSign className="w-4 h-4 mr-2" />
              Budget
            </Button>
          </div>
        </div>

        {/* Content based on view mode */}
        {viewMode === 'timeline' ? (
          <TimelineView trip={trip} activityTypeColors={activityTypeColors} />
        ) : (
          <CalendarView trip={trip} tripDays={tripDays} activityTypeColors={activityTypeColors} />
        )}
      </motion.div>
    </PageTransition>
  );
};

const TimelineView = ({ trip, activityTypeColors }: { 
  trip: any; 
  activityTypeColors: Record<string, string>; 
}) => {
  return (
    <div className="relative">
      {/* Vertical Line */}
      <div className="absolute left-6 lg:left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-tertiary to-accent" />

      {/* Stops */}
      <div className="space-y-8">
        {trip.stops.map((stop: any, index: number) => (
          <motion.div
            key={stop.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.15 }}
            className="relative pl-14 lg:pl-20"
          >
            {/* Dot */}
            <motion.div 
              className="absolute left-4 lg:left-6 w-4 h-4 rounded-full btn-gradient-primary border-4 border-background"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.15 + 0.1, type: 'spring' }}
            />

            {/* Stop Card */}
            <motion.div 
              className="glass-card p-5"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
            >
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
                  {stop.activities.map((activity: any, actIdx: number) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.15 + actIdx * 0.05 }}
                      className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors"
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
                      {activity.cost > 0 && (
                        <span className="text-sm font-medium text-foreground">${activity.cost}</span>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const CalendarView = ({ trip, tripDays, activityTypeColors }: { 
  trip: any; 
  tripDays: Date[]; 
  activityTypeColors: Record<string, string>; 
}) => {
  return (
    <div className="glass-card p-5 overflow-x-auto">
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${Math.min(tripDays.length, 7)}, minmax(150px, 1fr))` }}>
        {tripDays.map((day, index) => {
          const dayStop = trip.stops.find((stop: any) =>
            new Date(stop.arrivalDate) <= day && new Date(stop.departureDate) >= day
          );
          const dayActivities = dayStop?.activities || [];

          return (
            <motion.div
              key={day.toISOString()}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className="min-h-[200px]"
            >
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-border">
                <div>
                  <p className="text-xs text-muted-foreground uppercase">{format(day, 'EEE')}</p>
                  <p className="text-lg font-display font-bold text-foreground">{format(day, 'd')}</p>
                </div>
                {dayStop && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                    {dayStop.city}
                  </span>
                )}
              </div>

              <div className="space-y-2">
                {dayActivities.map((activity: any) => (
                  <motion.div
                    key={activity.id}
                    whileHover={{ scale: 1.02 }}
                    className={cn(
                      "p-2 rounded-lg text-xs cursor-pointer transition-transform",
                      activityTypeColors[activity.type] || 'bg-muted text-muted-foreground'
                    )}
                  >
                    <p className="font-medium line-clamp-2">{activity.name}</p>
                    <p className="opacity-80 mt-1">{activity.time}</p>
                  </motion.div>
                ))}
                {dayActivities.length === 0 && (
                  <p className="text-xs text-muted-foreground/50 italic">No activities</p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default TripViewer;