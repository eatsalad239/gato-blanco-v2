import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import {
  Package,
  Plus,
  Minus,
  ArrowsClockwise,
  TrendUp,
  TrendDown,
  CurrencyDollar,
  Users,
  ShoppingCart,
  Calendar,
  CreditCard,
  Warning,
  CheckCircle,
  Clock,
  PencilSimple,
  Trash
} from '@phosphor-icons/react';

import { useBusiness } from '../lib/business';
import { useLanguageStore } from '../lib/translations';
import { fullMenu } from '../data/content';
import { Inventory, Customer, Order, Analytics } from '../types';

// Inventory Management Component
export function InventoryManager() {
  const business = useBusiness();
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [loading, setLoading] = useState(false);
  const [restockDialog, setRestockDialog] = useState<{ open: boolean; item?: Inventory }>({ open: false });

  const loadInventory = async () => {
    setLoading(true);
    try {
      const data = await business.getInventory();
      setInventory(data);
    } catch (error) {
      console.error('Failed to load inventory:', error);
      toast.error('Failed to load inventory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  const handleRestock = async (itemId: string, quantity: number, cost: number) => {
    try {
      await business.restockItem(itemId, quantity, cost);
      await loadInventory();
      toast.success('Item restocked successfully');
      setRestockDialog({ open: false });
    } catch (error) {
      toast.error('Failed to restock item');
    }
  };

  const lowStockCount = inventory.filter(item => item.quantity <= item.minStock).length;
  const totalItems = inventory.length;
  const totalValue = inventory.reduce((sum, item) => sum + (item.quantity * item.cost), 0);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <div className="text-center">
          <p className="text-2xl font-bold nuclear-text">{totalItems}</p>
          <p className="text-sm text-muted-foreground">Total Items</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-red-400">{lowStockCount}</p>
          <p className="text-sm text-muted-foreground">Low Stock</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-electric-cyan">
            ${totalValue.toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground">Total Value</p>
        </div>
      </div>

      <Button 
        onClick={loadInventory} 
        disabled={loading}
        className="w-full nuclear-button"
      >
        <ArrowsClockwise size={16} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
        Refresh Inventory
      </Button>

      <Dialog>
        <DialogTrigger asChild>
          <Button className="w-full nuclear-button">
            <Plus size={16} className="mr-2" />
            Add New Item
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Inventory Item</DialogTitle>
          </DialogHeader>
          <AddInventoryForm onSuccess={loadInventory} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Inventory Table Component
export function InventoryTable() {
  const business = useBusiness();
  const { currentLanguage } = useLanguageStore();
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [loading, setLoading] = useState(false);

  const loadInventory = async () => {
    setLoading(true);
    try {
      const data = await business.getInventory();
      setInventory(data);
    } catch (error) {
      console.error('Failed to load inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  const getItemName = (itemId: string) => {
    const item = fullMenu.find(m => m.id === itemId);
    return item?.name[currentLanguage.code] || itemId;
  };

  const getStockStatus = (item: Inventory) => {
    if (item.quantity === 0) return { status: 'Out of Stock', color: 'text-red-500' };
    if (item.quantity <= item.minStock) return { status: 'Low Stock', color: 'text-yellow-500' };
    return { status: 'In Stock', color: 'text-green-500' };
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Inventory Items</h3>
        <Button onClick={loadInventory} disabled={loading} size="sm">
          <ArrowsClockwise size={16} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Min Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Cost</TableHead>
              <TableHead>Last Restocked</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inventory.map((item) => {
              const status = getStockStatus(item);
              return (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    {getItemName(item.itemId)}
                  </TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.minStock}</TableCell>
                  <TableCell>
                    <Badge className={status.color}>
                      {status.status}
                    </Badge>
                  </TableCell>
                  <TableCell>${item.cost.toLocaleString()}</TableCell>
                  <TableCell>
                    {new Date(item.lastRestocked).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <PencilSimple size={14} />
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline">
                            <Package size={14} />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Restock {getItemName(item.itemId)}</DialogTitle>
                          </DialogHeader>
                          <RestockForm item={item} onSuccess={loadInventory} />
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// Payment Transaction List Component
export function PaymentTransactionList() {
  const business = useBusiness();
  const [transactions, setTransactions] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  const loadTransactions = async () => {
    setLoading(true);
    try {
      const orders = await business.getOrders({
        dateFrom: Date.now() - 7 * 24 * 60 * 60 * 1000 // Last 7 days
      });
      setTransactions(orders.slice(0, 10));
    } catch (error) {
      console.error('Failed to load transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  const formatCurrency = (amount: number, currency: 'COP' | 'USD') => {
    return new Intl.NumberFormat(currency === 'COP' ? 'es-CO' : 'en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">Recent Transactions</h3>
        <Button onClick={loadTransactions} disabled={loading} size="sm" variant="outline">
          <ArrowsClockwise size={14} className={`mr-1 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      <div className="space-y-3 max-h-64 overflow-y-auto">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
            <div className="space-y-1">
              <p className="text-sm font-medium">#{transaction.id.slice(-8)}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(transaction.timestamp).toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-electric-cyan">
                {formatCurrency(transaction.total, transaction.currency)}
              </p>
              <Badge className={
                transaction.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                transaction.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-red-500/20 text-red-400'
              }>
                {transaction.status}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Revenue Chart Component
export function RevenueChart({ analytics }: { analytics: Analytics | null }) {
  if (!analytics) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No analytics data available</p>
      </div>
    );
  }

  const copPercentage = (analytics.revenue.byCurrency.COP / analytics.revenue.total) * 100;
  const usdPercentage = (analytics.revenue.byCurrency.USD / analytics.revenue.total) * 100;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 text-center">
        <div>
          <p className="text-2xl font-bold nuclear-text">
            ${analytics.revenue.total.toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground">Total Revenue</p>
        </div>
        <div>
          <p className="text-xl font-bold text-electric-cyan">
            {analytics.topItems.length}
          </p>
          <p className="text-sm text-muted-foreground">Top Items</p>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>COP Revenue</span>
            <span>{copPercentage.toFixed(1)}%</span>
          </div>
          <Progress value={copPercentage} className="h-2" />
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>USD Revenue</span>
            <span>{usdPercentage.toFixed(1)}%</span>
          </div>
          <Progress value={usdPercentage} className="h-2" />
        </div>
      </div>
    </div>
  );
}

// Customer Analysis Chart Component
export function CustomerAnalysisChart({ customers }: { customers: Customer[] }) {
  const totalCustomers = customers.length;
  const gringoCount = customers.filter(c => c.isGringo).length;
  const localCount = totalCustomers - gringoCount;
  
  const gringoPercentage = totalCustomers > 0 ? (gringoCount / totalCustomers) * 100 : 0;
  const localPercentage = totalCustomers > 0 ? (localCount / totalCustomers) * 100 : 0;

  const avgSpentGringo = gringoCount > 0 ? 
    customers.filter(c => c.isGringo).reduce((sum, c) => sum + c.totalSpent, 0) / gringoCount : 0;
  const avgSpentLocal = localCount > 0 ? 
    customers.filter(c => !c.isGringo).reduce((sum, c) => sum + c.totalSpent, 0) / localCount : 0;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 text-center">
        <div>
          <p className="text-2xl font-bold nuclear-text">{totalCustomers}</p>
          <p className="text-sm text-muted-foreground">Total Customers</p>
        </div>
        <div>
          <p className="text-xl font-bold text-electric-cyan">{gringoCount}</p>
          <p className="text-sm text-muted-foreground">Gringo Customers</p>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Gringo Customers</span>
            <span>{gringoPercentage.toFixed(1)}%</span>
          </div>
          <Progress value={gringoPercentage} className="h-2" />
          <p className="text-xs text-muted-foreground mt-1">
            Avg spent: ${avgSpentGringo.toLocaleString()}
          </p>
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Local Customers</span>
            <span>{localPercentage.toFixed(1)}%</span>
          </div>
          <Progress value={localPercentage} className="h-2" />
          <p className="text-xs text-muted-foreground mt-1">
            Avg spent: ${avgSpentLocal.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}

// Performance Metrics Component
export function PerformanceMetrics({ analytics, orders }: { analytics: Analytics | null; orders: Order[] }) {
  if (!analytics) {
    return <div className="text-center py-8 text-muted-foreground">No data available</div>;
  }

  const completedOrders = orders.filter(o => o.status === 'completed').length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const completionRate = orders.length > 0 ? (completedOrders / orders.length) * 100 : 0;

  const metrics = [
    {
      label: 'Order Completion Rate',
      value: `${completionRate.toFixed(1)}%`,
      trend: completionRate > 90 ? 'up' : 'down',
      color: completionRate > 90 ? 'text-green-400' : 'text-yellow-400'
    },
    {
      label: 'Customer Retention',
      value: `${analytics.customers.gringoPercentage.toFixed(1)}%`,
      trend: 'up',
      color: 'text-electric-cyan'
    },
    {
      label: 'Average Order Value',
      value: `$${(analytics.revenue.total / Math.max(orders.length, 1)).toLocaleString()}`,
      trend: 'up',
      color: 'text-nuclear-blue'
    },
    {
      label: 'Revenue Growth',
      value: '+12.5%',
      trend: 'up',
      color: 'text-green-400'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="text-center space-y-2"
        >
          <div className="flex items-center justify-center gap-2">
            {metric.trend === 'up' ? (
              <TrendUp size={16} className="text-green-400" />
            ) : (
              <TrendDown size={16} className="text-red-400" />
            )}
            <span className={`text-2xl font-bold ${metric.color}`}>
              {metric.value}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{metric.label}</p>
        </motion.div>
      ))}
    </div>
  );
}

// Helper Components
function AddInventoryForm({ onSuccess }: { onSuccess: () => void }) {
  const business = useBusiness();
  const [formData, setFormData] = useState({
    itemId: '',
    quantity: 0,
    minStock: 10,
    cost: 0
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await business.restockItem(formData.itemId, formData.quantity, formData.cost);
      toast.success('Item added successfully');
      onSuccess();
    } catch (error) {
      toast.error('Failed to add item');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="itemId">Item ID</Label>
        <Input
          id="itemId"
          value={formData.itemId}
          onChange={(e) => setFormData({ ...formData, itemId: e.target.value })}
          placeholder="coffee_americano"
          required
        />
      </div>
      <div>
        <Label htmlFor="quantity">Quantity</Label>
        <Input
          id="quantity"
          type="number"
          value={formData.quantity}
          onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
          required
        />
      </div>
      <div>
        <Label htmlFor="cost">Cost (COP)</Label>
        <Input
          id="cost"
          type="number"
          value={formData.cost}
          onChange={(e) => setFormData({ ...formData, cost: parseInt(e.target.value) })}
          required
        />
      </div>
      <Button type="submit" className="w-full nuclear-button">
        Add Item
      </Button>
    </form>
  );
}

function RestockForm({ item, onSuccess }: { item: Inventory; onSuccess: () => void }) {
  const business = useBusiness();
  const [quantity, setQuantity] = useState(0);
  const [cost, setCost] = useState(item.cost);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await business.restockItem(item.itemId, quantity, cost);
      toast.success('Item restocked successfully');
      onSuccess();
    } catch (error) {
      toast.error('Failed to restock item');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="quantity">Add Quantity</Label>
        <Input
          id="quantity"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value))}
          placeholder="0"
          required
        />
        <p className="text-sm text-muted-foreground mt-1">
          Current stock: {item.quantity} | Min stock: {item.minStock}
        </p>
      </div>
      <div>
        <Label htmlFor="cost">Unit Cost (COP)</Label>
        <Input
          id="cost"
          type="number"
          value={cost}
          onChange={(e) => setCost(parseInt(e.target.value))}
          required
        />
      </div>
      <Button type="submit" className="w-full nuclear-button">
        Restock Item
      </Button>
    </form>
  );
}