import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { 
  TrendUp, 
  TrendDown,
  Users, 
  Coffee,
  Calendar,
  CurrencyDollar,
  ShoppingCart,
  Star,
  Globe,
  Clock,
  Target,
  Crown
} from '@phosphor-icons/react';

import { useAdmin } from '../hooks/useAdmin';
import { formatPrice } from '../lib/pricing';

export function BusinessAnalytics() {
  const { orders, customers, bookings } = useAdmin();

  // Calculate current period metrics (last 30 days)
  const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
  const recentOrders = orders.filter(order => order.timestamp > thirtyDaysAgo);
  const recentBookings = bookings.filter(booking => booking.timestamp > thirtyDaysAgo);

  // Revenue metrics
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const recentRevenue = recentOrders.reduce((sum, order) => sum + order.total, 0);
  const bookingRevenue = bookings.reduce((sum, booking) => sum + booking.total, 0);
  const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

  // Customer metrics
  const totalCustomers = customers.length;
  const gringoCustomers = customers.filter(c => c.isGringo).length;
  const localCustomers = totalCustomers - gringoCustomers;
  const gringoPercentage = totalCustomers > 0 ? (gringoCustomers / totalCustomers) * 100 : 0;

  // Popular items analysis
  const itemCounts: Record<string, number> = {};
  orders.forEach(order => {
    order.items.forEach(item => {
      itemCounts[item.itemId] = (itemCounts[item.itemId] || 0) + item.quantity;
    });
  });
  
  const popularItems = Object.entries(itemCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  // Time analysis
  const hourlyOrders: Record<number, number> = {};
  orders.forEach(order => {
    const hour = new Date(order.timestamp).getHours();
    hourlyOrders[hour] = (hourlyOrders[hour] || 0) + 1;
  });

  const peakHour = Object.entries(hourlyOrders)
    .sort(([,a], [,b]) => b - a)[0];

  // Growth calculations (compare with previous 30 days)
  const sixtyDaysAgo = Date.now() - (60 * 24 * 60 * 60 * 1000);
  const previousPeriodOrders = orders.filter(order => 
    order.timestamp > sixtyDaysAgo && order.timestamp <= thirtyDaysAgo
  );
  const previousRevenue = previousPeriodOrders.reduce((sum, order) => sum + order.total, 0);
  const revenueGrowth = previousRevenue > 0 ? ((recentRevenue - previousRevenue) / previousRevenue) * 100 : 0;

  const metrics = [
    {
      title: 'Total Revenue',
      value: formatPrice(totalRevenue),
      subtitle: `Last 30 days: ${formatPrice(recentRevenue)}`,
      icon: CurrencyDollar,
      color: 'text-green-500',
      growth: revenueGrowth,
      trend: revenueGrowth >= 0 ? 'up' : 'down'
    },
    {
      title: 'Total Orders',
      value: orders.length.toString(),
      subtitle: `Recent: ${recentOrders.length}`,
      icon: ShoppingCart,
      color: 'text-blue-500',
      progress: Math.min((recentOrders.length / 100) * 100, 100)
    },
    {
      title: 'Customers',
      value: totalCustomers.toString(),
      subtitle: `${gringoCustomers} gringos, ${localCustomers} locals`,
      icon: Users,
      color: 'text-purple-500',
      progress: gringoPercentage
    },
    {
      title: 'Service Bookings',
      value: bookings.length.toString(),
      subtitle: `Revenue: ${formatPrice(bookingRevenue)}`,
      icon: Calendar,
      color: 'text-orange-500',
      progress: Math.min((bookings.length / 50) * 100, 100)
    },
    {
      title: 'Avg Order Value',
      value: formatPrice(avgOrderValue),
      subtitle: 'Per transaction',
      icon: Target,
      color: 'text-cyan-500'
    },
    {
      title: 'Peak Hour',
      value: peakHour ? `${peakHour[0]}:00` : 'N/A',
      subtitle: peakHour ? `${peakHour[1]} orders` : 'No data',
      icon: Clock,
      color: 'text-yellow-500'
    }
  ];

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h2 className="text-4xl font-black nuclear-text">📊 Business Analytics</h2>
        <p className="text-xl text-electric-cyan">Real-time insights & performance metrics</p>
      </motion.div>

      {/* Key Metrics Grid */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {metrics.map((metric, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="nuclear-card h-full">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <metric.icon size={18} className={metric.color} />
                    {metric.title}
                  </CardTitle>
                  {metric.trend && (
                    <Badge className={`${
                      metric.trend === 'up' 
                        ? 'bg-green-500/20 text-green-500 border-green-500' 
                        : 'bg-red-500/20 text-red-500 border-red-500'
                    } nuclear-glow`}>
                      {metric.trend === 'up' ? <TrendUp size={12} /> : <TrendDown size={12} />}
                      {Math.abs(metric.growth || 0).toFixed(1)}%
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-3xl font-black nuclear-text">{metric.value}</div>
                <div className="text-sm text-muted-foreground">{metric.subtitle}</div>
                {metric.progress !== undefined && (
                  <div className="space-y-1">
                    <Progress value={metric.progress} className="h-1" />
                    <div className="text-xs text-muted-foreground">
                      {metric.progress.toFixed(1)}%
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Customer Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Customer Demographics */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="nuclear-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe size={20} className="text-nuclear-blue" />
                Customer Demographics
              </CardTitle>
              <CardDescription>Customer breakdown by origin</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Crown size={16} className="text-electric-cyan" />
                    <span className="font-medium">International Visitors</span>
                  </div>
                  <Badge className="bg-electric-cyan/20 text-electric-cyan border-electric-cyan nuclear-glow">
                    {gringoCustomers} ({gringoPercentage.toFixed(1)}%)
                  </Badge>
                </div>
                <Progress value={gringoPercentage} className="h-2" />
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🇨🇴</span>
                    <span className="font-medium">Local Customers</span>
                  </div>
                  <Badge className="bg-colombia-blue/20 text-colombia-blue border-colombia-blue nuclear-glow">
                    {localCustomers} ({(100 - gringoPercentage).toFixed(1)}%)
                  </Badge>
                </div>
                <Progress value={100 - gringoPercentage} className="h-2" />
              </div>

              <div className="pt-4 border-t">
                <div className="text-sm text-muted-foreground">
                  Average spending per customer type:
                </div>
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>International:</span>
                    <span className="font-mono">
                      {formatPrice(
                        gringoCustomers > 0 
                          ? customers
                              .filter(c => c.isGringo)
                              .reduce((sum, c) => sum + c.totalSpent, 0) / gringoCustomers
                          : 0
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Local:</span>
                    <span className="font-mono">
                      {formatPrice(
                        localCustomers > 0 
                          ? customers
                              .filter(c => !c.isGringo)
                              .reduce((sum, c) => sum + c.totalSpent, 0) / localCustomers
                          : 0
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Popular Items */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="nuclear-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star size={20} className="text-plasma-blue" />
                Top Selling Items
              </CardTitle>
              <CardDescription>Most popular menu items</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {popularItems.map(([itemId, count], index) => (
                  <div key={itemId} className="flex items-center gap-3 p-2 rounded-lg bg-muted/30">
                    <Badge className="bg-plasma-blue/20 text-plasma-blue border-plasma-blue nuclear-glow">
                      #{index + 1}
                    </Badge>
                    <div className="flex-1">
                      <div className="font-medium">Item ID: {itemId}</div>
                      <div className="text-sm text-muted-foreground">
                        Sold {count} times
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-nuclear-blue">{count}</div>
                      <div className="text-xs text-muted-foreground">units</div>
                    </div>
                  </div>
                ))}
                
                {popularItems.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Coffee size={48} className="mx-auto mb-2 opacity-50" />
                    <p>No sales data available yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}