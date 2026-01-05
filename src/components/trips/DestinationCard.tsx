import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, TrendingUp, DollarSign } from 'lucide-react';
import { Destination } from '@/types/trip';
import { cn } from '@/lib/utils';

interface DestinationCardProps {
  destination: Destination;
  index?: number;
  onClick?: () => void;
}

const DestinationCard = ({ destination, index = 0, onClick }: DestinationCardProps) => {
  const costColors = {
    budget: 'text-success bg-success/10',
    moderate: 'text-warning bg-warning/10',
    expensive: 'text-accent bg-accent/10',
  };

  const costLabels = {
    budget: '$',
    moderate: '$$',
    expensive: '$$$',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      onClick={onClick}
      className="card-elevated overflow-hidden cursor-pointer group"
    >
      {/* Image */}
      <div className="relative h-36 overflow-hidden bg-gradient-to-br from-primary/20 to-tertiary/20">
        <img
          src={destination.image}
          alt={destination.city}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent" />
        
        {/* Popularity Badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-card/90 backdrop-blur-sm text-xs font-medium">
          <TrendingUp className="w-3 h-3 text-primary" />
          <span className="text-foreground">{destination.popularity}%</span>
        </div>

        {/* City Name Overlay */}
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="font-display font-bold text-lg text-primary-foreground">{destination.city}</h3>
          <div className="flex items-center gap-1 text-primary-foreground/80 text-sm">
            <MapPin className="w-3.5 h-3.5" />
            <span>{destination.country}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-3">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{destination.description}</p>
        
        {/* Cost Index */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Cost Index</span>
          <span className={cn(
            "px-2 py-0.5 rounded-full text-xs font-semibold",
            costColors[destination.costIndex]
          )}>
            {costLabels[destination.costIndex]}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default DestinationCard;
