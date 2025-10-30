import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChartBar, 
  TrendUp, 
  Users, 
  Coffee,
  Calendar,
  CurrencyDollar,
  ShoppingCart,
  MapPin,
  Star,
  Clock,
  Camera,
  PaperPlaneTilt,
  Eye,
  Heart,
  ChatCircle,
  Share,
  Target,
  Lightning,
  Crown,
  Rocket,
  Sparkle,
  Brain,
  Globe,
  DeviceMobile,
  Envelope,
  Bell,
  Gear,
  Plus,
  PencilSimple,
  Trash,
  Download,
  Upload,
  ArrowClockwise,
  Robot,
  Database,
  ChartLine,
  Megaphone,
  Shield,
  Code,
  Atom,
  Fire,
  Coins,
  TrendDown,
  Warning,
  CheckCircle,
  XCircle,
  Clock as ClockIcon,
  ArrowUp,
  ArrowDown,
  Gauge,
  WifiHigh,
  HardDrives,
  MagicWand,
  PresentationChart,
  CloudArrowUp,
  Handshake,
  GlobeHemisphereWest,
  InstagramLogo,
  TwitterLogo,
  FacebookLogo,
  TiktokLogo,
  WhatsappLogo,
  LinkedinLogo,
  CreditCard
} from '@phosphor-icons/react';
import { Activity } from 'lucide-react';
import { useKV } from '@github/spark/hooks';

interface BusinessMetrics {
  totalRevenue: number;
  totalOrders: number;
  customerCount: number;
  averageOrderValue: number;
  growthRate: number;
  marketingROI: number;
  customerRetention: number;
  socialEngagement: number;
}

interface AutomationRule {
  id: string;
  name: string;
  trigger: string;
  action: string;
  isActive: boolean;
  executionCount: number;
  lastRun: string;
}

interface MarketingCampaign {
  id: string;
  name: string;
  type: 'social' | 'email' | 'sms' | 'whatsapp';
  status: 'active' | 'paused' | 'completed';
  reach: number;
  engagement: number;
  conversions: number;
  roi: number;
  startDate: string;
  budget: number;
}

interface CompetitorAnalysis {
  name: string;
  rating: number;
  priceRange: string;
  strengths: string[];
  weaknesses: string[];
  socialFollowers: number;
  averageWaitTime: string;
}

interface AIInsight {
  id: string;
  type: 'opportunity' | 'warning' | 'optimization' | 'trend';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  actionRequired: boolean;
  timestamp: string;
}

