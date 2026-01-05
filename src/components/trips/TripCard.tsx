import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Eye, Edit2, Trash2, DollarSign } from 'lucide-react';
import { Trip } from '@/types/trip';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface TripCardProps {
  trip: Trip;
  index?: number;
  onDelete?: (id: string) => void;
}

const TripCard = ({ trip, index = 0, onDelete }: TripCardProps) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const totalBudget = trip.budget.transport + trip.budget.stay + trip.budget.activities + trip.budget.meals;

  const getBudgetBadge = () => {
    if (totalBudget < 1500) return { label: 'Budget', color: 'bg-success/10 text-success border-success/30' };
    if (totalBudget < 3000) return { label: 'On Budget', color: 'bg-tertiary/10 text-tertiary border-tertiary/30' };
    return { label: 'Luxury', color: 'bg-accent/10 text-accent border-accent/30' };
  };

  const budgetBadge = getBudgetBadge();

  const getTripTags = () => {
    const tags: string[] = [];
    const activityTypes = trip.stops.flatMap(stop => stop.activities.map(a => a.type));
    
    if (activityTypes.includes('adventure')) tags.push('Adventure');
    if (activityTypes.includes('relaxation')) tags.push('Relaxation');
    if (activityTypes.includes('culture')) tags.push('Culture');
    if (activityTypes.includes('food')) tags.push('Foodie');
    if (activityTypes.includes('sightseeing')) tags.push('Sightseeing');
    
    return tags.slice(0, 2);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      whileHover={{ y: -8, scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="glass-card overflow-hidden group cursor-pointer"
    >
      {/* Cover Image */}
      <div className="relative h-44 overflow-hidden">
        {trip.coverPhoto ? (
          <motion.img
            src={trip.coverPhoto}
            alt={trip.name}
            className="w-full h-full object-cover"
            animate={{ scale: isHovered ? 1.1 : 1 }}
            transition={{ duration: 0.6 }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-tertiary/20 flex items-center justify-center">
            <MapPin className="w-12 h-12 text-primary/40" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
          <Badge className={cn("border backdrop-blur-sm", budgetBadge.color)}>
            <DollarSign className="w-3 h-3 mr-1" />
            {budgetBadge.label}
          </Badge>
          <Badge variant="secondary" className="bg-card/90 backdrop-blur-sm text-foreground">
            {trip.stops.length} {trip.stops.length === 1 ? 'stop' : 'stops'}
          </Badge>
        </div>

        {/* Trip Name Overlay */}
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="font-display font-bold text-xl text-white drop-shadow-lg line-clamp-1">
            {trip.name}
          </h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {trip.description && (
          <p className="text-sm text-muted-foreground line-clamp-1 mb-3">{trip.description}</p>
        )}

        {/* Date Range */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
          <Calendar className="w-4 h-4" />
          <span>
            {format(new Date(trip.startDate), 'MMM d')} - {format(new Date(trip.endDate), 'MMM d, yyyy')}
          </span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {trip.stops.slice(0, 2).map((stop) => (
            <span
              key={stop.id}
              className="px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground text-xs font-medium"
            >
              {stop.city}
            </span>
          ))}
          {getTripTags().map(tag => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/trips/${trip.id}`);
            }}
            className="flex-1 btn-press"
          >
            <Eye className="w-4 h-4 mr-1.5" />
            View
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/trips/${trip.id}/edit`);
            }}
            className="px-3 btn-press"
          >
            <Edit2 className="w-4 h-4" />
          </Button>
          {onDelete && (
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(trip.id);
              }}
              className="px-3 btn-press hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50"
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
