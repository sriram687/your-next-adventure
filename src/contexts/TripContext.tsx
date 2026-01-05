import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Trip, Stop, Activity } from '@/types/trip';
import { mockTrips } from '@/data/mockData';

interface TripContextType {
  trips: Trip[];
  currentTrip: Trip | null;
  setCurrentTrip: (trip: Trip | null) => void;
  createTrip: (trip: Omit<Trip, 'id' | 'createdAt' | 'updatedAt'>) => Trip;
  addTrip: (trip: Trip) => void;
  updateTrip: (id: string, updates: Partial<Trip>) => void;
  deleteTrip: (id: string) => void;
  addStop: (tripId: string, stop: Omit<Stop, 'id'>) => void;
  updateStop: (tripId: string, stopId: string, updates: Partial<Stop>) => void;
  removeStop: (tripId: string, stopId: string) => void;
  reorderStops: (tripId: string, stops: Stop[]) => void;
  addActivity: (tripId: string, stopId: string, activity: Omit<Activity, 'id'>) => void;
  removeActivity: (tripId: string, stopId: string, activityId: string) => void;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

export const TripProvider = ({ children }: { children: ReactNode }) => {
  const [trips, setTrips] = useState<Trip[]>(mockTrips);
  const [currentTrip, setCurrentTrip] = useState<Trip | null>(null);

  const createTrip = (tripData: Omit<Trip, 'id' | 'createdAt' | 'updatedAt'>): Trip => {
    const newTrip: Trip = {
      ...tripData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTrips(prev => [...prev, newTrip]);
    return newTrip;
  };

  const addTrip = (trip: Trip) => {
    setTrips(prev => [...prev, trip]);
  };

  const updateTrip = (id: string, updates: Partial<Trip>) => {
    setTrips(prev =>
      prev.map(trip =>
        trip.id === id ? { ...trip, ...updates, updatedAt: new Date().toISOString() } : trip
      )
    );
  };

  const deleteTrip = (id: string) => {
    setTrips(prev => prev.filter(trip => trip.id !== id));
  };

  const addStop = (tripId: string, stop: Omit<Stop, 'id'>) => {
    const newStop: Stop = { ...stop, id: Date.now().toString() };
    setTrips(prev =>
      prev.map(trip =>
        trip.id === tripId
          ? { ...trip, stops: [...trip.stops, newStop], updatedAt: new Date().toISOString() }
          : trip
      )
    );
  };

  const updateStop = (tripId: string, stopId: string, updates: Partial<Stop>) => {
    setTrips(prev =>
      prev.map(trip =>
        trip.id === tripId
          ? {
              ...trip,
              stops: trip.stops.map(stop =>
                stop.id === stopId ? { ...stop, ...updates } : stop
              ),
              updatedAt: new Date().toISOString(),
            }
          : trip
      )
    );
  };

  const removeStop = (tripId: string, stopId: string) => {
    setTrips(prev =>
      prev.map(trip =>
        trip.id === tripId
          ? { ...trip, stops: trip.stops.filter(s => s.id !== stopId), updatedAt: new Date().toISOString() }
          : trip
      )
    );
  };

  const reorderStops = (tripId: string, stops: Stop[]) => {
    setTrips(prev =>
      prev.map(trip =>
        trip.id === tripId ? { ...trip, stops, updatedAt: new Date().toISOString() } : trip
      )
    );
  };

  const addActivity = (tripId: string, stopId: string, activity: Omit<Activity, 'id'>) => {
    const newActivity: Activity = { ...activity, id: Date.now().toString() };
    setTrips(prev =>
      prev.map(trip =>
        trip.id === tripId
          ? {
              ...trip,
              stops: trip.stops.map(stop =>
                stop.id === stopId
                  ? { ...stop, activities: [...stop.activities, newActivity] }
                  : stop
              ),
              updatedAt: new Date().toISOString(),
            }
          : trip
      )
    );
  };

  const removeActivity = (tripId: string, stopId: string, activityId: string) => {
    setTrips(prev =>
      prev.map(trip =>
        trip.id === tripId
          ? {
              ...trip,
              stops: trip.stops.map(stop =>
                stop.id === stopId
                  ? { ...stop, activities: stop.activities.filter(a => a.id !== activityId) }
                  : stop
              ),
              updatedAt: new Date().toISOString(),
            }
          : trip
      )
    );
  };

  return (
    <TripContext.Provider
      value={{
        trips,
        currentTrip,
        setCurrentTrip,
        createTrip,
        addTrip,
        updateTrip,
        deleteTrip,
        addStop,
        updateStop,
        removeStop,
        reorderStops,
        addActivity,
        removeActivity,
      }}
    >
      {children}
    </TripContext.Provider>
  );
};

export const useTrips = () => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTrips must be used within a TripProvider');
  }
  return context;
};
