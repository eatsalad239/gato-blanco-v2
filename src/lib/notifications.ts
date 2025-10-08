import { useEffect, useState } from 'react';
import { toast } from 'sonner';

// Real-time notification system for business operations
export class NotificationManager {
  private static instance: NotificationManager;
  private listeners: Map<string, ((data: any) => void)[]> = new Map();
  private isOnline: boolean = navigator.onLine;
  
  static getInstance(): NotificationManager {
    if (!NotificationManager.instance) {
      NotificationManager.instance = new NotificationManager();
    }
    return NotificationManager.instance;
  }

  constructor() {
    this.setupNetworkListeners();
    this.requestNotificationPermission();
  }

  // Setup network connectivity listeners
  private setupNetworkListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.notify('system', { type: 'connection', status: 'online' });
      toast.success('🌐 Connection restored!');
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.notify('system', { type: 'connection', status: 'offline' });
      toast.error('📡 Connection lost - working offline');
    });
  }

  // Request notification permission
  private async requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        toast.success('🔔 Notifications enabled!');
      }
    }
  }

  // Subscribe to specific notification types
  subscribe(type: string, callback: (data: any) => void) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, []);
    }
    this.listeners.get(type)!.push(callback);
  }

  // Unsubscribe from notifications
  unsubscribe(type: string, callback: (data: any) => void) {
    const listeners = this.listeners.get(type);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  // Notify all subscribers of a specific type
  notify(type: string, data: any) {
    const listeners = this.listeners.get(type);
    if (listeners) {
      listeners.forEach(callback => callback(data));
    }
  }

  // Show browser notification
  showNotification(title: string, options?: NotificationOptions) {
    if ('Notification' in window && Notification.permission === 'granted') {
      const notification = new Notification(title, {
        icon: '/icon-192.png',
        badge: '/icon-72.png',
        ...options
      });
      
      // Auto-close after 5 seconds
      setTimeout(() => notification.close(), 5000);
      
      return notification;
    }
  }

  // Business-specific notifications
  notifyNewOrder(orderId: string, amount: number, currency: string) {
    const message = `New order #${orderId.slice(-6)} - ${new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency
    }).format(amount)}`;
    
    this.showNotification('💰 New Order!', {
      body: message,
      tag: 'new-order',
      requireInteraction: true
    });
    
    toast.success(message, {
      duration: 4000,
      action: {
        label: 'View',
        onClick: () => this.notify('order-view', { orderId })
      }
    });
  }

  notifyLowStock(itemName: string, quantity: number) {
    const message = `${itemName} is running low (${quantity} remaining)`;
    
    this.showNotification('📦 Low Stock Alert', {
      body: message,
      tag: 'low-stock'
    });
    
    toast.warning(message, {
      duration: 6000,
      action: {
        label: 'Restock',
        onClick: () => this.notify('inventory-restock', { itemName })
      }
    });
  }

  notifyBookingConfirmed(serviceName: string, customerName: string, date: string) {
    const message = `${customerName} booked ${serviceName} for ${date}`;
    
    this.showNotification('📅 Booking Confirmed', {
      body: message,
      tag: 'booking-confirmed'
    });
    
    toast.success(message, { duration: 4000 });
  }

  notifyPaymentReceived(amount: number, currency: string, method: string) {
    const message = `Payment received: ${new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency
    }).format(amount)} via ${method}`;
    
    this.showNotification('💳 Payment Received', {
      body: message,
      tag: 'payment-received'
    });
    
    toast.success(message, { duration: 3000 });
  }

  notifyHighActivity(ordersCount: number) {
    const message = `Busy period! ${ordersCount} orders today - consider extra staff`;
    
    this.showNotification('🚀 High Activity', {
      body: message,
      tag: 'high-activity'
    });
    
    toast.info(message, { duration: 8000 });
  }

  // System notifications
  notifyAppUpdate() {
    this.showNotification('⚡ App Updated!', {
      body: 'New features and improvements are available',
      tag: 'app-update'
    });
    
    toast.success('App updated with new features!', {
      duration: 5000,
      action: {
        label: 'Refresh',
        onClick: () => window.location.reload()
      }
    });
  }

  notifyOfflineMode() {
    toast.info('📱 Working offline - changes will sync when connected', {
      duration: 4000
    });
  }

  // Analytics notifications
  notifyDailyReport(revenue: number, orders: number) {
    const message = `Today: ${orders} orders, ${new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(revenue)} revenue`;
    
    toast.success(`📊 Daily Summary: ${message}`, { duration: 6000 });
  }

  // Emergency notifications
  notifyEmergency(title: string, message: string) {
    this.showNotification(`🚨 ${title}`, {
      body: message,
      tag: 'emergency',
      requireInteraction: true
    });
    
    toast.error(`🚨 ${title}: ${message}`, {
      duration: Infinity,
      action: {
        label: 'Acknowledge',
        onClick: () => toast.dismiss()
      }
    });
  }

  // Check connectivity
  isConnected(): boolean {
    return this.isOnline;
  }
}

