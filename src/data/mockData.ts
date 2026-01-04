import { Trip, Destination, User } from '@/types/trip';
import santoriniImg from '@/assets/destinations/santorini.jpg';
import tokyoImg from '@/assets/destinations/tokyo.jpg';
import baliImg from '@/assets/destinations/bali.jpg';
import machuPicchuImg from '@/assets/destinations/machu-picchu.jpg';

export const mockUser: User = {
  id: '1',
  name: 'Alex Wanderer',
  email: 'alex@globetrotter.com',
  avatar: undefined,
  language: 'en',
  createdAt: '2024-01-15',
};

export const mockTrips: Trip[] = [
  {
    id: '1',
    name: 'European Adventure',
    description: 'Exploring the best of Western Europe',
    startDate: '2024-06-15',
    endDate: '2024-07-01',
    coverPhoto: santoriniImg,
    stops: [
      {
        id: 's1',
        city: 'Paris',
        country: 'France',
        arrivalDate: '2024-06-15',
        departureDate: '2024-06-20',
        activities: [
          { id: 'a1', name: 'Eiffel Tower Visit', type: 'sightseeing', time: '10:00', duration: 180, cost: 25 },
          { id: 'a2', name: 'Louvre Museum', type: 'culture', time: '14:00', duration: 240, cost: 17 },
          { id: 'a3', name: 'Seine River Cruise', type: 'relaxation', time: '19:00', duration: 90, cost: 45 },
        ],
      },
      {
        id: 's2',
        city: 'Barcelona',
        country: 'Spain',
        arrivalDate: '2024-06-20',
        departureDate: '2024-06-25',
        activities: [
          { id: 'a4', name: 'Sagrada Familia', type: 'sightseeing', time: '09:00', duration: 150, cost: 26 },
          { id: 'a5', name: 'La Boqueria Market', type: 'food', time: '12:00', duration: 120, cost: 30 },
        ],
      },
      {
        id: 's3',
        city: 'Rome',
        country: 'Italy',
        arrivalDate: '2024-06-25',
        departureDate: '2024-07-01',
        activities: [
          { id: 'a6', name: 'Colosseum Tour', type: 'sightseeing', time: '10:00', duration: 180, cost: 16 },
          { id: 'a7', name: 'Vatican Museums', type: 'culture', time: '14:00', duration: 240, cost: 20 },
        ],
      },
    ],
    budget: { transport: 850, stay: 1200, activities: 350, meals: 600 },
    createdAt: '2024-03-10',
    updatedAt: '2024-03-12',
  },
  {
    id: '2',
    name: 'Japan Discovery',
    description: 'From ancient temples to neon cities',
    startDate: '2024-09-01',
    endDate: '2024-09-14',
    coverPhoto: tokyoImg,
    stops: [
      {
        id: 's4',
        city: 'Tokyo',
        country: 'Japan',
        arrivalDate: '2024-09-01',
        departureDate: '2024-09-07',
        activities: [
          { id: 'a8', name: 'Shibuya Crossing Experience', type: 'sightseeing', time: '18:00', duration: 60, cost: 0 },
          { id: 'a9', name: 'Tsukiji Fish Market', type: 'food', time: '06:00', duration: 180, cost: 50 },
        ],
      },
      {
        id: 's5',
        city: 'Kyoto',
        country: 'Japan',
        arrivalDate: '2024-09-07',
        departureDate: '2024-09-14',
        activities: [
          { id: 'a10', name: 'Fushimi Inari Shrine', type: 'culture', time: '07:00', duration: 180, cost: 0 },
          { id: 'a11', name: 'Traditional Tea Ceremony', type: 'culture', time: '15:00', duration: 90, cost: 35 },
        ],
      },
    ],
    budget: { transport: 1200, stay: 1800, activities: 200, meals: 800 },
    createdAt: '2024-02-20',
    updatedAt: '2024-02-25',
  },
  {
    id: '3',
    name: 'Bali Retreat',
    description: 'Wellness and adventure in paradise',
    startDate: '2024-11-10',
    endDate: '2024-11-20',
    coverPhoto: baliImg,
    stops: [
      {
        id: 's6',
        city: 'Ubud',
        country: 'Indonesia',
        arrivalDate: '2024-11-10',
        departureDate: '2024-11-15',
        activities: [
          { id: 'a12', name: 'Rice Terrace Sunrise Trek', type: 'adventure', time: '05:00', duration: 240, cost: 40 },
          { id: 'a13', name: 'Balinese Cooking Class', type: 'food', time: '10:00', duration: 240, cost: 55 },
        ],
      },
      {
        id: 's7',
        city: 'Seminyak',
        country: 'Indonesia',
        arrivalDate: '2024-11-15',
        departureDate: '2024-11-20',
        activities: [
          { id: 'a14', name: 'Sunset Beach Yoga', type: 'relaxation', time: '17:00', duration: 90, cost: 20 },
          { id: 'a15', name: 'Surfing Lesson', type: 'adventure', time: '08:00', duration: 180, cost: 45 },
        ],
      },
    ],
    budget: { transport: 400, stay: 900, activities: 300, meals: 400 },
    createdAt: '2024-04-01',
    updatedAt: '2024-04-05',
  },
];

export const recommendedDestinations: Destination[] = [
  {
    id: 'd1',
    city: 'Santorini',
    country: 'Greece',
    image: santoriniImg,
    costIndex: 'expensive',
    popularity: 95,
    description: 'Iconic white-washed buildings and stunning sunsets',
  },
  {
    id: 'd2',
    city: 'Tokyo',
    country: 'Japan',
    image: tokyoImg,
    costIndex: 'moderate',
    popularity: 92,
    description: 'Where ancient traditions meet cutting-edge technology',
  },
  {
    id: 'd3',
    city: 'Bali',
    country: 'Indonesia',
    image: baliImg,
    costIndex: 'budget',
    popularity: 88,
    description: 'Tropical paradise with rich culture and adventure',
  },
  {
    id: 'd4',
    city: 'Machu Picchu',
    country: 'Peru',
    image: machuPicchuImg,
    costIndex: 'moderate',
    popularity: 90,
    description: 'Ancient Incan citadel high in the Andes mountains',
  },
];
