import { useState, useEffect } from "react";
import { Plus, Search, Filter, Download, Eye, Edit, Trash2, Phone, MapPin, Package, Truck, DollarSign, Calendar, User, Building } from "lucide-react";
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
import { shipmentService } from "@/services/shipmentService";
import { generatePDFReceipt } from "@/components/ui/pdf-receipt";
import { useToast } from "@/hooks/use-toast";

interface BiltyItem {
  id: string;
  description: string;
  quantity: number;
  unitFare: number;
  totalFare: number;
}

interface BiltyData {
  id: string;
  biltyNumber: string;
  senderName: string;
  addaName: string;
  cityName: string;
  receiverName: string;
  receiverPhone: string;
  receiverAddress: string;
  paymentStatus: 'paid' | 'unpaid';
  phoneNumber: string;
  items: BiltyItem[];
  totalFare: number;
  mazdoori: number;
  biltyCharges: number;
  reriCharges: number;
  extraCharges: number;
  receivedFare: number;
  remainingFare: number;
  deliveryStatus: 'delivered' | 'pending' | 'returned';
  dateTime: string;
  vehicleNumber?: string;
  driverName?: string;
  pickupType: 'self' | 'delivery';
  totalCharges?: number; // Added for detailed breakdown
}

export default function Shipments() {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [biltyData, setBiltyData] = useState<BiltyData[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedBilty, setSelectedBilty] = useState<BiltyData | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPayment, setFilterPayment] = useState("all");
  const [loading, setLoading] = useState(false);
  const [downloadingReceipt, setDownloadingReceipt] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<Partial<BiltyData>>({
    biltyNumber: "",
    senderName: "",
    addaName: "",
    cityName: "",
    receiverName: "",
    receiverPhone: "",
    receiverAddress: "",
    paymentStatus: "unpaid",
    phoneNumber: "",
    items: [],
    totalFare: 0,
    totalCharges: 0,
    mazdoori: 0,
    biltyCharges: 0,
    reriCharges: 0,
    extraCharges: 0,
    receivedFare: 0,
    remainingFare: 0,
    deliveryStatus: "pending",
    pickupType: "delivery"
  });

  // Item management
  const [items, setItems] = useState<BiltyItem[]>([]);
  const [newItem, setNewItem] = useState<Partial<BiltyItem>>({
    description: "",
    quantity: 1,
    unitFare: 0
  });

  // Load shipments from API
  useEffect(() => {
    loadShipments();
  }, [searchTerm, filterStatus, filterPayment]);

  // Recalculate totals when items or form data changes
  useEffect(() => {
    const totalFare = calculateTotalFare();
    const totalCharges = totalFare + (formData.mazdoori || 0) + (formData.biltyCharges || 0) + (formData.reriCharges || 0) + (formData.extraCharges || 0);
    const remainingFare = totalCharges - (formData.receivedFare || 0);
    
    console.log('useEffect: Recalculating totals - Total fare:', totalFare, 'Total charges:', totalCharges, 'Remaining fare:', remainingFare);
    
    setFormData(prev => ({
      ...prev,
      totalFare: totalFare,
      totalCharges: totalCharges,
      remainingFare: remainingFare
    }));
  }, [items, formData.mazdoori, formData.biltyCharges, formData.reriCharges, formData.extraCharges, formData.receivedFare]);

  // Reset form when dialog opens
  useEffect(() => {
    if (isFormOpen) {
      resetForm();
      console.log('Form dialog opened, form reset');
    }
  }, [isFormOpen]);

  const loadShipments = async () => {
    try {
      setLoading(true);
      const response = await shipmentService.getShipments({
        search: searchTerm,
        status: filterStatus,
        paymentStatus: filterPayment
      });
      setBiltyData(response.data || []);
    } catch (error) {
      console.error('Error loading shipments:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateBiltyNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `BLT-${year}-${month}${day}-${random}`;
  };

  // Item management functions
  const addItem = () => {
    if (newItem.description && newItem.quantity && newItem.unitFare) {
      const item: BiltyItem = {
        id: Date.now().toString(),
        description: newItem.description,
        quantity: newItem.quantity,
        unitFare: newItem.unitFare,
        totalFare: newItem.quantity * newItem.unitFare
      };
      
      const updatedItems = [...items, item];
      setItems(updatedItems);
      
      // Update formData.items to keep them in sync
      setFormData(prev => ({
        ...prev,
        items: updatedItems
      }));
      
      console.log('Item added:', item);
      console.log('Updated items array:', updatedItems);
      
      setNewItem({ description: "", quantity: 1, unitFare: 0 });
    }
  };

  const removeItem = (itemId: string) => {
    const updatedItems = items.filter(item => item.id !== itemId);
    setItems(updatedItems);
    
    // Update formData.items to keep them in sync
    setFormData(prev => ({
      ...prev,
      items: updatedItems
    }));
    
    console.log('Item removed. Updated items:', updatedItems);
  };

  const updateItem = (itemId: string, field: keyof BiltyItem, value: any) => {
    const updatedItems = items.map(item => {
      if (item.id === itemId) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'quantity' || field === 'unitFare') {
          updatedItem.totalFare = updatedItem.quantity * updatedItem.unitFare;
        }
        return updatedItem;
      }
      return item;
    });
    
    setItems(updatedItems);
    
    // Update formData.items to keep them in sync
    setFormData(prev => ({
      ...prev,
      items: updatedItems
    }));
    
    console.log('Item updated. Updated items:', updatedItems);
  };

  // Calculate totals
  const calculateTotalFare = () => {
    const total = items.reduce((sum, item) => sum + item.totalFare, 0);
    console.log('Calculated total fare:', total);
    return total;
  };

  const calculateRemainingFare = () => {
    const totalFare = calculateTotalFare();
    const totalCharges = totalFare + (formData.mazdoori || 0) + (formData.biltyCharges || 0) + (formData.reriCharges || 0) + (formData.extraCharges || 0);
    const remaining = totalCharges - (formData.receivedFare || 0);
    console.log('Calculated remaining fare:', remaining);
    return remaining;
  };

  const resetForm = () => {
    setFormData({
      biltyNumber: "",
      senderName: "",
      addaName: "",
      cityName: "",
      receiverName: "",
      receiverPhone: "",
      receiverAddress: "",
      paymentStatus: "unpaid",
      phoneNumber: "",
      items: [],
      totalFare: 0,
      totalCharges: 0,
      mazdoori: 0,
      biltyCharges: 0,
      reriCharges: 0,
      extraCharges: 0,
      receivedFare: 0,
      remainingFare: 0,
      deliveryStatus: "pending",
      pickupType: "delivery"
    });
    setItems([]);
    setNewItem({ description: "", quantity: 1, unitFare: 0 });
    console.log('Form reset completed');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const totalFare = calculateTotalFare();
      const totalCharges = totalFare + (formData.mazdoori || 0) + (formData.biltyCharges || 0) + (formData.reriCharges || 0) + (formData.extraCharges || 0);
      const remainingFare = totalCharges - (formData.receivedFare || 0);
      
      const shipmentData = {
        biltyNumber: formData.biltyNumber || generateBiltyNumber(),
        items: items, // Use the items state directly
        totalFare: totalFare,
        totalCharges: totalCharges,
        remainingFare: remainingFare,
        senderName: formData.senderName,
        addaName: formData.addaName,
        cityName: formData.cityName,
        receiverName: formData.receiverName,
        receiverPhone: formData.receiverPhone,
        receiverAddress: formData.receiverAddress,
        paymentStatus: formData.paymentStatus,
        phoneNumber: formData.phoneNumber,
        mazdoori: formData.mazdoori || 0,
        biltyCharges: formData.biltyCharges || 0,
        reriCharges: formData.reriCharges || 0,
        extraCharges: formData.extraCharges || 0,
        receivedFare: formData.receivedFare || 0,
        deliveryStatus: formData.deliveryStatus,
        pickupType: formData.pickupType,
        dateTime: new Date().toISOString().slice(0, 16).replace('T', ' ')
      };

      console.log('Submitting shipment data:', shipmentData);
      console.log('Items being sent:', items);
      console.log('Total fare:', totalFare);
      console.log('Total charges:', totalCharges);
      console.log('Remaining fare:', remainingFare);

      await shipmentService.createShipment(shipmentData);
      
      // Reset form
      resetForm();
      setIsFormOpen(false);
      
      // Reload shipments
      loadShipments();
    } catch (error) {
      console.error('Error creating shipment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewBilty = (bilty: BiltyData) => {
    setSelectedBilty(bilty);
    setIsViewOpen(true);
  };

  const handleDownloadReceipt = async (bilty: BiltyData) => {
    try {
      setDownloadingReceipt(bilty.id);
      const receiptData = {
        documentNumber: bilty.biltyNumber,
        date: new Date(bilty.dateTime).toLocaleDateString(),
        senderName: bilty.senderName,
        senderPhone: bilty.phoneNumber,
        senderAddress: `${bilty.addaName}, ${bilty.cityName}`,
        receiverName: bilty.receiverName,
        receiverPhone: bilty.receiverPhone,
        receiverAddress: bilty.receiverAddress,
        quantity: bilty.items.reduce((sum, item) => sum + item.quantity, 0),
        weight: 0, // Not used in current structure
        details: bilty.items.map(item => `${item.description} (${item.quantity}x${item.unitFare})`).join(', '),
        fare: bilty.totalFare,
        localCharges: 0, // Not used in current structure
        mazdoori: bilty.mazdoori,
        biltyCharges: bilty.biltyCharges,
        totalAmount: bilty.totalFare + bilty.mazdoori + bilty.biltyCharges + (bilty.reriCharges || 0) + (bilty.extraCharges || 0),
        paymentStatus: bilty.paymentStatus,
        deliveryStatus: bilty.deliveryStatus,
        vehicleNumber: bilty.vehicleNumber || "N/A",
        driverName: bilty.driverName || "N/A",
        pickupType: bilty.pickupType,
        addaName: bilty.addaName,
        cityName: bilty.cityName,
        biltyNumber: bilty.biltyNumber,
        type: 'bilty' as const,
        items: bilty.items,
        reriCharges: bilty.reriCharges || 0,
        extraCharges: bilty.extraCharges || 0,
        receivedFare: bilty.receivedFare || 0,
        remainingFare: bilty.remainingFare || 0
      };
      
      await generatePDFReceipt(receiptData, language);
      
      toast({
        title: language === 'ur' ? 'رسید ڈاؤن لوڈ ہو گئی' : 'Receipt Downloaded',
        description: language === 'ur' 
          ? `${bilty.biltyNumber} کی رسید کامیابی سے ڈاؤن لوڈ ہو گئی` 
          : `Receipt for ${bilty.biltyNumber} has been downloaded successfully`,
      });
      
    } catch (error) {
      console.error('Error generating PDF receipt:', error);
      
      toast({
        title: language === 'ur' ? 'خرابی' : 'Error',
        description: language === 'ur' 
          ? 'رسید ڈاؤن لوڈ کرنے میں خرابی ہوئی' 
          : 'Failed to download receipt. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setDownloadingReceipt(null);
    }
  };

  const filteredBiltyData = biltyData.filter(bilty => {
    const matchesSearch = 
      bilty.biltyNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bilty.senderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bilty.receiverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bilty.addaName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bilty.cityName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || bilty.deliveryStatus === filterStatus;
    const matchesPayment = filterPayment === "all" || bilty.paymentStatus === filterPayment;
    
    return matchesSearch && matchesStatus && matchesPayment;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'returned': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentColor = (status: string) => {
    return status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {language === 'ur' ? 'بلٹی مینجمنٹ' : 'Bilty Management'}
          </h1>
          <p className="text-gray-600 mt-1">
            {language === 'ur' ? 'شپمنٹس اور کنسائنمنٹ کا انتظام' : 'Manage shipments and consignments'}
          </p>
        </div>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary hover:bg-primary-hover text-white" disabled={loading}>
              <Plus className="w-4 h-4 mr-2" />
              {loading ? 'Loading...' : (language === 'ur' ? 'نیا بلٹی' : 'New Bilty')}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {language === 'ur' ? 'نیا بلٹی شامل کریں' : 'Add New Bilty'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="biltyNumber">
                    {language === 'ur' ? 'بلٹی نمبر' : 'Bilty Number'}
                  </Label>
                  <Input
                    id="biltyNumber"
                    value={formData.biltyNumber}
                    onChange={(e) => setFormData({...formData, biltyNumber: e.target.value})}
                    placeholder={language === 'ur' ? 'بلٹی نمبر درج کریں' : 'Enter bilty number'}
                  />
                </div>
                <div>
                  <Label htmlFor="dateTime">
                    {language === 'ur' ? 'تاریخ اور وقت' : 'Date & Time'}
                  </Label>
                  <Input
                    id="dateTime"
                    type="datetime-local"
                    value={formData.dateTime}
                    onChange={(e) => setFormData({...formData, dateTime: e.target.value})}
                  />
                </div>
              </div>

              {/* Sender Information */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-4">
                  {language === 'ur' ? 'مرسل کی معلومات' : 'Sender Information'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="senderName">
                      {language === 'ur' ? 'مرسل کا نام' : 'Sender Name'}
                    </Label>
                    <Input
                      id="senderName"
                      value={formData.senderName}
                      onChange={(e) => setFormData({...formData, senderName: e.target.value})}
                      placeholder={language === 'ur' ? 'مرسل کا نام درج کریں' : 'Enter sender name'}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phoneNumber">
                      {language === 'ur' ? 'فون نمبر' : 'Phone Number'}
                    </Label>
                    <Input
                      id="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                      placeholder={language === 'ur' ? 'فون نمبر درج کریں' : 'Enter phone number'}
                    />
                  </div>
                  <div>
                    <Label htmlFor="addaName">
                      {language === 'ur' ? 'ادا کا نام' : 'Adda Name'}
                    </Label>
                    <Input
                      id="addaName"
                      value={formData.addaName}
                      onChange={(e) => setFormData({...formData, addaName: e.target.value})}
                      placeholder={language === 'ur' ? 'ادا کا نام درج کریں' : 'Enter adda name'}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cityName">
                      {language === 'ur' ? 'شہر کا نام' : 'City Name'}
                    </Label>
                    <Input
                      id="cityName"
                      value={formData.cityName}
                      onChange={(e) => setFormData({...formData, cityName: e.target.value})}
                      placeholder={language === 'ur' ? 'شہر کا نام درج کریں' : 'Enter city name'}
                    />
                  </div>
                </div>
              </div>

              {/* Receiver Information */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-4">
                  {language === 'ur' ? 'وصول کنندہ کی معلومات' : 'Receiver Information'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="receiverName">
                      {language === 'ur' ? 'وصول کنندہ کا نام' : 'Receiver Name'}
                    </Label>
                    <Input
                      id="receiverName"
                      value={formData.receiverName}
                      onChange={(e) => setFormData({...formData, receiverName: e.target.value})}
                      placeholder={language === 'ur' ? 'وصول کنندہ کا نام درج کریں' : 'Enter receiver name'}
                    />
                  </div>
                  <div>
                    <Label htmlFor="receiverPhone">
                      {language === 'ur' ? 'وصول کنندہ کا فون' : 'Receiver Phone'}
                    </Label>
                    <Input
                      id="receiverPhone"
                      value={formData.receiverPhone}
                      onChange={(e) => setFormData({...formData, receiverPhone: e.target.value})}
                      placeholder={language === 'ur' ? 'فون نمبر درج کریں' : 'Enter phone number'}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="receiverAddress">
                      {language === 'ur' ? 'وصول کنندہ کا پتہ' : 'Receiver Address'}
                    </Label>
                    <Textarea
                      id="receiverAddress"
                      value={formData.receiverAddress}
                      onChange={(e) => setFormData({...formData, receiverAddress: e.target.value})}
                      placeholder={language === 'ur' ? 'مکمل پتہ درج کریں' : 'Enter complete address'}
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              {/* Items Section */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-4">
                  {language === 'ur' ? 'اشیاء کی تفصیلات' : 'Item Details'}
                </h3>
                
                {/* Add Item Form */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <Label>
                      {language === 'ur' ? 'تفصیل' : 'Description'}
                    </Label>
                    <Input
                      value={newItem.description}
                      onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                      placeholder={language === 'ur' ? 'اشیاء کی تفصیل' : 'Item description'}
                    />
                  </div>
                  <div>
                    <Label>
                      {language === 'ur' ? 'مقدار' : 'Quantity'}
                    </Label>
                    <Input
                      type="number"
                      value={newItem.quantity}
                      onChange={(e) => setNewItem({...newItem, quantity: parseInt(e.target.value) || 0})}
                      placeholder="1"
                    />
                  </div>
                  <div>
                    <Label>
                      {language === 'ur' ? 'فی یونٹ ریٹ' : 'Unit Rate'}
                    </Label>
                    <Input
                      type="number"
                      value={newItem.unitFare}
                      onChange={(e) => setNewItem({...newItem, unitFare: parseFloat(e.target.value) || 0})}
                      placeholder="0"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button type="button" onClick={addItem} className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      {language === 'ur' ? 'شامل کریں' : 'Add Item'}
                    </Button>
                  </div>
                </div>

                {/* Items List */}
                {items.length > 0 && (
                  <div className="space-y-2">
                    {items.map((item) => (
                      <div key={item.id} className="grid grid-cols-5 gap-4 p-3 bg-white border rounded-lg items-center">
                        <div className="font-medium">{item.description}</div>
                        <div className="text-center">{item.quantity}</div>
                        <div className="text-center">PKR {item.unitFare}</div>
                        <div className="text-center font-semibold">PKR {item.totalFare}</div>
                        <div className="text-center">
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-end p-3 bg-gray-50 rounded-lg">
                      <div className="text-lg font-bold">
                        {language === 'ur' ? 'کل ریٹ: ' : 'Total Fare: '}PKR {calculateTotalFare()}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Charges Section */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-4">
                  {language === 'ur' ? 'اضافی چارجز' : 'Additional Charges'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="mazdoori">
                      {language === 'ur' ? 'مزدوری' : 'Mazdoori'}
                    </Label>
                    <Input
                      id="mazdoori"
                      type="number"
                      value={formData.mazdoori}
                      onChange={(e) => setFormData({...formData, mazdoori: parseFloat(e.target.value) || 0})}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="biltyCharges">
                      {language === 'ur' ? 'بلٹی چارجز' : 'Bilty Charges'}
                    </Label>
                    <Input
                      id="biltyCharges"
                      type="number"
                      value={formData.biltyCharges}
                      onChange={(e) => setFormData({...formData, biltyCharges: parseFloat(e.target.value) || 0})}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="reriCharges">
                      {language === 'ur' ? 'ریری چارجز' : 'Reri Charges'}
                    </Label>
                    <Input
                      id="reriCharges"
                      type="number"
                      value={formData.reriCharges}
                      onChange={(e) => setFormData({...formData, reriCharges: parseFloat(e.target.value) || 0})}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="extraCharges">
                      {language === 'ur' ? 'اضافی چارجز' : 'Extra Charges'}
                    </Label>
                    <Input
                      id="extraCharges"
                      type="number"
                      value={formData.extraCharges}
                      onChange={(e) => setFormData({...formData, extraCharges: parseFloat(e.target.value) || 0})}
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Section */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-4">
                  {language === 'ur' ? 'ادائیگی کی تفصیلات' : 'Payment Details'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="receivedFare">
                      {language === 'ur' ? 'وصول شدہ رقم' : 'Received Amount'}
                    </Label>
                    <Input
                      id="receivedFare"
                      type="number"
                      value={formData.receivedFare}
                      onChange={(e) => setFormData({...formData, receivedFare: parseFloat(e.target.value) || 0})}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="paymentStatus">
                      {language === 'ur' ? 'ادائیگی کی صورتحال' : 'Payment Status'}
                    </Label>
                    <Select
                      value={formData.paymentStatus}
                      onValueChange={(value) => setFormData({...formData, paymentStatus: value as 'paid' | 'unpaid'})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="paid">
                          {language === 'ur' ? 'ادا شدہ' : 'Paid'}
                        </SelectItem>
                        <SelectItem value="unpaid">
                          {language === 'ur' ? 'غیر ادا شدہ' : 'Unpaid'}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="pickupType">
                      {language === 'ur' ? 'ڈیلیوری کی قسم' : 'Pickup Type'}
                    </Label>
                    <Select
                      value={formData.pickupType}
                      onValueChange={(value) => setFormData({...formData, pickupType: value as 'self' | 'delivery'})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="delivery">
                          {language === 'ur' ? 'ڈیلیوری' : 'Delivery'}
                        </SelectItem>
                        <SelectItem value="self">
                          {language === 'ur' ? 'خود لینا' : 'Self Pickup'}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Total Fare and Remaining Fare Display */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-4">
                  {language === 'ur' ? 'کل حساب' : 'Total Calculation'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <Label className="text-sm font-medium text-gray-600">
                      {language === 'ur' ? 'کل ریٹ' : 'Total Fare'}
                    </Label>
                    <div className="text-2xl font-bold text-green-600">
                      PKR {calculateTotalFare()}
                    </div>
                  </div>
                  <div className="text-center">
                    <Label className="text-sm font-medium text-gray-600">
                      {language === 'ur' ? 'باقی رقم' : 'Remaining Fare'}
                    </Label>
                    <div className="text-2xl font-bold text-red-600">
                      PKR {calculateRemainingFare()}
                    </div>
                  </div>
                </div>
                
                {/* Detailed Breakdown */}
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold mb-2">
                    {language === 'ur' ? 'تفصیلی حساب' : 'Detailed Breakdown'}
                  </h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>{language === 'ur' ? 'اشیاء کا کل ریٹ:' : 'Items Total Fare:'}</span>
                      <span>PKR {calculateTotalFare()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{language === 'ur' ? 'مزدوری:' : 'Mazdoori:'}</span>
                      <span>PKR {formData.mazdoori || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{language === 'ur' ? 'بلٹی چارجز:' : 'Bilty Charges:'}</span>
                      <span>PKR {formData.biltyCharges || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{language === 'ur' ? 'ریری چارجز:' : 'Reri Charges:'}</span>
                      <span>PKR {formData.reriCharges || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{language === 'ur' ? 'اضافی چارجز:' : 'Extra Charges:'}</span>
                      <span>PKR {formData.extraCharges || 0}</span>
                    </div>
                    <div className="flex justify-between font-bold border-t pt-1">
                      <span>{language === 'ur' ? 'کل چارجز:' : 'Total Charges:'}</span>
                      <span>PKR {formData.totalCharges || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{language === 'ur' ? 'وصول شدہ:' : 'Received:'}</span>
                      <span>PKR {formData.receivedFare || 0}</span>
                    </div>
                    <div className="flex justify-between font-bold text-red-600 border-t pt-1">
                      <span>{language === 'ur' ? 'باقی:' : 'Remaining:'}</span>
                      <span>PKR {calculateRemainingFare()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => {
                  resetForm();
                  setIsFormOpen(false);
                }}>
                  {language === 'ur' ? 'منسوخ' : 'Cancel'}
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : (language === 'ur' ? 'محفوظ کریں' : 'Save Bilty')}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            {language === 'ur' ? 'تلاش اور فلٹر' : 'Search & Filter'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search">
                {language === 'ur' ? 'تلاش' : 'Search'}
              </Label>
              <Input
                id="search"
                placeholder={language === 'ur' ? 'بلٹی نمبر، نام، یا شہر تلاش کریں' : 'Search by bilty number, name, or city'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="statusFilter">
                {language === 'ur' ? 'ڈیلیوری کی صورتحال' : 'Delivery Status'}
              </Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    {language === 'ur' ? 'تمام' : 'All'}
                  </SelectItem>
                  <SelectItem value="pending">
                    {language === 'ur' ? 'زیر التواء' : 'Pending'}
                  </SelectItem>
                  <SelectItem value="delivered">
                    {language === 'ur' ? 'پہنچا دیا گیا' : 'Delivered'}
                  </SelectItem>
                  <SelectItem value="returned">
                    {language === 'ur' ? 'واپس' : 'Returned'}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="paymentFilter">
                {language === 'ur' ? 'ادائیگی کی صورتحال' : 'Payment Status'}
              </Label>
              <Select value={filterPayment} onValueChange={setFilterPayment}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    {language === 'ur' ? 'تمام' : 'All'}
                  </SelectItem>
                  <SelectItem value="paid">
                    {language === 'ur' ? 'ادا شدہ' : 'Paid'}
                  </SelectItem>
                  <SelectItem value="unpaid">
                    {language === 'ur' ? 'غیر ادا شدہ' : 'Unpaid'}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button onClick={loadShipments} className="w-full" disabled={loading}>
                <Filter className="w-4 h-4 mr-2" />
                {loading ? 'Loading...' : (language === 'ur' ? 'تازہ کریں' : 'Refresh')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bilty List */}
      <Card>
        <CardHeader>
          <CardTitle>
            {language === 'ur' ? 'بلٹی کی فہرست' : 'Bilty List'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              {language === 'ur' ? 'لوڈ ہو رہا ہے...' : 'Loading...'}
            </div>
          ) : filteredBiltyData.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {language === 'ur' ? 'کوئی بلٹی نہیں ملی' : 'No bilty found'}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{language === 'ur' ? 'بلٹی نمبر' : 'Bilty Number'}</TableHead>
                  <TableHead>{language === 'ur' ? 'بھیجنے والا' : 'Sender'}</TableHead>
                  <TableHead>{language === 'ur' ? 'وصول کنندہ' : 'Receiver'}</TableHead>
                  <TableHead>{language === 'ur' ? 'شہر' : 'City'}</TableHead>
                  <TableHead>{language === 'ur' ? 'کل رقم' : 'Total Amount'}</TableHead>
                  <TableHead>{language === 'ur' ? 'ادائیگی' : 'Payment'}</TableHead>
                  <TableHead>{language === 'ur' ? 'ڈیلیوری' : 'Delivery'}</TableHead>
                  <TableHead>{language === 'ur' ? 'عمل' : 'Actions'}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBiltyData.map((bilty) => (
                  <TableRow key={bilty.id}>
                    <TableCell className="font-medium">{bilty.biltyNumber}</TableCell>
                    <TableCell>{bilty.senderName}</TableCell>
                    <TableCell>{bilty.receiverName}</TableCell>
                    <TableCell>{bilty.cityName}</TableCell>
                    <TableCell>PKR {bilty.totalFare}</TableCell>
                    <TableCell>
                      <Badge className={getPaymentColor(bilty.paymentStatus)}>
                        {bilty.paymentStatus === 'paid' 
                          ? (language === 'ur' ? 'ادا شدہ' : 'Paid')
                          : (language === 'ur' ? 'غیر ادا شدہ' : 'Unpaid')
                        }
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(bilty.deliveryStatus)}>
                        {bilty.deliveryStatus === 'delivered' 
                          ? (language === 'ur' ? 'پہنچا دیا گیا' : 'Delivered')
                          : bilty.deliveryStatus === 'pending'
                          ? (language === 'ur' ? 'زیر التواء' : 'Pending')
                          : (language === 'ur' ? 'واپس' : 'Returned')
                        }
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewBilty(bilty)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownloadReceipt(bilty)}
                          disabled={downloadingReceipt === bilty.id}
                        >
                          {downloadingReceipt === bilty.id ? (
                            <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                          ) : (
                            <Download className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* View Bilty Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {language === 'ur' ? 'بلٹی کی تفصیلات' : 'Bilty Details'}
            </DialogTitle>
          </DialogHeader>
          {selectedBilty && (
            <div className="space-y-6">
              {/* Bilty Header */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <strong>{language === 'ur' ? 'بلٹی نمبر:' : 'Bilty Number:'}</strong> {selectedBilty.biltyNumber}
                </div>
                <div>
                  <strong>{language === 'ur' ? 'تاریخ:' : 'Date:'}</strong> {selectedBilty.dateTime}
                </div>
              </div>

              {/* Sender & Receiver Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h4 className="font-semibold text-lg">{language === 'ur' ? 'بھیجنے والا' : 'Sender'}</h4>
                  <div><strong>{language === 'ur' ? 'نام:' : 'Name:'}</strong> {selectedBilty.senderName}</div>
                  <div><strong>{language === 'ur' ? 'فون:' : 'Phone:'}</strong> {selectedBilty.phoneNumber}</div>
                  <div><strong>{language === 'ur' ? 'ادا:' : 'Adda:'}</strong> {selectedBilty.addaName}</div>
                  <div><strong>{language === 'ur' ? 'شہر:' : 'City:'}</strong> {selectedBilty.cityName}</div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-lg">{language === 'ur' ? 'وصول کنندہ' : 'Receiver'}</h4>
                  <div><strong>{language === 'ur' ? 'نام:' : 'Name:'}</strong> {selectedBilty.receiverName}</div>
                  <div><strong>{language === 'ur' ? 'فون:' : 'Phone:'}</strong> {selectedBilty.receiverPhone}</div>
                  <div><strong>{language === 'ur' ? 'پتہ:' : 'Address:'}</strong> {selectedBilty.receiverAddress}</div>
                </div>
              </div>

              {/* Items */}
              <div>
                <h4 className="font-semibold text-lg mb-3">{language === 'ur' ? 'اشیاء' : 'Items'}</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{language === 'ur' ? 'تفصیل' : 'Description'}</TableHead>
                      <TableHead>{language === 'ur' ? 'مقدار' : 'Quantity'}</TableHead>
                      <TableHead>{language === 'ur' ? 'فی یونٹ ریٹ' : 'Unit Rate'}</TableHead>
                      <TableHead>{language === 'ur' ? 'کل' : 'Total'}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedBilty.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.description}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>PKR {item.unitFare}</TableCell>
                        <TableCell>PKR {item.totalFare}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Financial Details - Enhanced */}
              <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <div><strong>{language === 'ur' ? 'کل ریٹ:' : 'Total Fare:'}</strong> <span className="text-green-700 font-bold">PKR {selectedBilty.totalFare}</span></div>
                  <div><strong>{language === 'ur' ? 'کل چارجز:' : 'Total Charges:'}</strong> <span className="text-blue-700 font-bold">PKR {selectedBilty.totalCharges ?? (selectedBilty.totalFare + selectedBilty.mazdoori + selectedBilty.biltyCharges + (selectedBilty.reriCharges || 0) + (selectedBilty.extraCharges || 0))}</span></div>
                  <div><strong>{language === 'ur' ? 'مزدوری:' : 'Mazdoori:'}</strong> PKR {selectedBilty.mazdoori}</div>
                  <div><strong>{language === 'ur' ? 'بلٹی چارجز:' : 'Bilty Charges:'}</strong> PKR {selectedBilty.biltyCharges}</div>
                  <div><strong>{language === 'ur' ? 'ریری چارجز:' : 'Reri Charges:'}</strong> PKR {selectedBilty.reriCharges || 0}</div>
                  <div><strong>{language === 'ur' ? 'اضافی چارجز:' : 'Extra Charges:'}</strong> PKR {selectedBilty.extraCharges || 0}</div>
                  <div><strong>{language === 'ur' ? 'وصول شدہ:' : 'Received:'}</strong> <span className="text-green-600 font-bold">PKR {selectedBilty.receivedFare || 0}</span></div>
                  <div><strong>{language === 'ur' ? 'باقی:' : 'Remaining:'}</strong> <span className="text-red-600 font-bold">PKR {selectedBilty.remainingFare}</span></div>
                </div>
                <div>
                  <strong>{language === 'ur' ? 'ادائیگی:' : 'Payment:'}</strong>
                  <Badge className={`ml-2 ${getPaymentColor(selectedBilty.paymentStatus)}`}>
                    {selectedBilty.paymentStatus === 'paid' 
                      ? (language === 'ur' ? 'ادا شدہ' : 'Paid')
                      : (language === 'ur' ? 'غیر ادا شدہ' : 'Unpaid')
                    }
                  </Badge>
                </div>
              </div>

              {/* Download Actions */}
              <div className="flex justify-end pt-4 border-t">
                <Button
                  onClick={() => handleDownloadReceipt(selectedBilty)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={downloadingReceipt === selectedBilty?.id}
                >
                  {downloadingReceipt === selectedBilty?.id ? (
                    <>
                      <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {language === 'ur' ? 'ڈاؤن لوڈ ہو رہا ہے...' : 'Downloading...'}
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      {language === 'ur' ? 'رسید ڈاؤن لوڈ کریں' : 'Download Receipt'}
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}