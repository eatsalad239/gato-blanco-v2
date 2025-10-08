import { toast } from 'sonner';

export const notificationService = {
  // Order notifications
  orderCreated: (orderId: string, total: number) => {
    toast.success(`🎉 New order #${orderId.slice(-6)} - ${total.toLocaleString('es-CO')} COP`, {
      description: 'Order confirmed and sent to kitchen',
      duration: 5000,
    });
  },

  orderStatusUpdated: (orderId: string, status: string) => {
    const statusEmojis: Record<string, string> = {
      confirmed: '✅',
      preparing: '👨‍🍳',
      ready: '🔔',
      completed: '🎉',
      cancelled: '❌'
    };
    
    toast.success(`${statusEmojis[status] || '📋'} Order #${orderId.slice(-6)} is ${status}`, {
      duration: 4000,
    });
  },

  // Booking notifications
  bookingCreated: (serviceId: string, date: string) => {
    toast.success(`📅 Service booking confirmed for ${date}`, {
      description: `Service ID: ${serviceId}`,
      duration: 5000,
    });
  },

  // Payment notifications
  paymentSuccessful: (amount: number, currency: string) => {
    toast.success(`💳 Payment successful! ${amount.toLocaleString()} ${currency}`, {
      description: 'Transaction completed securely',
      duration: 5000,
    });
  },

  paymentFailed: (reason?: string) => {
    toast.error(`❌ Payment failed`, {
      description: reason || 'Please try again or use a different payment method',
      duration: 6000,
    });
  },

  // Inventory notifications
  lowStock: (itemName: string, currentStock: number) => {
    toast.warning(`⚠️ Low stock alert: ${itemName}`, {
      description: `Only ${currentStock} units remaining`,
      duration: 8000,
    });
  },

  stockAdded: (itemName: string, quantity: number) => {
    toast.success(`📦 Stock updated: ${itemName}`, {
      description: `Added ${quantity} units to inventory`,
      duration: 4000,
    });
  },

  // Customer notifications
  newCustomer: (customerName: string) => {
    toast.success(`👋 Welcome new customer: ${customerName}`, {
      description: 'Customer profile created',
      duration: 4000,
    });
  },

  // Business notifications
  dailySummary: (orders: number, revenue: number) => {
    toast.success(`📊 Daily Summary`, {
      description: `${orders} orders • ${revenue.toLocaleString('es-CO')} COP revenue`,
      duration: 6000,
    });
  },

  // Marketing notifications
  campaignLaunched: (campaignName: string) => {
    toast.success(`🚀 Marketing campaign launched: ${campaignName}`, {
      duration: 5000,
    });
  },

  // Error notifications
  systemError: (error: string) => {
    toast.error(`🔧 System Error`, {
      description: error,
      duration: 8000,
    });
  },

  // General success
  success: (message: string, description?: string) => {
    toast.success(message, {
      description,
      duration: 4000,
    });
  },

  // General error
  error: (message: string, description?: string) => {
    toast.error(message, {
      description,
      duration: 6000,
    });
  },

  // General info
  info: (message: string, description?: string) => {
    toast.info(message, {
      description,
      duration: 4000,
    });
  },

  // Warning
  warning: (message: string, description?: string) => {
    toast.warning(message, {
      description,
      duration: 5000,
    });
  }
};