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
import { toast } from 'sonner';
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
import {
  InventoryManager,
  InventoryTable,
  PaymentTransactionList,
  RevenueChart,
  CustomerAnalysisChart,
  PerformanceMetrics
} from './ManagementComponents';

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
      // Initialize demo data if none exists
      await initializeDemoData();
      
      const [
        statsData,
        analyticsData,
        paymentData,
        alertsData,
        ordersData,
        bookingsData,
        customersData
      ] = await Promise.all([
        business.getRealtimeStats(),
        business.getAnalytics(selectedPeriod),
        payments.getPaymentAnalytics(selectedPeriod),
        business.checkAlerts(),
        business.getOrders({ dateFrom: Date.now() - 24 * 60 * 60 * 1000 }),
        business.getBookings(),
        business.generateCustomerReport()
      ]);

      setRealtimeStats(statsData);
      setAnalytics(analyticsData);
      setPaymentAnalytics(paymentData);
      setAlerts(alertsData);
      setOrders(ordersData);
      setBookings(bookingsData);
      setCustomers(customersData);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initialize demo data for a functional dashboard
  const initializeDemoData = async () => {
    const existingInventory = await business.getInventory();
    
    if (existingInventory.length === 0) {
      // Create demo inventory for some menu items
      const demoItems = [
        { itemId: 'coffee_americano', quantity: 45, cost: 2500 },
        { itemId: 'coffee_latte', quantity: 8, cost: 3000 }, // Low stock
        { itemId: 'cocktail_mojito', quantity: 25, cost: 8000 },
        { itemId: 'beer_corona', quantity: 5, cost: 4000 }, // Low stock
        { itemId: 'food_arepa', quantity: 30, cost: 3500 }
      ];

      for (const item of demoItems) {
        await business.restockItem(item.itemId, item.quantity, item.cost);
      }
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

  // Generate AI-powered business insights
  const generateBusinessInsights = async () => {
    try {
      const stats = await business.getRealtimeStats();
      const analytics = await business.getAnalytics(selectedPeriod);
      
      const prompt = (window as any).spark.llmPrompt`
You are a business consultant for Gato Blanco Café in Zona Rosa, Medellín.

Current Data:
- Orders today: ${stats.ordersToday}
- Revenue today: ${stats.revenueToday} COP
- Low stock items: ${stats.lowStockItems.length}
- Total customers: ${analytics.customers.total}
- Gringo percentage: ${analytics.customers.gringoPercentage}%

Based on this data, provide 3 specific, actionable business insights that could improve operations, increase revenue, or enhance customer experience. Focus on practical recommendations for a Colombian coffee shop that serves both locals and tourists.

Keep insights concise and specific to the current situation.
`;
      
      return await (window as any).spark.llm(prompt);
    } catch (error) {
      return 'Unable to generate insights at this time. Please try again later.';
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
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={async () => {
              const insights = await generateBusinessInsights();
              alert(insights);
            }}
            disabled={loading}
          >
            <Lightning size={16} className="mr-2" />
            AI Insights
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

          <TabsContent value="orders" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Order Stats */}
              <Card className="nuclear-card">
                <CardHeader>
                  <CardTitle className="nuclear-text">🛒 Order Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Total Orders</span>
                      <span className="font-bold text-nuclear-blue">{orders.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Completed</span>
                      <span className="font-bold text-green-400">
                        {orders.filter(o => o.status === 'completed').length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pending</span>
                      <span className="font-bold text-yellow-400">
                        {orders.filter(o => o.status === 'pending').length}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Completion Rate</span>
                      <span className="font-medium">
                        {orders.length > 0 ? 
                          Math.round((orders.filter(o => o.status === 'completed').length / orders.length) * 100) 
                          : 0}%
                      </span>
                    </div>
                    <Progress 
                      value={orders.length > 0 ? 
                        (orders.filter(o => o.status === 'completed').length / orders.length) * 100 
                        : 0} 
                      className="h-2" 
                    />
                  </div>

                  <Button 
                    className="w-full nuclear-button"
                    onClick={async () => {
                      // Create a demo order to show functionality
                      const newOrder = await business.createOrder({
                        customerId: 'demo_customer',
                        items: [
                          { itemId: 'coffee_americano', quantity: 2, price: 8000 },
                          { itemId: 'food_arepa', quantity: 1, price: 6000 }
                        ],
                        total: 14000,
                        currency: 'COP',
                        status: 'pending',
                        type: 'pickup'
                      });
                      await loadDashboardData();
                      toast.success('Demo order created!');
                    }}
                  >
                    <ShoppingCart size={16} className="mr-2" />
                    Create Demo Order
                  </Button>
                </CardContent>
              </Card>

              {/* Recent Orders */}
              <Card className="nuclear-card lg:col-span-2">
                <CardHeader>
                  <CardTitle className="nuclear-text">📋 Recent Orders</CardTitle>
                  <CardDescription>Latest order activity</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-80 overflow-y-auto">
                    {orders.slice(0, 10).map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                        <div className="space-y-1">
                          <p className="font-medium">Order #{order.id.slice(-8)}</p>
                          <p className="text-sm text-muted-foreground">
                            {order.items.length} items • {order.type}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(order.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right space-y-1">
                          <p className="font-bold text-electric-cyan">
                            {formatCurrency(order.total, order.currency)}
                          </p>
                          <Badge className={
                            order.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                            order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-blue-500/20 text-blue-400'
                          }>
                            {order.status}
                          </Badge>
                          <div className="flex gap-1 mt-1">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={async () => {
                                await business.updateOrderStatus(order.id, 'completed');
                                await loadDashboardData();
                                toast.success('Order completed!');
                              }}
                              disabled={order.status === 'completed'}
                            >
                              <CheckCircle size={12} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {orders.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <ShoppingCart size={48} className="mx-auto mb-4 opacity-50" />
                        <p>No orders yet. Create a demo order to get started!</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

        {/* Customers Tab */}
        <TabsContent value="customers" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Customer Stats */}
            <Card className="nuclear-card">
              <CardHeader>
                <CardTitle className="nuclear-text">👥 Customer Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Total Customers</span>
                    <span className="font-bold text-nuclear-blue">{customers.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Gringo Customers</span>
                    <span className="font-bold text-electric-cyan">
                      {customers.filter(c => c.isGringo).length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>VIP Customers</span>
                    <span className="font-bold text-plasma-blue">
                      {customers.filter(c => c.totalSpent > 500000).length}
                    </span>
                  </div>
                </div>
                
                <Button 
                  className="w-full nuclear-button"
                  onClick={async () => {
                    const newCustomers = await business.generateCustomerReport();
                    setCustomers(newCustomers);
                  }}
                >
                  <Users size={16} className="mr-2" />
                  Generate Customer Report
                </Button>
              </CardContent>
            </Card>

            {/* Top Customers */}
            <Card className="nuclear-card lg:col-span-2">
              <CardHeader>
                <CardTitle className="nuclear-text">🏆 Top Customers</CardTitle>
                <CardDescription>Highest spending customers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {customers
                    .sort((a, b) => b.totalSpent - a.totalSpent)
                    .slice(0, 5)
                    .map((customer, index) => (
                      <div key={customer.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Badge className="w-8 h-8 rounded-full flex items-center justify-center bg-nuclear-blue/20 text-nuclear-blue">
                            {index + 1}
                          </Badge>
                          <div>
                            <p className="font-medium">{customer.name}</p>
                            <p className="text-sm text-muted-foreground">{customer.email}</p>
                          </div>
                          {customer.isGringo && (
                            <Badge className="bg-plasma-blue/20 text-plasma-blue">GRINGO</Badge>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-electric-cyan">
                            {formatCurrency(customer.totalSpent, 'COP')}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {customer.orders.length} orders
                          </p>
                        </div>
                      </div>
                    ))
                  }
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Inventory Tab */}
        <TabsContent value="inventory" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Inventory Stats */}
            <Card className="nuclear-card">
              <CardHeader>
                <CardTitle className="nuclear-text">📦 Inventory Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <InventoryManager />
              </CardContent>
            </Card>

            {/* Inventory Items */}
            <Card className="nuclear-card lg:col-span-3">
              <CardHeader>
                <CardTitle className="nuclear-text">📋 Stock Levels</CardTitle>
                <CardDescription>Current inventory status</CardDescription>
              </CardHeader>
              <CardContent>
                <InventoryTable />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Payments Tab */}
        <TabsContent value="payments" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Payment Stats */}
            <Card className="nuclear-card">
              <CardHeader>
                <CardTitle className="nuclear-text">💳 Payment Analytics</CardTitle>
                <CardDescription>Payment processing insights</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {paymentAnalytics && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Success Rate</p>
                        <p className="text-2xl font-bold nuclear-text">
                          {paymentAnalytics.successRate.toFixed(1)}%
                        </p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Failed Payments</p>
                        <p className="text-xl font-bold text-red-400">
                          {paymentAnalytics.failedCount || 0}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Apple Pay</span>
                        <span className="font-medium">
                          {Math.round(((paymentAnalytics.methodBreakdown.apple_pay || 0) / paymentAnalytics.totalVolume) * 100)}%
                        </span>
                      </div>
                      <Progress 
                        value={((paymentAnalytics.methodBreakdown.apple_pay || 0) / paymentAnalytics.totalVolume) * 100} 
                        className="h-2" 
                      />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Recent Transactions */}
            <Card className="nuclear-card">
              <CardHeader>
                <CardTitle className="nuclear-text">🧾 Recent Payments</CardTitle>
                <CardDescription>Latest payment transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <PaymentTransactionList />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Trends */}
            <Card className="nuclear-card">
              <CardHeader>
                <CardTitle className="nuclear-text">📈 Revenue Trends</CardTitle>
                <CardDescription>Financial performance over time</CardDescription>
              </CardHeader>
              <CardContent>
                <RevenueChart analytics={analytics} />
              </CardContent>
            </Card>

            {/* Customer Analysis */}
            <Card className="nuclear-card">
              <CardHeader>
                <CardTitle className="nuclear-text">👥 Customer Analysis</CardTitle>
                <CardDescription>Customer behavior insights</CardDescription>
              </CardHeader>
              <CardContent>
                <CustomerAnalysisChart customers={customers} />
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card className="nuclear-card lg:col-span-2">
              <CardHeader>
                <CardTitle className="nuclear-text">⚡ Performance Metrics</CardTitle>
                <CardDescription>Key business performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <PerformanceMetrics analytics={analytics} orders={orders} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}