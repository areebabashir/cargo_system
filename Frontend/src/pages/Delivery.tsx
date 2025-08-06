import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Truck, Plus, Search, Download, Eye, Filter } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { DownloadReceiptPopup } from "@/components/ui/pdf-receipt";

interface DeliveryData {
  id: string;
  biltyNumber: string;
  biltyDate: string;
  departure: string;
  forwardingAgency: string;
  truckNumber: string;
  numberOfItems: number;
  sender: string;
  receiver: string;
  destination: string;
  unloadingDate: string;
  fare: number;
  unloadingCharges: number;
  stationCharges: number;
  rehriCharges: number;
  numberOfDamages: number;
  status: "pending" | "in-transit" | "delivered" | "damaged";
  createdAt: string;
}

const deliveryTranslations = {
  en: {
    title: "Delivery Management",
    description: "Manage and track all deliveries",
    addDelivery: "Add New Delivery",
    searchPlaceholder: "Search deliveries...",
    biltyNumber: "Bilty Number",
    biltyDate: "Bilty Date",
    departure: "Departure (Location)",
    forwardingAgency: "Forwarding Agency",
    truckNumber: "Truck Number",
    numberOfItems: "Number of Items",
    sender: "Sender",
    receiver: "Receiver",
    destination: "For (Location)",
    unloadingDate: "Unloading Date",
    fare: "Fare",
    unloadingCharges: "Unloading Charges",
    stationCharges: "Station (Adda) Charges",
    rehriCharges: "Rehri Charges",
    numberOfDamages: "No of Damages",
    status: "Status",
    actions: "Actions",
    submit: "Submit",
    cancel: "Cancel",
    view: "View",
    download: "Download Receipt",
    pending: "Pending",
    inTransit: "In Transit",
    delivered: "Delivered",
    damaged: "Damaged",
    totalDeliveries: "Total Deliveries",
    pendingDeliveries: "Pending Deliveries",
    deliveredCount: "Delivered",
    totalFare: "Total Fare",
    noDeliveries: "No deliveries found",
    addDeliveryDialog: "Add New Delivery",
    addDeliveryDescription: "Enter the details for the new delivery",
    filterByStatus: "Filter by Status",
    allStatuses: "All Statuses",
    totalAmount: "Total Amount",
    deliveryReceipt: "Delivery Receipt",
  },
  ur: {
    title: "ترسیل کا انتظام",
    description: "تمام ترسیلوں کا انتظام اور ٹریکنگ",
    addDelivery: "نیا ترسیل شامل کریں",
    searchPlaceholder: "ترسیلیں تلاش کریں...",
    biltyNumber: "بلٹی نمبر",
    biltyDate: "بلٹی کی تاریخ",
    departure: "روانگی (مقام)",
    forwardingAgency: "فارورڈنگ ایجنسی",
    truckNumber: "ٹرک نمبر",
    numberOfItems: "اشیاء کی تعداد",
    sender: "مرسل",
    receiver: "وصول کنندہ",
    destination: "برائے (مقام)",
    unloadingDate: "اتارنے کی تاریخ",
    fare: "کرایہ",
    unloadingCharges: "اتارنے کے اخراجات",
    stationCharges: "اسٹیشن (ادا) اخراجات",
    rehriCharges: "ریہری اخراجات",
    numberOfDamages: "نقصانات کی تعداد",
    status: "حیثیت",
    actions: "اعمال",
    submit: "جمع کریں",
    cancel: "منسوخ کریں",
    view: "دیکھیں",
    download: "رسید ڈاؤن لوڈ کریں",
    pending: "زیر التوا",
    inTransit: "راستے میں",
    delivered: "پہنچا دیا گیا",
    damaged: "خراب",
    totalDeliveries: "کل ترسیلیں",
    pendingDeliveries: "زیر التوا ترسیلیں",
    deliveredCount: "پہنچائی گئی",
    totalFare: "کل کرایہ",
    noDeliveries: "کوئی ترسیل نہیں ملی",
    addDeliveryDialog: "نیا ترسیل شامل کریں",
    addDeliveryDescription: "نئے ترسیل کی تفصیلات درج کریں",
    filterByStatus: "حیثیت کے مطابق فلٹر کریں",
    allStatuses: "تمام حیثیتیں",
    totalAmount: "کل رقم",
    deliveryReceipt: "ترسیل کی رسید",
  },
};

