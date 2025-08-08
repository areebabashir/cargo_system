import { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import axios from "axios";

interface ExpenseItem {
  amount: number;
  description: string;
  paymentMethod: string;
  paymentDate: Date;
  category?: string;
  location?: string;
}

interface FinancialReport {
  _id: string;
  tripId: string;
  driverId: string;
  vehicleId: string;
  date: Date;
  expenses: {
    driverPayment: ExpenseItem;
    mazdori: ExpenseItem;
    loading: ExpenseItem;
    unloading: ExpenseItem;
    roadExpenses: ExpenseItem[];
    tripExpenses: ExpenseItem[];
    otherExpenses: ExpenseItem[];
  };
  income: {
    amount: number;
    description: string;
    paymentMethod: string;
    paymentDate: Date;
  };
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Trip {
  _id: string;
  tripNumber: string;
}

interface Driver {
  _id: string;
  name: string;
}

interface Vehicle {
  _id: string;
  registrationNumber: string;
}

export default function FinancialReportPage() {
  const { t, language } = useLanguage();
  const [reports, setReports] = useState<FinancialReport[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentReport, setCurrentReport] = useState<FinancialReport | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    tripId: "",
    driverId: "",
    vehicleId: "",
    date: new Date(),
    expenses: {
      driverPayment: { amount: 0, description: "", paymentMethod: "cash", paymentDate: new Date() },
      mazdori: { amount: 0, description: "", paymentMethod: "cash", paymentDate: new Date() },
      loading: { amount: 0, description: "", paymentMethod: "cash", paymentDate: new Date() },
      unloading: { amount: 0, description: "", paymentMethod: "cash", paymentDate: new Date() },
      roadExpenses: [] as ExpenseItem[],
      tripExpenses: [] as ExpenseItem[],
      otherExpenses: [] as ExpenseItem[]
    },
    income: { amount: 0, description: "", paymentMethod: "cash", paymentDate: new Date() },
    notes: ""
  });

  const API_URL = "http://localhost:8000/api/financial-reports";
  const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [reportsRes, tripsRes, driversRes, vehiclesRes] = await Promise.all([
        axiosInstance.get("/"),
        axios.get("http://localhost:8000/api/trips"),
        axios.get("http://localhost:8000/api/drivers"),
        axios.get("http://localhost:8000/api/vehicles")
      ]);
      
      // Handle nested data structure from API responses
      setReports(Array.isArray(reportsRes.data) ? reportsRes.data : []);
      setTrips(Array.isArray(tripsRes.data?.data) ? tripsRes.data.data : []);
      setDrivers(Array.isArray(driversRes.data?.data) ? driversRes.data.data : []);
      setVehicles(Array.isArray(vehiclesRes.data?.data) ? vehiclesRes.data.data : []);
      
    } catch (error) {
      toast.error(language === 'ur' ? 'ڈیٹا لوڈ کرنے میں ناکام' : 'Failed to load data');
      setReports([]);
      setTrips([]);
      setDrivers([]);
      setVehicles([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleExpenseChange = (expenseType: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      expenses: {
        ...prev.expenses,
        [expenseType]: {
          ...prev.expenses[expenseType as keyof typeof prev.expenses],
          [field]: value
        }
      }
    }));
  };

  const handleIncomeChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      income: {
        ...prev.income,
        [field]: value
      }
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setFormData(prev => ({ ...prev, date }));
    }
  };

  const handleOpenDialog = (report: FinancialReport | null = null) => {
    if (report) {
      setCurrentReport(report);
      setFormData({
        tripId: report.tripId,
        driverId: report.driverId,
        vehicleId: report.vehicleId,
        date: new Date(report.date),
        expenses: report.expenses,
        income: report.income,
        notes: report.notes
      });
    } else {
      setCurrentReport(null);
      setFormData({
        tripId: "",
        driverId: "",
        vehicleId: "",
        date: new Date(),
        expenses: {
          driverPayment: { amount: 0, description: "", paymentMethod: "cash", paymentDate: new Date() },
          mazdori: { amount: 0, description: "", paymentMethod: "cash", paymentDate: new Date() },
          loading: { amount: 0, description: "", paymentMethod: "cash", paymentDate: new Date() },
          unloading: { amount: 0, description: "", paymentMethod: "cash", paymentDate: new Date() },
          roadExpenses: [],
          tripExpenses: [],
          otherExpenses: []
        },
        income: { amount: 0, description: "", paymentMethod: "cash", paymentDate: new Date() },
        notes: ""
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      let response;
      if (currentReport) {
        response = await axiosInstance.put(`/${currentReport._id}`, formData);
        toast.success(language === 'ur' ? 'رپورٹ کامیابی سے اپ ڈیٹ ہو گئی' : 'Report updated successfully');
      } else {
        response = await axiosInstance.post("/", formData);
        toast.success(language === 'ur' ? 'رپورٹ کامیابی سے شامل ہو گئی' : 'Report added successfully');
      }
      fetchData();
      setIsDialogOpen(false);
    } catch (error) {
      toast.error(language === 'ur' ? 'خرابی پیدا ہوئی' : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setIsLoading(true);
      await axiosInstance.delete(`/${id}`);
      toast.success(language === 'ur' ? 'رپورٹ کامیابی سے حذف ہو گئی' : 'Report deleted successfully');
      fetchData();
    } catch (error) {
      toast.error(language === 'ur' ? 'خرابی پیدا ہوئی' : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredReports = reports.filter(report => {
    const trip = trips.find(t => t._id === report.tripId);
    const driver = drivers.find(d => d._id === report.driverId);
    const vehicle = vehicles.find(v => v._id === report.vehicleId);
    
    return (
      (trip?.tripNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      (driver?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      (vehicle?.registrationNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
    );
  });

  const calculateTotalExpenses = (report: FinancialReport) => {
    return (
      report.expenses.driverPayment.amount +
      report.expenses.mazdori.amount +
      report.expenses.loading.amount +
      report.expenses.unloading.amount +
      report.expenses.roadExpenses.reduce((sum, exp) => sum + exp.amount, 0) +
      report.expenses.tripExpenses.reduce((sum, exp) => sum + exp.amount, 0) +
      report.expenses.otherExpenses.reduce((sum, exp) => sum + exp.amount, 0)
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {language === 'ur' ? 'مالی رپورٹس' : 'Financial Reports'}
          </h1>
          <p className="text-gray-600 mt-1">
            {language === 'ur' ? 'ٹرپ سے متعلق مالی رپورٹس کا انتظام کریں' : 'Manage financial reports for trips'}
          </p>
        </div>
        <Button 
          onClick={() => handleOpenDialog()}
          className="bg-gradient-primary text-white"
          disabled={isLoading}
        >
          <Plus className="w-4 h-4 mr-2" />
          {language === 'ur' ? 'نیا رپورٹ' : 'New Report'}
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder={language === 'ur' ? 'تلاش کریں...' : 'Search...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              disabled={isLoading}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            {language === 'ur' ? 'مالی رپورٹس کی فہرست' : 'Financial Reports List'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{language === 'ur' ? 'ٹرپ نمبر' : 'Trip'}</TableHead>
                  <TableHead>{language === 'ur' ? 'ڈرائیور' : 'Driver'}</TableHead>
                  <TableHead>{language === 'ur' ? 'گاڑی' : 'Vehicle'}</TableHead>
                  <TableHead>{language === 'ur' ? 'آمدنی' : 'Income'}</TableHead>
                  <TableHead>{language === 'ur' ? 'اخراجات' : 'Expenses'}</TableHead>
                  <TableHead>{language === 'ur' ? 'منافع' : 'Profit'}</TableHead>
                  <TableHead>{language === 'ur' ? 'عمل' : 'Actions'}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.length > 0 ? (
                  filteredReports.map(report => {
                    const trip = trips.find(t => t._id === report.tripId);
                    const driver = drivers.find(d => d._id === report.driverId);
                    const vehicle = vehicles.find(v => v._id === report.vehicleId);
                    const totalExpenses = calculateTotalExpenses(report);
                    const profit = report.income.amount - totalExpenses;

                    return (
                      <TableRow key={report._id}>
                        <TableCell>{trip?.tripNumber || 'N/A'}</TableCell>
                        <TableCell>{driver?.name || 'N/A'}</TableCell>
                        <TableCell>{vehicle?.registrationNumber || 'N/A'}</TableCell>
                        <TableCell>₨{report.income.amount.toLocaleString()}</TableCell>
                        <TableCell>₨{totalExpenses.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge className={profit >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                            ₨{Math.abs(profit).toLocaleString()} {profit >= 0 ? '↑' : '↓'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => handleOpenDialog(report)}
                              disabled={isLoading}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => handleDelete(report._id)}
                              disabled={isLoading}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => window.open(`${API_URL}/${report._id}/download`, '_blank')}
                              disabled={isLoading}
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">
                      {language === 'ur' ? 'کوئی رپورٹ دستیاب نہیں' : 'No reports available'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {currentReport 
                ? (language === 'ur' ? 'رپورٹ کو اپ ڈیٹ کریں' : 'Update Report')
                : (language === 'ur' ? 'نیا رپورٹ شامل کریں' : 'Add New Report')
              }
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Trip Dropdown */}
              <div>
                <Label>{language === 'ur' ? 'ٹرپ' : 'Trip'} *</Label>
                <Select
                  value={formData.tripId}
                  onValueChange={(value) => handleSelectChange('tripId', value)}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={language === 'ur' ? 'ٹرپ منتخب کریں' : 'Select trip'} />
                  </SelectTrigger>
                  <SelectContent>
                    {trips.length > 0 ? (
                      trips.map(trip => (
                        <SelectItem key={trip._id} value={trip._id}>
                          {trip.tripNumber}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="" disabled>
                        {language === 'ur' ? 'کوئی ٹرپ دستیاب نہیں' : 'No trips available'}
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Driver Dropdown */}
              <div>
                <Label>{language === 'ur' ? 'ڈرائیور' : 'Driver'} *</Label>
                <Select
                  value={formData.driverId}
                  onValueChange={(value) => handleSelectChange('driverId', value)}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={language === 'ur' ? 'ڈرائیور منتخب کریں' : 'Select driver'} />
                  </SelectTrigger>
                  <SelectContent>
                    {drivers.length > 0 ? (
                      drivers.map(driver => (
                        <SelectItem key={driver._id} value={driver._id}>
                          {driver.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="" disabled>
                        {language === 'ur' ? 'کوئی ڈرائیور دستیاب نہیں' : 'No drivers available'}
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Vehicle Dropdown */}
              <div>
                <Label>{language === 'ur' ? 'گاڑی' : 'Vehicle'} *</Label>
                <Select
                  value={formData.vehicleId}
                  onValueChange={(value) => handleSelectChange('vehicleId', value)}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={language === 'ur' ? 'گاڑی منتخب کریں' : 'Select vehicle'} />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicles.length > 0 ? (
                      vehicles.map(vehicle => (
                        <SelectItem key={vehicle._id} value={vehicle._id}>
                          {vehicle.registrationNumber}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="" disabled>
                        {language === 'ur' ? 'کوئی گاڑی دستیاب نہیں' : 'No vehicles available'}
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>{language === 'ur' ? 'تاریخ' : 'Date'} *</Label>
                <input
                  type="date"
                  value={formData.date.toISOString().split('T')[0]}
                  onChange={(e) => handleDateChange(new Date(e.target.value))}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Income Section */}
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-4">{language === 'ur' ? 'آمدنی' : 'Income'}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>{language === 'ur' ? 'رقم' : 'Amount'} *</Label>
                  <Input
                    type="number"
                    value={formData.income.amount}
                    onChange={(e) => handleIncomeChange('amount', parseFloat(e.target.value || "0"))}
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <Label>{language === 'ur' ? 'تفصیل' : 'Description'} *</Label>
                  <Input
                    value={formData.income.description}
                    onChange={(e) => handleIncomeChange('description', e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <Label>{language === 'ur' ? 'ادائیگی کا طریقہ' : 'Payment Method'} *</Label>
                  <Select
                    value={formData.income.paymentMethod}
                    onValueChange={(value) => handleIncomeChange('paymentMethod', value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={language === 'ur' ? 'طریقہ منتخب کریں' : 'Select method'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">{language === 'ur' ? 'نقد' : 'Cash'}</SelectItem>
                      <SelectItem value="bank transfer">{language === 'ur' ? 'بینک ٹرانسفر' : 'Bank Transfer'}</SelectItem>
                      <SelectItem value="credit card">{language === 'ur' ? 'کریڈٹ کارڈ' : 'Credit Card'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Expenses Section */}
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-4">{language === 'ur' ? 'اخراجات' : 'Expenses'}</h3>

              {/* Fixed Expenses */}
              <div className="space-y-6">
                {/* Driver Payment */}
                <div>
                  <h4 className="font-medium mb-2">{language === 'ur' ? 'ڈرائیور ادائیگی' : 'Driver Payment'}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>{language === 'ur' ? 'رقم' : 'Amount'} *</Label>
                      <Input
                        type="number"
                        value={formData.expenses.driverPayment.amount}
                        onChange={(e) => handleExpenseChange('driverPayment', 'amount', parseFloat(e.target.value || "0"))}
                        disabled={isLoading}
                      />
                    </div>
                    <div>
                      <Label>{language === 'ur' ? 'تفصیل' : 'Description'}</Label>
                      <Input
                        value={formData.expenses.driverPayment.description}
                        onChange={(e) => handleExpenseChange('driverPayment', 'description', e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                    <div>
                      <Label>{language === 'ur' ? 'ادائیگی کا طریقہ' : 'Payment Method'}</Label>
                      <Select
                        value={formData.expenses.driverPayment.paymentMethod}
                        onValueChange={(value) => handleExpenseChange('driverPayment', 'paymentMethod', value)}
                        disabled={isLoading}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={language === 'ur' ? 'طریقہ منتخب کریں' : 'Select method'} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cash">{language === 'ur' ? 'نقد' : 'Cash'}</SelectItem>
                          <SelectItem value="bank transfer">{language === 'ur' ? 'بینک ٹرانسفر' : 'Bank Transfer'}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Mazdori */}
                <div>
                  <h4 className="font-medium mb-2">{language === 'ur' ? 'مزدوری' : 'Mazdori'}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>{language === 'ur' ? 'رقم' : 'Amount'} *</Label>
                      <Input
                        type="number"
                        value={formData.expenses.mazdori.amount}
                        onChange={(e) => handleExpenseChange('mazdori', 'amount', parseFloat(e.target.value || "0"))}
                        disabled={isLoading}
                      />
                    </div>
                    <div>
                      <Label>{language === 'ur' ? 'تفصیل' : 'Description'}</Label>
                      <Input
                        value={formData.expenses.mazdori.description}
                        onChange={(e) => handleExpenseChange('mazdori', 'description', e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                    <div>
                      <Label>{language === 'ur' ? 'ادائیگی کا طریقہ' : 'Payment Method'}</Label>
                      <Select
                        value={formData.expenses.mazdori.paymentMethod}
                        onValueChange={(value) => handleExpenseChange('mazdori', 'paymentMethod', value)}
                        disabled={isLoading}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={language === 'ur' ? 'طریقہ منتخب کریں' : 'Select method'} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cash">{language === 'ur' ? 'نقد' : 'Cash'}</SelectItem>
                          <SelectItem value="bank transfer">{language === 'ur' ? 'بینک ٹرانسفر' : 'Bank Transfer'}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Loading/Unloading */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-2">{language === 'ur' ? 'لوڈنگ' : 'Loading'}</h4>
                    <div className="space-y-4">
                      <div>
                        <Label>{language === 'ur' ? 'رقم' : 'Amount'} *</Label>
                        <Input
                          type="number"
                          value={formData.expenses.loading.amount}
                          onChange={(e) => handleExpenseChange('loading', 'amount', parseFloat(e.target.value || "0"))}
                          disabled={isLoading}
                        />
                      </div>
                      <div>
                        <Label>{language === 'ur' ? 'تفصیل' : 'Description'}</Label>
                        <Input
                          value={formData.expenses.loading.description}
                          onChange={(e) => handleExpenseChange('loading', 'description', e.target.value)}
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">{language === 'ur' ? 'ان لوڈنگ' : 'Unloading'}</h4>
                    <div className="space-y-4">
                      <div>
                        <Label>{language === 'ur' ? 'رقم' : 'Amount'} *</Label>
                        <Input
                          type="number"
                          value={formData.expenses.unloading.amount}
                          onChange={(e) => handleExpenseChange('unloading', 'amount', parseFloat(e.target.value || "0"))}
                          disabled={isLoading}
                        />
                      </div>
                      <div>
                        <Label>{language === 'ur' ? 'تفصیل' : 'Description'}</Label>
                        <Input
                          value={formData.expenses.unloading.description}
                          onChange={(e) => handleExpenseChange('unloading', 'description', e.target.value)}
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Array Expenses */}
                {(['roadExpenses', 'tripExpenses', 'otherExpenses'] as const).map((expenseType) => (
                  <div key={expenseType} className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">
                        {language === 'ur' 
                          ? expenseType === 'roadExpenses' ? 'سڑک کے اخراجات' 
                            : expenseType === 'tripExpenses' ? 'ٹرپ کے اخراجات' 
                            : 'دیگر اخراجات'
                          : expenseType === 'roadExpenses' ? 'Road Expenses'
                            : expenseType === 'tripExpenses' ? 'Trip Expenses'
                            : 'Other Expenses'
                        }
                      </h4>
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            expenses: {
                              ...prev.expenses,
                              [expenseType]: [
                                ...prev.expenses[expenseType],
                                {
                                  amount: 0,
                                  description: "",
                                  paymentMethod: "cash",
                                  paymentDate: new Date(),
                                  ...(expenseType === 'roadExpenses' && { category: "", location: "" })
                                }
                              ]
                            }
                          }))
                        }}
                        disabled={isLoading}
                      >
                        {language === 'ur' ? 'نیا شامل کریں' : 'Add New'}
                      </Button>
                    </div>

                    {formData.expenses[expenseType].map((expense, index) => (
                      <div key={index} className="border rounded-lg p-4 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <Label>{language === 'ur' ? 'رقم' : 'Amount'} *</Label>
                            <Input
                              type="number"
                              value={expense.amount}
                              onChange={(e) => {
                                const newExpenses = [...formData.expenses[expenseType]];
                                newExpenses[index] = {
                                  ...newExpenses[index],
                                  amount: parseFloat(e.target.value || "0")
                                };
                                setFormData(prev => ({
                                  ...prev,
                                  expenses: {
                                    ...prev.expenses,
                                    [expenseType]: newExpenses
                                  }
                                }));
                              }}
                              disabled={isLoading}
                            />
                          </div>
                          <div>
                            <Label>{language === 'ur' ? 'تفصیل' : 'Description'}</Label>
                            <Input
                              value={expense.description}
                              onChange={(e) => {
                                const newExpenses = [...formData.expenses[expenseType]];
                                newExpenses[index] = {
                                  ...newExpenses[index],
                                  description: e.target.value
                                };
                                setFormData(prev => ({
                                  ...prev,
                                  expenses: {
                                    ...prev.expenses,
                                    [expenseType]: newExpenses
                                  }
                                }));
                              }}
                              disabled={isLoading}
                            />
                          </div>
                          {expenseType === 'roadExpenses' && (
                            <>
                              <div>
                                <Label>{language === 'ur' ? 'قسم' : 'Category'}</Label>
                                <Input
                                  value={expense.category || ""}
                                  onChange={(e) => {
                                    const newExpenses = [...formData.expenses.roadExpenses];
                                    newExpenses[index] = {
                                      ...newExpenses[index],
                                      category: e.target.value
                                    };
                                    setFormData(prev => ({
                                      ...prev,
                                      expenses: {
                                        ...prev.expenses,
                                        roadExpenses: newExpenses
                                      }
                                    }));
                                  }}
                                  disabled={isLoading}
                                />
                              </div>
                              <div>
                                <Label>{language === 'ur' ? 'مقام' : 'Location'}</Label>
                                <Input
                                  value={expense.location || ""}
                                  onChange={(e) => {
                                    const newExpenses = [...formData.expenses.roadExpenses];
                                    newExpenses[index] = {
                                      ...newExpenses[index],
                                      location: e.target.value
                                    };
                                    setFormData(prev => ({
                                      ...prev,
                                      expenses: {
                                        ...prev.expenses,
                                        roadExpenses: newExpenses
                                      }
                                    }));
                                  }}
                                  disabled={isLoading}
                                />
                              </div>
                            </>
                          )}
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            const newExpenses = [...formData.expenses[expenseType]];
                            newExpenses.splice(index, 1);
                            setFormData(prev => ({
                              ...prev,
                              expenses: {
                                ...prev.expenses,
                                [expenseType]: newExpenses
                              }
                            }));
                          }}
                          disabled={isLoading}
                        >
                          {language === 'ur' ? 'حذف کریں' : 'Remove'}
                        </Button>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <Label>{language === 'ur' ? 'نوٹس' : 'Notes'}</Label>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                disabled={isLoading}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={isLoading}
              >
                {language === 'ur' ? 'منسوخ کریں' : 'Cancel'}
              </Button>
              <Button
                type="submit"
                className="bg-gradient-primary text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    {language === 'ur' ? 'محفوظ ہو رہا ہے...' : 'Saving...'}
                  </span>
                ) : currentReport ? (
                  language === 'ur' ? 'اپ ڈیٹ کریں' : 'Update'
                ) : (
                  language === 'ur' ? 'شامل کریں' : 'Save'
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}