export interface Activity {
  id: string;
  name: string;
  type: 'sightseeing' | 'food' | 'adventure' | 'culture' | 'relaxation';
  time: string;
  duration: number; // in minutes
  cost: number;
  notes?: string;
}

export interface Stop {
  id: string;
  city: string;
  country: string;
  arrivalDate: string;
  departureDate: string;
  activities: Activity[];
  image?: string;
}

export interface Trip {
  id: string;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  coverPhoto?: string;
  stops: Stop[];
  budget: {
    transport: number;
    stay: number;
    activities: number;
    meals: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Destination {
  id: string;
  city: string;
  country: string;
  image: string;
  costIndex: 'budget' | 'moderate' | 'expensive';
  popularity: number;
  description: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  language: string;
  createdAt: string;
}
