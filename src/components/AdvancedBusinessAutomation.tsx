import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { 
  Robot,
  Lightning,
  Brain,
  Target,
  TrendUp,
  Users,
  ChartLine,
  Megaphone,
  Bell,
  CheckCircle,
  Warning,
  Clock,
  CurrencyDollar,
  Coffee,
  Star,
  Heart,
  Eye,
  Share,
  InstagramLogo,
  FacebookLogo,
  WhatsappLogo,
  TiktokLogo,
  Envelope,
  Calendar,
  MapPin,
  Camera,
  PaperPlaneTilt,
  CloudArrowUp,
  ShieldCheck,
  Gauge,
  Globe,
  DeviceMobile,
  Activity
} from '@phosphor-icons/react';
import { useKV } from '@github/spark/hooks';

interface MarketingAutomation {
  id: string;
  name: string;
  platform: 'instagram' | 'facebook' | 'whatsapp' | 'email' | 'tiktok';
  frequency: 'daily' | 'weekly' | 'monthly' | 'event-based';
  contentType: 'promotional' | 'educational' | 'entertainment' | 'cultural';
  isActive: boolean;
  performance: {
    reach: number;
    engagement: number;
    conversions: number;
    roi: number;
  };
  lastRun: string;
  nextRun: string;
}

interface BusinessAlert {
  id: string;
  type: 'opportunity' | 'warning' | 'critical' | 'info';
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
  actionTaken?: boolean;
}

interface CustomerInsight {
  segment: string;
  count: number;
  avgSpend: number;
  preferredTime: string;
  topItems: string[];
  growthRate: number;
  retentionRate: number;
}

