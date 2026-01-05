import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Plane, Home, Utensils, Ticket } from 'lucide-react';

interface BudgetOverviewProps {
  transport?: number;
  stay?: number;
  food?: number;
  activities?: number;
}

const BudgetOverview = ({
  transport = 1200,
  stay = 900,
  food = 600,
  activities = 300,
}: BudgetOverviewProps) => {
  const total = transport + stay + food + activities;

  const data = [
    { name: 'Transport', value: transport, color: 'hsl(200, 80%, 50%)', icon: Plane },
    { name: 'Stay', value: stay, color: 'hsl(174, 62%, 45%)', icon: Home },
    { name: 'Food', value: food, color: 'hsl(15, 85%, 55%)', icon: Utensils },
    { name: 'Activities', value: activities, color: 'hsl(40, 95%, 55%)', icon: Ticket },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass dark:glass-dark rounded-2xl p-6 border border-white/20 dark:border-white/10"
    >
      <h3 className="font-display font-bold text-lg text-foreground mb-4">Budget Overview</h3>
      
      <div className="flex items-center gap-6">
        {/* Donut Chart */}
        <div className="relative w-40 h-40 flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={70}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload;
                    return (
                      <div className="glass dark:glass-dark rounded-lg px-3 py-2 border border-white/20">
                        <p className="text-sm font-medium text-foreground">{item.name}</p>
                        <p className="text-lg font-bold" style={{ color: item.color }}>
                          ${item.value.toLocaleString()}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          
          {/* Center Total */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xs text-muted-foreground uppercase tracking-wide">Total</span>
            <span className="text-xl font-display font-bold text-foreground">${total.toLocaleString()}</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-3">
          {data.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-3"
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${item.color}20` }}
              >
                <item.icon className="w-4 h-4" style={{ color: item.color }} />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">{item.name}</p>
                <p className="font-semibold text-foreground">${item.value.toLocaleString()}</p>
              </div>
              <span className="text-sm text-muted-foreground">
                {Math.round((item.value / total) * 100)}%
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default BudgetOverview;
