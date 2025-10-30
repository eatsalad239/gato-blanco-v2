import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  TrendingUp,
  Users,
  DollarSign,
  ShoppingCart,
  Package,
  AlertTriangle,
  CheckCircle,
  Clock,
  Star,
  MessageSquare,
  Settings,
  Download,
  Upload,
  Plus,
  Edit,
  Trash2,
  Eye,
  Calendar as CalendarIcon,
  BarChart3,
  PieChartIcon,
  Activity,
  Zap
} from 'lucide-react';

interface SalesData {
  date: string;
  revenue: number;
  orders: number;
  customers: number;
}

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unitCost: number;
  sellingPrice: number;
  supplier: string;
  lastRestocked: string;
}

interface CustomerData {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  lastOrder: string;
  vipStatus: boolean;
  notes: string;
}

interface StaffMember {
  id: string;
  name: string;
  role: string;
  schedule: string;
  performance: number;
  salary: number;
}

interface OwnerBackendSystemProps {
  isGringo: boolean;
  currentLanguage: any;
}

const mockSalesData: SalesData[] = [
  { date: '2024-01-01', revenue: 2500000, orders: 45, customers: 32 },
  { date: '2024-01-02', revenue: 3200000, orders: 52, customers: 41 },
  { date: '2024-01-03', revenue: 2800000, orders: 48, customers: 35 },
  { date: '2024-01-04', revenue: 4100000, orders: 68, customers: 55 },
  { date: '2024-01-05', revenue: 3600000, orders: 58, customers: 47 },
  { date: '2024-01-06', revenue: 2900000, orders: 49, customers: 38 },
  { date: '2024-01-07', revenue: 3800000, orders: 62, customers: 51 },
];

const mockInventory: InventoryItem[] = [
  {
    id: '1',
    name: 'Colombian Coffee Beans - Supremo',
    category: 'Coffee',
    currentStock: 25,
    minStock: 10,
    maxStock: 50,
    unitCost: 15000,
    sellingPrice: 25000,
    supplier: 'Finca El Paraíso',
    lastRestocked: '2024-01-15'
  },
  {
    id: '2',
    name: 'Organic Sugar Cane Panela',
    category: 'Sweeteners',
    currentStock: 8,
    minStock: 15,
    maxStock: 40,
    unitCost: 8000,
    sellingPrice: 12000,
    supplier: 'Cooperativa Paisa',
    lastRestocked: '2024-01-10'
  },
  {
    id: '3',
    name: 'Fresh Arepas Mix',
    category: 'Baking',
    currentStock: 12,
    minStock: 20,
    maxStock: 60,
    unitCost: 5000,
    sellingPrice: 8000,
    supplier: 'Molino Antioqueño',
    lastRestocked: '2024-01-12'
  }
];

const mockCustomers: CustomerData[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@example.com',
    phone: '+1 555-0123',
    totalOrders: 12,
    totalSpent: 480000,
    lastOrder: '2024-01-15',
    vipStatus: true,
    notes: 'Regular customer, prefers Colombian blend'
  },
  {
    id: '2',
    name: 'Maria Rodriguez',
    email: 'maria@example.com',
    phone: '+57 300-123-4567',
    totalOrders: 8,
    totalSpent: 320000,
    lastOrder: '2024-01-14',
    vipStatus: false,
    notes: 'Local customer, orders weekly'
  }
];

const mockStaff: StaffMember[] = [
  {
    id: '1',
    name: 'Ana Maria',
    role: 'Barista',
    schedule: 'Mon-Fri 7AM-3PM',
    performance: 95,
    salary: 1200000
  },
  {
    id: '2',
    name: 'Carlos Mendoza',
    role: 'Manager',
    schedule: 'Mon-Sat 8AM-6PM',
    performance: 98,
    salary: 1800000
  },
  {
    id: '3',
    name: 'Sofia Garcia',
    role: 'Server',
    schedule: 'Tue-Sun 11AM-9PM',
    performance: 92,
    salary: 1000000
  }
];