export function BusinessIntelligenceDashboard() {
  const [metrics] = useKV<BusinessMetrics>('business-metrics', {
    totalRevenue: 45750,
    totalOrders: 892,
    customerCount: 567,
    averageOrderValue: 51.3,
    growthRate: 23.5,
    marketingROI: 4.2,
    customerRetention: 68.5,
    socialEngagement: 8.9
  });

  const [automationRules, setAutomationRules] = useKV<AutomationRule[]>('automation-rules', [
    {
      id: '1',
      name: 'Auto-Post Daily Specials',
      trigger: 'Daily at 8 AM',
      action: 'Post to Instagram & Facebook',
      isActive: true,
      executionCount: 45,
      lastRun: '2024-01-15 08:00'
    },
    {
      id: '2',
      name: 'Birthday Discount Campaigns',
      trigger: 'Customer Birthday',
      action: 'Send WhatsApp with 20% discount',
      isActive: true,
      executionCount: 12,
      lastRun: '2024-01-14 14:30'
    },
    {
      id: '3',
      name: 'Inventory Low Alert',
      trigger: 'Stock < 10 units',
      action: 'Email supplier + Slack notification',
      isActive: true,
      executionCount: 8,
      lastRun: '2024-01-13 16:45'
    },
    {
      id: '4',
      name: 'Peak Hour Staffing',
      trigger: 'Queue > 5 customers',
      action: 'SMS backup staff',
      isActive: true,
      executionCount: 23,
      lastRun: '2024-01-15 11:15'
    }
  ]);

  const [campaigns] = useKV<MarketingCampaign[]>('marketing-campaigns', [
    {
      id: '1',
      name: '🇨🇴 Authentic Colombian Experience',
      type: 'social',
      status: 'active',
      reach: 12500,
      engagement: 8.9,
      conversions: 89,
      roi: 4.2,
      startDate: '2024-01-10',
      budget: 2500
    },
    {
      id: '2',
      name: 'VIP Tourist Package Promotion',
      type: 'email',
      status: 'active',
      reach: 3400,
      engagement: 12.3,
      conversions: 34,
      roi: 6.8,
      startDate: '2024-01-12',
      budget: 800
    },
    {
      id: '3',
      name: 'Weekend Coffee Masterclass',
      type: 'whatsapp',
      status: 'completed',
      reach: 890,
      engagement: 15.7,
      conversions: 23,
      roi: 5.1,
      startDate: '2024-01-08',
      budget: 400
    }
  ]);

  const [competitors] = useState<CompetitorAnalysis[]>([
    {
      name: 'Café Central',
      rating: 4.2,
      priceRange: '$15-25',
      strengths: ['Location', 'Traditional Menu'],
      weaknesses: ['No English Menu', 'Limited Hours'],
      socialFollowers: 2300,
      averageWaitTime: '12 min'
    },
    {
      name: 'Starbucks Zona Rosa',
      rating: 4.0,
      priceRange: '$18-30',
      strengths: ['Brand Recognition', 'Consistency'],
      weaknesses: ['Not Authentic', 'Expensive'],
      socialFollowers: 8900,
      averageWaitTime: '8 min'
    },
    {
      name: 'Juan Valdez',
      rating: 4.3,
      priceRange: '$12-22',
      strengths: ['Colombian Brand', 'Coffee Quality'],
      weaknesses: ['Limited Services', 'Tourist Focus'],
      socialFollowers: 15600,
      averageWaitTime: '10 min'
    }
  ]);

  const [aiInsights, setAiInsights] = useKV<AIInsight[]>('ai-insights', [
    {
      id: '1',
      type: 'opportunity',
      title: 'Peak Tourist Season Approaching',
      description: 'Historical data shows 40% increase in foreign visitors next month. Recommend launching premium tour packages.',
      impact: 'high',
      actionRequired: true,
      timestamp: '2024-01-15 09:30'
    },
    {
      id: '2',
      type: 'optimization',
      title: 'Instagram Post Timing',
      description: 'Engagement 60% higher when posting at 7 PM vs current 2 PM schedule.',
      impact: 'medium',
      actionRequired: true,
      timestamp: '2024-01-15 08:15'
    },
    {
      id: '3',
      type: 'warning',
      title: 'Competitor Price Decrease',
      description: 'Café Central reduced coffee prices by 15%. Monitor customer retention.',
      impact: 'medium',
      actionRequired: false,
      timestamp: '2024-01-14 16:45'
    },
    {
      id: '4',
      type: 'trend',
      title: 'Cold Brew Demand Rising',
      description: 'Cold coffee orders increased 35% this week. Consider expanding cold menu.',
      impact: 'high',
      actionRequired: true,
      timestamp: '2024-01-14 14:20'
    }
  ]);

  const [isGeneratingContent, setIsGeneratingContent] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState('instagram');
  const [automationDialogOpen, setAutomationDialogOpen] = useState(false);

  // AI Content Generation
  const generateSocialContent = async () => {
    setIsGeneratingContent(true);
    try {
      const prompt = `Generate engaging social media content for a Colombian coffee shop in Medellín. 
      Include: Colombian flag emojis, coffee culture references, tourist-friendly messaging, and authentic paisa expressions. 
      Format for ${selectedPlatform}. Make it premium and inviting for international visitors.`;
      
      // Simulated content generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('AI-generated content ready for review!');
    } catch (error) {
      toast.error('Failed to generate content');
    } finally {
      setIsGeneratingContent(false);
    }
  };

  // Automated Market Analysis
  const runMarketAnalysis = async () => {
    try {
      // Simulated analysis
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const newInsight: AIInsight = {
        id: Date.now().toString(),
        type: 'opportunity',
        title: 'Market Analysis Complete',
        description: 'New market opportunities identified in premium coffee tourism segment',
        impact: 'high',
        actionRequired: true,
        timestamp: new Date().toISOString()
      };
      
      setAiInsights(current => current ? [newInsight, ...current] : [newInsight]);
      toast.success('Market analysis completed!');
    } catch (error) {
      toast.error('Market analysis failed');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div 
        className="text-center space-y-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-black nuclear-text flex items-center justify-center gap-3">
          <Brain size={40} className="text-nuclear-blue" />
          🇨🇴 BUSINESS INTELLIGENCE CENTER 🇨🇴
        </h1>
        <p className="text-xl text-electric-cyan">AI-Powered Business Automation & Marketing Hub</p>
        <div className="flex justify-center gap-2">
          <Badge className="bg-nuclear-blue/20 text-nuclear-blue border-nuclear-blue">
            <Robot size={16} className="mr-1" />
            AI-ENHANCED
          </Badge>
          <Badge className="bg-electric-cyan/20 text-electric-cyan border-electric-cyan">
            <Lightning size={16} className="mr-1" />
            REAL-TIME
          </Badge>
          <Badge className="bg-plasma-blue/20 text-plasma-blue border-plasma-blue">
            <Rocket size={16} className="mr-1" />
            AUTOMATED
          </Badge>
        </div>
      </motion.div>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6 nuclear-border">
          <TabsTrigger value="dashboard" className="nuclear-button">📊 DASHBOARD</TabsTrigger>
          <TabsTrigger value="automation" className="nuclear-button">🤖 AUTOMATION</TabsTrigger>
          <TabsTrigger value="marketing" className="nuclear-button">📱 MARKETING</TabsTrigger>
          <TabsTrigger value="insights" className="nuclear-button">🧠 AI INSIGHTS</TabsTrigger>
          <TabsTrigger value="competition" className="nuclear-button">🎯 COMPETITION</TabsTrigger>
          <TabsTrigger value="integration" className="nuclear-button">🔗 INTEGRATIONS</TabsTrigger>
        </TabsList>

        {/* Real-time Dashboard */}
        <TabsContent value="dashboard" className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { 
                title: 'Total Revenue', 
                value: `$${metrics?.totalRevenue.toLocaleString() || '0'}`, 
                change: `+${metrics?.growthRate || 0}%`,
                icon: CurrencyDollar,
                color: 'text-green-500',
                trend: 'up'
              },
              { 
                title: 'Total Orders', 
                value: metrics?.totalOrders.toLocaleString() || '0', 
                change: '+12%',
                icon: ShoppingCart,
                color: 'text-nuclear-blue',
                trend: 'up'
              },
              { 
                title: 'Customers', 
                value: metrics?.customerCount.toLocaleString() || '0', 
                change: '+8%',
                icon: Users,
                color: 'text-electric-cyan',
                trend: 'up'
              },
              { 
                title: 'Avg Order Value', 
                value: `$${metrics?.averageOrderValue || 0}`, 
                change: '+5%',
                icon: Target,
                color: 'text-plasma-blue',
                trend: 'up'
              }
            ].map((metric, index) => (
              <motion.div
                key={metric.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="nuclear-card">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                    <metric.icon className={`h-4 w-4 ${metric.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold nuclear-text">{metric.value}</div>
                    <div className="flex items-center gap-1">
                      {metric.trend === 'up' ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                      <span className={`text-xs ${metric.color}`}>{metric.change}</span>
                      <span className="text-xs text-muted-foreground">vs last month</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Advanced Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="nuclear-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ChartBar size={20} className="text-nuclear-blue" />
                  Revenue Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Today</span>
                    <span className="font-bold">$2,340</span>
                  </div>
                  <Progress value={78} className="w-full" />
                  <div className="flex justify-between items-center">
                    <span>This Week</span>
                    <span className="font-bold">$14,230</span>
                  </div>
                  <Progress value={85} className="w-full" />
                  <div className="flex justify-between items-center">
                    <span>This Month</span>
                    <span className="font-bold">$45,750</span>
                  </div>
                  <Progress value={92} className="w-full" />
                </div>
              </CardContent>
            </Card>

            <Card className="nuclear-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity size={20} className="text-electric-cyan" />
                  Live Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span>System Status</span>
                    </div>
                    <Badge className="bg-green-500/20 text-green-500">OPTIMAL</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Order Processing</span>
                    <span className="text-green-500 font-bold">2.3s avg</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Social Engagement</span>
                    <span className="text-nuclear-blue font-bold">{metrics?.socialEngagement || 0}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Marketing ROI</span>
                    <span className="text-electric-cyan font-bold">{metrics?.marketingROI || 0}x</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Automation Center */}
        <TabsContent value="automation" className="space-y-6">
          <Card className="nuclear-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Robot size={24} className="text-nuclear-blue" />
                  Business Automation Rules
                </CardTitle>
                <CardDescription>
                  Automated workflows that run your business 24/7
                </CardDescription>
              </div>
              <Dialog open={automationDialogOpen} onOpenChange={setAutomationDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="nuclear-button">
                    <Plus size={16} className="mr-2" />
                    Add Rule
                  </Button>
                </DialogTrigger>
                <DialogContent className="nuclear-card">
                  <DialogHeader>
                    <DialogTitle>Create Automation Rule</DialogTitle>
                    <DialogDescription>
                      Set up intelligent automation for your business
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Rule Name</Label>
                      <Input placeholder="e.g., Auto-respond to reviews" />
                    </div>
                    <div>
                      <Label>Trigger</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select trigger" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="time">Time-based</SelectItem>
                          <SelectItem value="customer">Customer action</SelectItem>
                          <SelectItem value="inventory">Inventory level</SelectItem>
                          <SelectItem value="review">New review</SelectItem>
                          <SelectItem value="order">Order placed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Action</Label>
                      <Textarea placeholder="Describe what should happen..." />
                    </div>
                    <Button className="w-full nuclear-button" onClick={() => {
                      toast.success('Automation rule created!');
                      setAutomationDialogOpen(false);
                    }}>
                      Create Automation
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {automationRules?.map((rule) => (
                  <motion.div
                    key={rule.id}
                    className="border border-border rounded-lg p-4 nuclear-border"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold">{rule.name}</h3>
                          <Badge className={rule.isActive ? 'bg-green-500/20 text-green-500' : 'bg-gray-500/20 text-gray-500'}>
                            {rule.isActive ? 'ACTIVE' : 'INACTIVE'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium">Trigger:</span> {rule.trigger}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium">Action:</span> {rule.action}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>Executed {rule.executionCount} times</span>
                          <span>Last run: {rule.lastRun}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch 
                          checked={rule.isActive} 
                          onCheckedChange={(checked) => {
                            setAutomationRules(current => 
                              current ? current.map(r => r.id === rule.id ? { ...r, isActive: checked } : r) : []
                            );
                          }}
                        />
                        <Button variant="outline" size="sm">
                          <PencilSimple size={14} />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Automation Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="nuclear-card">
              <CardHeader>
                <CardTitle className="text-center">AI Content Generation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="facebook">Facebook</SelectItem>
                    <SelectItem value="twitter">Twitter</SelectItem>
                    <SelectItem value="tiktok">TikTok</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  className="w-full nuclear-button" 
                  onClick={generateSocialContent}
                  disabled={isGeneratingContent}
                >
                  {isGeneratingContent ? (
                    <ArrowClockwise className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <MagicWand className="mr-2 h-4 w-4" />
                  )}
                  Generate Content
                </Button>
              </CardContent>
            </Card>

            <Card className="nuclear-card">
              <CardHeader>
                <CardTitle className="text-center">Market Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground text-center">
                  AI-powered competitor and market analysis
                </p>
                <Button 
                  className="w-full nuclear-button" 
                  onClick={runMarketAnalysis}
                >
                  <PresentationChart className="mr-2 h-4 w-4" />
                  Run Analysis
                </Button>
              </CardContent>
            </Card>

            <Card className="nuclear-card">
              <CardHeader>
                <CardTitle className="text-center">System Health</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Uptime</span>
                  <Badge className="bg-green-500/20 text-green-500">99.9%</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">API Status</span>
                  <Badge className="bg-green-500/20 text-green-500">ONLINE</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Automations</span>
                  <Badge className="bg-nuclear-blue/20 text-nuclear-blue">{automationRules?.filter(r => r.isActive).length || 0} ACTIVE</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Marketing Hub */}
        <TabsContent value="marketing" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="nuclear-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Megaphone size={20} className="text-nuclear-blue" />
                  Active Campaigns
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {campaigns?.map((campaign) => (
                    <div key={campaign.id} className="border border-border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{campaign.name}</h3>
                        <Badge className={
                          campaign.status === 'active' ? 'bg-green-500/20 text-green-500' :
                          campaign.status === 'paused' ? 'bg-yellow-500/20 text-yellow-500' :
                          'bg-gray-500/20 text-gray-500'
                        }>
                          {campaign.status?.toUpperCase() || 'UNKNOWN'}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Reach: </span>
                          <span className="font-medium">{campaign.reach.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">ROI: </span>
                          <span className="font-medium text-green-500">{campaign.roi}x</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Engagement: </span>
                          <span className="font-medium">{campaign.engagement}%</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Conversions: </span>
                          <span className="font-medium">{campaign.conversions}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="nuclear-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Share size={20} className="text-electric-cyan" />
                  Social Media Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { platform: 'Instagram', followers: '12.5K', engagement: '8.9%', icon: InstagramLogo },
                    { platform: 'Facebook', followers: '8.2K', engagement: '5.4%', icon: FacebookLogo },
                    { platform: 'TikTok', followers: '15.1K', engagement: '12.3%', icon: TiktokLogo },
                    { platform: 'WhatsApp', followers: '2.1K', engagement: '45.2%', icon: WhatsappLogo }
                  ].map((social) => (
                    <div key={social.platform} className="flex items-center justify-between p-3 border border-border rounded-lg">
                      <div className="flex items-center gap-3">
                        <social.icon size={24} className="text-nuclear-blue" />
                        <div>
                          <p className="font-medium">{social.platform}</p>
                          <p className="text-sm text-muted-foreground">{social.followers} followers</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-electric-cyan">{social.engagement}</p>
                        <p className="text-xs text-muted-foreground">engagement</p>
                      </div>
                    </div>
                  ))}
                  
                  <Button className="w-full nuclear-button">
                    <CloudArrowUp className="mr-2 h-4 w-4" />
                    Schedule Posts
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* AI Insights */}
        <TabsContent value="insights" className="space-y-6">
          <Card className="nuclear-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain size={24} className="text-nuclear-blue" />
                AI Business Insights
              </CardTitle>
              <CardDescription>
                Real-time AI analysis of your business performance and opportunities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {aiInsights?.map((insight) => (
                  <motion.div
                    key={insight.id}
                    className={`border rounded-lg p-4 ${
                      insight.type === 'opportunity' ? 'border-green-500/30 bg-green-500/5' :
                      insight.type === 'warning' ? 'border-yellow-500/30 bg-yellow-500/5' :
                      insight.type === 'optimization' ? 'border-blue-500/30 bg-blue-500/5' :
                      'border-purple-500/30 bg-purple-500/5'
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          {insight.type === 'opportunity' && <Target className="h-5 w-5 text-green-500" />}
                          {insight.type === 'warning' && <Warning className="h-5 w-5 text-yellow-500" />}
                          {insight.type === 'optimization' && <Lightning className="h-5 w-5 text-blue-500" />}
                          {insight.type === 'trend' && <TrendUp className="h-5 w-5 text-purple-500" />}
                          <h3 className="font-semibold">{insight.title}</h3>
                          <Badge className={`${
                            insight.impact === 'high' ? 'bg-red-500/20 text-red-500' :
                            insight.impact === 'medium' ? 'bg-yellow-500/20 text-yellow-500' :
                            'bg-green-500/20 text-green-500'
                          }`}>
                            {insight.impact?.toUpperCase() || 'UNKNOWN'} IMPACT
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{insight.description}</p>
                        <p className="text-xs text-muted-foreground">{insight.timestamp}</p>
                      </div>
                      {insight.actionRequired && (
                        <Button size="sm" className="nuclear-button">
                          Take Action
                        </Button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Competition Analysis */}
        <TabsContent value="competition" className="space-y-6">
          <Card className="nuclear-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target size={24} className="text-nuclear-blue" />
                Competitive Analysis
              </CardTitle>
              <CardDescription>
                Real-time monitoring of competitors in Zona Rosa
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {competitors.map((competitor, index) => (
                  <motion.div
                    key={competitor.name}
                    className="border border-border rounded-lg p-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">{competitor.name}</h3>
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500" fill="currentColor" />
                        <span>{competitor.rating}</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Price Range</p>
                        <p className="font-medium">{competitor.priceRange}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Social Followers</p>
                        <p className="font-medium">{competitor.socialFollowers.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Wait Time</p>
                        <p className="font-medium">{competitor.averageWaitTime}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Status</p>
                        <Badge className="bg-green-500/20 text-green-500">MONITORED</Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-green-500 mb-2">Strengths</p>
                        <ul className="text-sm space-y-1">
                          {competitor.strengths.map((strength, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <CheckCircle className="h-3 w-3 text-green-500" />
                              {strength}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-red-500 mb-2">Weaknesses</p>
                        <ul className="text-sm space-y-1">
                          {competitor.weaknesses.map((weakness, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <XCircle className="h-3 w-3 text-red-500" />
                              {weakness}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations */}
        <TabsContent value="integration" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { 
                name: 'Whop Payments', 
                status: 'connected', 
                description: 'Process payments & subscriptions',
                icon: CreditCard,
                features: ['Payment Processing', 'Subscription Management', 'Analytics']
              },
              { 
                name: 'Instagram API', 
                status: 'connected', 
                description: 'Auto-post content & track engagement',
                icon: InstagramLogo,
                features: ['Auto Posting', 'Analytics', 'Story Management']
              },
              { 
                name: 'WhatsApp Business', 
                status: 'connected', 
                description: 'Customer communication & marketing',
                icon: WhatsappLogo,
                features: ['Automated Messages', 'Customer Support', 'Broadcast Lists']
              },
              { 
                name: 'Google My Business', 
                status: 'pending', 
                description: 'Manage reviews & local SEO',
                icon: Globe,
                features: ['Review Management', 'Local SEO', 'Business Hours']
              },
              { 
                name: 'Mailchimp', 
                status: 'disconnected', 
                description: 'Email marketing campaigns',
                icon: Envelope,
                features: ['Email Campaigns', 'Automation', 'Analytics']
              },
              { 
                name: 'Slack', 
                status: 'connected', 
                description: 'Team notifications & alerts',
                icon: Bell,
                features: ['Order Alerts', 'Low Stock Warnings', 'Daily Reports']
              }
            ].map((integration, index) => (
              <motion.div
                key={integration.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="nuclear-card">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <integration.icon size={24} className="text-nuclear-blue" />
                      <Badge className={
                        integration.status === 'connected' ? 'bg-green-500/20 text-green-500' :
                        integration.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' :
                        'bg-gray-500/20 text-gray-500'
                      }>
                        {integration.status?.toUpperCase() || 'UNKNOWN'}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{integration.name}</CardTitle>
                    <CardDescription>{integration.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {integration.features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          {feature}
                        </div>
                      ))}
                      <Button 
                        className="w-full nuclear-button mt-4"
                        variant={integration.status === 'connected' ? 'outline' : 'default'}
                      >
                        {integration.status === 'connected' ? 'Configure' : 
                         integration.status === 'pending' ? 'Complete Setup' : 'Connect'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* API Health Dashboard */}
          <Card className="nuclear-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HardDrives size={24} className="text-nuclear-blue" />
                System Health & API Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Database size={20} className="text-electric-cyan" />
                    Database
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Connection</span>
                      <Badge className="bg-green-500/20 text-green-500">HEALTHY</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Response Time</span>
                      <span className="text-sm font-medium">12ms</span>
                    </div>
                    <Progress value={95} className="w-full" />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <WifiHigh size={20} className="text-electric-cyan" />
                    External APIs
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Payment Gateway</span>
                      <Badge className="bg-green-500/20 text-green-500">ONLINE</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Social Media</span>
                      <Badge className="bg-green-500/20 text-green-500">ONLINE</Badge>
                    </div>
                    <Progress value={98} className="w-full" />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Shield size={20} className="text-electric-cyan" />
                    Security
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">SSL Certificate</span>
                      <Badge className="bg-green-500/20 text-green-500">VALID</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Firewall</span>
                      <Badge className="bg-green-500/20 text-green-500">ACTIVE</Badge>
                    </div>
                    <Progress value={100} className="w-full" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}