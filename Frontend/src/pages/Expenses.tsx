import { useState, useEffect } from "react";
import { Plus, Search, Filter, Download, Eye, Edit, Trash2, DollarSign, Calculator, TrendingUp, BarChart3, PieChart, FileText, Calendar, Truck, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";

interface ExpenseData {
  id: string;
  date: string;
  category: 'fuel' | 'maintenance' | 'driver_payment' | 'office' | 'other';
  description: string;
  amount: number;
  vehicleId?: string;
  vehicleNumber?: string;
  driverId?: string;
  driverName?: string;
  paymentMethod: 'cash' | 'online' | 'bank';
  status: 'paid' | 'pending' | 'cancelled';
  receiptNumber?: string;
  notes?: string;
}

interface DriverKhata {
  id: string;
  driverId: string;
  driverName: string;
  vehicleNumber: string;
  date: string;
  type: 'payment' | 'advance' | 'deduction';
  amount: number;
  description: string;
  balance: number;
  status: 'paid' | 'pending';
}

interface FinancialReport {
  period: string;
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  totalShipments: number;
  totalDeliveries: number;
  outstandingPayments: number;
  driverPayments: number;
}

export default function Expenses() {
  const { t, language } = useLanguage();
  const [expenses, setExpenses] = useState<ExpenseData[]>([]);
  const [driverKhata, setDriverKhata] = useState<DriverKhata[]>([]);
  const [isExpenseFormOpen, setIsExpenseFormOpen] = useState(false);
  const [isKhataFormOpen, setIsKhataFormOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<ExpenseData | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [activeTab, setActiveTab] = useState<'expenses' | 'khata' | 'reports'>('expenses');

  // Expense form state
  const [expenseForm, setExpenseForm] = useState<Partial<ExpenseData>>({
    date: new Date().toISOString().split('T')[0],
    category: 'other',
    description: "",
    amount: 0,
    paymentMethod: 'cash',
    status: 'paid'
  });

  // Khata form state
  const [khataForm, setKhataForm] = useState<Partial<DriverKhata>>({
    date: new Date().toISOString().split('T')[0],
    type: 'payment',
    amount: 0,
    description: "",
    status: 'paid'
  });

  // Sample data
  useEffect(() => {
    const sampleExpenses: ExpenseData[] = [
      {
        id: "1",
        date: "2024-01-15",
        category: "fuel",
        description: "Diesel for ABC-123 truck",
        amount: 15000,
        vehicleId: "1",
        vehicleNumber: "ABC-123",
        driverId: "1",
        driverName: "Muhammad Hassan",
        paymentMethod: "cash",
        status: "paid",
        receiptNumber: "RCP-001",
        notes: "Full tank refill"
      },
      {
        id: "2",
        date: "2024-01-16",
        category: "maintenance",
        description: "Tire replacement for XYZ-789",
        amount: 25000,
        vehicleId: "2",
        vehicleNumber: "XYZ-789",
        driverId: "2",
        driverName: "Ahmed Ali",
        paymentMethod: "online",
        status: "paid",
        receiptNumber: "RCP-002",
        notes: "4 new tires"
      },
      {
        id: "3",
        date: "2024-01-17",
        category: "driver_payment",
        description: "Monthly salary payment",
        amount: 35000,
        driverId: "1",
        driverName: "Muhammad Hassan",
        paymentMethod: "bank",
        status: "paid",
        receiptNumber: "RCP-003"
      }
    ];

    const sampleKhata: DriverKhata[] = [
      {
        id: "1",
        driverId: "1",
        driverName: "Muhammad Hassan",
        vehicleNumber: "ABC-123",
        date: "2024-01-15",
        type: "payment",
        amount: 3000,
        description: "Trip payment for Karachi-Lahore",
        balance: 2000,
        status: "paid"
      },
      {
        id: "2",
        driverId: "1",
        driverName: "Muhammad Hassan",
        vehicleNumber: "ABC-123",
        date: "2024-01-16",
        type: "advance",
        amount: 5000,
        description: "Advance for family emergency",
        balance: -3000,
        status: "paid"
      },
      {
        id: "3",
        driverId: "2",
        driverName: "Ahmed Ali",
        vehicleNumber: "XYZ-789",
        date: "2024-01-17",
        type: "payment",
        amount: 2500,
        description: "Trip payment for Islamabad-Peshawar",
        balance: 2500,
        status: "pending"
      }
    ];

    setExpenses(sampleExpenses);
    setDriverKhata(sampleKhata);
  }, []);

  const handleExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newExpense: ExpenseData = {
      id: Date.now().toString(),
      receiptNumber: `RCP-${Date.now().toString().slice(-6)}`,
      ...expenseForm
    } as ExpenseData;

    setExpenses([...expenses, newExpense]);
    setExpenseForm({
      date: new Date().toISOString().split('T')[0],
      category: 'other',
      description: "",
      amount: 0,
      paymentMethod: 'cash',
      status: 'paid'
    });
    setIsExpenseFormOpen(false);
  };

  const handleKhataSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newKhata: DriverKhata = {
      id: Date.now().toString(),
      balance: 0, // Calculate based on previous balance
      ...khataForm
    } as DriverKhata;

    setDriverKhata([...driverKhata, newKhata]);
    setKhataForm({
      date: new Date().toISOString().split('T')[0],
      type: 'payment',
      amount: 0,
      description: "",
      status: 'paid'
    });
    setIsKhataFormOpen(false);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'fuel': return 'bg-blue-100 text-blue-800';
      case 'maintenance': return 'bg-orange-100 text-orange-800';
      case 'driver_payment': return 'bg-green-100 text-green-800';
      case 'office': return 'bg-purple-100 text-purple-800';
      case 'other': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'payment': return 'bg-green-100 text-green-800';
      case 'advance': return 'bg-blue-100 text-blue-800';
      case 'deduction': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = 
      expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.vehicleNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.driverName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === "all" || expense.category === filterCategory;
    const matchesStatus = filterStatus === "all" || expense.status === filterStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalRevenue = 150000; // Sample data
  const netProfit = totalRevenue - totalExpenses;

  const financialReport: FinancialReport = {
    period: "January 2024",
    totalRevenue,
    totalExpenses,
    netProfit,
    totalShipments: 45,
    totalDeliveries: 38,
    outstandingPayments: 25000,
    driverPayments: 65000
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {language === 'ur' ? 'مالی انتظام' : 'Financial Management'}
          </h1>
          <p className="text-gray-600 mt-1">
            {language === 'ur' ? 'اخراجات، ڈرائیور کھاتہ اور مالی رپورٹس' : 'Expenses, driver khata and financial reports'}
          </p>
        </div>
        <div className="flex space-x-2">
          <Dialog open={isExpenseFormOpen} onOpenChange={setIsExpenseFormOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                {language === 'ur' ? 'نیا خرچہ' : 'New Expense'}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {language === 'ur' ? 'نیا خرچہ شامل کریں' : 'Add New Expense'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleExpenseSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date">
                      {language === 'ur' ? 'تاریخ' : 'Date'}
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      value={expenseForm.date}
                      onChange={(e) => setExpenseForm({...expenseForm, date: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">
                      {language === 'ur' ? 'قسم' : 'Category'}
                    </Label>
                    <Select
                      value={expenseForm.category}
                      onValueChange={(value) => setExpenseForm({...expenseForm, category: value as any})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fuel">{language === 'ur' ? 'ایندھن' : 'Fuel'}</SelectItem>
                        <SelectItem value="maintenance">{language === 'ur' ? 'مرمت' : 'Maintenance'}</SelectItem>
                        <SelectItem value="driver_payment">{language === 'ur' ? 'ڈرائیور کی ادائیگی' : 'Driver Payment'}</SelectItem>
                        <SelectItem value="office">{language === 'ur' ? 'دفتر' : 'Office'}</SelectItem>
                        <SelectItem value="other">{language === 'ur' ? 'دیگر' : 'Other'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="amount">
                      {language === 'ur' ? 'رقم' : 'Amount'}
                    </Label>
                    <Input
                      id="amount"
                      type="number"
                      value={expenseForm.amount}
                      onChange={(e) => setExpenseForm({...expenseForm, amount: parseFloat(e.target.value)})}
                      placeholder={language === 'ur' ? 'رقم درج کریں' : 'Enter amount'}
                    />
                  </div>
                  <div>
                    <Label htmlFor="paymentMethod">
                      {language === 'ur' ? 'ادائیگی کا طریقہ' : 'Payment Method'}
                    </Label>
                    <Select
                      value={expenseForm.paymentMethod}
                      onValueChange={(value) => setExpenseForm({...expenseForm, paymentMethod: value as any})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">{language === 'ur' ? 'نقد' : 'Cash'}</SelectItem>
                        <SelectItem value="online">{language === 'ur' ? 'آن لائن' : 'Online'}</SelectItem>
                        <SelectItem value="bank">{language === 'ur' ? 'بینک' : 'Bank'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">
                    {language === 'ur' ? 'تفصیل' : 'Description'}
                  </Label>
                  <Textarea
                    id="description"
                    value={expenseForm.description}
                    onChange={(e) => setExpenseForm({...expenseForm, description: e.target.value})}
                    placeholder={language === 'ur' ? 'تفصیل درج کریں' : 'Enter description'}
                  />
                </div>
                <div>
                  <Label htmlFor="notes">
                    {language === 'ur' ? 'نوٹس' : 'Notes'}
                  </Label>
                  <Textarea
                    id="notes"
                    value={expenseForm.notes}
                    onChange={(e) => setExpenseForm({...expenseForm, notes: e.target.value})}
                    placeholder={language === 'ur' ? 'نوٹس درج کریں' : 'Enter notes'}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsExpenseFormOpen(false)}>
                    {language === 'ur' ? 'منسوخ کریں' : 'Cancel'}
                  </Button>
                  <Button type="submit" className="bg-gradient-primary hover:bg-primary-hover text-white">
                    {language === 'ur' ? 'خرچہ شامل کریں' : 'Add Expense'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={isKhataFormOpen} onOpenChange={setIsKhataFormOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary hover:bg-primary-hover text-white">
                <Plus className="w-4 h-4 mr-2" />
                {language === 'ur' ? 'ڈرائیور کھاتہ' : 'Driver Khata'}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {language === 'ur' ? 'ڈرائیور کھاتہ شامل کریں' : 'Add Driver Khata Entry'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleKhataSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="driverName">
                      {language === 'ur' ? 'ڈرائیور کا نام' : 'Driver Name'}
                    </Label>
                    <Input
                      id="driverName"
                      value={khataForm.driverName}
                      onChange={(e) => setKhataForm({...khataForm, driverName: e.target.value})}
                      placeholder={language === 'ur' ? 'ڈرائیور کا نام درج کریں' : 'Enter driver name'}
                    />
                  </div>
                  <div>
                    <Label htmlFor="vehicleNumber">
                      {language === 'ur' ? 'گاڑی نمبر' : 'Vehicle Number'}
                    </Label>
                    <Input
                      id="vehicleNumber"
                      value={khataForm.vehicleNumber}
                      onChange={(e) => setKhataForm({...khataForm, vehicleNumber: e.target.value})}
                      placeholder={language === 'ur' ? 'گاڑی نمبر درج کریں' : 'Enter vehicle number'}
                    />
                  </div>
                  <div>
                    <Label htmlFor="khataDate">
                      {language === 'ur' ? 'تاریخ' : 'Date'}
                    </Label>
                    <Input
                      id="khataDate"
                      type="date"
                      value={khataForm.date}
                      onChange={(e) => setKhataForm({...khataForm, date: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">
                      {language === 'ur' ? 'قسم' : 'Type'}
                    </Label>
                    <Select
                      value={khataForm.type}
                      onValueChange={(value) => setKhataForm({...khataForm, type: value as any})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="payment">{language === 'ur' ? 'ادائیگی' : 'Payment'}</SelectItem>
                        <SelectItem value="advance">{language === 'ur' ? 'ادوانس' : 'Advance'}</SelectItem>
                        <SelectItem value="deduction">{language === 'ur' ? 'کٹوتی' : 'Deduction'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="khataAmount">
                      {language === 'ur' ? 'رقم' : 'Amount'}
                    </Label>
                    <Input
                      id="khataAmount"
                      type="number"
                      value={khataForm.amount}
                      onChange={(e) => setKhataForm({...khataForm, amount: parseFloat(e.target.value)})}
                      placeholder={language === 'ur' ? 'رقم درج کریں' : 'Enter amount'}
                    />
                  </div>
                  <div>
                    <Label htmlFor="khataStatus">
                      {language === 'ur' ? 'حیثیت' : 'Status'}
                    </Label>
                    <Select
                      value={khataForm.status}
                      onValueChange={(value) => setKhataForm({...khataForm, status: value as any})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="paid">{language === 'ur' ? 'ادا شدہ' : 'Paid'}</SelectItem>
                        <SelectItem value="pending">{language === 'ur' ? 'زیر التوا' : 'Pending'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="khataDescription">
                    {language === 'ur' ? 'تفصیل' : 'Description'}
                  </Label>
                  <Textarea
                    id="khataDescription"
                    value={khataForm.description}
                    onChange={(e) => setKhataForm({...khataForm, description: e.target.value})}
                    placeholder={language === 'ur' ? 'تفصیل درج کریں' : 'Enter description'}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsKhataFormOpen(false)}>
                    {language === 'ur' ? 'منسوخ کریں' : 'Cancel'}
                  </Button>
                  <Button type="submit" className="bg-gradient-primary hover:bg-primary-hover text-white">
                    {language === 'ur' ? 'کھاتہ شامل کریں' : 'Add Khata Entry'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{language === 'ur' ? 'کل آمدنی' : 'Total Revenue'}</p>
                <p className="text-2xl font-bold text-green-600">₨{financialReport.totalRevenue.toLocaleString()}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{language === 'ur' ? 'کل اخراجات' : 'Total Expenses'}</p>
                <p className="text-2xl font-bold text-red-600">₨{financialReport.totalExpenses.toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{language === 'ur' ? 'خالص منافع' : 'Net Profit'}</p>
                <p className="text-2xl font-bold text-blue-600">₨{financialReport.netProfit.toLocaleString()}</p>
              </div>
              <Calculator className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{language === 'ur' ? 'بقایا ادائیگی' : 'Outstanding'}</p>
                <p className="text-2xl font-bold text-orange-600">₨{financialReport.outstandingPayments.toLocaleString()}</p>
              </div>
              <FileText className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="expenses">
            <DollarSign className="w-4 h-4 mr-2" />
            {language === 'ur' ? 'اخراجات' : 'Expenses'}
          </TabsTrigger>
          <TabsTrigger value="khata">
            <User className="w-4 h-4 mr-2" />
            {language === 'ur' ? 'ڈرائیور کھاتہ' : 'Driver Khata'}
          </TabsTrigger>
          <TabsTrigger value="reports">
            <BarChart3 className="w-4 h-4 mr-2" />
            {language === 'ur' ? 'رپورٹس' : 'Reports'}
          </TabsTrigger>
        </TabsList>

        {/* Expenses Tab */}
        <TabsContent value="expenses" className="space-y-4">
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder={language === 'ur' ? 'تلاش کریں...' : 'Search...'}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder={language === 'ur' ? 'قسم' : 'Category'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{language === 'ur' ? 'سب' : 'All'}</SelectItem>
                    <SelectItem value="fuel">{language === 'ur' ? 'ایندھن' : 'Fuel'}</SelectItem>
                    <SelectItem value="maintenance">{language === 'ur' ? 'مرمت' : 'Maintenance'}</SelectItem>
                    <SelectItem value="driver_payment">{language === 'ur' ? 'ڈرائیور کی ادائیگی' : 'Driver Payment'}</SelectItem>
                    <SelectItem value="office">{language === 'ur' ? 'دفتر' : 'Office'}</SelectItem>
                    <SelectItem value="other">{language === 'ur' ? 'دیگر' : 'Other'}</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder={language === 'ur' ? 'حیثیت' : 'Status'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{language === 'ur' ? 'سب' : 'All'}</SelectItem>
                    <SelectItem value="paid">{language === 'ur' ? 'ادا شدہ' : 'Paid'}</SelectItem>
                    <SelectItem value="pending">{language === 'ur' ? 'زیر التوا' : 'Pending'}</SelectItem>
                    <SelectItem value="cancelled">{language === 'ur' ? 'منسوخ' : 'Cancelled'}</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  {language === 'ur' ? 'فلٹر' : 'Filter'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Expenses Table */}
          <Card>
            <CardHeader>
              <CardTitle>
                {language === 'ur' ? 'اخراجات کی فہرست' : 'Expenses List'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{language === 'ur' ? 'تاریخ' : 'Date'}</TableHead>
                    <TableHead>{language === 'ur' ? 'قسم' : 'Category'}</TableHead>
                    <TableHead>{language === 'ur' ? 'تفصیل' : 'Description'}</TableHead>
                    <TableHead>{language === 'ur' ? 'رقم' : 'Amount'}</TableHead>
                    <TableHead>{language === 'ur' ? 'گاڑی/ڈرائیور' : 'Vehicle/Driver'}</TableHead>
                    <TableHead>{language === 'ur' ? 'ادائیگی' : 'Payment'}</TableHead>
                    <TableHead>{language === 'ur' ? 'حیثیت' : 'Status'}</TableHead>
                    <TableHead>{language === 'ur' ? 'عمل' : 'Actions'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredExpenses.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell>{expense.date}</TableCell>
                      <TableCell>
                        <Badge className={getCategoryColor(expense.category)}>
                          {language === 'ur' 
                            ? (expense.category === 'fuel' ? 'ایندھن' : 
                               expense.category === 'maintenance' ? 'مرمت' : 
                               expense.category === 'driver_payment' ? 'ڈرائیور کی ادائیگی' : 
                               expense.category === 'office' ? 'دفتر' : 'دیگر')
                            : expense.category
                          }
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{expense.description}</TableCell>
                      <TableCell className="font-medium">₨{expense.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        {expense.vehicleNumber && (
                          <div>
                            <div className="font-medium">{expense.vehicleNumber}</div>
                            <div className="text-sm text-gray-500">{expense.driverName}</div>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {language === 'ur' 
                            ? (expense.paymentMethod === 'cash' ? 'نقد' : 
                               expense.paymentMethod === 'online' ? 'آن لائن' : 'بینک')
                            : expense.paymentMethod
                          }
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(expense.status)}>
                          {language === 'ur' 
                            ? (expense.status === 'paid' ? 'ادا شدہ' : 
                               expense.status === 'pending' ? 'زیر التوا' : 'منسوخ')
                            : expense.status
                          }
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="ghost">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Edit className="w-4 h-4" />
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

        {/* Driver Khata Tab */}
        <TabsContent value="khata" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                {language === 'ur' ? 'ڈرائیور کھاتہ' : 'Driver Khata'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{language === 'ur' ? 'تاریخ' : 'Date'}</TableHead>
                    <TableHead>{language === 'ur' ? 'ڈرائیور' : 'Driver'}</TableHead>
                    <TableHead>{language === 'ur' ? 'گاڑی' : 'Vehicle'}</TableHead>
                    <TableHead>{language === 'ur' ? 'قسم' : 'Type'}</TableHead>
                    <TableHead>{language === 'ur' ? 'تفصیل' : 'Description'}</TableHead>
                    <TableHead>{language === 'ur' ? 'رقم' : 'Amount'}</TableHead>
                    <TableHead>{language === 'ur' ? 'بقایا' : 'Balance'}</TableHead>
                    <TableHead>{language === 'ur' ? 'حیثیت' : 'Status'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {driverKhata.map((khata) => (
                    <TableRow key={khata.id}>
                      <TableCell>{khata.date}</TableCell>
                      <TableCell className="font-medium">{khata.driverName}</TableCell>
                      <TableCell>{khata.vehicleNumber}</TableCell>
                      <TableCell>
                        <Badge className={getTypeColor(khata.type)}>
                          {language === 'ur' 
                            ? (khata.type === 'payment' ? 'ادائیگی' : 
                               khata.type === 'advance' ? 'ادوانس' : 'کٹوتی')
                            : khata.type
                          }
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{khata.description}</TableCell>
                      <TableCell className="font-medium">₨{khata.amount.toLocaleString()}</TableCell>
                      <TableCell className={`font-bold ${khata.balance < 0 ? 'text-red-600' : 'text-green-600'}`}>
                        ₨{khata.balance.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(khata.status)}>
                          {language === 'ur' 
                            ? (khata.status === 'paid' ? 'ادا شدہ' : 'زیر التوا')
                            : khata.status
                          }
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Monthly Report */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  {language === 'ur' ? 'ماہانہ رپورٹ' : 'Monthly Report'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{language === 'ur' ? 'کل آمدنی:' : 'Total Revenue:'}</span>
                    <span className="font-bold text-green-600">₨{financialReport.totalRevenue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{language === 'ur' ? 'کل اخراجات:' : 'Total Expenses:'}</span>
                    <span className="font-bold text-red-600">₨{financialReport.totalExpenses.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{language === 'ur' ? 'خالص منافع:' : 'Net Profit:'}</span>
                    <span className="font-bold text-blue-600">₨{financialReport.netProfit.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{language === 'ur' ? 'کل شپمنٹس:' : 'Total Shipments:'}</span>
                    <span className="font-bold">{financialReport.totalShipments}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{language === 'ur' ? 'کل ترسیل:' : 'Total Deliveries:'}</span>
                    <span className="font-bold">{financialReport.totalDeliveries}</span>
                  </div>
                </div>
                <Button className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  {language === 'ur' ? 'رپورٹ ڈاؤن لوڈ کریں' : 'Download Report'}
                </Button>
              </CardContent>
            </Card>

            {/* Driver Payments Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  {language === 'ur' ? 'ڈرائیور ادائیگیاں' : 'Driver Payments'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{language === 'ur' ? 'کل ادائیگیاں:' : 'Total Payments:'}</span>
                    <span className="font-bold">₨{financialReport.driverPayments.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{language === 'ur' ? 'بقایا:' : 'Outstanding:'}</span>
                    <span className="font-bold text-orange-600">₨{financialReport.outstandingPayments.toLocaleString()}</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  <PieChart className="w-4 h-4 mr-2" />
                  {language === 'ur' ? 'تفصیلی رپورٹ' : 'Detailed Report'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}