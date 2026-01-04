import React from 'react';
import { motion } from 'framer-motion';
import { Plus, MapPin, Calendar, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useTrips } from '@/contexts/TripContext';
import { useNavigate } from 'react-router-dom';
import TripCard from '@/components/trips/TripCard';
import DestinationCard from '@/components/trips/DestinationCard';
import { recommendedDestinations } from '@/data/mockData';
import { format } from 'date-fns';

const Dashboard = () => {
  const { user } = useAuth();
  const { trips } = useTrips();
  const navigate = useNavigate();

  const recentTrips = trips.slice(0, 3);
  const upcomingTrips = trips.filter(trip => new Date(trip.startDate) > new Date()).slice(0, 2);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 pt-12 lg:pt-0"
    >
      {/* Welcome Header */}
      <motion.div variants={itemVariants} className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-display font-bold text-foreground">
            Welcome back, {user?.name?.split(' ')[0] || 'Traveler'}!
          </h1>
          <p className="text-muted-foreground mt-1">
            Ready to plan your next adventure? Today is {format(new Date(), 'EEEE, MMMM do')}.
          </p>
        </div>
        <Button
          onClick={() => navigate('/trips/new')}
          className="btn-gradient-primary h-12 px-6 rounded-xl group"
        >
          <Plus className="w-5 h-5 mr-2" />
          Plan New Trip
          <Sparkles className="w-4 h-4 ml-2 opacity-70 group-hover:opacity-100 transition-opacity" />
        </Button>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={MapPin}
          label="Total Trips"
          value={trips.length.toString()}
          color="primary"
        />
        <StatCard
          icon={MapPin}
          label="Cities Visited"
          value={trips.reduce((acc, trip) => acc + trip.stops.length, 0).toString()}
          color="accent"
        />
        <StatCard
          icon={Calendar}
          label="Upcoming"
          value={upcomingTrips.length.toString()}
          color="tertiary"
        />
        <StatCard
          icon={Calendar}
          label="Days Traveled"
          value="32"
          color="success"
        />
      </motion.div>

      {/* Recent Trips */}
      <motion.section variants={itemVariants}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-display font-bold text-foreground">Recent Trips</h2>
          <Button
            variant="ghost"
            onClick={() => navigate('/trips')}
            className="text-primary hover:text-primary/80"
          >
            View All
          </Button>
        </div>
        {recentTrips.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {recentTrips.map((trip, index) => (
              <TripCard key={trip.id} trip={trip} index={index} />
            ))}
          </div>
        ) : (
          <div className="card-elevated p-8 text-center">
            <MapPin className="w-12 h-12 mx-auto text-muted-foreground/40 mb-4" />
            <h3 className="font-semibold text-foreground mb-2">No trips yet</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Start planning your first adventure!
            </p>
            <Button onClick={() => navigate('/trips/new')} className="btn-gradient-primary">
              Create Your First Trip
            </Button>
          </div>
        )}
      </motion.section>

      {/* Recommended Destinations */}
      <motion.section variants={itemVariants}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-display font-bold text-foreground">Recommended Destinations</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {recommendedDestinations.map((destination, index) => (
            <DestinationCard key={destination.id} destination={destination} index={index} />
          ))}
        </div>
      </motion.section>
    </motion.div>
  );
};

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  color: 'primary' | 'accent' | 'tertiary' | 'success';
}

const StatCard = ({ icon: Icon, label, value, color }: StatCardProps) => {
  const colorClasses = {
    primary: 'bg-primary/10 text-primary',
    accent: 'bg-accent/10 text-accent',
    tertiary: 'bg-tertiary/10 text-tertiary',
    success: 'bg-success/10 text-success',
  };

  return (
    <div className="card-elevated p-4">
      <div className={`w-10 h-10 rounded-lg ${colorClasses[color]} flex items-center justify-center mb-3`}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-2xl font-display font-bold text-foreground">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
};

export default Dashboard;
