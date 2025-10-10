import { useKV } from '@github/spark/hooks';
import { Order, Booking, Customer, Analytics } from '../types';
import { generateId } from '../lib/pricing';

interface OrderRequest {
  items: { itemId: string; quantity: number; price: number }[];
  total: number;
  currency: 'COP' | 'USD';
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  isGringo: boolean;
  type: 'pickup' | 'delivery';
}

interface BookingRequest {
  serviceId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  date: string;
  time: string;
  participants: number;
  total: number;
  currency: 'COP' | 'USD';
  isGringo: boolean;
}

export const useAdmin = () => {
  const [orders, setOrders] = useKV<Order[]>('admin-orders', []);
  const [bookings, setBookings] = useKV<Booking[]>('admin-bookings', []);
  const [customers, setCustomers] = useKV<Customer[]>('admin-customers', []);

  const addOrder = (orderRequest: OrderRequest) => {
    const orderId = generateId();
    const customerId = generateId();
    
    const newOrder: Order = {
      id: orderId,
      customerId,
      items: orderRequest.items,
      total: orderRequest.total,
      currency: orderRequest.currency,
      status: 'pending',
      timestamp: Date.now(),
      type: orderRequest.type
    };

    // Add or update customer
    setCustomers(currentCustomers => {
      const existing = currentCustomers?.find(c => c.email === orderRequest.customerEmail);
      if (existing) {
        return currentCustomers?.map(c => 
          c.email === orderRequest.customerEmail 
            ? { ...c, totalSpent: c.totalSpent + orderRequest.total, orders: [...c.orders, newOrder] }
            : c
        ) || [];
      }
      
      const newCustomer: Customer = {
        id: customerId,
        name: orderRequest.customerName,
        email: orderRequest.customerEmail,
        phone: orderRequest.customerPhone,
        isGringo: orderRequest.isGringo,
        totalSpent: orderRequest.total,
        orders: [newOrder],
        bookings: []
      };
      
      return [...(currentCustomers || []), newCustomer];
    });

    setOrders(currentOrders => [...(currentOrders || []), newOrder]);
    return orderId;
  };

  const addBooking = (bookingRequest: BookingRequest) => {
    const bookingId = generateId();
    const customerId = generateId();
    
    const newBooking: Booking = {
      id: bookingId,
      customerId,
      serviceId: bookingRequest.serviceId,
      date: bookingRequest.date,
      time: bookingRequest.time,
      participants: bookingRequest.participants,
      total: bookingRequest.total,
      currency: bookingRequest.currency,
      status: 'pending',
      timestamp: Date.now()
    };

    // Add or update customer
    setCustomers(currentCustomers => {
      const existing = currentCustomers?.find(c => c.email === bookingRequest.customerEmail);
      if (existing) {
        return currentCustomers?.map(c => 
          c.email === bookingRequest.customerEmail 
            ? { ...c, totalSpent: c.totalSpent + bookingRequest.total, bookings: [...c.bookings, newBooking] }
            : c
        ) || [];
      }
      
      const newCustomer: Customer = {
        id: customerId,
        name: bookingRequest.customerName,
        email: bookingRequest.customerEmail,
        phone: bookingRequest.customerPhone,
        isGringo: bookingRequest.isGringo,
        totalSpent: bookingRequest.total,
        orders: [],
        bookings: [newBooking]
      };
      
      return [...(currentCustomers || []), newCustomer];
    });

    setBookings(currentBookings => [...(currentBookings || []), newBooking]);
    return bookingId;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(currentOrders =>
      (currentOrders || []).map(order =>
        order.id === orderId ? { ...order, status } : order
      )
    );
  };

  const updateBookingStatus = (bookingId: string, status: Booking['status']) => {
    setBookings(currentBookings =>
      (currentBookings || []).map(booking =>
        booking.id === bookingId ? { ...booking, status } : booking
      )
    );
  };

  const getAnalytics = (period: 'day' | 'week' | 'month'): Analytics => {
    const now = Date.now();
    const periodMs = {
      day: 24 * 60 * 60 * 1000,
      week: 7 * 24 * 60 * 60 * 1000,
      month: 30 * 24 * 60 * 60 * 1000
    }[period];

    const recentOrders = (orders || []).filter(order => 
      order.timestamp > (now - periodMs)
    );

    const recentBookings = (bookings || []).filter(booking => 
      booking.timestamp > (now - periodMs)
    );

    const totalRevenue = recentOrders.reduce((sum, order) => sum + order.total, 0) +
                        recentBookings.reduce((sum, booking) => sum + booking.total, 0);

    const revenueByCategory: Record<string, number> = {};
    const revenueByCurrency = { COP: 0, USD: 0 };

    recentOrders.forEach(order => {
      revenueByCurrency[order.currency] += order.total;
    });

    recentBookings.forEach(booking => {
      revenueByCurrency[booking.currency] += booking.total;
    });

    const gringoCustomers = (customers || []).filter(c => c.isGringo).length;
    const totalCustomers = (customers || []).length;

    return {
      period,
      revenue: {
        total: totalRevenue,
        byCategory: revenueByCategory,
        byCurrency: revenueByCurrency
      },
      customers: {
        total: totalCustomers,
        new: totalCustomers, // Simplified for now
        returning: 0, // Simplified for now
        gringoPercentage: totalCustomers > 0 ? (gringoCustomers / totalCustomers) * 100 : 0
      },
      topItems: [], // TODO: Implement based on order items
      events: {
        attendance: recentBookings.length,
        revenue: recentBookings.reduce((sum, booking) => sum + booking.total, 0)
      }
    };
  };

  return {
    orders: orders || [],
    bookings: bookings || [],
    customers: customers || [],
    addOrder,
    addBooking,
    updateOrderStatus,
    updateBookingStatus,
    getAnalytics
  };
};