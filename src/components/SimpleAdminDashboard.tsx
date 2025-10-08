import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { 
  ChartBar, 
  TrendUp, 
  Users, 
  Coffee,
  Calendar,
  CurrencyDollar,
  ShoppingCart,
  Star,
  Clock,
  Eye,
  Plus,
  PencilSimple,
  Trash,
  Download,
  CheckCircle,
  XCircle,
  Hourglass
} from '@phosphor-icons/react';

import { useAdmin } from '../hooks/useAdmin';
import { useKV } from '@github/spark/hooks';
import { formatPrice } from '../lib/pricing';
import { fullMenu } from '../data/content';
import { RealTimeOrderTracking } from './RealTimeOrderTracking';
import { BusinessAnalytics } from './BusinessAnalytics';
import { MarketingAutomation } from './MarketingAutomation';

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  stock: number;
  minStock: number;
  cost: number;
  supplier?: string;
}

export function SimpleAdminDashboard() {
  const { customers, orders, bookings } = useAdmin();
  const [inventory, setInventory] = useKV<InventoryItem[]>('inventory', []);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  // Calculate key metrics
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalCustomers = customers.length;
  const todayOrders = orders.filter(order => {
    const orderDate = new Date(order.timestamp);
    const today = new Date();
    return orderDate.toDateString() === today.toDateString();
  });
  const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    const getStatusColor = (status: string) => {
      switch (status) {
        case 'confirmed': return 'bg-green-500/20 text-green-500 border-green-500';
        case 'preparing': return 'bg-yellow-500/20 text-yellow-500 border-yellow-500';
        case 'ready': return 'bg-blue-500/20 text-blue-500 border-blue-500';
        case 'completed': return 'bg-green-600/20 text-green-600 border-green-600';
        case 'cancelled': return 'bg-red-500/20 text-red-500 border-red-500';
        default: return 'bg-gray-500/20 text-gray-500 border-gray-500';
      }
    };

    return (
      <Badge className={`${getStatusColor(status)} nuclear-glow`}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  // Update order status
  const updateOrderStatus = (orderId: string, newStatus: string) => {
    // In a real app, this would update the order in the database
    toast.success(`Order ${orderId} updated to ${newStatus}`);
  };

  // Add inventory item
  const addInventoryItem = (item: Omit<InventoryItem, 'id'>) => {
    const newItem: InventoryItem = {
      ...item,
      id: Date.now().toString()
    };
    setInventory(current => [...(current || []), newItem]);
    toast.success('Inventory item added');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h1 className="text-4xl font-black nuclear-text">
          ☕ GATO BLANCO ADMIN ☕
        </h1>
        <p className="text-xl text-electric-cyan">Business Management Dashboard</p>
      </motion.div>

      {/* Key Metrics */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        {[
          { icon: CurrencyDollar, label: 'Total Revenue', value: formatPrice(totalRevenue), color: 'text-green-500' },
          { icon: ShoppingCart, label: 'Total Orders', value: orders.length.toString(), color: 'text-blue-500' },
          { icon: Users, label: 'Customers', value: totalCustomers.toString(), color: 'text-purple-500' },
          { icon: TrendUp, label: 'Avg Order', value: formatPrice(avgOrderValue), color: 'text-orange-500' }
        ].map((metric, index) => (
          <Card key={index} className="nuclear-card">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm">
                <metric.icon size={16} className={metric.color} />
                {metric.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold nuclear-text">{metric.value}</div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Main Dashboard Tabs */}
      <Tabs defaultValue="tracking" className="space-y-6">
        <TabsList className="grid w-full grid-cols-7 nuclear-border">
          <TabsTrigger value="tracking" className="nuclear-button text-xs">Live Orders</TabsTrigger>
          <TabsTrigger value="analytics" className="nuclear-button text-xs">Analytics</TabsTrigger>
          <TabsTrigger value="marketing" className="nuclear-button text-xs">Marketing</TabsTrigger>
          <TabsTrigger value="orders" className="nuclear-button text-xs">Orders</TabsTrigger>
          <TabsTrigger value="bookings" className="nuclear-button text-xs">Bookings</TabsTrigger>
          <TabsTrigger value="customers" className="nuclear-button text-xs">Customers</TabsTrigger>
          <TabsTrigger value="inventory" className="nuclear-button text-xs">Inventory</TabsTrigger>
        </TabsList>

        {/* Real-Time Tracking Tab */}
        <TabsContent value="tracking" className="space-y-6">
          <RealTimeOrderTracking />
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <BusinessAnalytics />
        </TabsContent>

        {/* Marketing Tab */}
        <TabsContent value="marketing" className="space-y-6">
          <MarketingAutomation />
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold nuclear-text">Recent Orders</h2>
            <Badge className="bg-nuclear-blue/20 text-nuclear-blue border-nuclear-blue">
              {todayOrders.length} Today
            </Badge>
          </div>

          <div className="space-y-4">
            {orders.slice(0, 10).map((order) => {
              const customer = customers.find(c => c.id === order.customerId);
              return (
                <Card key={order.id} className="nuclear-card">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">Order #{order.id.slice(-6)}</CardTitle>
                        <CardDescription>
                          {customer?.name || 'Anonymous'} • {new Date(order.timestamp).toLocaleString()}
                        </CardDescription>
                      </div>
                      <div className="text-right space-y-2">
                        <div className="text-xl font-bold nuclear-text">
                          {formatPrice(order.total, order.currency, false)}
                        </div>
                        <StatusBadge status={order.status} />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Items: {order.items.length} • Type: {order.type}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateOrderStatus(order.id, 'preparing')}
                        >
                          <Hourglass size={16} className="mr-1" />
                          Preparing
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateOrderStatus(order.id, 'ready')}
                        >
                          <CheckCircle size={16} className="mr-1" />
                          Ready
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateOrderStatus(order.id, 'completed')}
                        >
                          <Star size={16} className="mr-1" />
                          Complete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Bookings Tab */}
        <TabsContent value="bookings" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold nuclear-text">Service Bookings</h2>
            <Badge className="bg-plasma-blue/20 text-plasma-blue border-plasma-blue">
              {bookings.length} Total
            </Badge>
          </div>

          <div className="space-y-4">
            {bookings.map((booking) => {
              const customer = customers.find(c => c.id === booking.customerId);
              return (
                <Card key={booking.id} className="nuclear-card">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">Booking #{booking.id.slice(-6)}</CardTitle>
                        <CardDescription>
                          {customer?.name || 'Anonymous'} • {booking.date} at {booking.time}
                        </CardDescription>
                      </div>
                      <div className="text-right space-y-2">
                        <div className="text-xl font-bold nuclear-text">
                          {formatPrice(booking.total, booking.currency, false)}
                        </div>
                        <StatusBadge status={booking.status} />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Service: {booking.serviceId} • Participants: {booking.participants}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Customers Tab */}
        <TabsContent value="customers" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold nuclear-text">Customer Database</h2>
            <Badge className="bg-electric-cyan/20 text-electric-cyan border-electric-cyan">
              {customers.length} Total
            </Badge>
          </div>

          <div className="grid gap-4">
            {customers.map((customer) => (
              <Card key={customer.id} className="nuclear-card">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{customer.name}</CardTitle>
                      <CardDescription>{customer.email}</CardDescription>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="text-lg font-bold nuclear-text">
                        {formatPrice(customer.totalSpent)}
                      </div>
                      {customer.isGringo && (
                        <Badge className="bg-crown-yellow/20 text-crown-yellow border-crown-yellow">
                          🇺🇸 GRINGO
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span>Orders: {customer.orders?.length || 0}</span>
                    <span>Bookings: {customer.bookings?.length || 0}</span>
                    {customer.phone && <span>📱 {customer.phone}</span>}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Inventory Tab */}
        <TabsContent value="inventory" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold nuclear-text">Inventory Management</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="nuclear-button">
                  <Plus size={16} className="mr-2" />
                  Add Item
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Inventory Item</DialogTitle>
                  <DialogDescription>
                    Add a new item to your inventory
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  addInventoryItem({
                    name: formData.get('name') as string,
                    category: formData.get('category') as string,
                    stock: parseInt(formData.get('stock') as string),
                    minStock: parseInt(formData.get('minStock') as string),
                    cost: parseFloat(formData.get('cost') as string),
                    supplier: formData.get('supplier') as string
                  });
                }} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input name="name" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select name="category" required>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="coffee">Coffee</SelectItem>
                        <SelectItem value="liquor">Liquor</SelectItem>
                        <SelectItem value="food">Food</SelectItem>
                        <SelectItem value="supplies">Supplies</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="stock">Current Stock</Label>
                      <Input name="stock" type="number" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="minStock">Min Stock</Label>
                      <Input name="minStock" type="number" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cost">Cost (COP)</Label>
                    <Input name="cost" type="number" step="0.01" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="supplier">Supplier</Label>
                    <Input name="supplier" />
                  </div>
                  <Button type="submit" className="w-full nuclear-button">
                    Add Item
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {(inventory || []).map((item) => (
              <Card key={item.id} className="nuclear-card">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{item.name}</CardTitle>
                      <CardDescription>Category: {item.category}</CardDescription>
                    </div>
                    <div className="text-right space-y-1">
                      <Badge 
                        className={`${item.stock <= item.minStock 
                          ? 'bg-red-500/20 text-red-500 border-red-500' 
                          : 'bg-green-500/20 text-green-500 border-green-500'
                        } nuclear-glow`}
                      >
                        Stock: {item.stock}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Min: {item.minStock}</span>
                    <span>Cost: {formatPrice(item.cost)}</span>
                    {item.supplier && <span>Supplier: {item.supplier}</span>}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}