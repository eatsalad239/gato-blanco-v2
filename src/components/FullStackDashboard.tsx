import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendUp,
  TrendDown,
  CurrencyDollar,
  Users,
  ShoppingCart,
  Calendar,
  Warning,
  CheckCircle,
  Clock,
  Package,
  ChartBar,
  ChartPie,
  Activity,
  Lightning,
  Star,
  CreditCard,
  DeviceMobile,
  Download,
  ArrowClockwise
} from '@phosphor-icons/react';

import { useBusiness } from '../lib/business';
import { usePayments } from '../lib/payments';
import { useLanguageStore } from '../lib/translations';
import { fullMenu } from '../data/content';
import { Customer, Order, Booking, Analytics } from '../types';

interface RealtimeStats {
  ordersToday: number;
  revenueToday: number;
  lowStockItems: string[];
  pendingOrders: number;
  activeBookings: number;
}

export function FullStackDashboard() {
  const business = useBusiness();
  const payments = usePayments();
  const { currentLanguage } = useLanguageStore();
  
  const [realtimeStats, setRealtimeStats] = useState<RealtimeStats | null>(null);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [paymentAnalytics, setPaymentAnalytics] = useState<any>(null);
  const [alerts, setAlerts] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<'day' | 'week' | 'month'>('day');
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Load dashboard data
  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [
        statsData,
        analyticsData,
        paymentData,
        alertsData,
        ordersData,
        bookingsData
      ] = await Promise.all([
        business.getRealtimeStats(),
        business.getAnalytics(selectedPeriod),
        payments.getPaymentAnalytics(selectedPeriod),
        business.checkAlerts(),
        business.getOrders({ dateFrom: Date.now() - 24 * 60 * 60 * 1000 }),
        business.getBookings()
      ]);

      setRealtimeStats(statsData);
      setAnalytics(analyticsData);
      setPaymentAnalytics(paymentData);
      setAlerts(alertsData);
      setOrders(ordersData);
      setBookings(bookingsData);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh data
  useEffect(() => {
    loadDashboardData();
    
    if (autoRefresh) {
      const interval = setInterval(loadDashboardData, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [selectedPeriod, autoRefresh]);

  // Generate business report
  const generateReport = async () => {
    setLoading(true);
    try {
      const report = await business.generateReport(selectedPeriod);
      
      // Create downloadable report
      const blob = new Blob([report], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `gato-blanco-report-${selectedPeriod}-${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to generate report:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number, currency: 'COP' | 'USD') => {
    return new Intl.NumberFormat(currentLanguage.code === 'es' ? 'es-CO' : 'en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const getMenuItemName = (itemId: string) => {
    const item = fullMenu.find(m => m.id === itemId);
    return item?.name[currentLanguage.code] || itemId;
  };

  return (
    <div className="space-y-8 p-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black nuclear-text">🚀 BUSINESS COMMAND CENTER</h1>
          <p className="text-electric-cyan font-medium">Real-time Operations Dashboard</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Select value={selectedPeriod} onValueChange={(value: 'day' | 'week' | 'month') => setSelectedPeriod(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Today</SelectItem>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="month">Month</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={autoRefresh ? 'bg-nuclear-blue/20' : ''}
          >
            <Activity size={16} className="mr-2" />
            Auto Refresh
          </Button>
          
          <Button variant="outline" size="sm" onClick={loadDashboardData} disabled={loading}>
            <ArrowClockwise size={16} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
          <Button variant="outline" size="sm" onClick={generateReport} disabled={loading}>
            <Download size={16} className="mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Alerts */}
      <AnimatePresence>
        {alerts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-2"
          >
            {alerts.map((alert, index) => (
              <Alert key={index} className="border-nuclear-blue bg-nuclear-blue/10">
                <Warning size={16} />
                <AlertDescription className="text-nuclear-blue font-medium">
                  {alert}
                </AlertDescription>
              </Alert>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Real-time Stats Grid */}
      {realtimeStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="nuclear-card">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Orders Today</CardTitle>
                  <ShoppingCart size={16} className="text-nuclear-blue" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold nuclear-text">{realtimeStats.ordersToday}</div>
                <Badge className="bg-green-500/20 text-green-400 mt-2">
                  <TrendUp size={12} className="mr-1" />
                  Active
                </Badge>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="nuclear-card">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Revenue Today</CardTitle>
                  <CurrencyDollar size={16} className="text-electric-cyan" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold nuclear-text">
                  {formatCurrency(realtimeStats.revenueToday, 'COP')}
                </div>
                <Badge className="bg-green-500/20 text-green-400 mt-2">
                  <TrendUp size={12} className="mr-1" />
                  Growing
                </Badge>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="nuclear-card">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
                  <Clock size={16} className="text-yellow-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold nuclear-text">{realtimeStats.pendingOrders}</div>
                <Badge className={`${realtimeStats.pendingOrders > 5 ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'} mt-2`}>
                  {realtimeStats.pendingOrders > 5 ? 'High' : 'Normal'}
                </Badge>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="nuclear-card">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
                  <Calendar size={16} className="text-plasma-blue" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold nuclear-text">{realtimeStats.activeBookings}</div>
                <Badge className="bg-blue-500/20 text-blue-400 mt-2">
                  Scheduled
                </Badge>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="nuclear-card">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
                  <Package size={16} className={realtimeStats.lowStockItems.length > 0 ? "text-red-400" : "text-green-400"} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold nuclear-text">{realtimeStats.lowStockItems.length}</div>
                <Badge className={`${realtimeStats.lowStockItems.length > 0 ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'} mt-2`}>
                  {realtimeStats.lowStockItems.length > 0 ? 'Attention' : 'Good'}
                </Badge>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}

      {/* Main Dashboard Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 nuclear-border">
          <TabsTrigger value="overview" className="nuclear-button">📊 Overview</TabsTrigger>
          <TabsTrigger value="orders" className="nuclear-button">🛒 Orders</TabsTrigger>
          <TabsTrigger value="customers" className="nuclear-button">👥 Customers</TabsTrigger>
          <TabsTrigger value="inventory" className="nuclear-button">📦 Inventory</TabsTrigger>
          <TabsTrigger value="payments" className="nuclear-button">💳 Payments</TabsTrigger>
          <TabsTrigger value="analytics" className="nuclear-button">📈 Analytics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {analytics && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Chart */}
              <Card className="nuclear-card">
                <CardHeader>
                  <CardTitle className="nuclear-text">💰 Revenue Analysis</CardTitle>
                  <CardDescription>Financial performance for {selectedPeriod}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Total Revenue</p>
                      <p className="text-2xl font-bold nuclear-text">
                        {formatCurrency(analytics.revenue.total, 'COP')}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">USD Revenue</p>
                      <p className="text-xl font-bold text-electric-cyan">
                        {formatCurrency(analytics.revenue.byCurrency.USD || 0, 'USD')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>COP Revenue</span>
                      <span className="font-medium">{Math.round((analytics.revenue.byCurrency.COP / analytics.revenue.total) * 100)}%</span>
                    </div>
                    <Progress value={(analytics.revenue.byCurrency.COP / analytics.revenue.total) * 100} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              {/* Customer Insights */}
              <Card className="nuclear-card">
                <CardHeader>
                  <CardTitle className="nuclear-text">👥 Customer Insights</CardTitle>
                  <CardDescription>Customer analytics for {selectedPeriod}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Total Customers</p>
                      <p className="text-2xl font-bold nuclear-text">{analytics.customers.total}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">New Customers</p>
                      <p className="text-xl font-bold text-electric-cyan">{analytics.customers.new}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Gringo Customers</span>
                      <span className="font-medium">{Math.round(analytics.customers.gringoPercentage)}%</span>
                    </div>
                    <Progress value={analytics.customers.gringoPercentage} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              {/* Top Selling Items */}
              <Card className="nuclear-card">
                <CardHeader>
                  <CardTitle className="nuclear-text">🔥 Top Selling Items</CardTitle>
                  <CardDescription>Best performers for {selectedPeriod}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analytics.topItems.slice(0, 5).map((item, index) => (
                      <div key={item.itemId} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge className="w-6 h-6 rounded-full flex items-center justify-center bg-nuclear-blue/20 text-nuclear-blue">
                            {index + 1}
                          </Badge>
                          <span className="font-medium">{getMenuItemName(item.itemId)}</span>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-electric-cyan">{item.quantity} sold</p>
                          <p className="text-sm text-muted-foreground">
                            {formatCurrency(item.revenue, 'COP')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method Breakdown */}
              {paymentAnalytics && (
                <Card className="nuclear-card">
                  <CardHeader>
                    <CardTitle className="nuclear-text">💳 Payment Methods</CardTitle>
                    <CardDescription>Payment breakdown for {selectedPeriod}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Total Volume</p>
                        <p className="text-2xl font-bold nuclear-text">
                          {formatCurrency(paymentAnalytics.totalVolume, 'COP')}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Success Rate</p>
                        <p className="text-xl font-bold text-electric-cyan">
                          {paymentAnalytics.successRate.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {Object.entries(paymentAnalytics.methodBreakdown).map(([method, amount]) => (
                        <div key={method} className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            {method === 'apple_pay' && <DeviceMobile size={16} />}
                            {method === 'card' && <CreditCard size={16} />}
                            <span className="capitalize">{method.replace('_', ' ')}</span>
                          </div>
                          <span className="font-medium">{formatCurrency(amount as number, 'COP')}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders" className="space-y-6">
          <Card className="nuclear-card">
            <CardHeader>
              <CardTitle className="nuclear-text">🛒 Recent Orders</CardTitle>
              <CardDescription>Latest orders and their status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orders.slice(0, 10).map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="space-y-1">
                      <p className="font-medium">Order #{order.id.slice(-8)}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.items.length} items • {formatCurrency(order.total, order.currency)}
                      </p>
                    </div>
                    <div className="text-right space-y-1">
                      <Badge className={
                        order.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                        order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-blue-500/20 text-blue-400'
                      }>
                        {order.status}
                      </Badge>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Other tabs would be implemented similarly... */}
        <TabsContent value="customers" className="space-y-6">
          <div className="text-center py-12">
            <Users size={48} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Customer Management</h3>
            <p className="text-muted-foreground">Detailed customer analytics and management tools coming soon...</p>
          </div>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-6">
          <div className="text-center py-12">
            <Package size={48} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Inventory Management</h3>
            <p className="text-muted-foreground">Real-time stock tracking and reorder alerts coming soon...</p>
          </div>
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          <div className="text-center py-12">
            <CreditCard size={48} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Payment Analytics</h3>
            <p className="text-muted-foreground">Detailed payment processing analytics coming soon...</p>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="text-center py-12">
            <ChartBar size={48} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Advanced Analytics</h3>
            <p className="text-muted-foreground">Comprehensive business intelligence dashboard coming soon...</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}