export function AdvancedBusinessAutomation() {
  const [automations, setAutomations] = useKV<MarketingAutomation[]>('marketing-automations', [
    {
      id: '1',
      name: '🇨🇴 Daily Colombian Coffee Stories',
      platform: 'instagram',
      frequency: 'daily',
      contentType: 'cultural',
      isActive: true,
      performance: { reach: 3500, engagement: 12.3, conversions: 45, roi: 3.8 },
      lastRun: '2024-01-15 08:00',
      nextRun: '2024-01-16 08:00'
    },
    {
      id: '2',
      name: 'VIP Tourist Welcome Campaigns',
      platform: 'whatsapp',
      frequency: 'event-based',
      contentType: 'promotional',
      isActive: true,
      performance: { reach: 890, engagement: 45.2, conversions: 123, roi: 8.9 },
      lastRun: '2024-01-14 15:30',
      nextRun: 'On new booking'
    },
    {
      id: '3',
      name: 'Weekend Coffee Masterclass Promotion',
      platform: 'facebook',
      frequency: 'weekly',
      contentType: 'educational',
      isActive: true,
      performance: { reach: 2100, engagement: 8.7, conversions: 23, roi: 4.2 },
      lastRun: '2024-01-13 12:00',
      nextRun: '2024-01-20 12:00'
    },
    {
      id: '4',
      name: 'Paisa Culture TikTok Series',
      platform: 'tiktok',
      frequency: 'daily',
      contentType: 'entertainment',
      isActive: true,
      performance: { reach: 12500, engagement: 18.9, conversions: 67, roi: 5.1 },
      lastRun: '2024-01-15 14:00',
      nextRun: '2024-01-16 14:00'
    }
  ]);

  const [businessAlerts, setBusinessAlerts] = useKV<BusinessAlert[]>('business-alerts', [
    {
      id: '1',
      type: 'opportunity',
      title: 'High Tourist Activity Detected',
      description: 'Instagram engagement from foreign accounts increased 67% this week. Consider launching premium tour packages.',
      timestamp: '2024-01-15 10:30',
      isRead: false
    },
    {
      id: '2',
      type: 'warning',
      title: 'Coffee Bean Inventory Low',
      description: 'Premium Colombian beans down to 15% capacity. Automated supplier order initiated.',
      timestamp: '2024-01-15 09:15',
      isRead: false,
      actionTaken: true
    },
    {
      id: '3',
      type: 'critical',
      title: 'Competitor Analysis Alert',
      description: 'Juan Valdez launched similar VIP tourist service. Pricing strategy review recommended.',
      timestamp: '2024-01-14 16:45',
      isRead: true
    }
  ]);

  const [customerInsights, setCustomerInsights] = useKV<CustomerInsight[]>('customer-insights', [
    {
      segment: 'International Tourists',
      count: 234,
      avgSpend: 67.50,
      preferredTime: '10:00 AM - 2:00 PM',
      topItems: ['Colombian Coffee Tour', 'Paisa Breakfast', 'Premium Espresso'],
      growthRate: 45.3,
      retentionRate: 23.1
    },
    {
      segment: 'Local Digital Nomads',
      count: 156,
      avgSpend: 34.20,
      preferredTime: '9:00 AM - 11:00 AM',
      topItems: ['Cortado', 'Avocado Toast', 'Cold Brew'],
      growthRate: 28.7,
      retentionRate: 67.8
    },
    {
      segment: 'Business Professionals',
      count: 189,
      avgSpend: 23.80,
      preferredTime: '7:00 AM - 9:00 AM',
      topItems: ['Cappuccino', 'Croissant', 'Americano'],
      growthRate: 12.4,
      retentionRate: 78.9
    }
  ]);

  const [systemMetrics] = useKV<{
    automationSuccess: number;
    avgResponseTime: number;
    customerSatisfaction: number;
    revenueGrowth: number;
    socialReach: number;
    conversionRate: number;
  }>('system-metrics', {
    automationSuccess: 98.7,
    avgResponseTime: 1.2,
    customerSatisfaction: 4.8,
    revenueGrowth: 34.5,
    socialReach: 45600,
    conversionRate: 12.3
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Real-time updates would happen here in a production environment
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const generateContentPlan = async () => {
    try {
      toast.info('AI is generating content strategy...');
      
      // Simulated AI content generation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const newAutomation: MarketingAutomation = {
        id: Date.now().toString(),
        name: '🎯 AI-Generated Content Series',
        platform: 'instagram',
        frequency: 'daily',
        contentType: 'promotional',
        isActive: false,
        performance: { reach: 0, engagement: 0, conversions: 0, roi: 0 },
        lastRun: 'Never',
        nextRun: 'Pending activation'
      };

      setAutomations(current => current ? [...current, newAutomation] : [newAutomation]);
      toast.success('AI content strategy generated! Review and activate.');
    } catch (error) {
      toast.error('Failed to generate content plan');
    }
  };

  const optimizeAutomation = async (automationId: string) => {
    try {
      toast.info('AI is optimizing automation...');
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setAutomations(current => 
        current ? current.map(automation => 
          automation.id === automationId 
            ? { ...automation, performance: { 
                ...automation.performance, 
                engagement: automation.performance.engagement * 1.15,
                roi: automation.performance.roi * 1.08
              }}
            : automation
        ) : []
      );
      
      toast.success('Automation optimized with AI insights!');
    } catch (error) {
      toast.error('Optimization failed');
    }
  };

  const markAlertAsRead = (alertId: string) => {
    setBusinessAlerts(current => 
      current ? current.map(alert => 
        alert.id === alertId ? { ...alert, isRead: true } : alert
      ) : []
    );
  };

  return (
    <div className="space-y-6">
      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { 
            title: 'Automation Success', 
            value: `${systemMetrics?.automationSuccess?.toFixed(1) || 0}%`, 
            icon: Robot, 
            color: 'text-green-500' 
          },
          { 
            title: 'Response Time', 
            value: `${systemMetrics?.avgResponseTime || 0}s`, 
            icon: Lightning, 
            color: 'text-nuclear-blue' 
          },
          { 
            title: 'Customer Rating', 
            value: `${systemMetrics?.customerSatisfaction || 0}/5`, 
            icon: Star, 
            color: 'text-yellow-500' 
          },
          { 
            title: 'Revenue Growth', 
            value: `+${systemMetrics?.revenueGrowth || 0}%`, 
            icon: TrendUp, 
            color: 'text-green-500' 
          },
          { 
            title: 'Social Reach', 
            value: systemMetrics?.socialReach?.toLocaleString() || '0', 
            icon: Users, 
            color: 'text-electric-cyan' 
          },
          { 
            title: 'Conversion Rate', 
            value: `${systemMetrics?.conversionRate || 0}%`, 
            icon: Target, 
            color: 'text-plasma-blue' 
          }
        ].map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="nuclear-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">{metric.title}</p>
                    <p className="text-lg font-bold nuclear-text">{metric.value}</p>
                  </div>
                  <metric.icon className={`h-6 w-6 ${metric.color}`} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Automations */}
        <Card className="nuclear-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Robot size={24} className="text-nuclear-blue" />
                Marketing Automations
              </CardTitle>
              <CardDescription>AI-powered content and engagement automation</CardDescription>
            </div>
            <Button onClick={generateContentPlan} className="nuclear-button">
              <Brain className="mr-2 h-4 w-4" />
              AI Strategy
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {automations?.map((automation) => (
                <motion.div
                  key={automation.id}
                  className="border border-border rounded-lg p-4 nuclear-border"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{automation.name}</h3>
                        <Badge className={automation.isActive ? 'bg-green-500/20 text-green-500' : 'bg-gray-500/20 text-gray-500'}>
                          {automation.isActive ? 'ACTIVE' : 'INACTIVE'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                        <span className="flex items-center gap-1">
                          {automation.platform === 'instagram' && <InstagramLogo size={12} />}
                          {automation.platform === 'facebook' && <FacebookLogo size={12} />}
                          {automation.platform === 'whatsapp' && <WhatsappLogo size={12} />}
                          {automation.platform === 'tiktok' && <TiktokLogo size={12} />}
                          {automation.platform === 'email' && <Envelope size={12} />}
                          {automation.platform}
                        </span>
                        <span>{automation.frequency}</span>
                        <span>{automation.contentType}</span>
                      </div>
                      <div className="grid grid-cols-4 gap-2 text-xs">
                        <div>
                          <span className="text-muted-foreground">Reach: </span>
                          <span className="font-medium">{automation.performance.reach.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Engage: </span>
                          <span className="font-medium">{automation.performance.engagement}%</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Convert: </span>
                          <span className="font-medium">{automation.performance.conversions}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">ROI: </span>
                          <span className="font-medium text-green-500">{automation.performance.roi}x</span>
                        </div>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => optimizeAutomation(automation.id)}
                      className="ml-4"
                    >
                      <Lightning className="h-3 w-3 mr-1" />
                      Optimize
                    </Button>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <span>Next run: {automation.nextRun}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Business Alerts */}
        <Card className="nuclear-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell size={24} className="text-electric-cyan" />
              Business Intelligence Alerts
            </CardTitle>
            <CardDescription>AI-powered insights and recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {businessAlerts?.slice(0, 5).map((alert) => (
                <motion.div
                  key={alert.id}
                  className={`p-3 rounded-lg border cursor-pointer ${
                    alert.type === 'critical' ? 'border-red-500/30 bg-red-500/5' :
                    alert.type === 'warning' ? 'border-yellow-500/30 bg-yellow-500/5' :
                    alert.type === 'opportunity' ? 'border-green-500/30 bg-green-500/5' :
                    'border-blue-500/30 bg-blue-500/5'
                  } ${!alert.isRead ? 'ring-1 ring-nuclear-blue/30' : ''}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  onClick={() => markAlertAsRead(alert.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {alert.type === 'critical' && <Warning className="h-4 w-4 text-red-500" />}
                        {alert.type === 'warning' && <Warning className="h-4 w-4 text-yellow-500" />}
                        {alert.type === 'opportunity' && <Target className="h-4 w-4 text-green-500" />}
                        {alert.type === 'info' && <CheckCircle className="h-4 w-4 text-blue-500" />}
                        <h4 className="font-medium text-sm">{alert.title}</h4>
                        {!alert.isRead && <div className="w-2 h-2 bg-nuclear-blue rounded-full"></div>}
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{alert.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{alert.timestamp}</span>
                        {alert.actionTaken && (
                          <Badge className="bg-green-500/20 text-green-500">ACTION TAKEN</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customer Intelligence */}
      <Card className="nuclear-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain size={24} className="text-nuclear-blue" />
            AI Customer Intelligence
          </CardTitle>
          <CardDescription>Real-time customer behavior analysis and segmentation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {customerInsights?.map((insight, index) => (
              <motion.div
                key={insight.segment}
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="text-center">
                  <h3 className="font-semibold text-lg">{insight.segment}</h3>
                  <p className="text-sm text-muted-foreground">{insight.count} customers</p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Average Spend</span>
                    <span className="font-medium">${insight.avgSpend}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Preferred Time</span>
                    <span className="font-medium text-xs">{insight.preferredTime}</span>
                  </div>
                  
                  <div>
                    <span className="text-sm text-muted-foreground">Top Items:</span>
                    <div className="mt-1 space-y-1">
                      {insight.topItems.map((item, i) => (
                        <div key={i} className="text-xs bg-muted/50 rounded px-2 py-1">
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Growth Rate</span>
                      <span className="text-green-500 font-medium">+{insight.growthRate}%</span>
                    </div>
                    <Progress value={insight.growthRate} className="h-2" />
                    
                    <div className="flex justify-between text-sm">
                      <span>Retention</span>
                      <span className="text-nuclear-blue font-medium">{insight.retentionRate}%</span>
                    </div>
                    <Progress value={insight.retentionRate} className="h-2" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="nuclear-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ChartLine size={20} className="text-electric-cyan" />
              Performance Optimization
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <h4 className="font-medium text-green-500 mb-2">🎯 Revenue Opportunity</h4>
              <p className="text-sm text-muted-foreground">
                Increase VIP tourist package prices by 15% during peak season (next month). 
                Projected additional revenue: $12,500/month.
              </p>
            </div>
            
            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <h4 className="font-medium text-blue-500 mb-2">📱 Social Media Boost</h4>
              <p className="text-sm text-muted-foreground">
                Post Instagram content at 7 PM for 60% higher engagement. 
                Automate posting schedule adjustment.
              </p>
            </div>
            
            <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
              <h4 className="font-medium text-purple-500 mb-2">☕ Menu Optimization</h4>
              <p className="text-sm text-muted-foreground">
                Cold brew orders up 35%. Consider expanding cold coffee menu 
                and promoting during afternoon hours.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="nuclear-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Megaphone size={20} className="text-nuclear-blue" />
              Marketing Automation Queue
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { time: '16:00', action: 'Post daily coffee story to Instagram', status: 'scheduled' },
              { time: '18:00', action: 'Send WhatsApp to VIP customers', status: 'scheduled' },
              { time: '19:00', action: 'Facebook event reminder post', status: 'scheduled' },
              { time: '20:00', action: 'TikTok trending hashtag post', status: 'scheduled' },
              { time: '21:00', action: 'Email newsletter to subscribers', status: 'scheduled' }
            ].map((task, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div className="flex items-center gap-3">
                  <Clock size={16} className="text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{task.action}</p>
                    <p className="text-xs text-muted-foreground">{task.time}</p>
                  </div>
                </div>
                <Badge className="bg-nuclear-blue/20 text-nuclear-blue">
                  {task.status.toUpperCase()}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}