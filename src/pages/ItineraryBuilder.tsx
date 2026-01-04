import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Plus,
  GripVertical,
  MapPin,
  Calendar,
  Clock,
  Trash2,
  Save,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTrips } from '@/contexts/TripContext';
import { Stop, Activity } from '@/types/trip';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import AddStopModal from '@/components/itinerary/AddStopModal';
import AddActivityModal from '@/components/itinerary/AddActivityModal';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const ItineraryBuilder = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { trips, reorderStops, removeStop, removeActivity } = useTrips();
  
  const trip = trips.find(t => t.id === tripId);
  const [stops, setStops] = useState<Stop[]>(trip?.stops || []);
  const [expandedStops, setExpandedStops] = useState<Set<string>>(new Set());
  const [showAddStop, setShowAddStop] = useState(false);
  const [activeStopId, setActiveStopId] = useState<string | null>(null);
  const [showAddActivity, setShowAddActivity] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    if (trip) {
      setStops(trip.stops);
      if (trip.stops.length > 0 && expandedStops.size === 0) {
        setExpandedStops(new Set([trip.stops[0].id]));
      }
    }
  }, [trip]);

  if (!trip) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Trip not found</p>
      </div>
    );
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = stops.findIndex(s => s.id === active.id);
      const newIndex = stops.findIndex(s => s.id === over.id);
      const newStops = arrayMove(stops, oldIndex, newIndex);
      setStops(newStops);
      reorderStops(tripId!, newStops);
    }
  };

  const toggleExpand = (stopId: string) => {
    setExpandedStops(prev => {
      const newSet = new Set(prev);
      if (newSet.has(stopId)) {
        newSet.delete(stopId);
      } else {
        newSet.add(stopId);
      }
      return newSet;
    });
  };

  const handleRemoveStop = (stopId: string) => {
    if (confirm('Remove this stop?')) {
      removeStop(tripId!, stopId);
    }
  };

  const handleRemoveActivity = (stopId: string, activityId: string) => {
    removeActivity(tripId!, stopId, activityId);
  };

  const openAddActivity = (stopId: string) => {
    setActiveStopId(stopId);
    setShowAddActivity(true);
  };

  const activityTypeColors: Record<string, string> = {
    sightseeing: 'bg-tertiary/10 text-tertiary border-tertiary/20',
    food: 'bg-accent/10 text-accent border-accent/20',
    adventure: 'bg-success/10 text-success border-success/20',
    culture: 'bg-primary/10 text-primary border-primary/20',
    relaxation: 'bg-warning/10 text-warning border-warning/20',
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 pt-12 lg:pt-0"
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/trips')}
            className="rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl lg:text-3xl font-display font-bold text-foreground">
              {trip.name}
            </h1>
            <p className="text-muted-foreground text-sm">
              {format(new Date(trip.startDate), 'MMM d')} - {format(new Date(trip.endDate), 'MMM d, yyyy')}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => setShowAddStop(true)}
            className="btn-gradient-primary h-10 rounded-lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Stop
          </Button>
          <Button variant="outline" onClick={() => navigate(`/trips/${tripId}`)}>
            <Save className="w-4 h-4 mr-2" />
            View Itinerary
          </Button>
        </div>
      </div>

      {/* Stops List */}
      <div className="space-y-4">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={stops.map(s => s.id)} strategy={verticalListSortingStrategy}>
            {stops.length > 0 ? (
              stops.map((stop, index) => (
                <SortableStop
                  key={stop.id}
                  stop={stop}
                  index={index}
                  isExpanded={expandedStops.has(stop.id)}
                  onToggle={() => toggleExpand(stop.id)}
                  onRemove={() => handleRemoveStop(stop.id)}
                  onAddActivity={() => openAddActivity(stop.id)}
                  onRemoveActivity={(activityId) => handleRemoveActivity(stop.id, activityId)}
                  activityTypeColors={activityTypeColors}
                />
              ))
            ) : (
              <div className="card-elevated p-12 text-center">
                <MapPin className="w-12 h-12 mx-auto text-muted-foreground/40 mb-4" />
                <h3 className="font-semibold text-foreground mb-2">No stops added yet</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Start building your itinerary by adding your first destination
                </p>
                <Button onClick={() => setShowAddStop(true)} className="btn-gradient-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Stop
                </Button>
              </div>
            )}
          </SortableContext>
        </DndContext>
      </div>

      <AddStopModal tripId={tripId!} open={showAddStop} onOpenChange={setShowAddStop} />
      <AddActivityModal
        tripId={tripId!}
        stopId={activeStopId || ''}
        open={showAddActivity}
        onOpenChange={setShowAddActivity}
      />
    </motion.div>
  );
};

interface SortableStopProps {
  stop: Stop;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
  onRemove: () => void;
  onAddActivity: () => void;
  onRemoveActivity: (activityId: string) => void;
  activityTypeColors: Record<string, string>;
}

const SortableStop = ({
  stop,
  index,
  isExpanded,
  onToggle,
  onRemove,
  onAddActivity,
  onRemoveActivity,
  activityTypeColors,
}: SortableStopProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: stop.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={cn(
        "card-elevated overflow-hidden",
        isDragging && "opacity-50 shadow-lg"
      )}
    >
      {/* Stop Header */}
      <div className="flex items-center gap-3 p-4 bg-secondary/30">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-muted"
        >
          <GripVertical className="w-5 h-5 text-muted-foreground" />
        </button>
        
        <div className="w-10 h-10 rounded-full btn-gradient-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
          {index + 1}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-display font-bold text-lg text-foreground">{stop.city}</h3>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span>{stop.country}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {format(new Date(stop.arrivalDate), 'MMM d')} - {format(new Date(stop.departureDate), 'MMM d')}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {stop.activities.length} {stop.activities.length === 1 ? 'activity' : 'activities'}
          </span>
          <Button variant="ghost" size="icon" onClick={onRemove} className="text-muted-foreground hover:text-destructive">
            <Trash2 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onToggle}>
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Activities */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-3">
              {stop.activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 group"
                >
                  <div className="flex items-center gap-2 text-sm text-muted-foreground min-w-[70px]">
                    <Clock className="w-4 h-4" />
                    {activity.time}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground">{activity.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={cn(
                        "px-2 py-0.5 rounded-full text-xs font-medium border",
                        activityTypeColors[activity.type] || 'bg-muted text-muted-foreground'
                      )}>
                        {activity.type}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {Math.floor(activity.duration / 60)}h {activity.duration % 60}m
                      </span>
                      {activity.cost > 0 && (
                        <span className="text-xs text-muted-foreground">
                          ${activity.cost}
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemoveActivity(activity.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={onAddActivity}
                className="w-full border-dashed"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Activity
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ItineraryBuilder;
