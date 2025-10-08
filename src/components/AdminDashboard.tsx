import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ChartBar, 
  Users, 
  ShoppingCart, 
  Calendar,
  CurrencyDollar,
  TrendUp,
  Coffee,
  Star,
  Phone,
  Envelope,
  MapPin,
  Plus,
  PencilSimple,
  Trash,
  Download
} from '@phosphor-icons/react';
import { useLanguageStore, translations } from '../lib/translations';
import { useKV } from '@github/spark/hooks';
import { Customer, Order, Booking, CoffeeItem, Service } from '../types';
import { formatPrice, generateId } from '../lib/pricing';
import { coffeeMenu, services } from '../data/content';
import { toast } from 'sonner';

interface DashboardStats {
  totalCustomers: number;
  totalOrders: number;
  totalBookings: number;
  totalRevenue: number;
  gringoRevenue: number;
  localRevenue: number;
  avgOrderValue: number;
  topSellingItems: { item: string; count: number }[];
}

export const AdminDashboard: React.FC = () => {
  const { currentLanguage } = useLanguageStore();
  const t = translations[currentLanguage.code];
  
  const [customers, setCustomers] = useKV<Customer[]>('admin-customers', []);
  const [orders, setOrders] = useKV<Order[]>('admin-orders', []);
  const [bookings, setBookings] = useKV<Booking[]>('admin-bookings', []);
  const [stats, setStats] = useState<DashboardStats>({
    totalCustomers: 0,
    totalOrders: 0,
    totalBookings: 0,
    totalRevenue: 0,
    gringoRevenue: 0,
    localRevenue: 0,
    avgOrderValue: 0,
    topSellingItems: []
  });
  
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [editingItem, setEditingItem] = useState<CoffeeItem | null>(null);
  const [editingService, setEditingService] = useState<Service | null>(null);

  // Calculate dashboard statistics
  useEffect(() => {
    const totalCustomers = customers?.length || 0;
    const totalOrders = orders?.length || 0;
    const totalBookings = bookings?.length || 0;
    
    const totalRevenue = (orders || []).reduce((sum, order) => sum + order.total, 0) + 
                        (bookings || []).reduce((sum, booking) => sum + booking.total, 0);
    
    const gringoRevenue = (orders || []).filter(o => {
      const customer = customers?.find(c => c.id === o.customerId);
      return customer?.isGringo;
    }).reduce((sum, order) => sum + order.total, 0) +
    (bookings || []).filter(b => {
      const customer = customers?.find(c => c.id === b.customerId);
      return customer?.isGringo;
    }).reduce((sum, booking) => sum + booking.total, 0);
    
    const localRevenue = totalRevenue - gringoRevenue;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Calculate top selling items
    const itemCounts: { [key: string]: number } = {};
    (orders || []).forEach(order => {
      order.items.forEach(item => {
        itemCounts[item.itemId] = (itemCounts[item.itemId] || 0) + item.quantity;
      });
    });
    
    const topSellingItems = Object.entries(itemCounts)
      .map(([itemId, count]) => {
        const item = coffeeMenu.find(i => i.id === itemId);
        return { item: item?.name.en || itemId, count };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    setStats({
      totalCustomers,
      totalOrders,
      totalBookings,
      totalRevenue,
      gringoRevenue,
      localRevenue,
      avgOrderValue,
      topSellingItems
    });
  }, [customers, orders, bookings]);

  const handleExportData = () => {
    const data = {
      customers: customers || [],
      orders: orders || [],
      bookings: bookings || [],
      stats,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gato-blanco-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('Data exported successfully');
  };

  const addTestData = () => {
    // Add sample customers
    const sampleCustomers: Customer[] = [
      {
        id: generateId(),
        name: 'John Gringo',
        email: 'john@example.com',
        phone: '+1 555-0123',
        isGringo: true,
        totalSpent: 95000,
        orders: [],
        bookings: []
      },
      {
        id: generateId(),
        name: 'María García',
        email: 'maria@example.com',
        phone: '+57 300-123-4567',
        isGringo: false,
        totalSpent: 45000,
        orders: [],
        bookings: []
      }
    ];

    // Add sample orders
    const sampleOrders: Order[] = [
      {
        id: generateId(),
        customerId: sampleCustomers[0].id,
        items: [
          { itemId: 'cafe-americano', quantity: 2, price: 6750 },
          { itemId: 'arepa-queso', quantity: 1, price: 12000 }
        ],
        total: 25500,
        currency: 'USD',
        status: 'completed',
        timestamp: Date.now() - 86400000,
        type: 'pickup'
      }
    ];

    // Add sample bookings
    const sampleBookings: Booking[] = [
      {
        id: generateId(),
        customerId: sampleCustomers[0].id,
        serviceId: 'city-tour',
        date: '2024-12-25',
        time: '10:00',
        participants: 2,
        total: 360000,
        currency: 'USD',
        status: 'confirmed',
        timestamp: Date.now() - 3600000
      }
    ];

    setCustomers((current) => [...(current || []), ...sampleCustomers]);
    setOrders((current) => [...(current || []), ...sampleOrders]);
    setBookings((current) => [...(current || []), ...sampleBookings]);
    
    toast.success('Test data added successfully');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t.admin.title}</h1>
          <p className="text-muted-foreground">Gato Blanco CRM Dashboard</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={addTestData} variant="outline" className="gap-2">
            <Plus size={16} />
            Add Test Data
          </Button>
          <Button onClick={handleExportData} className="gap-2">
            <Download size={16} />
            Export Data
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="customers">{t.admin.customers}</TabsTrigger>
          <TabsTrigger value="orders">{t.admin.orders}</TabsTrigger>
          <TabsTrigger value="bookings">{t.admin.bookings}</TabsTrigger>
          <TabsTrigger value="menu">Menu Management</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalCustomers}</div>
                <p className="text-xs text-muted-foreground">
                  Active customer base
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <CurrencyDollar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatPrice(stats.totalRevenue, 'COP', false)}</div>
                <p className="text-xs text-muted-foreground">
                  All time revenue
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Gringo Revenue</CardTitle>
                <TrendUp className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-accent">{formatPrice(stats.gringoRevenue, 'COP', false)}</div>
                <p className="text-xs text-muted-foreground">
                  Premium pricing revenue
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Orders</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalOrders}</div>
                <p className="text-xs text-muted-foreground">
                  Avg: {formatPrice(stats.avgOrderValue, 'COP', false)}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Top Selling Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star size={20} />
                Top Selling Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {stats.topSellingItems.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-muted/50 rounded">
                    <span>{item.item}</span>
                    <Badge>{item.count} sold</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users size={20} />
                Customer Database
              </CardTitle>
              <CardDescription>
                Manage your customer relationships and track spending
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(customers || []).map((customer) => (
                  <div key={customer.id} className="p-4 border rounded-lg space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold flex items-center gap-2">
                          {customer.name}
                          {customer.isGringo && (
                            <Badge className="bg-accent/10 text-accent border-accent/20">
                              Gringo
                            </Badge>
                          )}
                        </h3>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <div className="flex items-center gap-2">
                            <Envelope size={14} />
                            {customer.email}
                          </div>
                          {customer.phone && (
                            <div className="flex items-center gap-2">
                              <Phone size={14} />
                              {customer.phone}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">
                          {formatPrice(customer.totalSpent, customer.isGringo ? 'USD' : 'COP', false)}
                        </div>
                        <div className="text-sm text-muted-foreground">Total Spent</div>
                      </div>
                    </div>
                  </div>
                ))}
                {(customers || []).length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No customers yet. Add test data to see customer management in action.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart size={20} />
                Order Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(orders || []).map((order) => {
                  const customer = customers?.find(c => c.id === order.customerId);
                  return (
                    <div key={order.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold">Order #{order.id.slice(-6)}</h3>
                          <p className="text-sm text-muted-foreground">
                            {customer?.name} • {new Date(order.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">
                            {formatPrice(order.total, order.currency, false)}
                          </div>
                          <Badge variant={order.status === 'completed' ? 'default' : 'secondary'}>
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-sm space-y-1">
                        {order.items.map((item, index) => {
                          const menuItem = coffeeMenu.find(m => m.id === item.itemId);
                          return (
                            <div key={index} className="flex justify-between">
                              <span>{menuItem?.name.en || item.itemId} x{item.quantity}</span>
                              <span>{formatPrice(item.price * item.quantity, order.currency, false)}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
                {(orders || []).length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No orders yet. Orders will appear here as customers make purchases.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bookings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar size={20} />
                Service Bookings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(bookings || []).map((booking) => {
                  const customer = customers?.find(c => c.id === booking.customerId);
                  const service = services.find(s => s.id === booking.serviceId);
                  return (
                    <div key={booking.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold">{service?.name.en}</h3>
                          <p className="text-sm text-muted-foreground">
                            {customer?.name} • {booking.participants} participants
                          </p>
                          <p className="text-sm text-muted-foreground">
                            📅 {booking.date} at {booking.time}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">
                            {formatPrice(booking.total, booking.currency, false)}
                          </div>
                          <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                            {booking.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {(bookings || []).length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No bookings yet. Service bookings will appear here.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="menu" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coffee size={20} />
                Menu Management
              </CardTitle>
              <CardDescription>
                Manage coffee menu items and service offerings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Coffee Menu</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {coffeeMenu.map((item) => (
                    <div key={item.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{item.name.en}</h4>
                          <p className="text-sm text-muted-foreground">{item.description.en}</p>
                          <Badge className="mt-1">{item.category}</Badge>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">{formatPrice(item.basePrice, 'COP', false)}</div>
                          <div className="text-sm text-accent">
                            Gringo: {formatPrice(item.basePrice * 1.5, 'USD', true)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <h3 className="text-lg font-semibold mt-8">Services</h3>
                <div className="grid grid-cols-1 gap-4">
                  {services.map((service) => (
                    <div key={service.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{service.name.en}</h4>
                          <p className="text-sm text-muted-foreground">{service.description.en}</p>
                          <div className="flex gap-2 mt-1">
                            <Badge>{service.category}</Badge>
                            <Badge variant="outline">{service.duration}</Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">{formatPrice(service.basePriceCOP, 'COP', false)}</div>
                          <div className="text-sm text-accent">
                            Gringo: {formatPrice(service.basePriceCOP * 1.5, 'USD', true)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};