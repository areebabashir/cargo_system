import { useState, useEffect } from "react";
import { Plus, Search, Filter, Edit, Trash2, User, Phone, MapPin, Package, DollarSign, Calendar, Building, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useLanguage } from "@/contexts/LanguageContext";

interface CustomerData {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  customerType: 'sender' | 'receiver' | 'both';
  totalBiltyCount: number;
  totalAmount: number;
  outstandingBalance: number;
  paymentMethod: 'cash' | 'online' | 'cod';
  registrationDate: string;
  lastTransactionDate: string;
  status: 'active' | 'inactive';
  notes: string;
}

interface BiltyHistory {
  id: string;
  biltyNumber: string;
  customerId: string;
  customerName: string;
  date: string;
  quantity: number;
  amount: number;
  paymentStatus: 'paid' | 'unpaid';
  deliveryStatus: 'delivered' | 'pending' | 'returned';
  pickupType: 'self' | 'delivery';
}

export default function Staff() {
  const { t, language } = useLanguage();
  const [customers, setCustomers] = useState<CustomerData[]>([]);
  const [biltyHistory, setBiltyHistory] = useState<BiltyHistory[]>([]);
  const [isCustomerFormOpen, setIsCustomerFormOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerData | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [activeTab, setActiveTab] = useState<'customers' | 'history'>('customers');

  // Customer form state
  const [customerForm, setCustomerForm] = useState<Partial<CustomerData>>({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    customerType: "both",
    paymentMethod: "cash",
    status: "active",
    notes: ""
  });

  // Sample data
  useEffect(() => {
    const sampleCustomers: CustomerData[] = [
      {
        id: "1",
        name: "Ahmed Khan",
        phone: "0300-1234567",
        email: "ahmed.khan@email.com",
        address: "House #123, Street 5, Gulberg III",
        city: "Lahore",
        customerType: "both",
        totalBiltyCount: 25,
        totalAmount: 75000,
        outstandingBalance: 5000,
        paymentMethod: "cash",
        registrationDate: "2023-01-15",
        lastTransactionDate: "2024-01-15",
        status: "active",
        notes: "Regular customer, prefers self pickup"
      },
      {
        id: "2",
        name: "Fatima Ali",
        phone: "0312-9876543",
        email: "fatima.ali@email.com",
        address: "Flat #45, Building 2, Clifton",
        city: "Karachi",
        customerType: "sender",
        totalBiltyCount: 12,
        totalAmount: 45000,
        outstandingBalance: 0,
        paymentMethod: "online",
        registrationDate: "2023-03-20",
        lastTransactionDate: "2024-01-10",
        status: "active",
        notes: "Online payment preferred"
      },
      {
        id: "3",
        name: "Muhammad Hassan",
        phone: "0333-5555555",
        email: "m.hassan@email.com",
        address: "Shop #12, Blue Area",
        city: "Islamabad",
        customerType: "receiver",
        totalBiltyCount: 8,
        totalAmount: 28000,
        outstandingBalance: 3000,
        paymentMethod: "cod",
        registrationDate: "2023-06-10",
        lastTransactionDate: "2024-01-12",
        status: "active",
        notes: "COD customer, delivery required"
      }
    ];

    const sampleBiltyHistory: BiltyHistory[] = [
      {
        id: "1",
        biltyNumber: "BLT-2024-001",
        customerId: "1",
        customerName: "Ahmed Khan",
        date: "2024-01-15",
        quantity: 2,
        amount: 5000,
        paymentStatus: "paid",
        deliveryStatus: "delivered",
        pickupType: "self"
      },
      {
        id: "2",
        biltyNumber: "BLT-2024-002",
        customerId: "2",
        customerName: "Fatima Ali",
        date: "2024-01-16",
        quantity: 1,
        amount: 3500,
        paymentStatus: "paid",
        deliveryStatus: "pending",
        pickupType: "delivery"
      },
      {
        id: "3",
        biltyNumber: "BLT-2024-003",
        customerId: "3",
        customerName: "Muhammad Hassan",
        date: "2024-01-17",
        quantity: 3,
        amount: 7500,
        paymentStatus: "unpaid",
        deliveryStatus: "pending",
        pickupType: "delivery"
      }
    ];

    setCustomers(sampleCustomers);
    setBiltyHistory(sampleBiltyHistory);
  }, []);

  const handleCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCustomer: CustomerData = {
      id: Date.now().toString(),
      totalBiltyCount: 0,
      totalAmount: 0,
      outstandingBalance: 0,
      registrationDate: new Date().toISOString().split('T')[0],
      lastTransactionDate: new Date().toISOString().split('T')[0],
      ...customerForm
    } as CustomerData;

    setCustomers([...customers, newCustomer]);
    setCustomerForm({
      name: "",
      phone: "",
      email: "",
      address: "",
      city: "",
      customerType: "both",
      paymentMethod: "cash",
      status: "active",
      notes: ""
    });
    setIsCustomerFormOpen(false);
  };

  const handleViewCustomer = (customer: CustomerData) => {
    setSelectedCustomer(customer);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'unpaid': return 'bg-red-100 text-red-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'returned': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCustomerTypeColor = (type: string) => {
    switch (type) {
      case 'sender': return 'bg-blue-100 text-blue-800';
      case 'receiver': return 'bg-purple-100 text-purple-800';
      case 'both': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.city.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === "all" || customer.customerType === filterType;
    const matchesStatus = filterStatus === "all" || customer.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const customerBiltyHistory = selectedCustomer 
    ? biltyHistory.filter(bilty => bilty.customerId === selectedCustomer.id)
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {language === 'ur' ? 'کسٹمر اور وصول کنندہ مینجمنٹ' : 'Customer & Receiver Management'}
          </h1>
          <p className="text-gray-600 mt-1">
            {language === 'ur' ? 'کسٹمرز اور وصول کنندگان کا انتظام' : 'Manage customers and receivers'}
          </p>
        </div>
        <Dialog open={isCustomerFormOpen} onOpenChange={setIsCustomerFormOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary hover:bg-primary-hover text-white">
              <Plus className="w-4 h-4 mr-2" />
              {language === 'ur' ? 'نیا کسٹمر' : 'New Customer'}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {language === 'ur' ? 'نیا کسٹمر شامل کریں' : 'Add New Customer'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCustomerSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">
                    {language === 'ur' ? 'نام' : 'Name'}
                  </Label>
                  <Input
                    id="name"
                    value={customerForm.name}
                    onChange={(e) => setCustomerForm({...customerForm, name: e.target.value})}
                    placeholder={language === 'ur' ? 'نام درج کریں' : 'Enter name'}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">
                    {language === 'ur' ? 'فون نمبر' : 'Phone Number'}
                  </Label>
                  <Input
                    id="phone"
                    value={customerForm.phone}
                    onChange={(e) => setCustomerForm({...customerForm, phone: e.target.value})}
                    placeholder={language === 'ur' ? 'فون نمبر درج کریں' : 'Enter phone number'}
                  />
                </div>
                <div>
                  <Label htmlFor="email">
                    {language === 'ur' ? 'ای میل' : 'Email'}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={customerForm.email}
                    onChange={(e) => setCustomerForm({...customerForm, email: e.target.value})}
                    placeholder={language === 'ur' ? 'ای میل درج کریں' : 'Enter email'}
                  />
                </div>
                <div>
                  <Label htmlFor="city">
                    {language === 'ur' ? 'شہر' : 'City'}
                  </Label>
                  <Input
                    id="city"
                    value={customerForm.city}
                    onChange={(e) => setCustomerForm({...customerForm, city: e.target.value})}
                    placeholder={language === 'ur' ? 'شہر درج کریں' : 'Enter city'}
                  />
                </div>
                <div>
                  <Label htmlFor="customerType">
                    {language === 'ur' ? 'کسٹمر کی قسم' : 'Customer Type'}
                  </Label>
                  <Select
                    value={customerForm.customerType}
                    onValueChange={(value) => setCustomerForm({...customerForm, customerType: value as 'sender' | 'receiver' | 'both'})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sender">{language === 'ur' ? 'مرسل' : 'Sender'}</SelectItem>
                      <SelectItem value="receiver">{language === 'ur' ? 'وصول کنندہ' : 'Receiver'}</SelectItem>
                      <SelectItem value="both">{language === 'ur' ? 'دونوں' : 'Both'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="paymentMethod">
                    {language === 'ur' ? 'ادائیگی کا طریقہ' : 'Payment Method'}
                  </Label>
                  <Select
                    value={customerForm.paymentMethod}
                    onValueChange={(value) => setCustomerForm({...customerForm, paymentMethod: value as 'cash' | 'online' | 'cod'})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">{language === 'ur' ? 'نقد' : 'Cash'}</SelectItem>
                      <SelectItem value="online">{language === 'ur' ? 'آن لائن' : 'Online'}</SelectItem>
                      <SelectItem value="cod">{language === 'ur' ? 'کیش آن ڈیلیوری' : 'COD'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="address">
                  {language === 'ur' ? 'پتہ' : 'Address'}
                </Label>
                <Textarea
                  id="address"
                  value={customerForm.address}
                  onChange={(e) => setCustomerForm({...customerForm, address: e.target.value})}
                  placeholder={language === 'ur' ? 'پتہ درج کریں' : 'Enter address'}
                />
              </div>
              <div>
                <Label htmlFor="notes">
                  {language === 'ur' ? 'نوٹس' : 'Notes'}
                </Label>
                <Textarea
                  id="notes"
                  value={customerForm.notes}
                  onChange={(e) => setCustomerForm({...customerForm, notes: e.target.value})}
                  placeholder={language === 'ur' ? 'نوٹس درج کریں' : 'Enter notes'}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsCustomerFormOpen(false)}>
                  {language === 'ur' ? 'منسوخ کریں' : 'Cancel'}
                </Button>
                <Button type="submit" className="bg-gradient-primary hover:bg-primary-hover text-white">
                  {language === 'ur' ? 'کسٹمر شامل کریں' : 'Add Customer'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <Button
          variant={activeTab === 'customers' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('customers')}
          className="flex-1"
        >
          <User className="w-4 h-4 mr-2" />
          {language === 'ur' ? 'کسٹمرز' : 'Customers'}
        </Button>
        <Button
          variant={activeTab === 'history' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('history')}
          className="flex-1"
        >
          <Package className="w-4 h-4 mr-2" />
          {language === 'ur' ? 'بلٹی تاریخ' : 'Bilty History'}
        </Button>
      </div>

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
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue placeholder={language === 'ur' ? 'کسٹمر کی قسم' : 'Customer Type'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{language === 'ur' ? 'سب' : 'All'}</SelectItem>
                <SelectItem value="sender">{language === 'ur' ? 'مرسل' : 'Sender'}</SelectItem>
                <SelectItem value="receiver">{language === 'ur' ? 'وصول کنندہ' : 'Receiver'}</SelectItem>
                <SelectItem value="both">{language === 'ur' ? 'دونوں' : 'Both'}</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder={language === 'ur' ? 'حیثیت' : 'Status'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{language === 'ur' ? 'سب' : 'All'}</SelectItem>
                <SelectItem value="active">{language === 'ur' ? 'فعال' : 'Active'}</SelectItem>
                <SelectItem value="inactive">{language === 'ur' ? 'غیر فعال' : 'Inactive'}</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              {language === 'ur' ? 'فلٹر' : 'Filter'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Customers Tab */}
      {activeTab === 'customers' && (
        <Card>
          <CardHeader>
            <CardTitle>
              {language === 'ur' ? 'کسٹمرز کی فہرست' : 'Customer List'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{language === 'ur' ? 'نام' : 'Name'}</TableHead>
                  <TableHead>{language === 'ur' ? 'رابطہ' : 'Contact'}</TableHead>
                  <TableHead>{language === 'ur' ? 'شہر' : 'City'}</TableHead>
                  <TableHead>{language === 'ur' ? 'قسم' : 'Type'}</TableHead>
                  <TableHead>{language === 'ur' ? 'کل بلٹی' : 'Total Bilty'}</TableHead>
                  <TableHead>{language === 'ur' ? 'کل رقم' : 'Total Amount'}</TableHead>
                  <TableHead>{language === 'ur' ? 'بقایا' : 'Outstanding'}</TableHead>
                  <TableHead>{language === 'ur' ? 'حیثیت' : 'Status'}</TableHead>
                  <TableHead>{language === 'ur' ? 'عمل' : 'Actions'}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">{customer.name}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{customer.phone}</div>
                        <div className="text-sm text-gray-500">{customer.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>{customer.city}</TableCell>
                    <TableCell>
                      <Badge className={getCustomerTypeColor(customer.customerType)}>
                        {language === 'ur' 
                          ? (customer.customerType === 'sender' ? 'مرسل' : 
                             customer.customerType === 'receiver' ? 'وصول کنندہ' : 'دونوں')
                          : customer.customerType
                        }
                      </Badge>
                    </TableCell>
                    <TableCell>{customer.totalBiltyCount}</TableCell>
                    <TableCell>₨{customer.totalAmount.toLocaleString()}</TableCell>
                    <TableCell>₨{customer.outstandingBalance.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(customer.status)}>
                        {language === 'ur' 
                          ? (customer.status === 'active' ? 'فعال' : 'غیر فعال')
                          : customer.status
                        }
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => handleViewCustomer(customer)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Bilty History Tab */}
      {activeTab === 'history' && (
        <Card>
          <CardHeader>
            <CardTitle>
              {language === 'ur' ? 'بلٹی کی تاریخ' : 'Bilty History'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{language === 'ur' ? 'بلٹی نمبر' : 'Bilty No.'}</TableHead>
                  <TableHead>{language === 'ur' ? 'کسٹمر' : 'Customer'}</TableHead>
                  <TableHead>{language === 'ur' ? 'تاریخ' : 'Date'}</TableHead>
                  <TableHead>{language === 'ur' ? 'مقدار' : 'Quantity'}</TableHead>
                  <TableHead>{language === 'ur' ? 'رقم' : 'Amount'}</TableHead>
                  <TableHead>{language === 'ur' ? 'ادائیگی' : 'Payment'}</TableHead>
                  <TableHead>{language === 'ur' ? 'ترسیل' : 'Delivery'}</TableHead>
                  <TableHead>{language === 'ur' ? 'پک اپ' : 'Pickup'}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {biltyHistory.map((bilty) => (
                  <TableRow key={bilty.id}>
                    <TableCell className="font-medium">{bilty.biltyNumber}</TableCell>
                    <TableCell>{bilty.customerName}</TableCell>
                    <TableCell>{bilty.date}</TableCell>
                    <TableCell>{bilty.quantity}</TableCell>
                    <TableCell>₨{bilty.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(bilty.paymentStatus)}>
                        {language === 'ur' 
                          ? (bilty.paymentStatus === 'paid' ? 'ادا شدہ' : 'غیر ادا شدہ')
                          : bilty.paymentStatus
                        }
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(bilty.deliveryStatus)}>
                        {language === 'ur' 
                          ? (bilty.deliveryStatus === 'delivered' ? 'پہنچا دیا گیا' : 
                             bilty.deliveryStatus === 'pending' ? 'زیر التوا' : 'واپس')
                          : bilty.deliveryStatus
                        }
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {language === 'ur' 
                          ? (bilty.pickupType === 'self' ? 'خود پک اپ' : 'ترسیل')
                          : bilty.pickupType
                        }
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Customer Details Dialog */}
      {selectedCustomer && (
        <Dialog open={!!selectedCustomer} onOpenChange={() => setSelectedCustomer(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>
                {language === 'ur' ? 'کسٹمر کی تفصیلات' : 'Customer Details'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">
                    {language === 'ur' ? 'بنیادی معلومات' : 'Basic Information'}
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">{language === 'ur' ? 'نام:' : 'Name:'}</span>
                      <span className="font-medium">{selectedCustomer.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{language === 'ur' ? 'فون:' : 'Phone:'}</span>
                      <span>{selectedCustomer.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{language === 'ur' ? 'ای میل:' : 'Email:'}</span>
                      <span>{selectedCustomer.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{language === 'ur' ? 'شہر:' : 'City:'}</span>
                      <span>{selectedCustomer.city}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">
                    {language === 'ur' ? 'مالی تفصیلات' : 'Financial Details'}
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">{language === 'ur' ? 'کل بلٹی:' : 'Total Bilty:'}</span>
                      <span>{selectedCustomer.totalBiltyCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{language === 'ur' ? 'کل رقم:' : 'Total Amount:'}</span>
                      <span>₨{selectedCustomer.totalAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{language === 'ur' ? 'بقایا:' : 'Outstanding:'}</span>
                      <span className="font-bold">₨{selectedCustomer.outstandingBalance.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-3">
                  {language === 'ur' ? 'بلٹی کی تاریخ' : 'Bilty History'}
                </h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{language === 'ur' ? 'بلٹی نمبر' : 'Bilty No.'}</TableHead>
                      <TableHead>{language === 'ur' ? 'تاریخ' : 'Date'}</TableHead>
                      <TableHead>{language === 'ur' ? 'مقدار' : 'Quantity'}</TableHead>
                      <TableHead>{language === 'ur' ? 'رقم' : 'Amount'}</TableHead>
                      <TableHead>{language === 'ur' ? 'حیثیت' : 'Status'}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customerBiltyHistory.map((bilty) => (
                      <TableRow key={bilty.id}>
                        <TableCell className="font-medium">{bilty.biltyNumber}</TableCell>
                        <TableCell>{bilty.date}</TableCell>
                        <TableCell>{bilty.quantity}</TableCell>
                        <TableCell>₨{bilty.amount.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(bilty.deliveryStatus)}>
                            {language === 'ur' 
                              ? (bilty.deliveryStatus === 'delivered' ? 'پہنچا دیا گیا' : 
                                 bilty.deliveryStatus === 'pending' ? 'زیر التوا' : 'واپس')
                              : bilty.deliveryStatus
                            }
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}