export default function Delivery() {
  const { language, t } = useLanguage();
  const [deliveries, setDeliveries] = useState<DeliveryData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryData | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    biltyNumber: "",
    biltyDate: "",
    departure: "",
    forwardingAgency: "",
    truckNumber: "",
    numberOfItems: "",
    sender: "",
    receiver: "",
    destination: "",
    unloadingDate: "",
    fare: "",
    unloadingCharges: "",
    stationCharges: "",
    rehriCharges: "",
    numberOfDamages: "",
  });

  // Sample data
  useEffect(() => {
    const sampleDeliveries: DeliveryData[] = [
      {
        id: "1",
        biltyNumber: "BLT-2024-001",
        biltyDate: "2024-01-15",
        departure: "Karachi",
        forwardingAgency: "ABC Logistics",
        truckNumber: "KHI-1234",
        numberOfItems: 50,
        sender: "Ahmed Khan",
        receiver: "Muhammad Ali",
        destination: "Lahore",
        unloadingDate: "2024-01-18",
        fare: 15000,
        unloadingCharges: 500,
        stationCharges: 300,
        rehriCharges: 200,
        numberOfDamages: 0,
        status: "delivered",
        createdAt: "2024-01-15T10:30:00Z",
      },
      {
        id: "2",
        biltyNumber: "BLT-2024-002",
        biltyDate: "2024-01-20",
        departure: "Lahore",
        forwardingAgency: "XYZ Transport",
        truckNumber: "LHR-5678",
        numberOfItems: 30,
        sender: "Fatima Zahra",
        receiver: "Hassan Raza",
        destination: "Islamabad",
        unloadingDate: "",
        fare: 12000,
        unloadingCharges: 400,
        stationCharges: 250,
        rehriCharges: 150,
        numberOfDamages: 2,
        status: "in-transit",
        createdAt: "2024-01-20T14:15:00Z",
      },
      {
        id: "3",
        biltyNumber: "BLT-2024-003",
        biltyDate: "2024-01-18",
        departure: "Islamabad",
        forwardingAgency: "Fast Cargo",
        truckNumber: "ISB-9012",
        numberOfItems: 25,
        sender: "Sara Ahmed",
        receiver: "Usman Khan",
        destination: "Peshawar",
        unloadingDate: "2024-01-22",
        fare: 8000,
        unloadingCharges: 300,
        stationCharges: 200,
        rehriCharges: 100,
        numberOfDamages: 1,
        status: "delivered",
        createdAt: "2024-01-18T09:45:00Z",
      },
    ];
    setDeliveries(sampleDeliveries);
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newDelivery: DeliveryData = {
      id: Date.now().toString(),
      biltyNumber: formData.biltyNumber,
      biltyDate: formData.biltyDate,
      departure: formData.departure,
      forwardingAgency: formData.forwardingAgency,
      truckNumber: formData.truckNumber,
      numberOfItems: parseInt(formData.numberOfItems) || 0,
      sender: formData.sender,
      receiver: formData.receiver,
      destination: formData.destination,
      unloadingDate: formData.unloadingDate,
      fare: parseFloat(formData.fare) || 0,
      unloadingCharges: parseFloat(formData.unloadingCharges) || 0,
      stationCharges: parseFloat(formData.stationCharges) || 0,
      rehriCharges: parseFloat(formData.rehriCharges) || 0,
      numberOfDamages: parseInt(formData.numberOfDamages) || 0,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    setDeliveries(prev => [newDelivery, ...prev]);
    setFormData({
      biltyNumber: "",
      biltyDate: "",
      departure: "",
      forwardingAgency: "",
      truckNumber: "",
      numberOfItems: "",
      sender: "",
      receiver: "",
      destination: "",
      unloadingDate: "",
      fare: "",
      unloadingCharges: "",
      stationCharges: "",
      rehriCharges: "",
      numberOfDamages: "",
    });
    setIsAddDialogOpen(false);
  };

  const filteredDeliveries = deliveries.filter(delivery => {
    const matchesSearch = 
      delivery.biltyNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.receiver.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.destination.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || delivery.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in-transit":
        return "bg-blue-100 text-blue-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "damaged":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    const translations = deliveryTranslations[language];
    switch (status) {
      case "pending":
        return translations.pending;
      case "in-transit":
        return translations.inTransit;
      case "delivered":
        return translations.delivered;
      case "damaged":
        return translations.damaged;
      default:
        return status;
    }
  };

  const translations = deliveryTranslations[language];
  const isRTL = language === 'ur';

  const stats = {
    totalDeliveries: deliveries.length,
    pendingDeliveries: deliveries.filter(d => d.status === "pending").length,
    deliveredCount: deliveries.filter(d => d.status === "delivered").length,
    totalFare: deliveries.reduce((sum, d) => sum + d.fare, 0),
  };

  const mapDeliveryToReceiptData = (delivery: DeliveryData) => ({
    type: 'delivery' as const,
    documentNumber: delivery.biltyNumber,
    date: delivery.biltyDate,
    senderName: delivery.sender,
    senderPhone: "",
    senderAddress: delivery.departure,
    receiverName: delivery.receiver,
    receiverPhone: "",
    receiverAddress: delivery.destination,
    quantity: delivery.numberOfItems,
    weight: 0,
    details: `From ${delivery.departure} to ${delivery.destination}`,
    fare: delivery.fare,
    localCharges: delivery.unloadingCharges,
    mazdoori: 0,
    biltyCharges: delivery.stationCharges,
    reriCharges: delivery.rehriCharges,
    extraCharges: 0,
    totalAmount: delivery.fare + delivery.unloadingCharges + delivery.stationCharges + delivery.rehriCharges,
    paymentStatus: delivery.status === "delivered" ? "paid" : "pending",
    deliveryStatus: delivery.status,
    vehicleNumber: delivery.truckNumber,
    driverName: delivery.forwardingAgency,
    pickupType: "agency",
    addaName: delivery.forwardingAgency,
    cityName: delivery.destination,
    biltyNumber: delivery.biltyNumber,
    voucherNumber: "",
    customerName: delivery.receiver,
    customerPhone: "",
    customerEmail: "",
    purpose: "delivery",
    paymentMethod: "cash",
    reference: "",
    dueDate: delivery.unloadingDate,
    items: [],
    receivedFare: 0,
    remainingFare: 0,
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {translations.title}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {translations.description}
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              {translations.addDelivery}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{translations.addDeliveryDialog}</DialogTitle>
              <DialogDescription>{translations.addDeliveryDescription}</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="biltyNumber">{translations.biltyNumber}</Label>
                  <Input
                    id="biltyNumber"
                    value={formData.biltyNumber}
                    onChange={(e) => handleInputChange("biltyNumber", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="biltyDate">{translations.biltyDate}</Label>
                  <Input
                    id="biltyDate"
                    type="date"
                    value={formData.biltyDate}
                    onChange={(e) => handleInputChange("biltyDate", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="departure">{translations.departure}</Label>
                  <Input
                    id="departure"
                    value={formData.departure}
                    onChange={(e) => handleInputChange("departure", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="forwardingAgency">{translations.forwardingAgency}</Label>
                  <Input
                    id="forwardingAgency"
                    value={formData.forwardingAgency}
                    onChange={(e) => handleInputChange("forwardingAgency", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="truckNumber">{translations.truckNumber}</Label>
                  <Input
                    id="truckNumber"
                    value={formData.truckNumber}
                    onChange={(e) => handleInputChange("truckNumber", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="numberOfItems">{translations.numberOfItems}</Label>
                  <Input
                    id="numberOfItems"
                    type="number"
                    value={formData.numberOfItems}
                    onChange={(e) => handleInputChange("numberOfItems", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="sender">{translations.sender}</Label>
                  <Input
                    id="sender"
                    value={formData.sender}
                    onChange={(e) => handleInputChange("sender", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="receiver">{translations.receiver}</Label>
                  <Input
                    id="receiver"
                    value={formData.receiver}
                    onChange={(e) => handleInputChange("receiver", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="destination">{translations.destination}</Label>
                  <Input
                    id="destination"
                    value={formData.destination}
                    onChange={(e) => handleInputChange("destination", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="unloadingDate">{translations.unloadingDate}</Label>
                  <Input
                    id="unloadingDate"
                    type="date"
                    value={formData.unloadingDate}
                    onChange={(e) => handleInputChange("unloadingDate", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="fare">{translations.fare}</Label>
                  <Input
                    id="fare"
                    type="number"
                    step="0.01"
                    value={formData.fare}
                    onChange={(e) => handleInputChange("fare", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="unloadingCharges">{translations.unloadingCharges}</Label>
                  <Input
                    id="unloadingCharges"
                    type="number"
                    step="0.01"
                    value={formData.unloadingCharges}
                    onChange={(e) => handleInputChange("unloadingCharges", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="stationCharges">{translations.stationCharges}</Label>
                  <Input
                    id="stationCharges"
                    type="number"
                    step="0.01"
                    value={formData.stationCharges}
                    onChange={(e) => handleInputChange("stationCharges", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="rehriCharges">{translations.rehriCharges}</Label>
                  <Input
                    id="rehriCharges"
                    type="number"
                    step="0.01"
                    value={formData.rehriCharges}
                    onChange={(e) => handleInputChange("rehriCharges", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="numberOfDamages">{translations.numberOfDamages}</Label>
                  <Input
                    id="numberOfDamages"
                    type="number"
                    value={formData.numberOfDamages}
                    onChange={(e) => handleInputChange("numberOfDamages", e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  {translations.cancel}
                </Button>
                <Button type="submit">{translations.submit}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{translations.totalDeliveries}</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDeliveries}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{translations.pendingDeliveries}</CardTitle>
            <Truck className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pendingDeliveries}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{translations.deliveredCount}</CardTitle>
            <Truck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.deliveredCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{translations.totalFare}</CardTitle>
            <Truck className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              ${stats.totalFare.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>{translations.title}</CardTitle>
          <CardDescription>{translations.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder={translations.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">{translations.allStatuses}</option>
                <option value="pending">{translations.pending}</option>
                <option value="in-transit">{translations.inTransit}</option>
                <option value="delivered">{translations.delivered}</option>
                <option value="damaged">{translations.damaged}</option>
              </select>
            </div>
          </div>

          {filteredDeliveries.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {translations.noDeliveries}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{translations.biltyNumber}</TableHead>
                  <TableHead>{translations.sender}</TableHead>
                  <TableHead>{translations.receiver}</TableHead>
                  <TableHead>{translations.destination}</TableHead>
                  <TableHead>{translations.fare}</TableHead>
                  <TableHead>{translations.status}</TableHead>
                  <TableHead>{translations.actions}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDeliveries.map((delivery) => (
                  <TableRow key={delivery.id}>
                    <TableCell className="font-medium">{delivery.biltyNumber}</TableCell>
                    <TableCell>{delivery.sender}</TableCell>
                    <TableCell>{delivery.receiver}</TableCell>
                    <TableCell>{delivery.destination}</TableCell>
                    <TableCell>${delivery.fare.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(delivery.status)}>
                        {getStatusText(delivery.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedDelivery(delivery);
                            setIsViewDialogOpen(true);
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <DownloadReceiptPopup
                          data={mapDeliveryToReceiptData(delivery)}
                          trigger={
                            <Button variant="outline" size="sm">
                              <Download className="w-4 h-4" />
                            </Button>
                          }
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* View Delivery Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{translations.title}</DialogTitle>
            <DialogDescription>{translations.description}</DialogDescription>
          </DialogHeader>
          {selectedDelivery && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-medium">{translations.biltyNumber}</Label>
                  <p className="text-sm text-gray-600">{selectedDelivery.biltyNumber}</p>
                </div>
                <div>
                  <Label className="font-medium">{translations.biltyDate}</Label>
                  <p className="text-sm text-gray-600">
                    {new Date(selectedDelivery.biltyDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <Label className="font-medium">{translations.departure}</Label>
                  <p className="text-sm text-gray-600">{selectedDelivery.departure}</p>
                </div>
                <div>
                  <Label className="font-medium">{translations.forwardingAgency}</Label>
                  <p className="text-sm text-gray-600">{selectedDelivery.forwardingAgency}</p>
                </div>
                <div>
                  <Label className="font-medium">{translations.truckNumber}</Label>
                  <p className="text-sm text-gray-600">{selectedDelivery.truckNumber}</p>
                </div>
                <div>
                  <Label className="font-medium">{translations.numberOfItems}</Label>
                  <p className="text-sm text-gray-600">{selectedDelivery.numberOfItems}</p>
                </div>
                <div>
                  <Label className="font-medium">{translations.sender}</Label>
                  <p className="text-sm text-gray-600">{selectedDelivery.sender}</p>
                </div>
                <div>
                  <Label className="font-medium">{translations.receiver}</Label>
                  <p className="text-sm text-gray-600">{selectedDelivery.receiver}</p>
                </div>
                <div>
                  <Label className="font-medium">{translations.destination}</Label>
                  <p className="text-sm text-gray-600">{selectedDelivery.destination}</p>
                </div>
                <div>
                  <Label className="font-medium">{translations.unloadingDate}</Label>
                  <p className="text-sm text-gray-600">
                    {selectedDelivery.unloadingDate 
                      ? new Date(selectedDelivery.unloadingDate).toLocaleDateString()
                      : "Not set"
                    }
                  </p>
                </div>
                <div>
                  <Label className="font-medium">{translations.fare}</Label>
                  <p className="text-sm text-gray-600">${selectedDelivery.fare.toLocaleString()}</p>
                </div>
                <div>
                  <Label className="font-medium">{translations.unloadingCharges}</Label>
                  <p className="text-sm text-gray-600">${selectedDelivery.unloadingCharges.toLocaleString()}</p>
                </div>
                <div>
                  <Label className="font-medium">{translations.stationCharges}</Label>
                  <p className="text-sm text-gray-600">${selectedDelivery.stationCharges.toLocaleString()}</p>
                </div>
                <div>
                  <Label className="font-medium">{translations.rehriCharges}</Label>
                  <p className="text-sm text-gray-600">${selectedDelivery.rehriCharges.toLocaleString()}</p>
                </div>
                <div>
                  <Label className="font-medium">{translations.numberOfDamages}</Label>
                  <p className="text-sm text-gray-600">{selectedDelivery.numberOfDamages}</p>
                </div>
                <div>
                  <Label className="font-medium">{translations.status}</Label>
                  <Badge className={getStatusColor(selectedDelivery.status)}>
                    {getStatusText(selectedDelivery.status)}
                  </Badge>
                </div>
              </div>
              <div className="flex justify-end">
                <DownloadReceiptPopup
                  data={mapDeliveryToReceiptData(selectedDelivery)}
                  trigger={
                    <Button>
                      <Download className="w-4 h-4 mr-2" />
                      {translations.download}
                    </Button>
                  }
                />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 