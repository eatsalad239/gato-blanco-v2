import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ChartBar, 
  Users, 
  ShoppingCart, 
  Calendar,
  CurrencyDollar,
  TrendUp,
  Coffee,
  Star,
  Download,
  Warning,
  Clock,
  Wine,
  Package
} from '@phosphor-icons/react';
import { useLanguageStore, translations } from '../lib/translations';
import { useKV } from '@github/spark/hooks';
import { Customer, Order, Booking, Analytics, Inventory } from '../types';
import { formatPrice } from '../lib/pricing';
import { fullMenu, services, upcomingEvents } from '../data/content';

interface DashboardStats {
  totalCustomers: number;
  totalOrders: number;
  totalBookings: number;
  totalRevenue: number;
  gringoRevenue: number;
  localRevenue: number;
  avgOrderValue: number;
  eventRevenue: number;
  topSellingItems: { itemId: string; name: string; count: number; revenue: number }[];
  lowStockItems: { itemId: string; name: string; current: number; minimum: number }[];
  recentActivity: { type: string; description: string; timestamp: number; amount?: number }[];
}

export const EnhancedAdminDashboard: React.FC = () => {
  const { currentLanguage } = useLanguageStore();
  const t = translations[currentLanguage.code];
  
  const [customers] = useKV<Customer[]>('admin-customers', []);
  const [orders] = useKV<Order[]>('admin-orders', []);
  const [bookings] = useKV<Booking[]>('admin-bookings', []);
  const [inventory] = useKV<Inventory[]>('admin-inventory', []);
  const [activeTab, setActiveTab] = useState('overview');

  // Calculate comprehensive stats
  const stats: DashboardStats = useMemo(() => {
    const totalCustomers = customers?.length || 0;
    const totalOrders = orders?.length || 0;
    const totalBookings = bookings?.length || 0;
    
    const totalOrderRevenue = orders?.reduce((sum, order) => sum + order.total, 0) || 0;
    const totalBookingRevenue = bookings?.reduce((sum, booking) => sum + booking.total, 0) || 0;
    const totalRevenue = totalOrderRevenue + totalBookingRevenue;
    
    const gringoOrders = orders?.filter(order => order.customerId.includes('gringo')) || [];
    const gringoBookings = bookings?.filter(booking => booking.customerId.includes('gringo')) || [];
    const gringoRevenue = 
      gringoOrders.reduce((sum, order) => sum + order.total, 0) +
      gringoBookings.reduce((sum, booking) => sum + booking.total, 0);
    
    const localRevenue = totalRevenue - gringoRevenue;
    const avgOrderValue = totalOrders > 0 ? totalOrderRevenue / totalOrders : 0;
    
    // Calculate top selling items
    const itemCounts: Record<string, { count: number; revenue: number; name: string }> = {};
    orders?.forEach(order => {
      order.items.forEach(item => {
        const menuItem = fullMenu.find(m => m.id === item.itemId);
        if (menuItem) {
          if (!itemCounts[item.itemId]) {
            itemCounts[item.itemId] = { 
              count: 0, 
              revenue: 0, 
              name: menuItem.name[currentLanguage.code] 
            };
          }
          itemCounts[item.itemId].count += item.quantity;
          itemCounts[item.itemId].revenue += item.price * item.quantity;
        }
      });
    });
    
    const topSellingItems = Object.entries(itemCounts)
      .map(([itemId, data]) => ({ itemId, ...data }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // Calculate low stock items
    const lowStockItems = inventory?.filter(item => item.quantity <= item.minStock)
      .map(item => {
        const menuItem = fullMenu.find(m => m.id === item.itemId);
        return {
          itemId: item.itemId,
          name: menuItem?.name[currentLanguage.code] || 'Unknown',
          current: item.quantity,
          minimum: item.minStock
        };
      }) || [];

    // Recent activity
    const recentActivity = [
      ...orders?.slice(-5).map(order => ({
        type: 'order',
        description: `New order #${order.id.slice(-4)}`,
        timestamp: order.timestamp,
        amount: order.total
      })) || [],
      ...bookings?.slice(-5).map(booking => ({
        type: 'booking',
        description: `Service booking #${booking.id.slice(-4)}`,
        timestamp: booking.timestamp,
        amount: booking.total
      })) || []
    ].sort((a, b) => b.timestamp - a.timestamp).slice(0, 10);

    return {
      totalCustomers,
      totalOrders,
      totalBookings,
      totalRevenue,
      gringoRevenue,
      localRevenue,
      avgOrderValue,
      eventRevenue: totalBookingRevenue,
      topSellingItems,
      lowStockItems,
      recentActivity
    };
  }, [customers, orders, bookings, inventory, currentLanguage.code]);

  const exportData = () => {
    const data = {
      customers,
      orders,
      bookings,
      stats,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gato-blanco-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t.admin.title}</h1>
          <p className="text-muted-foreground">Complete business management for Gato Blanco</p>
        </div>
        <Button onClick={exportData} className="gap-2">
          <Download size={16} />
          {t.admin.exportData}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6 lg:w-auto lg:inline-grid">
          <TabsTrigger value="overview">{t.admin.overview}</TabsTrigger>
          <TabsTrigger value="customers">{t.admin.customers}</TabsTrigger>
          <TabsTrigger value="orders">{t.admin.orders}</TabsTrigger>
          <TabsTrigger value="events">{t.admin.events}</TabsTrigger>
          <TabsTrigger value="inventory">{t.admin.inventory}</TabsTrigger>
          <TabsTrigger value="analytics">{t.admin.analytics}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <CurrencyDollar size={16} className="text-primary" />
                  {t.admin.revenue}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">
                  {formatPrice(stats.totalRevenue)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Avg order: {formatPrice(stats.avgOrderValue)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Users size={16} className="text-accent" />
                  {t.admin.customers}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-accent">
                  {stats.totalCustomers}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {Math.round((stats.gringoRevenue / stats.totalRevenue) * 100)}% gringo revenue
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <ShoppingCart size={16} className="text-secondary" />
                  {t.admin.orders}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-secondary">
                  {stats.totalOrders}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.totalBookings} service bookings
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Calendar size={16} className="text-purple-500" />
                  Events Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-500">
                  {formatPrice(stats.eventRevenue)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {upcomingEvents.length} upcoming events
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity & Top Items */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock size={20} />
                  {t.admin.recentOrders}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats.recentActivity.length === 0 ? (
                    <p className="text-muted-foreground text-sm">No recent activity</p>
                  ) : (
                    stats.recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                        <div>
                          <p className="text-sm font-medium">{activity.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(activity.timestamp).toLocaleString()}
                          </p>
                        </div>
                        {activity.amount && (
                          <Badge variant="outline">
                            {formatPrice(activity.amount)}
                          </Badge>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendUp size={20} />
                  {t.admin.topItems}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats.topSellingItems.length === 0 ? (
                    <p className="text-muted-foreground text-sm">No sales data yet</p>
                  ) : (
                    stats.topSellingItems.map((item, index) => (
                      <div key={item.itemId} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="w-6 h-6 p-0 flex items-center justify-center text-xs">
                            {index + 1}
                          </Badge>
                          <span className="text-sm font-medium">{item.name}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold">{formatPrice(item.revenue)}</p>
                          <p className="text-xs text-muted-foreground">{item.count} sold</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Low Stock Alert */}
          {stats.lowStockItems.length > 0 && (
            <Card className="border-destructive/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <Warning size={20} />
                  {t.admin.lowStock}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {stats.lowStockItems.map((item) => (
                    <div key={item.itemId} className="p-3 bg-destructive/10 rounded border border-destructive/20">
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Current: {item.current} | Min: {item.minimum}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Other tabs would go here - customers, orders, events, inventory, analytics */}
        <TabsContent value="customers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t.admin.customerStats}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">Customer management features coming soon...</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/50 rounded">
                    <p className="text-2xl font-bold">{stats.totalCustomers}</p>
                    <p className="text-sm text-muted-foreground">Total Customers</p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded">
                    <p className="text-2xl font-bold">
                      {Math.round((stats.gringoRevenue / stats.totalRevenue) * 100)}%
                    </p>
                    <p className="text-sm text-muted-foreground">Gringo Revenue Share</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package size={20} />
                Inventory Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Inventory tracking for {fullMenu.length} menu items. 
                {stats.lowStockItems.length > 0 && (
                  <span className="text-destructive ml-2">
                    {stats.lowStockItems.length} items need restocking.
                  </span>
                )}
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Add other tab contents as needed */}
      </Tabs>
    </div>
  );
};