export const OwnerBackendSystem: React.FC<OwnerBackendSystemProps> = ({ isGringo, currentLanguage }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [lowStockAlerts] = useState(mockInventory.filter(item => item.currentStock <= item.minStock));
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerData | null>(null);

  const totalRevenue = mockSalesData.reduce((sum, day) => sum + day.revenue, 0);
  const totalOrders = mockSalesData.reduce((sum, day) => sum + day.orders, 0);
  const totalCustomers = mockSalesData.reduce((sum, day) => sum + day.customers, 0);
  const avgOrderValue = totalRevenue / totalOrders;

  const inventoryValue = mockInventory.reduce((sum, item) => sum + (item.currentStock * item.unitCost), 0);
  const potentialRevenue = mockInventory.reduce((sum, item) => sum + (item.currentStock * item.sellingPrice), 0);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                🚀 GATO BLANCO OWNER DASHBOARD
              </h1>
              <p className="text-slate-400 mt-2">
                {isGringo ? 'Advanced Business Intelligence & Management System' : 'Sistema Avanzado de Inteligencia Empresarial y Gestión'}
              </p>
            </div>
            <div className="flex gap-4">
              <Button variant="outline" className="border-slate-600">
                <Download className="h-4 w-4 mr-2" />
                {isGringo ? 'Export Report' : 'Exportar Reporte'}
              </Button>
              <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600">
                <Settings className="h-4 w-4 mr-2" />
                {isGringo ? 'Settings' : 'Configuración'}
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 border-green-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-400 text-sm font-medium">
                    {isGringo ? 'Total Revenue' : 'Ingresos Totales'}
                  </p>
                  <p className="text-2xl font-bold text-white">
                    ${totalRevenue.toLocaleString()}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-green-400" />
              </div>
              <div className="mt-4 flex items-center text-sm">
                <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
                <span className="text-green-400">+12.5%</span>
                <span className="text-slate-400 ml-2">
                  {isGringo ? 'vs last week' : 'vs semana anterior'}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500/20 to-cyan-600/20 border-blue-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-400 text-sm font-medium">
                    {isGringo ? 'Total Orders' : 'Pedidos Totales'}
                  </p>
                  <p className="text-2xl font-bold text-white">{totalOrders}</p>
                </div>
                <ShoppingCart className="h-8 w-8 text-blue-400" />
              </div>
              <div className="mt-4 flex items-center text-sm">
                <TrendingUp className="h-4 w-4 text-blue-400 mr-1" />
                <span className="text-blue-400">+8.2%</span>
                <span className="text-slate-400 ml-2">
                  {isGringo ? 'vs last week' : 'vs semana anterior'}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/20 to-pink-600/20 border-purple-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-400 text-sm font-medium">
                    {isGringo ? 'Avg Order Value' : 'Valor Promedio Pedido'}
                  </p>
                  <p className="text-2xl font-bold text-white">
                    ${Math.round(avgOrderValue).toLocaleString()}
                  </p>
                </div>
                <BarChart3 className="h-8 w-8 text-purple-400" />
              </div>
              <div className="mt-4 flex items-center text-sm">
                <TrendingUp className="h-4 w-4 text-purple-400 mr-1" />
                <span className="text-purple-400">+5.7%</span>
                <span className="text-slate-400 ml-2">
                  {isGringo ? 'vs last week' : 'vs semana anterior'}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500/20 to-red-600/20 border-orange-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-400 text-sm font-medium">
                    {isGringo ? 'Active Customers' : 'Clientes Activos'}
                  </p>
                  <p className="text-2xl font-bold text-white">{totalCustomers}</p>
                </div>
                <Users className="h-8 w-8 text-orange-400" />
              </div>
              <div className="mt-4 flex items-center text-sm">
                <TrendingUp className="h-4 w-4 text-orange-400 mr-1" />
                <span className="text-orange-400">+15.3%</span>
                <span className="text-slate-400 ml-2">
                  {isGringo ? 'vs last week' : 'vs semana anterior'}
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Low Stock Alerts */}
        {lowStockAlerts.length > 0 && (
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border-red-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-400">
                  <AlertTriangle className="h-5 w-5" />
                  {isGringo ? 'Low Stock Alerts' : 'Alertas de Stock Bajo'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {lowStockAlerts.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-red-500/10 rounded-lg">
                      <div>
                        <p className="font-medium text-white">{item.name}</p>
                        <p className="text-sm text-red-300">
                          {isGringo ? 'Current:' : 'Actual:'} {item.currentStock} |
                          {isGringo ? 'Minimum:' : 'Mínimo:'} {item.minStock}
                        </p>
                      </div>
                      <Badge variant="destructive">
                        {isGringo ? 'Reorder Needed' : 'Reorden Necesario'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Main Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6 bg-slate-800">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-orange-500">
              <BarChart3 className="h-4 w-4 mr-2" />
              {isGringo ? 'Dashboard' : 'Panel'}
            </TabsTrigger>
            <TabsTrigger value="inventory" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-orange-500">
              <Package className="h-4 w-4 mr-2" />
              {isGringo ? 'Inventory' : 'Inventario'}
            </TabsTrigger>
            <TabsTrigger value="customers" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-orange-500">
              <Users className="h-4 w-4 mr-2" />
              {isGringo ? 'Customers' : 'Clientes'}
            </TabsTrigger>
            <TabsTrigger value="staff" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-orange-500">
              <Star className="h-4 w-4 mr-2" />
              {isGringo ? 'Staff' : 'Personal'}
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-orange-500">
              <Activity className="h-4 w-4 mr-2" />
              {isGringo ? 'Analytics' : 'Analíticas'}
            </TabsTrigger>
            <TabsTrigger value="reports" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-orange-500">
              <Download className="h-4 w-4 mr-2" />
              {isGringo ? 'Reports' : 'Reportes'}
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Sales Chart */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-400" />
                    {isGringo ? 'Sales Performance' : 'Rendimiento de Ventas'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={mockSalesData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="date" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1F2937',
                          border: '1px solid #374151',
                          borderRadius: '8px'
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#10B981"
                        strokeWidth={2}
                        dot={{ fill: '#10B981' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Order Distribution */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <PieChartIcon className="h-5 w-5 text-blue-400" />
                    {isGringo ? 'Order Categories' : 'Categorías de Pedidos'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: isGringo ? 'Coffee' : 'Café', value: 45, color: '#10B981' },
                          { name: isGringo ? 'Food' : 'Comida', value: 30, color: '#3B82F6' },
                          { name: isGringo ? 'Drinks' : 'Bebidas', value: 25, color: '#F59E0B' }
                        ]}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                      >
                        {[
                          { name: isGringo ? 'Coffee' : 'Café', value: 45, color: '#10B981' },
                          { name: isGringo ? 'Food' : 'Comida', value: 30, color: '#3B82F6' },
                          { name: isGringo ? 'Drinks' : 'Bebidas', value: 25, color: '#F59E0B' }
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Clock className="h-5 w-5 text-purple-400" />
                  {isGringo ? 'Recent Activity' : 'Actividad Reciente'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      time: '2 minutes ago',
                      action: isGringo ? 'New order placed' : 'Nuevo pedido realizado',
                      amount: '$45,000',
                      status: 'completed'
                    },
                    {
                      time: '15 minutes ago',
                      action: isGringo ? 'Inventory alert: Low stock on coffee beans' : 'Alerta de inventario: Stock bajo en granos de café',
                      amount: '',
                      status: 'warning'
                    },
                    {
                      time: '1 hour ago',
                      action: isGringo ? 'Customer John Smith became VIP' : 'Cliente John Smith se convirtió en VIP',
                      amount: '',
                      status: 'info'
                    }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${
                          activity.status === 'completed' ? 'bg-green-400' :
                          activity.status === 'warning' ? 'bg-yellow-400' : 'bg-blue-400'
                        }`} />
                        <div>
                          <p className="text-white font-medium">{activity.action}</p>
                          <p className="text-slate-400 text-sm">{activity.time}</p>
                        </div>
                      </div>
                      {activity.amount && (
                        <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                          {activity.amount}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Inventory Tab */}
          <TabsContent value="inventory" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {isGringo ? 'Inventory Management' : 'Gestión de Inventario'}
                </h2>
                <p className="text-slate-400">
                  {isGringo ? 'Track stock levels and manage suppliers' : 'Seguimiento de niveles de stock y gestión de proveedores'}
                </p>
              </div>
              <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600">
                <Plus className="h-4 w-4 mr-2" />
                {isGringo ? 'Add Item' : 'Agregar Artículo'}
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm">
                        {isGringo ? 'Total Inventory Value' : 'Valor Total Inventario'}
                      </p>
                      <p className="text-2xl font-bold text-white">
                        ${inventoryValue.toLocaleString()}
                      </p>
                    </div>
                    <Package className="h-8 w-8 text-blue-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm">
                        {isGringo ? 'Potential Revenue' : 'Ingresos Potenciales'}
                      </p>
                      <p className="text-2xl font-bold text-white">
                        ${potentialRevenue.toLocaleString()}
                      </p>
                    </div>
                    <DollarSign className="h-8 w-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm">
                        {isGringo ? 'Low Stock Items' : 'Artículos con Stock Bajo'}
                      </p>
                      <p className="text-2xl font-bold text-white">{lowStockAlerts.length}</p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-red-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">
                  {isGringo ? 'Inventory Items' : 'Artículos de Inventario'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-700">
                      <TableHead className="text-slate-300">
                        {isGringo ? 'Item' : 'Artículo'}
                      </TableHead>
                      <TableHead className="text-slate-300">
                        {isGringo ? 'Category' : 'Categoría'}
                      </TableHead>
                      <TableHead className="text-slate-300">
                        {isGringo ? 'Stock' : 'Existencias'}
                      </TableHead>
                      <TableHead className="text-slate-300">
                        {isGringo ? 'Cost/Unit' : 'Costo/Unidad'}
                      </TableHead>
                      <TableHead className="text-slate-300">
                        {isGringo ? 'Selling Price' : 'Precio Venta'}
                      </TableHead>
                      <TableHead className="text-slate-300">
                        {isGringo ? 'Actions' : 'Acciones'}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockInventory.map((item) => (
                      <TableRow key={item.id} className="border-slate-700">
                        <TableCell className="text-white font-medium">{item.name}</TableCell>
                        <TableCell className="text-slate-300">{item.category}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className={`font-medium ${
                              item.currentStock <= item.minStock ? 'text-red-400' :
                              item.currentStock >= item.maxStock * 0.8 ? 'text-yellow-400' : 'text-green-400'
                            }`}>
                              {item.currentStock}
                            </span>
                            <Progress
                              value={(item.currentStock / item.maxStock) * 100}
                              className="w-16 h-2"
                            />
                          </div>
                        </TableCell>
                        <TableCell className="text-slate-300">
                          ${item.unitCost.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-green-400 font-medium">
                          ${item.sellingPrice.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Customers Tab */}
          <TabsContent value="customers" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {isGringo ? 'Customer Management' : 'Gestión de Clientes'}
                </h2>
                <p className="text-slate-400">
                  {isGringo ? 'Track customer behavior and VIP status' : 'Seguimiento del comportamiento del cliente y estado VIP'}
                </p>
              </div>
              <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600">
                <Plus className="h-4 w-4 mr-2" />
                {isGringo ? 'Add Customer' : 'Agregar Cliente'}
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {mockCustomers.map((customer) => (
                <Card key={customer.id} className="bg-slate-800/50 border-slate-700 hover:bg-slate-700/50 transition-colors">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white flex items-center gap-2">
                        {customer.name}
                        {customer.vipStatus && (
                          <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                            VIP
                          </Badge>
                        )}
                      </CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedCustomer(customer)}
                        className="text-slate-400 hover:text-white"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">
                          {isGringo ? 'Total Orders:' : 'Pedidos Totales:'}
                        </span>
                        <span className="text-white font-medium">{customer.totalOrders}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">
                          {isGringo ? 'Total Spent:' : 'Total Gastado:'}
                        </span>
                        <span className="text-green-400 font-medium">
                          ${customer.totalSpent.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">
                          {isGringo ? 'Last Order:' : 'Último Pedido:'}
                        </span>
                        <span className="text-white">{customer.lastOrder}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Staff Tab */}
          <TabsContent value="staff" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {isGringo ? 'Staff Management' : 'Gestión de Personal'}
                </h2>
                <p className="text-slate-400">
                  {isGringo ? 'Monitor staff performance and scheduling' : 'Monitoreo del rendimiento del personal y programación'}
                </p>
              </div>
              <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600">
                <Plus className="h-4 w-4 mr-2" />
                {isGringo ? 'Add Staff' : 'Agregar Personal'}
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockStaff.map((staff) => (
                <Card key={staff.id} className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center justify-between">
                      {staff.name}
                      <Badge variant="secondary" className="text-xs">
                        {staff.role}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-slate-400">
                            {isGringo ? 'Performance' : 'Rendimiento'}
                          </span>
                          <span className="text-white font-medium">{staff.performance}%</span>
                        </div>
                        <Progress value={staff.performance} className="h-2" />
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-400">
                            {isGringo ? 'Schedule:' : 'Horario:'}
                          </span>
                          <span className="text-white">{staff.schedule}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">
                            {isGringo ? 'Salary:' : 'Salario:'}
                          </span>
                          <span className="text-green-400">
                            ${staff.salary.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                {isGringo ? 'Advanced Analytics' : 'Analíticas Avanzadas'}
              </h2>
              <p className="text-slate-400">
                {isGringo ? 'Deep insights into business performance' : 'Perspectivas profundas del rendimiento empresarial'}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">
                    {isGringo ? 'Revenue Trends' : 'Tendencias de Ingresos'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={mockSalesData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="date" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1F2937',
                          border: '1px solid #374151',
                          borderRadius: '8px'
                        }}
                      />
                      <Bar dataKey="revenue" fill="#10B981" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">
                    {isGringo ? 'Customer Acquisition' : 'Adquisición de Clientes'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={mockSalesData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="date" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1F2937',
                          border: '1px solid #374151',
                          borderRadius: '8px'
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="customers"
                        stroke="#3B82F6"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                {isGringo ? 'Business Reports' : 'Reportes Empresariales'}
              </h2>
              <p className="text-slate-400">
                {isGringo ? 'Generate and download comprehensive reports' : 'Generar y descargar reportes completos'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: isGringo ? 'Sales Report' : 'Reporte de Ventas',
                  description: isGringo ? 'Detailed sales analysis' : 'Análisis detallado de ventas',
                  icon: DollarSign,
                  color: 'from-green-500 to-emerald-600'
                },
                {
                  title: isGringo ? 'Inventory Report' : 'Reporte de Inventario',
                  description: isGringo ? 'Stock levels and costs' : 'Niveles de stock y costos',
                  icon: Package,
                  color: 'from-blue-500 to-cyan-600'
                },
                {
                  title: isGringo ? 'Customer Report' : 'Reporte de Clientes',
                  description: isGringo ? 'Customer behavior analysis' : 'Análisis del comportamiento del cliente',
                  icon: Users,
                  color: 'from-purple-500 to-pink-600'
                },
                {
                  title: isGringo ? 'Staff Performance' : 'Rendimiento del Personal',
                  description: isGringo ? 'Staff metrics and schedules' : 'Métricas y horarios del personal',
                  icon: Star,
                  color: 'from-orange-500 to-red-600'
                },
                {
                  title: isGringo ? 'Financial Summary' : 'Resumen Financiero',
                  description: isGringo ? 'Profit and loss analysis' : 'Análisis de ganancias y pérdidas',
                  icon: TrendingUp,
                  color: 'from-yellow-500 to-orange-600'
                },
                {
                  title: isGringo ? 'Operations Report' : 'Reporte de Operaciones',
                  description: isGringo ? 'Daily operations summary' : 'Resumen diario de operaciones',
                  icon: Activity,
                  color: 'from-indigo-500 to-purple-600'
                }
              ].map((report, index) => (
                <Card key={index} className="bg-slate-800/50 border-slate-700 hover:bg-slate-700/50 transition-all duration-200 hover:scale-105">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${report.color} flex items-center justify-center mb-2`}>
                      <report.icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-white text-lg">{report.title}</CardTitle>
                    <CardDescription className="text-slate-400">
                      {report.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700">
                        <Eye className="h-4 w-4 mr-2" />
                        {isGringo ? 'Preview' : 'Vista Previa'}
                      </Button>
                      <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Customer Details Modal */}
        <Dialog open={!!selectedCustomer} onOpenChange={() => setSelectedCustomer(null)}>
          <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl">
                {selectedCustomer?.name}
                {selectedCustomer?.vipStatus && (
                  <Badge className="ml-2 bg-gradient-to-r from-yellow-500 to-orange-500">
                    VIP
                  </Badge>
                )}
              </DialogTitle>
              <DialogDescription className="text-slate-400">
                {isGringo ? 'Customer details and order history' : 'Detalles del cliente e historial de pedidos'}
              </DialogDescription>
            </DialogHeader>

            {selectedCustomer && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-slate-400">
                      {isGringo ? 'Email' : 'Correo'}
                    </Label>
                    <p className="text-white font-medium">{selectedCustomer.email}</p>
                  </div>
                  <div>
                    <Label className="text-slate-400">
                      {isGringo ? 'Phone' : 'Teléfono'}
                    </Label>
                    <p className="text-white font-medium">{selectedCustomer.phone}</p>
                  </div>
                  <div>
                    <Label className="text-slate-400">
                      {isGringo ? 'Total Orders' : 'Pedidos Totales'}
                    </Label>
                    <p className="text-white font-medium">{selectedCustomer.totalOrders}</p>
                  </div>
                  <div>
                    <Label className="text-slate-400">
                      {isGringo ? 'Total Spent' : 'Total Gastado'}
                    </Label>
                    <p className="text-green-400 font-medium">
                      ${selectedCustomer.totalSpent.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div>
                  <Label className="text-slate-400">
                    {isGringo ? 'Notes' : 'Notas'}
                  </Label>
                  <Textarea
                    value={selectedCustomer.notes}
                    readOnly
                    className="bg-slate-700 border-slate-600 text-white mt-2"
                  />
                </div>

                <div className="flex gap-3">
                  <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    {isGringo ? 'Send Message' : 'Enviar Mensaje'}
                  </Button>
                  <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                    <Edit className="h-4 w-4 mr-2" />
                    {isGringo ? 'Edit Customer' : 'Editar Cliente'}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};