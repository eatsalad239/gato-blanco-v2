import { Customer, Order, Booking, Inventory, Analytics, MenuItem, Service } from '../types';

// Business Logic Layer - Full CRM & Operations Management
export class BusinessManager {
  private static instance: BusinessManager;
  
  static getInstance(): BusinessManager {
    if (!BusinessManager.instance) {
      BusinessManager.instance = new BusinessManager();
    }
    return BusinessManager.instance;
  }

  // CUSTOMER MANAGEMENT
  async createCustomer(data: Omit<Customer, 'id' | 'totalSpent' | 'orders' | 'bookings'>): Promise<Customer> {
    const customers = await (window as any).spark.kv.get('customers') || [];
    const customer: Customer = {
      ...data,
      id: `customer_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
      totalSpent: 0,
      orders: [],
      bookings: []
    };
    
    customers.push(customer);
    await (window as any).spark.kv.set('customers', customers);
    return customer;
  }

  async getCustomer(id: string): Promise<Customer | null> {
    const customers = await (window as any).spark.kv.get('customers') || [];
    return customers.find(c => c.id === id) || null;
  }

  async updateCustomer(id: string, updates: Partial<Customer>): Promise<Customer | null> {
    const customers = await (window as any).spark.kv.get('customers') || [];
    const index = customers.findIndex(c => c.id === id);
    
    if (index === -1) return null;
    
    customers[index] = { ...customers[index], ...updates };
    await (window as any).spark.kv.set('customers', customers);
    return customers[index];
  }

  // ORDER MANAGEMENT
  async createOrder(data: Omit<Order, 'id' | 'timestamp'>): Promise<Order> {
    const orders = await (window as any).spark.kv.get('orders') || [];
    const order: Order = {
      ...data,
      id: `order_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
      timestamp: Date.now()
    };
    
    orders.push(order);
    await (window as any).spark.kv.set('orders', orders);
    
    // Update customer total spent
    const customer = await this.getCustomer(data.customerId);
    if (customer) {
      await this.updateCustomer(customer.id, {
        totalSpent: customer.totalSpent + data.total,
        orders: [...customer.orders, order]
      });
    }
    
    // Update inventory
    for (const item of data.items) {
      await this.updateInventory(item.itemId, -item.quantity);
    }
    
    return order;
  }

  async getOrders(filters?: { 
    customerId?: string; 
    status?: Order['status']; 
    dateFrom?: number; 
    dateTo?: number 
  }): Promise<Order[]> {
    let orders = await (window as any).spark.kv.get('orders') || [];
    
    if (filters) {
      if (filters.customerId) {
        orders = orders.filter(o => o.customerId === filters.customerId);
      }
      if (filters.status) {
        orders = orders.filter(o => o.status === filters.status);
      }
      if (filters.dateFrom) {
        orders = orders.filter(o => o.timestamp >= filters.dateFrom!);
      }
      if (filters.dateTo) {
        orders = orders.filter(o => o.timestamp <= filters.dateTo!);
      }
    }
    
    return orders.sort((a, b) => b.timestamp - a.timestamp);
  }

  async updateOrderStatus(orderId: string, status: Order['status']): Promise<Order | null> {
    const orders = await (window as any).spark.kv.get('orders') || [];
    const index = orders.findIndex(o => o.id === orderId);
    
    if (index === -1) return null;
    
    orders[index].status = status;
    await (window as any).spark.kv.set('orders', orders);
    return orders[index];
  }

