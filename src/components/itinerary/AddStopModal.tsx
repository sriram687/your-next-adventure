import React, { useState } from 'react';
import { MapPin, Calendar, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { useTrips } from '@/contexts/TripContext';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface AddStopModalProps {
  tripId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const popularCities = [
  { city: 'Paris', country: 'France', costIndex: 'expensive' },
  { city: 'Tokyo', country: 'Japan', costIndex: 'moderate' },
  { city: 'Barcelona', country: 'Spain', costIndex: 'moderate' },
  { city: 'Bali', country: 'Indonesia', costIndex: 'budget' },
  { city: 'New York', country: 'USA', costIndex: 'expensive' },
  { city: 'Rome', country: 'Italy', costIndex: 'moderate' },
];

const AddStopModal = ({ tripId, open, onOpenChange }: AddStopModalProps) => {
  const { addStop } = useTrips();
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [arrivalDate, setArrivalDate] = useState<Date>();
  const [departureDate, setDepartureDate] = useState<Date>();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCities = popularCities.filter(
    c => c.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
         c.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectCity = (selectedCity: typeof popularCities[0]) => {
    setCity(selectedCity.city);
    setCountry(selectedCity.country);
    setSearchQuery('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!city || !country || !arrivalDate || !departureDate) return;

    addStop(tripId, {
      city,
      country,
      arrivalDate: arrivalDate.toISOString(),
      departureDate: departureDate.toISOString(),
      activities: [],
    });

    onOpenChange(false);
    resetForm();
  };

  const resetForm = () => {
    setCity('');
    setCountry('');
    setArrivalDate(undefined);
    setDepartureDate(undefined);
    setSearchQuery('');
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      onOpenChange(isOpen);
      if (!isOpen) resetForm();
    }}>
      <DialogContent className="sm:max-w-lg bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-display flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            Add Stop
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 pt-2">
          {/* City Search */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Destination</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search cities..."
                value={searchQuery || city}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (!e.target.value) {
                    setCity('');
                    setCountry('');
                  }
                }}
                className="pl-9 h-11 bg-secondary/50"
              />
            </div>
            
            {/* City Suggestions */}
            {searchQuery && (
              <div className="border border-border rounded-lg overflow-hidden bg-card shadow-lg">
                {filteredCities.length > 0 ? (
                  filteredCities.map((c) => (
                    <button
                      key={c.city}
                      type="button"
                      onClick={() => handleSelectCity(c)}
                      className="w-full px-4 py-3 text-left hover:bg-muted flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium text-foreground">{c.city}</p>
                        <p className="text-sm text-muted-foreground">{c.country}</p>
                      </div>
                      <span className={cn(
                        "px-2 py-0.5 rounded-full text-xs font-medium",
                        c.costIndex === 'budget' && 'bg-success/10 text-success',
                        c.costIndex === 'moderate' && 'bg-warning/10 text-warning',
                        c.costIndex === 'expensive' && 'bg-accent/10 text-accent'
                      )}>
                        {c.costIndex === 'budget' ? '$' : c.costIndex === 'moderate' ? '$$' : '$$$'}
                      </span>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-3 text-sm text-muted-foreground">No cities found</div>
                )}
              </div>
            )}

            {/* Selected City Display */}
            {city && !searchQuery && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 text-primary">
                <MapPin className="w-4 h-4" />
                <span className="font-medium">{city}, {country}</span>
              </div>
            )}
          </div>

          {/* Custom City/Country (if not selected from list) */}
          {!city && !searchQuery && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">City *</Label>
                <Input
                  placeholder="Enter city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="h-11 bg-secondary/50"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Country *</Label>
                <Input
                  placeholder="Enter country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="h-11 bg-secondary/50"
                />
              </div>
            </div>
          )}

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Arrival *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full h-11 justify-start text-left font-normal bg-secondary/50",
                      !arrivalDate && "text-muted-foreground"
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {arrivalDate ? format(arrivalDate, "MMM d") : "Date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={arrivalDate}
                    onSelect={setArrivalDate}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Departure *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full h-11 justify-start text-left font-normal bg-secondary/50",
                      !departureDate && "text-muted-foreground"
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {departureDate ? format(departureDate, "MMM d") : "Date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={departureDate}
                    onSelect={setDepartureDate}
                    disabled={(date) => arrivalDate ? date < arrivalDate : false}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 h-11"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!city || !country || !arrivalDate || !departureDate}
              className="flex-1 h-11 btn-gradient-primary"
            >
              Add Stop
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddStopModal;
