import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, MapPin, Calendar, Sparkles, Search, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useTrips } from '@/contexts/TripContext';
import { useNavigate } from 'react-router-dom';
import TripCard from '@/components/trips/TripCard';
import DestinationCard from '@/components/trips/DestinationCard';
import BudgetOverview from '@/components/budget/BudgetOverview';
import SmartSearchModal from '@/components/search/SmartSearchModal';
import { recommendedDestinations } from '@/data/mockData';
import { format } from 'date-fns';
import PageTransition from '@/components/layout/PageTransition';

const Dashboard = () => {
  const { user } = useAuth();
  const { trips } = useTrips();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);

  // Ensure trips is always an array
  const safeTrips = trips || [];
  const recentTrips = safeTrips.slice(0, 6);
  const upcomingTrips = safeTrips.filter(trip => new Date(trip.startDate) > new Date()).slice(0, 2);

  // Calculate total budget across all trips
  const totalBudget = safeTrips.reduce((acc, trip) => ({
    transport: acc.transport + trip.budget.transport,
    stay: acc.stay + trip.budget.stay,
    food: acc.food + trip.budget.meals,
    activities: acc.activities + trip.budget.activities,
  }), { transport: 0, stay: 0, food: 0, activities: 0 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <PageTransition>
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
              Welcome back, <span className="text-gradient-primary">{user?.name?.split(' ')[0] || 'Traveler'}</span>!
            </h1>
            <p className="text-muted-foreground mt-1">
              Ready to plan your next adventure? Today is {format(new Date(), 'EEEE, MMMM do')}.
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setSearchOpen(true)}
              className="glass dark:glass-dark border-white/20 btn-press"
            >
              <Search className="w-4 h-4 mr-2" />
              Search Cities
            </Button>
            <Button
              onClick={() => navigate('/trips/new')}
              className="btn-gradient-primary h-12 px-6 rounded-xl group"
            >
              <Plus className="w-5 h-5 mr-2" />
              Plan New Trip
              <Sparkles className="w-4 h-4 ml-2 opacity-70 group-hover:opacity-100 transition-opacity" />
            </Button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={MapPin}
            label="Total Trips"
            value={safeTrips.length.toString()}
            color="primary"
            delay={0}
          />
          <StatCard
            icon={MapPin}
            label="Cities Visited"
            value={safeTrips.reduce((acc, trip) => acc + trip.stops.length, 0).toString()}
            color="accent"
            delay={1}
          />
          <StatCard
            icon={Calendar}
            label="Upcoming"
            value={upcomingTrips.length.toString()}
            color="tertiary"
            delay={2}
          />
          <StatCard
            icon={TrendingUp}
            label="Days Traveled"
            value="32"
            color="success"
            delay={3}
          />
        </motion.div>

        {/* Budget Overview */}
        <motion.div variants={itemVariants}>
          <BudgetOverview
            transport={totalBudget.transport}
            stay={totalBudget.stay}
            food={totalBudget.food}
            activities={totalBudget.activities}
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
            <motion.div 
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-5"
              variants={containerVariants}
            >
              {recentTrips.map((trip, index) => (
                <TripCard key={trip.id} trip={trip} index={index} />
              ))}
            </motion.div>
          ) : (
            <div className="glass-card p-8 text-center">
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
            {recommendedDestinations.slice(0, 8).map((destination, index) => (
              <DestinationCard key={destination.id} destination={destination} index={index} />
            ))}
          </div>
        </motion.section>

        <SmartSearchModal open={searchOpen} onOpenChange={setSearchOpen} />
      </motion.div>
    </PageTransition>
  );
};

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  color: 'primary' | 'accent' | 'tertiary' | 'success';
  delay: number;
}

const StatCard = ({ icon: Icon, label, value, color, delay }: StatCardProps) => {
  const colorClasses = {
    primary: 'bg-primary/10 text-primary',
    accent: 'bg-accent/10 text-accent',
    tertiary: 'bg-tertiary/10 text-tertiary',
    success: 'bg-success/10 text-success',
  };

  return (
    <motion.div 
      className="glass-card p-4"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: delay * 0.1 }}
      whileHover={{ scale: 1.02 }}
    >
      <div className={`w-10 h-10 rounded-lg ${colorClasses[color]} flex items-center justify-center mb-3`}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-2xl font-display font-bold text-foreground">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </motion.div>
  );
};

export default Dashboard;
