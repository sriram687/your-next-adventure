import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, MapPin, TrendingUp, DollarSign } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

interface City {
  id: string;
  name: string;
  country: string;
  costIndex: '$' | '$$' | '$$$';
  popularity: number;
  image: string;
}

const mockCities: City[] = [
  { id: '1', name: 'Tokyo', country: 'Japan', costIndex: '$$', popularity: 95, image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=100' },
  { id: '2', name: 'Paris', country: 'France', costIndex: '$$$', popularity: 98, image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=100' },
  { id: '3', name: 'Bali', country: 'Indonesia', costIndex: '$', popularity: 88, image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=100' },
  { id: '4', name: 'Barcelona', country: 'Spain', costIndex: '$$', popularity: 92, image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=100' },
  { id: '5', name: 'New York', country: 'USA', costIndex: '$$$', popularity: 97, image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=100' },
  { id: '6', name: 'Santorini', country: 'Greece', costIndex: '$$$', popularity: 90, image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=100' },
  { id: '7', name: 'Bangkok', country: 'Thailand', costIndex: '$', popularity: 85, image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=100' },
  { id: '8', name: 'Rome', country: 'Italy', costIndex: '$$', popularity: 94, image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=100' },
  { id: '9', name: 'Dubai', country: 'UAE', costIndex: '$$$', popularity: 89, image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=100' },
  { id: '10', name: 'Kyoto', country: 'Japan', costIndex: '$$', popularity: 87, image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=100' },
];

interface SmartSearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectCity?: (city: City) => void;
}

const SmartSearchModal = ({ open, onOpenChange, onSelectCity }: SmartSearchModalProps) => {
  const [query, setQuery] = useState('');

  const filteredCities = useMemo(() => {
    if (!query.trim()) return mockCities;
    return mockCities.filter(
      city =>
        city.name.toLowerCase().includes(query.toLowerCase()) ||
        city.country.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  const handleSelect = (city: City) => {
    onSelectCity?.(city);
    toast.success(`${city.name} selected!`, {
      description: `${city.country} • ${city.costIndex}`,
    });
    onOpenChange(false);
    setQuery('');
  };

  const getCostColor = (cost: string) => {
    switch (cost) {
      case '$': return 'text-success bg-success/10';
      case '$$': return 'text-warning bg-warning/10';
      case '$$$': return 'text-accent bg-accent/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass dark:glass-dark border-white/20 dark:border-white/10 max-w-lg p-0 overflow-hidden">
        <VisuallyHidden>
          <DialogTitle>Search Cities</DialogTitle>
        </VisuallyHidden>
        
        {/* Search Header */}
        <div className="p-4 border-b border-white/10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search cities..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 h-12 bg-background/50 border-white/10 text-lg"
              autoFocus
            />
            {query && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="max-h-[400px] overflow-y-auto p-2">
          <AnimatePresence mode="popLayout">
            {filteredCities.length > 0 ? (
              filteredCities.map((city, index) => (
                <motion.button
                  key={city.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.03 }}
                  onClick={() => handleSelect(city)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 dark:hover:bg-white/5 transition-all duration-200 group"
                >
                  <img
                    src={city.image}
                    alt={city.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {city.name}
                      </span>
                      <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${getCostColor(city.costIndex)}`}>
                        {city.costIndex}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      {city.country}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <TrendingUp className="w-4 h-4" />
                    <span>{city.popularity}%</span>
                  </div>
                </motion.button>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8 text-muted-foreground"
              >
                <MapPin className="w-12 h-12 mx-auto mb-3 opacity-40" />
                <p>No cities found for "{query}"</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SmartSearchModal;
