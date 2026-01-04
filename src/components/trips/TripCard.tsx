import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Eye, Edit2, Trash2 } from 'lucide-react';
import { Trip } from '@/types/trip';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface TripCardProps {
  trip: Trip;
  index?: number;
  onDelete?: (id: string) => void;
}

const TripCard = ({ trip, index = 0, onDelete }: TripCardProps) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="card-elevated overflow-hidden group"
    >
      {/* Cover Image */}
      <div className="relative h-40 overflow-hidden">
        {trip.coverPhoto ? (
          <img
            src={trip.coverPhoto}
            alt={trip.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-tertiary/20 flex items-center justify-center">
            <MapPin className="w-12 h-12 text-primary/40" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
        
        {/* Stop Count Badge */}
        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-card/90 backdrop-blur-sm text-xs font-medium text-foreground">
          {trip.stops.length} {trip.stops.length === 1 ? 'stop' : 'stops'}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-display font-bold text-lg text-foreground mb-1 group-hover:text-primary transition-colors">
          {trip.name}
        </h3>
        
        {trip.description && (
          <p className="text-sm text-muted-foreground line-clamp-1 mb-3">{trip.description}</p>
        )}

        {/* Date Range */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Calendar className="w-4 h-4" />
          <span>
            {format(new Date(trip.startDate), 'MMM d')} - {format(new Date(trip.endDate), 'MMM d, yyyy')}
          </span>
        </div>

        {/* Cities */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {trip.stops.slice(0, 3).map((stop) => (
            <span
              key={stop.id}
              className="px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground text-xs font-medium"
            >
              {stop.city}
            </span>
          ))}
          {trip.stops.length > 3 && (
            <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-xs">
              +{trip.stops.length - 3} more
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/trips/${trip.id}`)}
            className="flex-1"
          >
            <Eye className="w-4 h-4 mr-1.5" />
            View
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/trips/${trip.id}/edit`)}
            className="px-3"
          >
            <Edit2 className="w-4 h-4" />
          </Button>
          {onDelete && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(trip.id)}
              className="px-3 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default TripCard;
