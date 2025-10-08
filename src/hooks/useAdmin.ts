import { useKV } from '@github/spark/hooks';
import { Customer, Order, Booking } from '../types';
import { generateId } from '../lib/pricing';
import { notificationService } from '../lib/notifications';

export const useAdmin = () => {
  const [customers, setCustomers] = useKV<Customer[]>('admin-customers', []);
  const [orders, setOrders] = useKV<Order[]>('admin-orders', []);
  const [bookings, setBookings] = useKV<Booking[]>('admin-bookings', []);

  const findOrCreateCustomer = (name: string, email: string, phone?: string, isGringo: boolean = false): string => {
    const existingCustomer = customers?.find(c => c.email === email);
    
    if (existingCustomer) {
      return existingCustomer.id;
    }

    const newCustomer: Customer = {
      id: generateId(),
      name,
      email,
      phone,
      isGringo,
      totalSpent: 0,
      orders: [],
      bookings: []
    };

    setCustomers(current => [...(current || []), newCustomer]);
    return newCustomer.id;
  };

  const addOrder = (orderData: {
    items: { itemId: string; quantity: number; price: number }[];
    total: number;
    currency: 'COP' | 'USD';
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    isGringo: boolean;
    type: 'pickup' | 'delivery';
  }) => {
    const customerId = findOrCreateCustomer(
      orderData.customerName, 
      orderData.customerEmail, 
      orderData.customerPhone,
      orderData.isGringo
    );

    const newOrder: Order = {
      id: generateId(),
      customerId,
      items: orderData.items,
      total: orderData.total,
      currency: orderData.currency,
      status: 'confirmed',
      timestamp: Date.now(),
      type: orderData.type
    };

    setOrders(current => [...(current || []), newOrder]);

    // Update customer total spent
    setCustomers(current => 
      (current || []).map(customer => 
        customer.id === customerId 
          ? { ...customer, totalSpent: customer.totalSpent + orderData.total }
          : customer
      )
    );

    // Send notification
    notificationService.orderCreated(newOrder.id, orderData.total);

    return newOrder;
  };

  const addBooking = (bookingData: {
    serviceId: string;
    date: string;
    time: string;
    participants: number;
    total: number;
    currency: 'COP' | 'USD';
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    isGringo: boolean;
  }) => {
    const customerId = findOrCreateCustomer(
      bookingData.customerName,
      bookingData.customerEmail,
      bookingData.customerPhone,
      bookingData.isGringo
    );

    const newBooking: Booking = {
      id: generateId(),
      customerId,
      serviceId: bookingData.serviceId,
      date: bookingData.date,
      time: bookingData.time,
      participants: bookingData.participants,
      total: bookingData.total,
      currency: bookingData.currency,
      status: 'confirmed',
      timestamp: Date.now()
    };

    setBookings(current => [...(current || []), newBooking]);

    // Update customer total spent
    setCustomers(current => 
      (current || []).map(customer => 
        customer.id === customerId 
          ? { ...customer, totalSpent: customer.totalSpent + bookingData.total }
          : customer
      )
    );

    // Send notification
    notificationService.bookingCreated(bookingData.serviceId, bookingData.date);

    return newBooking;
  };

  return {
    customers: customers || [],
    orders: orders || [],
    bookings: bookings || [],
    addOrder,
    addBooking,
    findOrCreateCustomer
  };
};