  // BOOKING MANAGEMENT
  async createBooking(data: Omit<Booking, 'id' | 'timestamp'>): Promise<Booking> {
    const bookings = await (window as any).spark.kv.get('bookings') || [];
    const booking: Booking = {
      ...data,
      id: `booking_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
      timestamp: Date.now()
    };
    
    bookings.push(booking);
    await (window as any).spark.kv.set('bookings', bookings);
    
    // Update customer
    const customer = await this.getCustomer(data.customerId);
    if (customer) {
      await this.updateCustomer(customer.id, {
        totalSpent: customer.totalSpent + data.total,
        bookings: [...customer.bookings, booking]
      });
    }
    
    return booking;
  }

  async getBookings(filters?: { 
    customerId?: string; 
    serviceId?: string; 
    status?: Booking['status']; 
    date?: string 
  }): Promise<Booking[]> {
    let bookings = await (window as any).spark.kv.get('bookings') || [];
    
    if (filters) {
      if (filters.customerId) {
        bookings = bookings.filter(b => b.customerId === filters.customerId);
      }
      if (filters.serviceId) {
        bookings = bookings.filter(b => b.serviceId === filters.serviceId);
      }
      if (filters.status) {
        bookings = bookings.filter(b => b.status === filters.status);
      }
      if (filters.date) {
        bookings = bookings.filter(b => b.date === filters.date);
      }
    }
    
    return bookings.sort((a, b) => b.timestamp - a.timestamp);
  }

  // INVENTORY MANAGEMENT
  async getInventory(): Promise<Inventory[]> {
    return await (window as any).spark.kv.get('inventory') || [];
  }

  async updateInventory(itemId: string, quantityChange: number): Promise<void> {
    const inventory = await (window as any).spark.kv.get('inventory') || [];
    const index = inventory.findIndex(i => i.itemId === itemId);
    
    if (index === -1) {
      // Create new inventory item
      inventory.push({
        id: `inv_${itemId}_${Date.now()}`,
        itemId,
        quantity: Math.max(0, quantityChange),
        minStock: 10,
        lastRestocked: new Date().toISOString(),
        cost: 0
      });
    } else {
      inventory[index].quantity = Math.max(0, inventory[index].quantity + quantityChange);
    }
    
    await (window as any).spark.kv.set('inventory', inventory);
  }

  async restockItem(itemId: string, quantity: number, cost: number): Promise<void> {
    const inventory = await (window as any).spark.kv.get('inventory') || [];
    const index = inventory.findIndex(i => i.itemId === itemId);
    
    if (index === -1) {
      inventory.push({
        id: `inv_${itemId}_${Date.now()}`,
        itemId,
        quantity,
        minStock: 10,
        lastRestocked: new Date().toISOString(),
        cost
      });
    } else {
      inventory[index].quantity += quantity;
      inventory[index].cost = cost;
      inventory[index].lastRestocked = new Date().toISOString();
    }
    
    await (window as any).spark.kv.set('inventory', inventory);
  }

  // ANALYTICS & REPORTING
  async getAnalytics(period: 'day' | 'week' | 'month'): Promise<Analytics> {
    const now = new Date();
    let startDate: Date;
    
    switch (period) {
      case 'day':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
    }
    
    const orders = await this.getOrders({
      dateFrom: startDate.getTime(),
      dateTo: now.getTime()
    });
    
    const bookings = await this.getBookings();
    const customers = await (window as any).spark.kv.get('customers') || [];
    
    // Calculate revenue
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const revenueByCategory: Record<string, number> = {};
    const revenueByCurrency = { COP: 0, USD: 0 };
    
    orders.forEach(order => {
      revenueByCurrency[order.currency] += order.total;
    });
    
    // Calculate top items
    const itemSales: Record<string, { quantity: number; revenue: number }> = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        if (!itemSales[item.itemId]) {
          itemSales[item.itemId] = { quantity: 0, revenue: 0 };
        }
        itemSales[item.itemId].quantity += item.quantity;
        itemSales[item.itemId].revenue += item.price * item.quantity;
      });
    });
    
    const topItems = Object.entries(itemSales)
      .map(([itemId, data]) => ({ itemId, ...data }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);
    
    // Customer analytics
    const periodCustomers = customers.filter(c => 
      c.orders.some(o => o.timestamp >= startDate.getTime())
    );
    
    const gringoCount = periodCustomers.filter(c => c.isGringo).length;
    
    return {
      period,
      revenue: {
        total: totalRevenue,
        byCategory: revenueByCategory,
        byCurrency: revenueByCurrency
      },
      customers: {
        total: customers.length,
        new: periodCustomers.length,
        returning: customers.length - periodCustomers.length,
        gringoPercentage: customers.length > 0 ? (gringoCount / customers.length) * 100 : 0
      },
      topItems,
      events: {
        attendance: bookings.filter(b => b.status === 'completed').length,
        revenue: bookings.reduce((sum, b) => sum + b.total, 0)
      }
    };
  }

  // REAL-TIME FEATURES
  async getRealtimeStats(): Promise<{
    ordersToday: number;
    revenueToday: number;
    lowStockItems: string[];
    pendingOrders: number;
    activeBookings: number;
  }> {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    const todayOrders = await this.getOrders({
      dateFrom: startOfDay.getTime(),
      dateTo: Date.now()
    });
    
    const pendingOrders = await this.getOrders({ status: 'pending' });
    const activeBookings = await this.getBookings({ status: 'confirmed' });
    const inventory = await this.getInventory();
    
    const lowStockItems = inventory
      .filter(item => item.quantity <= item.minStock)
      .map(item => item.itemId);
    
    return {
      ordersToday: todayOrders.length,
      revenueToday: todayOrders.reduce((sum, order) => sum + order.total, 0),
      lowStockItems,
      pendingOrders: pendingOrders.length,
      activeBookings: activeBookings.length
    };
  }

  // BUSINESS INTELLIGENCE
  async generateReport(type: 'day' | 'week' | 'month'): Promise<string> {
    const analytics = await this.getAnalytics(type);
    const realtimeStats = await this.getRealtimeStats();
    
    const prompt = (window as any).spark.llmPrompt`
Generate a comprehensive business report for Gato Blanco Café in Zona Rosa, Medellín.

Report Type: ${type}
Analytics Data: ${JSON.stringify(analytics)}
Real-time Stats: ${JSON.stringify(realtimeStats)}

Create a professional report that includes:
1. Executive Summary
2. Revenue Analysis
3. Customer Insights
4. Inventory Status
5. Top Performing Items
6. Recommendations for improvement
7. Action items

Format it as a clear, actionable business report that owners can use to make decisions.
`;
    
    return await (window as any).spark.llm(prompt);
  }

  async generateCustomerReport(): Promise<Customer[]> {
    const customers = await (window as any).spark.kv.get('customers') || [];
    
    // If no customers exist, generate some demo data
    if (customers.length === 0) {
      const demoCustomers: Customer[] = [
        {
          id: 'customer_demo_1',
          name: 'Maria González',
          email: 'maria@email.com',
          phone: '+57 300 123 4567',
          isGringo: false,
          totalSpent: 250000,
          orders: [],
          bookings: []
        },
        {
          id: 'customer_demo_2',
          name: 'John Smith',
          email: 'john@email.com',
          phone: '+1 555 123 4567',
          isGringo: true,
          totalSpent: 850000,
          orders: [],
          bookings: []
        },
        {
          id: 'customer_demo_3',
          name: 'Carlos Restrepo',
          email: 'carlos@email.com',
          phone: '+57 301 987 6543',
          isGringo: false,
          totalSpent: 180000,
          orders: [],
          bookings: []
        }
      ];
      
      await (window as any).spark.kv.set('customers', demoCustomers);
      return demoCustomers;
    }
    
    return customers;
  }

  // AUTOMATED ALERTS
  async checkAlerts(): Promise<string[]> {
    const alerts: string[] = [];
    const inventory = await this.getInventory();
    const pendingOrders = await this.getOrders({ status: 'pending' });
    const realtimeStats = await this.getRealtimeStats();
    
    // Low stock alerts
    inventory.forEach(item => {
      if (item.quantity <= item.minStock) {
        alerts.push(`🚨 LOW STOCK: ${item.itemId} (${item.quantity} remaining)`);
      }
    });
    
    // Pending orders alert
    if (pendingOrders.length > 5) {
      alerts.push(`⚠️ ${pendingOrders.length} orders pending - check kitchen queue`);
    }
    
    // High activity alert
    if (realtimeStats.ordersToday > 50) {
      alerts.push(`🚀 HIGH ACTIVITY: ${realtimeStats.ordersToday} orders today - consider extra staff`);
    }
    
    return alerts;
  }
}

// React Hook for Business Operations
export function useBusiness() {
  const business = BusinessManager.getInstance();
  return business;
}