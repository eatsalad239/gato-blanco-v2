import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { 
  Plus,
  PaperPlaneTilt,
  Eye,
  Heart,
  Share,
  Target,
  Lightning,
  Bell,
  Rocket,
  Sparkle,
  Globe,
  Camera,
  Envelope,
  ArrowClockwise
} from '@phosphor-icons/react';

import { useKV } from '@github/spark/hooks';
import { notificationService } from '../lib/notifications';

interface MarketingCampaign {
  id: string;
  name: string;
  type: 'instagram' | 'facebook' | 'whatsapp' | 'email' | 'sms';
  status: 'active' | 'scheduled' | 'completed';
  content: string;
  audience: 'all' | 'gringos' | 'locals' | 'vip';
  reach: number;
  engagement: number;
  clicks: number;
  scheduled: string;
  budget: number;
  performance: number; // 0-100 score
}

interface AutoPost {
  id: string;
  title: string;
  content: string;
  platforms: string[];
  schedule: string;
  isActive: boolean;
  lastPosted?: string;
  nextPost?: string;
}

export function MarketingAutomation() {
  const [campaigns, setCampaigns] = useKV<MarketingCampaign[]>('marketing-campaigns', []);
  const [autoPosts, setAutoPosts] = useKV<AutoPost[]>('auto-posts', []);
  const [newCampaign, setNewCampaign] = useState<Partial<MarketingCampaign>>({});
  const [newAutoPost, setNewAutoPost] = useState<Partial<AutoPost>>({});
  const [isCreatingCampaign, setIsCreatingCampaign] = useState(false);
  const [isCreatingAutoPost, setIsCreatingAutoPost] = useState(false);

  // Initialize with sample data if empty
  useEffect(() => {
    if (!campaigns || campaigns.length === 0) {
      const sampleCampaigns: MarketingCampaign[] = [
        {
          id: '1',
          name: '🇨🇴 Colombian Coffee Culture',
          type: 'instagram',
          status: 'active',
          content: 'Experience authentic Colombian coffee in the heart of Zona Rosa! ☕🇨🇴 #GatoBlanco #ColombiaCoffee #ZonaRosa',
          audience: 'all',
          reach: 2500,
          engagement: 185,
          clicks: 45,
          scheduled: new Date().toISOString(),
          budget: 50000,
          performance: 92
        },
        {
          id: '2',
          name: 'Gringo Services Promotion',
          type: 'facebook',
          status: 'active',
          content: 'Special services for international visitors! Language exchange, city tours, and authentic experiences 🌎✈️',
          audience: 'gringos',
          reach: 1200,
          engagement: 95,
          clicks: 28,
          scheduled: new Date(Date.now() - 86400000).toISOString(),
          budget: 75000,
          performance: 88
        }
      ];
      setCampaigns(sampleCampaigns);
    }

    if (!autoPosts || autoPosts.length === 0) {
      const sampleAutoPosts: AutoPost[] = [
        {
          id: '1',
          title: 'Daily Coffee Special',
          content: '☕ Today\'s special: Premium Colombian Single Origin - Limited time only! Visit us in Zona Rosa 🇨🇴',
          platforms: ['instagram', 'facebook'],
          schedule: 'daily at 8:00 AM',
          isActive: true,
          lastPosted: new Date(Date.now() - 3600000).toISOString(),
          nextPost: new Date(Date.now() + 82800000).toISOString()
        },
        {
          id: '2',
          title: 'Evening Cocktail Hour',
          content: '🍹 Cocktail hour starting now! Premium drinks & Colombian vibes in Zona Rosa 🌙',
          platforms: ['instagram', 'whatsapp'],
          schedule: 'daily at 6:00 PM',
          isActive: true,
          lastPosted: new Date(Date.now() - 7200000).toISOString(),
          nextPost: new Date(Date.now() + 79200000).toISOString()
        }
      ];
      setAutoPosts(sampleAutoPosts);
    }
  }, [campaigns, autoPosts]);

  const createCampaign = () => {
    if (!newCampaign.name || !newCampaign.content || !newCampaign.type) {
      notificationService.error('Please fill in all required fields');
      return;
    }

    const campaign: MarketingCampaign = {
      id: Date.now().toString(),
      name: newCampaign.name,
      type: newCampaign.type as MarketingCampaign['type'],
      status: 'active',
      content: newCampaign.content,
      audience: newCampaign.audience as MarketingCampaign['audience'] || 'all',
      reach: 0,
      engagement: 0,
      clicks: 0,
      scheduled: new Date().toISOString(),
      budget: newCampaign.budget || 50000,
      performance: Math.floor(Math.random() * 30) + 70 // Simulate 70-100% performance
    };

    setCampaigns(current => [...(current || []), campaign]);
    setNewCampaign({});
    setIsCreatingCampaign(false);
    notificationService.success('Campaign created and launched! 🚀');
  };

  const createAutoPost = () => {
    if (!newAutoPost.title || !newAutoPost.content || !newAutoPost.schedule) {
      notificationService.error('Please fill in all required fields');
      return;
    }

    const autoPost: AutoPost = {
      id: Date.now().toString(),
      title: newAutoPost.title,
      content: newAutoPost.content,
      platforms: newAutoPost.platforms || ['instagram'],
      schedule: newAutoPost.schedule,
      isActive: true,
      nextPost: new Date(Date.now() + 3600000).toISOString() // 1 hour from now
    };

    setAutoPosts(current => [...(current || []), autoPost]);
    setNewAutoPost({});
    setIsCreatingAutoPost(false);
    notificationService.success('Auto-post scheduled! 📅');
  };

  const toggleAutoPost = (id: string) => {
    setAutoPosts(current => 
      (current || []).map(post => 
        post.id === id ? { ...post, isActive: !post.isActive } : post
      )
    );
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'instagram': return <Camera size={16} className="text-pink-500" />;
      case 'facebook': return <Globe size={16} className="text-blue-500" />;
      case 'whatsapp': return <PaperPlaneTilt size={16} className="text-green-500" />;
      case 'email': return <PaperPlaneTilt size={16} className="text-purple-500" />;
      default: return <Share size={16} className="text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-500 border-green-500';
      case 'scheduled': return 'bg-blue-500/20 text-blue-500 border-blue-500';
      case 'completed': return 'bg-gray-500/20 text-gray-500 border-gray-500';
      default: return 'bg-gray-500/20 text-gray-500 border-gray-500';
    }
  };

  const getAudienceColor = (audience: string) => {
    switch (audience) {
      case 'gringos': return 'bg-electric-cyan/20 text-electric-cyan border-electric-cyan';
      case 'locals': return 'bg-colombia-blue/20 text-colombia-blue border-colombia-blue';
      case 'vip': return 'bg-plasma-blue/20 text-plasma-blue border-plasma-blue';
      default: return 'bg-nuclear-blue/20 text-nuclear-blue border-nuclear-blue';
    }
  };

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCampaigns(current => 
        (current || []).map(campaign => ({
          ...campaign,
          reach: campaign.reach + Math.floor(Math.random() * 10),
          engagement: campaign.engagement + Math.floor(Math.random() * 3),
          clicks: campaign.clicks + Math.floor(Math.random() * 2)
        }))
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h2 className="text-4xl font-black nuclear-text">🚀 Marketing Automation</h2>
        <p className="text-xl text-electric-cyan">Automated campaigns & social media management</p>
      </motion.div>

      {/* Active Campaigns */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-2xl font-bold nuclear-text">Active Campaigns</h3>
          <Dialog open={isCreatingCampaign} onOpenChange={setIsCreatingCampaign}>
            <DialogTrigger asChild>
              <Button className="nuclear-button">
                <Plus size={16} className="mr-2" />
                Create Campaign
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Marketing Campaign</DialogTitle>
                <DialogDescription>
                  Launch a new marketing campaign across platforms
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="campaignName">Campaign Name</Label>
                  <Input
                    id="campaignName"
                    value={newCampaign.name || ''}
                    onChange={(e) => setNewCampaign(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Weekend Coffee Special"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="campaignType">Platform</Label>
                  <Select 
                    value={newCampaign.type} 
                    onValueChange={(value: MarketingCampaign['type']) => setNewCampaign(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="facebook">Facebook</SelectItem>
                      <SelectItem value="whatsapp">WhatsApp</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="campaignAudience">Target Audience</Label>
                  <Select 
                    value={newCampaign.audience} 
                    onValueChange={(value: MarketingCampaign['audience']) => setNewCampaign(prev => ({ ...prev, audience: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select audience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Everyone</SelectItem>
                      <SelectItem value="gringos">International Visitors</SelectItem>
                      <SelectItem value="locals">Local Customers</SelectItem>
                      <SelectItem value="vip">VIP Customers</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="campaignContent">Content</Label>
                  <Input
                    id="campaignContent"
                    value={newCampaign.content || ''}
                    onChange={(e) => setNewCampaign(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Write your campaign message..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="campaignBudget">Budget (COP)</Label>
                  <Input
                    id="campaignBudget"
                    type="number"
                    value={newCampaign.budget || ''}
                    onChange={(e) => setNewCampaign(prev => ({ ...prev, budget: parseInt(e.target.value) }))}
                    placeholder="50000"
                  />
                </div>
                <Button onClick={createCampaign} className="w-full nuclear-button">
                  <Rocket size={16} className="mr-2" />
                  Launch Campaign
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6">
          {(campaigns || []).map((campaign) => (
            <motion.div
              key={campaign.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              layout
            >
              <Card className="nuclear-card">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {getTypeIcon(campaign.type)}
                        {campaign.name}
                      </CardTitle>
                      <CardDescription className="mt-2">
                        {campaign.content}
                      </CardDescription>
                    </div>
                    <div className="text-right space-y-2">
                      <Badge className={`${getStatusColor(campaign.status)} nuclear-glow`}>
                        {campaign.status?.toUpperCase() || 'UNKNOWN'}
                      </Badge>
                      <Badge className={`${getAudienceColor(campaign.audience)} nuclear-glow`}>
                        {campaign.audience?.toUpperCase() || 'UNKNOWN'}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div className="space-y-1">
                      <div className="flex items-center justify-center gap-1">
                        <Eye size={14} className="text-nuclear-blue" />
                        <span className="text-sm text-muted-foreground">Reach</span>
                      </div>
                      <div className="text-lg font-bold nuclear-text">{campaign.reach.toLocaleString()}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-center gap-1">
                        <Heart size={14} className="text-red-500" />
                        <span className="text-sm text-muted-foreground">Engagement</span>
                      </div>
                      <div className="text-lg font-bold nuclear-text">{campaign.engagement}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-center gap-1">
                        <Target size={14} className="text-green-500" />
                        <span className="text-sm text-muted-foreground">Clicks</span>
                      </div>
                      <div className="text-lg font-bold nuclear-text">{campaign.clicks}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-center gap-1">
                        <Sparkle size={14} className="text-electric-cyan" />
                        <span className="text-sm text-muted-foreground">Performance</span>
                      </div>
                      <div className="text-lg font-bold nuclear-text">{campaign.performance}%</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Auto Posts */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-2xl font-bold nuclear-text">Automated Posts</h3>
          <Dialog open={isCreatingAutoPost} onOpenChange={setIsCreatingAutoPost}>
            <DialogTrigger asChild>
              <Button className="nuclear-button">
                <ArrowClockwise size={16} className="mr-2" />
                Add Auto Post
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Automated Post</DialogTitle>
                <DialogDescription>
                  Schedule automatic posts across platforms
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="postTitle">Post Title</Label>
                  <Input
                    id="postTitle"
                    value={newAutoPost.title || ''}
                    onChange={(e) => setNewAutoPost(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Daily Coffee Special"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postContent">Post Content</Label>
                  <Input
                    id="postContent"
                    value={newAutoPost.content || ''}
                    onChange={(e) => setNewAutoPost(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Write your post content..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postSchedule">Schedule</Label>
                  <Input
                    id="postSchedule"
                    value={newAutoPost.schedule || ''}
                    onChange={(e) => setNewAutoPost(prev => ({ ...prev, schedule: e.target.value }))}
                    placeholder="e.g., daily at 9:00 AM"
                  />
                </div>
                <Button onClick={createAutoPost} className="w-full nuclear-button">
                  <Bell size={16} className="mr-2" />
                  Schedule Auto Post
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4">
          {(autoPosts || []).map((post) => (
            <Card key={post.id} className="nuclear-card">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Lightning size={18} className="text-electric-cyan" />
                      {post.title}
                    </CardTitle>
                    <CardDescription className="mt-2">
                      {post.content}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`${post.isActive 
                      ? 'bg-green-500/20 text-green-500 border-green-500' 
                      : 'bg-gray-500/20 text-gray-500 border-gray-500'
                    } nuclear-glow`}>
                      {post.isActive ? 'ACTIVE' : 'PAUSED'}
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleAutoPost(post.id)}
                    >
                      {post.isActive ? 'Pause' : 'Activate'}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                  <span>📅 {post.schedule}</span>
                  {post.nextPost && (
                    <span>⏰ Next: {new Date(post.nextPost).toLocaleString()}</span>
                  )}
                  <span>📱 Platforms: {post.platforms.join(', ')}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}