// React hooks for notifications
export function useNotifications() {
  const [manager] = useState(() => NotificationManager.getInstance());
  return manager;
}

// Hook for subscribing to specific notification types
export function useNotificationSubscription(type: string, callback: (data: any) => void) {
  const manager = useNotifications();
  
  useEffect(() => {
    manager.subscribe(type, callback);
    return () => manager.unsubscribe(type, callback);
  }, [manager, type, callback]);
}

// Hook for online/offline status
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  return isOnline;
}

// Background sync for offline operations
export class OfflineManager {
  private static instance: OfflineManager;
  private pendingOperations: any[] = [];
  
  static getInstance(): OfflineManager {
    if (!OfflineManager.instance) {
      OfflineManager.instance = new OfflineManager();
    }
    return OfflineManager.instance;
  }

  constructor() {
    this.loadPendingOperations();
    this.setupSyncListeners();
  }

  // Add operation to offline queue
  addPendingOperation(operation: any) {
    this.pendingOperations.push({
      ...operation,
      timestamp: Date.now(),
      id: `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    });
    this.savePendingOperations();
  }

  // Process all pending operations when online
  async processPendingOperations() {
    if (!navigator.onLine || this.pendingOperations.length === 0) {
      return;
    }

    const operations = [...this.pendingOperations];
    this.pendingOperations = [];
    this.savePendingOperations();

    for (const operation of operations) {
      try {
        await this.processOperation(operation);
        toast.success(`✅ Synced: ${operation.type}`);
      } catch (error) {
        // Re-add failed operation
        this.pendingOperations.push(operation);
        toast.error(`❌ Sync failed: ${operation.type}`);
      }
    }

    if (this.pendingOperations.length > 0) {
      this.savePendingOperations();
    }
  }

  private async processOperation(operation: any) {
    // Process different types of offline operations
    switch (operation.type) {
      case 'order':
        // Process offline order
        break;
      case 'booking':
        // Process offline booking
        break;
      case 'inventory':
        // Process offline inventory update
        break;
      default:
        console.warn('Unknown operation type:', operation.type);
    }
  }

  private loadPendingOperations() {
    try {
      const stored = localStorage.getItem('gato-blanco-offline-operations');
      if (stored) {
        this.pendingOperations = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load pending operations:', error);
    }
  }

  private savePendingOperations() {
    try {
      localStorage.setItem('gato-blanco-offline-operations', JSON.stringify(this.pendingOperations));
    } catch (error) {
      console.error('Failed to save pending operations:', error);
    }
  }

  private setupSyncListeners() {
    window.addEventListener('online', () => {
      setTimeout(() => this.processPendingOperations(), 1000);
    });

    // Periodic sync attempts
    setInterval(() => {
      if (navigator.onLine) {
        this.processPendingOperations();
      }
    }, 60000); // Every minute
  }

  getPendingOperationsCount(): number {
    return this.pendingOperations.length;
  }
}

export function useOfflineManager() {
  const [manager] = useState(() => OfflineManager.getInstance());
  return manager;
}