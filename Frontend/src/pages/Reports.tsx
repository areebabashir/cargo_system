import { useState, useEffect } from "react";
import { Plus, Search, Filter, Download, Eye, Edit, Trash2, Building, User, DollarSign, Calendar, FileText, BarChart3, PieChart, MapPin, Phone } from "lucide-react";
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

interface ShopData {
  id: string;
  shopNumber: string;
  shopName: string;
  location: string;
  size: number;
  tenantName: string;
  tenantPhone: string;
  tenantCNIC: string;
  monthlyRent: number;
  securityDeposit: number;
  leaseStartDate: string;
  leaseEndDate: string;
  paymentStatus: 'paid' | 'due' | 'overdue';
  lastPaymentDate: string;
  outstandingAmount: number;
  businessType: string;
  status: 'occupied' | 'vacant' | 'under_renovation';
  notes: string;
}

interface RentPayment {
  id: string;
  shopId: string;
  shopNumber: string;
  tenantName: string;
  paymentDate: string;
  amount: number;
  paymentMethod: 'cash' | 'online' | 'bank';
  month: string;
  year: string;
  receiptNumber: string;
  status: 'paid' | 'pending';
  notes: string;
}

interface RentalReport {
  period: string;
  totalShops: number;
  occupiedShops: number;
  vacantShops: number;
  totalRent: number;
  collectedRent: number;
  outstandingRent: number;
  collectionRate: number;
}

