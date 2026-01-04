import React from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, DollarSign, TrendingUp, Calendar, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTrips } from '@/contexts/TripContext';
import { format, differenceInDays } from 'date-fns';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const BudgetDashboard = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { trips } = useTrips();

  const trip = trips.find(t => t.id === tripId);

  if (!trip) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Trip not found</p>
      </div>
    );
  }

  const totalBudget = trip.budget.transport + trip.budget.stay + trip.budget.activities + trip.budget.meals;
  const tripDays = differenceInDays(new Date(trip.endDate), new Date(trip.startDate)) + 1;
  const avgCostPerDay = totalBudget / tripDays;

  const pieData = [
    { name: 'Transport', value: trip.budget.transport, color: 'hsl(174, 62%, 35%)' },
    { name: 'Accommodation', value: trip.budget.stay, color: 'hsl(200, 80%, 50%)' },
    { name: 'Activities', value: trip.budget.activities, color: 'hsl(15, 85%, 60%)' },
    { name: 'Meals', value: trip.budget.meals, color: 'hsl(40, 95%, 55%)' },
  ].filter(item => item.value > 0);

  const barData = trip.stops.map(stop => {
    const stopActivitiesCost = stop.activities.reduce((acc, a) => acc + a.cost, 0);
    return {
      city: stop.city,
      activities: stopActivitiesCost,
      estimate: stopActivitiesCost * 1.5, // Estimate for other expenses
    };
  });

  const budgetCategories = [
    { label: 'Transport', value: trip.budget.transport, icon: '✈️', color: 'bg-primary' },
    { label: 'Accommodation', value: trip.budget.stay, icon: '🏨', color: 'bg-tertiary' },
    { label: 'Activities', value: trip.budget.activities, icon: '🎯', color: 'bg-accent' },
    { label: 'Meals', value: trip.budget.meals, icon: '🍽️', color: 'bg-warning' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 pt-12 lg:pt-0"
    >
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(`/trips/${tripId}`)}
          className="rounded-full"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl lg:text-3xl font-display font-bold text-foreground">
            Budget Dashboard
          </h1>
          <p className="text-muted-foreground">{trip.name}</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-elevated p-5"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-primary" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">Total Budget</span>
          </div>
          <p className="text-3xl font-display font-bold text-foreground">${totalBudget.toLocaleString()}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="card-elevated p-5"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-accent" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">Avg per Day</span>
          </div>
          <p className="text-3xl font-display font-bold text-foreground">${avgCostPerDay.toFixed(0)}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-elevated p-5"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-tertiary/10 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-tertiary" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">Trip Duration</span>
          </div>
          <p className="text-3xl font-display font-bold text-foreground">{tripDays} days</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="card-elevated p-5"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-success" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">Destinations</span>
          </div>
          <p className="text-3xl font-display font-bold text-foreground">{trip.stops.length}</p>
        </motion.div>
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card-elevated p-6"
        >
          <h3 className="font-display font-bold text-lg text-foreground mb-4">Cost Breakdown</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="card-elevated p-6"
        >
          <h3 className="font-display font-bold text-lg text-foreground mb-4">Cost by Destination</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis dataKey="city" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip
                  formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="activities" name="Activities" fill="hsl(15, 85%, 60%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Budget Categories */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card-elevated p-6"
      >
        <h3 className="font-display font-bold text-lg text-foreground mb-4">Budget Categories</h3>
        <div className="space-y-4">
          {budgetCategories.map((category) => {
            const percentage = totalBudget > 0 ? (category.value / totalBudget) * 100 : 0;
            return (
              <div key={category.label} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{category.icon}</span>
                    <span className="font-medium text-foreground">{category.label}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-foreground">${category.value.toLocaleString()}</span>
                    <span className="text-sm text-muted-foreground ml-2">({percentage.toFixed(1)}%)</span>
                  </div>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className={`h-full ${category.color} rounded-full`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default BudgetDashboard;
