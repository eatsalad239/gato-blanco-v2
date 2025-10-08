import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, 
  CheckCircle, 
  Coffee, 
  Truck, 
  Bell,
  MapPin,
  User,
  Phone
} from '@phosphor-icons/react';

import { useKV } from '@github/spark/hooks';
import { useAdmin } from '../hooks/useAdmin';
import { notificationService } from '../lib/notifications';
import { formatPrice } from '../lib/pricing';

interface OrderTracking {
  orderId: string;
  status: 'confirmed' | 'preparing' | 'ready' | 'out-for-delivery' | 'delivered' | 'completed';
  estimatedTime: number; // minutes
  actualTime?: number;
  timeline: {
    step: string;
    timestamp: number;
    completed: boolean;
  }[];
}

export function RealTimeOrderTracking() {
  const { orders, customers } = useAdmin();
  const [orderTracking, setOrderTracking] = useKV<OrderTracking[]>('order-tracking', []);
  const [activeOrders, setActiveOrders] = useState<string[]>([]);

  // Initialize tracking for new orders
  useEffect(() => {
    const newOrders = orders.filter(order => 
      !orderTracking?.find(tracking => tracking.orderId === order.id) &&
      order.status !== 'completed'
    );

    if (newOrders.length > 0) {
      const newTracking: OrderTracking[] = newOrders.map(order => ({
        orderId: order.id,
        status: 'confirmed',
        estimatedTime: calculateEstimatedTime(order.items.length),
        timeline: [
          { step: 'Order Confirmed', timestamp: order.timestamp, completed: true },
          { step: 'Preparing', timestamp: 0, completed: false },
          { step: 'Ready for Pickup', timestamp: 0, completed: false },
          { step: 'Completed', timestamp: 0, completed: false }
        ]
      }));

      setOrderTracking(current => [...(current || []), ...newTracking]);
    }
  }, [orders, orderTracking]);

  // Simulate order progression
  useEffect(() => {
    const interval = setInterval(() => {
      setOrderTracking(current => {
        const currentTracking = current || [];
        
        return currentTracking.map(tracking => {
          if (tracking.status === 'completed') return tracking;
          
          // Simulate random progression
          const shouldProgress = Math.random() < 0.3; // 30% chance every 5 seconds
          
          if (shouldProgress) {
            const nextStatus = getNextStatus(tracking.status);
            const updatedTimeline = tracking.timeline.map((item, index) => {
              if (item.step === getStepForStatus(nextStatus) && !item.completed) {
                return { ...item, timestamp: Date.now(), completed: true };
              }
              return item;
            });

            // Send notification
            notificationService.orderStatusUpdated(tracking.orderId, nextStatus);

            return {
              ...tracking,
              status: nextStatus,
              timeline: updatedTimeline,
              ...(nextStatus === 'completed' && { actualTime: Math.floor((Date.now() - tracking.timeline[0].timestamp) / 60000) })
            };
          }
          
          return tracking;
        });
      });
    }, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const calculateEstimatedTime = (itemCount: number): number => {
    // Base time 5 minutes + 2 minutes per item
    return 5 + (itemCount * 2);
  };

  const getNextStatus = (currentStatus: OrderTracking['status']): OrderTracking['status'] => {
    const statusFlow: OrderTracking['status'][] = ['confirmed', 'preparing', 'ready', 'completed'];
    const currentIndex = statusFlow.indexOf(currentStatus);
    return statusFlow[currentIndex + 1] || currentStatus;
  };

  const getStepForStatus = (status: OrderTracking['status']): string => {
    const statusMap = {
      'confirmed': 'Order Confirmed',
      'preparing': 'Preparing',
      'ready': 'Ready for Pickup',
      'completed': 'Completed'
    };
    return statusMap[status] || 'Unknown';
  };

  const getStatusIcon = (status: OrderTracking['status']) => {
    switch (status) {
      case 'confirmed': return <CheckCircle size={20} className="text-green-500" />;
      case 'preparing': return <Coffee size={20} className="text-yellow-500" />;
      case 'ready': return <Bell size={20} className="text-blue-500" />;
      case 'completed': return <CheckCircle size={20} className="text-green-600" />;
      default: return <Clock size={20} className="text-gray-500" />;
    }
  };

  const getStatusColor = (status: OrderTracking['status']) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500/20 text-green-500 border-green-500';
      case 'preparing': return 'bg-yellow-500/20 text-yellow-500 border-yellow-500';
      case 'ready': return 'bg-blue-500/20 text-blue-500 border-blue-500';
      case 'completed': return 'bg-green-600/20 text-green-600 border-green-600';
      default: return 'bg-gray-500/20 text-gray-500 border-gray-500';
    }
  };

  const getProgressPercentage = (status: OrderTracking['status']) => {
    const progressMap = {
      'confirmed': 25,
      'preparing': 50,
      'ready': 75,
      'completed': 100
    };
    return progressMap[status] || 0;
  };

  const activeTrackingOrders = (orderTracking || []).filter(tracking => tracking.status !== 'completed');

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2"
      >
        <h2 className="text-3xl font-black nuclear-text">📍 Real-Time Order Tracking</h2>
        <p className="text-electric-cyan">Live updates on all active orders</p>
        <Badge className="bg-nuclear-blue/20 text-nuclear-blue border-nuclear-blue nuclear-glow">
          {activeTrackingOrders.length} Active Orders
        </Badge>
      </motion.div>

      <div className="grid gap-6">
        <AnimatePresence>
          {activeTrackingOrders.map((tracking) => {
            const order = orders.find(o => o.id === tracking.orderId);
            const customer = order ? customers.find(c => c.id === order.customerId) : null;
            
            if (!order) return null;

            return (
              <motion.div
                key={tracking.orderId}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                layout
              >
                <Card className="nuclear-card overflow-hidden">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {getStatusIcon(tracking.status)}
                          Order #{tracking.orderId.slice(-6)}
                        </CardTitle>
                        <CardDescription>
                          {customer?.name || 'Anonymous Customer'} • {order.items.length} items
                        </CardDescription>
                      </div>
                      <div className="text-right space-y-2">
                        <div className="text-xl font-bold nuclear-text">
                          {formatPrice(order.total, order.currency, false)}
                        </div>
                        <Badge className={`${getStatusColor(tracking.status)} nuclear-glow`}>
                          {tracking.status?.toUpperCase() || 'UNKNOWN'}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Order Progress</span>
                        <span>{getProgressPercentage(tracking.status)}%</span>
                      </div>
                      <Progress 
                        value={getProgressPercentage(tracking.status)} 
                        className="h-2"
                      />
                    </div>

                    {/* Timeline */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-foreground">Order Timeline</h4>
                      <div className="space-y-2">
                        {tracking.timeline.map((step, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`flex items-center gap-3 p-2 rounded-lg ${
                              step.completed 
                                ? 'bg-green-500/10 border border-green-500/30' 
                                : 'bg-muted/30'
                            }`}
                          >
                            <div className={`w-3 h-3 rounded-full ${
                              step.completed ? 'bg-green-500' : 'bg-muted-foreground'
                            }`} />
                            <div className="flex-1">
                              <span className={`text-sm ${
                                step.completed ? 'text-foreground font-medium' : 'text-muted-foreground'
                              }`}>
                                {step.step}
                              </span>
                              {step.completed && step.timestamp > 0 && (
                                <div className="text-xs text-muted-foreground">
                                  {new Date(step.timestamp).toLocaleTimeString()}
                                </div>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Estimated Time */}
                    <div className="flex items-center justify-between p-3 bg-nuclear-blue/10 rounded-lg border border-nuclear-blue/30">
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-nuclear-blue" />
                        <span className="text-sm font-medium">
                          {tracking.status === 'completed' ? 'Total Time' : 'Estimated Time'}
                        </span>
                      </div>
                      <span className="font-bold text-nuclear-blue">
                        {tracking.actualTime || tracking.estimatedTime} minutes
                      </span>
                    </div>

                    {/* Customer Info */}
                    {customer && (
                      <div className="flex items-center gap-4 p-3 bg-card/50 rounded-lg border">
                        <User size={16} className="text-muted-foreground" />
                        <div className="flex-1">
                          <div className="font-medium">{customer.name}</div>
                          <div className="text-sm text-muted-foreground">{customer.email}</div>
                        </div>
                        {customer.phone && (
                          <Button size="sm" variant="outline" className="gap-2">
                            <Phone size={14} />
                            Call
                          </Button>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {activeTrackingOrders.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Coffee size={64} className="mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-xl font-semibold text-muted-foreground mb-2">No Active Orders</h3>
            <p className="text-muted-foreground">All orders have been completed or no orders yet today.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}