export default function Reports() {
  const { t, language } = useLanguage();
  const [shops, setShops] = useState<ShopData[]>([]);
  const [rentPayments, setRentPayments] = useState<RentPayment[]>([]);
  const [isShopFormOpen, setIsShopFormOpen] = useState(false);
  const [isPaymentFormOpen, setIsPaymentFormOpen] = useState(false);
  const [selectedShop, setSelectedShop] = useState<ShopData | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPayment, setFilterPayment] = useState("all");
  const [activeTab, setActiveTab] = useState<'shops' | 'payments' | 'reports'>('shops');

  // Shop form state
  const [shopForm, setShopForm] = useState<Partial<ShopData>>({
    shopNumber: "",
    shopName: "",
    location: "",
    size: 0,
    tenantName: "",
    tenantPhone: "",
    tenantCNIC: "",
    monthlyRent: 0,
    securityDeposit: 0,
    leaseStartDate: "",
    leaseEndDate: "",
    paymentStatus: "due",
    businessType: "",
    status: "occupied",
    notes: ""
  });

  // Payment form state
  const [paymentForm, setPaymentForm] = useState<Partial<RentPayment>>({
    shopId: "",
    paymentDate: new Date().toISOString().split('T')[0],
    amount: 0,
    paymentMethod: "cash",
    month: "",
    year: new Date().getFullYear().toString(),
    status: "paid",
    notes: ""
  });

  // Sample data
  useEffect(() => {
    const sampleShops: ShopData[] = [
      {
        id: "1",
        shopNumber: "SHOP-001",
        shopName: "Karachi Electronics",
        location: "Gulshan-e-Iqbal, Block 6",
        size: 200,
        tenantName: "Ahmed Khan",
        tenantPhone: "0300-1234567",
        tenantCNIC: "42101-1234567-8",
        monthlyRent: 25000,
        securityDeposit: 50000,
        leaseStartDate: "2023-01-01",
        leaseEndDate: "2024-12-31",
        paymentStatus: "paid",
        lastPaymentDate: "2024-01-01",
        outstandingAmount: 0,
        businessType: "Electronics",
        status: "occupied",
        notes: "Good tenant, pays on time"
      },
      {
        id: "2",
        shopNumber: "SHOP-002",
        shopName: "Lahore Textiles",
        location: "Defense Phase 2",
        size: 150,
        tenantName: "Fatima Ali",
        tenantPhone: "0312-9876543",
        tenantCNIC: "35202-9876543-2",
        monthlyRent: 20000,
        securityDeposit: 40000,
        leaseStartDate: "2023-03-01",
        leaseEndDate: "2024-02-28",
        paymentStatus: "due",
        lastPaymentDate: "2023-12-01",
        outstandingAmount: 20000,
        businessType: "Textiles",
        status: "occupied",
        notes: "Payment due for January"
      },
      {
        id: "3",
        shopNumber: "SHOP-003",
        shopName: "Islamabad Restaurant",
        location: "Blue Area",
        size: 300,
        tenantName: "Muhammad Hassan",
        tenantPhone: "0333-5555555",
        tenantCNIC: "61101-5555555-3",
        monthlyRent: 35000,
        securityDeposit: 70000,
        leaseStartDate: "2023-06-01",
        leaseEndDate: "2024-05-31",
        paymentStatus: "overdue",
        lastPaymentDate: "2023-11-01",
        outstandingAmount: 70000,
        businessType: "Restaurant",
        status: "occupied",
        notes: "Two months overdue"
      }
    ];

    const samplePayments: RentPayment[] = [
      {
        id: "1",
        shopId: "1",
        shopNumber: "SHOP-001",
        tenantName: "Ahmed Khan",
        paymentDate: "2024-01-01",
        amount: 25000,
        paymentMethod: "online",
        month: "January",
        year: "2024",
        receiptNumber: "RCP-001",
        status: "paid",
        notes: "Monthly rent payment"
      },
      {
        id: "2",
        shopId: "2",
        shopNumber: "SHOP-002",
        tenantName: "Fatima Ali",
        paymentDate: "2023-12-01",
        amount: 20000,
        paymentMethod: "cash",
        month: "December",
        year: "2023",
        receiptNumber: "RCP-002",
        status: "paid",
        notes: "Monthly rent payment"
      }
    ];

    setShops(sampleShops);
    setRentPayments(samplePayments);
  }, []);

  const handleShopSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newShop: ShopData = {
      id: Date.now().toString(),
      outstandingAmount: 0,
      lastPaymentDate: "",
      ...shopForm
    } as ShopData;

    setShops([...shops, newShop]);
    setShopForm({
      shopNumber: "",
      shopName: "",
      location: "",
      size: 0,
      tenantName: "",
      tenantPhone: "",
      tenantCNIC: "",
      monthlyRent: 0,
      securityDeposit: 0,
      leaseStartDate: "",
      leaseEndDate: "",
      paymentStatus: "due",
      businessType: "",
      status: "occupied",
      notes: ""
    });
    setIsShopFormOpen(false);
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedShopData = shops.find(s => s.id === paymentForm.shopId);
    const newPayment: RentPayment = {
      id: Date.now().toString(),
      shopNumber: selectedShopData?.shopNumber || "",
      tenantName: selectedShopData?.tenantName || "",
      receiptNumber: `RCP-${Date.now().toString().slice(-6)}`,
      ...paymentForm
    } as RentPayment;

    setRentPayments([...rentPayments, newPayment]);
    setPaymentForm({
      shopId: "",
      paymentDate: new Date().toISOString().split('T')[0],
      amount: 0,
      paymentMethod: "cash",
      month: "",
      year: new Date().getFullYear().toString(),
      status: "paid",
      notes: ""
    });
    setIsPaymentFormOpen(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'occupied': return 'bg-green-100 text-green-800';
      case 'vacant': return 'bg-gray-100 text-gray-800';
      case 'under_renovation': return 'bg-yellow-100 text-yellow-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'due': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentMethodColor = (method: string) => {
    switch (method) {
      case 'cash': return 'bg-green-100 text-green-800';
      case 'online': return 'bg-blue-100 text-blue-800';
      case 'bank': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredShops = shops.filter(shop => {
    const matchesSearch = 
      shop.shopNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shop.shopName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shop.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shop.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || shop.status === filterStatus;
    const matchesPayment = filterPayment === "all" || shop.paymentStatus === filterPayment;
    
    return matchesSearch && matchesStatus && matchesPayment;
  });

  const totalShops = shops.length;
  const occupiedShops = shops.filter(s => s.status === 'occupied').length;
  const vacantShops = shops.filter(s => s.status === 'vacant').length;
  const totalRent = shops.reduce((sum, shop) => sum + shop.monthlyRent, 0);
  const collectedRent = rentPayments.reduce((sum, payment) => sum + payment.amount, 0);
  const outstandingRent = shops.reduce((sum, shop) => sum + shop.outstandingAmount, 0);
  const collectionRate = totalRent > 0 ? (collectedRent / totalRent) * 100 : 0;

  const rentalReport: RentalReport = {
    period: "January 2024",
    totalShops,
    occupiedShops,
    vacantShops,
    totalRent,
    collectedRent,
    outstandingRent,
    collectionRate
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {language === 'ur' ? 'دکان کرایہ مینجمنٹ' : 'Shop Rental Management'}
          </h1>
          <p className="text-gray-600 mt-1">
            {language === 'ur' ? 'دکانوں اور کرایہ داروں کا انتظام' : 'Manage shops and tenants'}
          </p>
        </div>
        <div className="flex space-x-2">
          <Dialog open={isShopFormOpen} onOpenChange={setIsShopFormOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                {language === 'ur' ? 'نیا دکان' : 'New Shop'}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {language === 'ur' ? 'نیا دکان شامل کریں' : 'Add New Shop'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleShopSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="shopNumber">
                      {language === 'ur' ? 'دکان نمبر' : 'Shop Number'}
                    </Label>
                    <Input
                      id="shopNumber"
                      value={shopForm.shopNumber}
                      onChange={(e) => setShopForm({...shopForm, shopNumber: e.target.value})}
                      placeholder={language === 'ur' ? 'دکان نمبر درج کریں' : 'Enter shop number'}
                    />
                  </div>
                  <div>
                    <Label htmlFor="shopName">
                      {language === 'ur' ? 'دکان کا نام' : 'Shop Name'}
                    </Label>
                    <Input
                      id="shopName"
                      value={shopForm.shopName}
                      onChange={(e) => setShopForm({...shopForm, shopName: e.target.value})}
                      placeholder={language === 'ur' ? 'دکان کا نام درج کریں' : 'Enter shop name'}
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">
                      {language === 'ur' ? 'مقام' : 'Location'}
                    </Label>
                    <Input
                      id="location"
                      value={shopForm.location}
                      onChange={(e) => setShopForm({...shopForm, location: e.target.value})}
                      placeholder={language === 'ur' ? 'مقام درج کریں' : 'Enter location'}
                    />
                  </div>
                  <div>
                    <Label htmlFor="size">
                      {language === 'ur' ? 'سائز (مربع فٹ)' : 'Size (sq ft)'}
                    </Label>
                    <Input
                      id="size"
                      type="number"
                      value={shopForm.size}
                      onChange={(e) => setShopForm({...shopForm, size: parseInt(e.target.value)})}
                      placeholder={language === 'ur' ? 'سائز درج کریں' : 'Enter size'}
                    />
                  </div>
                  <div>
                    <Label htmlFor="tenantName">
                      {language === 'ur' ? 'کرایہ دار کا نام' : 'Tenant Name'}
                    </Label>
                    <Input
                      id="tenantName"
                      value={shopForm.tenantName}
                      onChange={(e) => setShopForm({...shopForm, tenantName: e.target.value})}
                      placeholder={language === 'ur' ? 'کرایہ دار کا نام درج کریں' : 'Enter tenant name'}
                    />
                  </div>
                  <div>
                    <Label htmlFor="tenantPhone">
                      {language === 'ur' ? 'کرایہ دار کا فون' : 'Tenant Phone'}
                    </Label>
                    <Input
                      id="tenantPhone"
                      value={shopForm.tenantPhone}
                      onChange={(e) => setShopForm({...shopForm, tenantPhone: e.target.value})}
                      placeholder={language === 'ur' ? 'کرایہ دار کا فون درج کریں' : 'Enter tenant phone'}
                    />
                  </div>
                  <div>
                    <Label htmlFor="monthlyRent">
                      {language === 'ur' ? 'ماہانہ کرایہ' : 'Monthly Rent'}
                    </Label>
                    <Input
                      id="monthlyRent"
                      type="number"
                      value={shopForm.monthlyRent}
                      onChange={(e) => setShopForm({...shopForm, monthlyRent: parseInt(e.target.value)})}
                      placeholder={language === 'ur' ? 'ماہانہ کرایہ درج کریں' : 'Enter monthly rent'}
                    />
                  </div>
                  <div>
                    <Label htmlFor="securityDeposit">
                      {language === 'ur' ? 'سیکیورٹی ڈپازٹ' : 'Security Deposit'}
                    </Label>
                    <Input
                      id="securityDeposit"
                      type="number"
                      value={shopForm.securityDeposit}
                      onChange={(e) => setShopForm({...shopForm, securityDeposit: parseInt(e.target.value)})}
                      placeholder={language === 'ur' ? 'سیکیورٹی ڈپازٹ درج کریں' : 'Enter security deposit'}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="leaseStartDate">
                      {language === 'ur' ? 'لیز کی شروع تاریخ' : 'Lease Start Date'}
                    </Label>
                    <Input
                      id="leaseStartDate"
                      type="date"
                      value={shopForm.leaseStartDate}
                      onChange={(e) => setShopForm({...shopForm, leaseStartDate: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="leaseEndDate">
                      {language === 'ur' ? 'لیز کی ختم تاریخ' : 'Lease End Date'}
                    </Label>
                    <Input
                      id="leaseEndDate"
                      type="date"
                      value={shopForm.leaseEndDate}
                      onChange={(e) => setShopForm({...shopForm, leaseEndDate: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="businessType">
                    {language === 'ur' ? 'کاروبار کی قسم' : 'Business Type'}
                  </Label>
                  <Input
                    id="businessType"
                    value={shopForm.businessType}
                    onChange={(e) => setShopForm({...shopForm, businessType: e.target.value})}
                    placeholder={language === 'ur' ? 'کاروبار کی قسم درج کریں' : 'Enter business type'}
                  />
                </div>
                <div>
                  <Label htmlFor="notes">
                    {language === 'ur' ? 'نوٹس' : 'Notes'}
                  </Label>
                  <Textarea
                    id="notes"
                    value={shopForm.notes}
                    onChange={(e) => setShopForm({...shopForm, notes: e.target.value})}
                    placeholder={language === 'ur' ? 'نوٹس درج کریں' : 'Enter notes'}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsShopFormOpen(false)}>
                    {language === 'ur' ? 'منسوخ کریں' : 'Cancel'}
                  </Button>
                  <Button type="submit" className="bg-gradient-primary hover:bg-primary-hover text-white">
                    {language === 'ur' ? 'دکان شامل کریں' : 'Add Shop'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={isPaymentFormOpen} onOpenChange={setIsPaymentFormOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary hover:bg-primary-hover text-white">
                <Plus className="w-4 h-4 mr-2" />
                {language === 'ur' ? 'کرایہ ادائیگی' : 'Rent Payment'}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {language === 'ur' ? 'کرایہ ادائیگی شامل کریں' : 'Add Rent Payment'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handlePaymentSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="shopId">
                      {language === 'ur' ? 'دکان منتخب کریں' : 'Select Shop'}
                    </Label>
                    <Select
                      value={paymentForm.shopId}
                      onValueChange={(value) => setPaymentForm({...paymentForm, shopId: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={language === 'ur' ? 'دکان منتخب کریں' : 'Select shop'} />
                      </SelectTrigger>
                      <SelectContent>
                        {shops.map(shop => (
                          <SelectItem key={shop.id} value={shop.id}>
                            {shop.shopNumber} - {shop.tenantName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="paymentDate">
                      {language === 'ur' ? 'ادائیگی کی تاریخ' : 'Payment Date'}
                    </Label>
                    <Input
                      id="paymentDate"
                      type="date"
                      value={paymentForm.paymentDate}
                      onChange={(e) => setPaymentForm({...paymentForm, paymentDate: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="amount">
                      {language === 'ur' ? 'رقم' : 'Amount'}
                    </Label>
                    <Input
                      id="amount"
                      type="number"
                      value={paymentForm.amount}
                      onChange={(e) => setPaymentForm({...paymentForm, amount: parseInt(e.target.value)})}
                      placeholder={language === 'ur' ? 'رقم درج کریں' : 'Enter amount'}
                    />
                  </div>
                  <div>
                    <Label htmlFor="paymentMethod">
                      {language === 'ur' ? 'ادائیگی کا طریقہ' : 'Payment Method'}
                    </Label>
                    <Select
                      value={paymentForm.paymentMethod}
                      onValueChange={(value) => setPaymentForm({...paymentForm, paymentMethod: value as any})}
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
                  <div>
                    <Label htmlFor="month">
                      {language === 'ur' ? 'مہینہ' : 'Month'}
                    </Label>
                    <Select
                      value={paymentForm.month}
                      onValueChange={(value) => setPaymentForm({...paymentForm, month: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={language === 'ur' ? 'مہینہ منتخب کریں' : 'Select month'} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="January">{language === 'ur' ? 'جنوری' : 'January'}</SelectItem>
                        <SelectItem value="February">{language === 'ur' ? 'فروری' : 'February'}</SelectItem>
                        <SelectItem value="March">{language === 'ur' ? 'مارچ' : 'March'}</SelectItem>
                        <SelectItem value="April">{language === 'ur' ? 'اپریل' : 'April'}</SelectItem>
                        <SelectItem value="May">{language === 'ur' ? 'مئی' : 'May'}</SelectItem>
                        <SelectItem value="June">{language === 'ur' ? 'جون' : 'June'}</SelectItem>
                        <SelectItem value="July">{language === 'ur' ? 'جولائی' : 'July'}</SelectItem>
                        <SelectItem value="August">{language === 'ur' ? 'اگست' : 'August'}</SelectItem>
                        <SelectItem value="September">{language === 'ur' ? 'ستمبر' : 'September'}</SelectItem>
                        <SelectItem value="October">{language === 'ur' ? 'اکتوبر' : 'October'}</SelectItem>
                        <SelectItem value="November">{language === 'ur' ? 'نومبر' : 'November'}</SelectItem>
                        <SelectItem value="December">{language === 'ur' ? 'دسمبر' : 'December'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="year">
                      {language === 'ur' ? 'سال' : 'Year'}
                    </Label>
                    <Input
                      id="year"
                      value={paymentForm.year}
                      onChange={(e) => setPaymentForm({...paymentForm, year: e.target.value})}
                      placeholder={language === 'ur' ? 'سال درج کریں' : 'Enter year'}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="paymentNotes">
                    {language === 'ur' ? 'نوٹس' : 'Notes'}
                  </Label>
                  <Textarea
                    id="paymentNotes"
                    value={paymentForm.notes}
                    onChange={(e) => setPaymentForm({...paymentForm, notes: e.target.value})}
                    placeholder={language === 'ur' ? 'نوٹس درج کریں' : 'Enter notes'}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsPaymentFormOpen(false)}>
                    {language === 'ur' ? 'منسوخ کریں' : 'Cancel'}
                  </Button>
                  <Button type="submit" className="bg-gradient-primary hover:bg-primary-hover text-white">
                    {language === 'ur' ? 'ادائیگی شامل کریں' : 'Add Payment'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{language === 'ur' ? 'کل دکانیں' : 'Total Shops'}</p>
                <p className="text-2xl font-bold text-blue-600">{rentalReport.totalShops}</p>
              </div>
              <Building className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{language === 'ur' ? 'آباد دکانیں' : 'Occupied Shops'}</p>
                <p className="text-2xl font-bold text-green-600">{rentalReport.occupiedShops}</p>
              </div>
              <User className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{language === 'ur' ? 'کل کرایہ' : 'Total Rent'}</p>
                <p className="text-2xl font-bold text-purple-600">₨{rentalReport.totalRent.toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{language === 'ur' ? 'وصولی کی شرح' : 'Collection Rate'}</p>
                <p className="text-2xl font-bold text-orange-600">{rentalReport.collectionRate.toFixed(1)}%</p>
              </div>
              <BarChart3 className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="shops">
            <Building className="w-4 h-4 mr-2" />
            {language === 'ur' ? 'دکانیں' : 'Shops'}
          </TabsTrigger>
          <TabsTrigger value="payments">
            <DollarSign className="w-4 h-4 mr-2" />
            {language === 'ur' ? 'ادائیگیاں' : 'Payments'}
          </TabsTrigger>
          <TabsTrigger value="reports">
            <BarChart3 className="w-4 h-4 mr-2" />
            {language === 'ur' ? 'رپورٹس' : 'Reports'}
          </TabsTrigger>
        </TabsList>

        {/* Shops Tab */}
        <TabsContent value="shops" className="space-y-4">
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
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder={language === 'ur' ? 'حیثیت' : 'Status'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{language === 'ur' ? 'سب' : 'All'}</SelectItem>
                    <SelectItem value="occupied">{language === 'ur' ? 'آباد' : 'Occupied'}</SelectItem>
                    <SelectItem value="vacant">{language === 'ur' ? 'خالی' : 'Vacant'}</SelectItem>
                    <SelectItem value="under_renovation">{language === 'ur' ? 'مرمت میں' : 'Under Renovation'}</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterPayment} onValueChange={setFilterPayment}>
                  <SelectTrigger>
                    <SelectValue placeholder={language === 'ur' ? 'ادائیگی' : 'Payment'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{language === 'ur' ? 'سب' : 'All'}</SelectItem>
                    <SelectItem value="paid">{language === 'ur' ? 'ادا شدہ' : 'Paid'}</SelectItem>
                    <SelectItem value="due">{language === 'ur' ? 'واجب' : 'Due'}</SelectItem>
                    <SelectItem value="overdue">{language === 'ur' ? 'زائد' : 'Overdue'}</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  {language === 'ur' ? 'فلٹر' : 'Filter'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Shops Table */}
          <Card>
            <CardHeader>
              <CardTitle>
                {language === 'ur' ? 'دکانوں کی فہرست' : 'Shops List'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{language === 'ur' ? 'دکان نمبر' : 'Shop No.'}</TableHead>
                    <TableHead>{language === 'ur' ? 'دکان کا نام' : 'Shop Name'}</TableHead>
                    <TableHead>{language === 'ur' ? 'کرایہ دار' : 'Tenant'}</TableHead>
                    <TableHead>{language === 'ur' ? 'مقام' : 'Location'}</TableHead>
                    <TableHead>{language === 'ur' ? 'ماہانہ کرایہ' : 'Monthly Rent'}</TableHead>
                    <TableHead>{language === 'ur' ? 'بقایا' : 'Outstanding'}</TableHead>
                    <TableHead>{language === 'ur' ? 'حیثیت' : 'Status'}</TableHead>
                    <TableHead>{language === 'ur' ? 'ادائیگی' : 'Payment'}</TableHead>
                    <TableHead>{language === 'ur' ? 'عمل' : 'Actions'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredShops.map((shop) => (
                    <TableRow key={shop.id}>
                      <TableCell className="font-medium">{shop.shopNumber}</TableCell>
                      <TableCell>{shop.shopName}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{shop.tenantName}</div>
                          <div className="text-sm text-gray-500">{shop.tenantPhone}</div>
                        </div>
                      </TableCell>
                      <TableCell>{shop.location}</TableCell>
                      <TableCell>₨{shop.monthlyRent.toLocaleString()}</TableCell>
                      <TableCell className={`font-bold ${shop.outstandingAmount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        ₨{shop.outstandingAmount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(shop.status)}>
                          {language === 'ur' 
                            ? (shop.status === 'occupied' ? 'آباد' : 
                               shop.status === 'vacant' ? 'خالی' : 'مرمت میں')
                            : shop.status
                          }
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(shop.paymentStatus)}>
                          {language === 'ur' 
                            ? (shop.paymentStatus === 'paid' ? 'ادا شدہ' : 
                               shop.paymentStatus === 'due' ? 'واجب' : 'زائد')
                            : shop.paymentStatus
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

        {/* Payments Tab */}
        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                {language === 'ur' ? 'کرایہ ادائیگیاں' : 'Rent Payments'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{language === 'ur' ? 'تاریخ' : 'Date'}</TableHead>
                    <TableHead>{language === 'ur' ? 'دکان نمبر' : 'Shop No.'}</TableHead>
                    <TableHead>{language === 'ur' ? 'کرایہ دار' : 'Tenant'}</TableHead>
                    <TableHead>{language === 'ur' ? 'رقم' : 'Amount'}</TableHead>
                    <TableHead>{language === 'ur' ? 'مہینہ' : 'Month'}</TableHead>
                    <TableHead>{language === 'ur' ? 'ادائیگی کا طریقہ' : 'Payment Method'}</TableHead>
                    <TableHead>{language === 'ur' ? 'رسید نمبر' : 'Receipt No.'}</TableHead>
                    <TableHead>{language === 'ur' ? 'حیثیت' : 'Status'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rentPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>{payment.paymentDate}</TableCell>
                      <TableCell className="font-medium">{payment.shopNumber}</TableCell>
                      <TableCell>{payment.tenantName}</TableCell>
                      <TableCell className="font-medium">₨{payment.amount.toLocaleString()}</TableCell>
                      <TableCell>{payment.month} {payment.year}</TableCell>
                      <TableCell>
                        <Badge className={getPaymentMethodColor(payment.paymentMethod)}>
                          {language === 'ur' 
                            ? (payment.paymentMethod === 'cash' ? 'نقد' : 
                               payment.paymentMethod === 'online' ? 'آن لائن' : 'بینک')
                            : payment.paymentMethod
                          }
                        </Badge>
                      </TableCell>
                      <TableCell>{payment.receiptNumber}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(payment.status)}>
                          {language === 'ur' 
                            ? (payment.status === 'paid' ? 'ادا شدہ' : 'زیر التوا')
                            : payment.status
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
            {/* Rental Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  {language === 'ur' ? 'کرایہ کا خلاصہ' : 'Rental Summary'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{language === 'ur' ? 'کل دکانیں:' : 'Total Shops:'}</span>
                    <span className="font-bold">{rentalReport.totalShops}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{language === 'ur' ? 'آباد دکانیں:' : 'Occupied Shops:'}</span>
                    <span className="font-bold text-green-600">{rentalReport.occupiedShops}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{language === 'ur' ? 'خالی دکانیں:' : 'Vacant Shops:'}</span>
                    <span className="font-bold text-gray-600">{rentalReport.vacantShops}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{language === 'ur' ? 'کل کرایہ:' : 'Total Rent:'}</span>
                    <span className="font-bold">₨{rentalReport.totalRent.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{language === 'ur' ? 'وصول شدہ کرایہ:' : 'Collected Rent:'}</span>
                    <span className="font-bold text-green-600">₨{rentalReport.collectedRent.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{language === 'ur' ? 'بقایا کرایہ:' : 'Outstanding Rent:'}</span>
                    <span className="font-bold text-red-600">₨{rentalReport.outstandingRent.toLocaleString()}</span>
                  </div>
                </div>
                <Button className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  {language === 'ur' ? 'رپورٹ ڈاؤن لوڈ کریں' : 'Download Report'}
                </Button>
              </CardContent>
            </Card>

            {/* Collection Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="w-5 h-5 mr-2" />
                  {language === 'ur' ? 'وصولی کا تجزیہ' : 'Collection Analysis'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{language === 'ur' ? 'وصولی کی شرح:' : 'Collection Rate:'}</span>
                    <span className="font-bold text-blue-600">{rentalReport.collectionRate.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{language === 'ur' ? 'اوسط کرایہ:' : 'Average Rent:'}</span>
                    <span className="font-bold">₨{(rentalReport.totalRent / rentalReport.totalShops).toLocaleString()}</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  <FileText className="w-4 h-4 mr-2" />
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