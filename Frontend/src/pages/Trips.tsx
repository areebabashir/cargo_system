import { useState, useEffect } from "react";
import { Plus, Search, Filter, Edit, Trash2, Truck, User, Phone, Calendar, MapPin, DollarSign, Clock } from "lucide-react";
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

interface VehicleData {
  id: string;
  vehicleNumber: string;
  driverName: string;
  driverPhone: string;
  driverAddress: string;
  vehicleType: string;
  capacity: number;
  registrationDate: string;
  insuranceExpiry: string;
  fitnessExpiry: string;
  permitExpiry: string;
  status: 'active' | 'inactive' | 'maintenance';
  totalTrips: number;
  totalEarnings: number;
  outstandingBalance: number;
}

interface TripData {
  id: string;
  vehicleId: string;
  vehicleNumber: string;
  driverName: string;
  tripDate: string;
  origin: string;
  destination: string;
  distance: number;
  fare: number;
  fuelCost: number;
  driverPayment: number;
  netEarnings: number;
  status: 'completed' | 'ongoing' | 'cancelled';
  notes: string;
}

export default function Trips() {
  const { t, language } = useLanguage();
  const [vehicles, setVehicles] = useState<VehicleData[]>([]);
  const [trips, setTrips] = useState<TripData[]>([]);
  const [isVehicleFormOpen, setIsVehicleFormOpen] = useState(false);
  const [isTripFormOpen, setIsTripFormOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleData | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [activeTab, setActiveTab] = useState<'vehicles' | 'trips'>('vehicles');

  // Vehicle form state
  const [vehicleForm, setVehicleForm] = useState<Partial<VehicleData>>({
    vehicleNumber: "",
    driverName: "",
    driverPhone: "",
    driverAddress: "",
    vehicleType: "",
    capacity: 0,
    registrationDate: "",
    insuranceExpiry: "",
    fitnessExpiry: "",
    permitExpiry: "",
    status: "active"
  });

  // Trip form state
  const [tripForm, setTripForm] = useState<Partial<TripData>>({
    vehicleId: "",
    tripDate: "",
    origin: "",
    destination: "",
    distance: 0,
    fare: 0,
    fuelCost: 0,
    driverPayment: 0,
    status: "ongoing",
    notes: ""
  });

  // Sample data
  useEffect(() => {
    const sampleVehicles: VehicleData[] = [
      {
        id: "1",
        vehicleNumber: "ABC-123",
        driverName: "Muhammad Hassan",
        driverPhone: "0300-1234567",
        driverAddress: "House #45, Street 8, Karachi",
        vehicleType: "Truck",
        capacity: 5000,
        registrationDate: "2023-01-15",
        insuranceExpiry: "2024-12-31",
        fitnessExpiry: "2024-06-30",
        permitExpiry: "2024-12-31",
        status: "active",
        totalTrips: 45,
        totalEarnings: 125000,
        outstandingBalance: 5000
      },
      {
        id: "2",
        vehicleNumber: "XYZ-789",
        driverName: "Ahmed Ali",
        driverPhone: "0312-9876543",
        driverAddress: "Flat #12, Building 3, Lahore",
        vehicleType: "Van",
        capacity: 2000,
        registrationDate: "2023-03-20",
        insuranceExpiry: "2024-11-30",
        fitnessExpiry: "2024-05-15",
        permitExpiry: "2024-10-31",
        status: "active",
        totalTrips: 32,
        totalEarnings: 89000,
        outstandingBalance: 0
      }
    ];

    const sampleTrips: TripData[] = [
      {
        id: "1",
        vehicleId: "1",
        vehicleNumber: "ABC-123",
        driverName: "Muhammad Hassan",
        tripDate: "2024-01-15",
        origin: "Karachi",
        destination: "Lahore",
        distance: 1200,
        fare: 15000,
        fuelCost: 8000,
        driverPayment: 3000,
        netEarnings: 4000,
        status: "completed",
        notes: "On-time delivery"
      },
      {
        id: "2",
        vehicleId: "2",
        vehicleNumber: "XYZ-789",
        driverName: "Ahmed Ali",
        tripDate: "2024-01-16",
        origin: "Islamabad",
        destination: "Peshawar",
        distance: 180,
        fare: 5000,
        fuelCost: 2500,
        driverPayment: 1000,
        netEarnings: 1500,
        status: "ongoing",
        notes: "In transit"
      }
    ];

    setVehicles(sampleVehicles);
    setTrips(sampleTrips);
  }, []);

  const handleVehicleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newVehicle: VehicleData = {
      id: Date.now().toString(),
      ...vehicleForm,
      totalTrips: 0,
      totalEarnings: 0,
      outstandingBalance: 0
    } as VehicleData;

    setVehicles([...vehicles, newVehicle]);
    setVehicleForm({
      vehicleNumber: "",
      driverName: "",
      driverPhone: "",
      driverAddress: "",
      vehicleType: "",
      capacity: 0,
      registrationDate: "",
      insuranceExpiry: "",
      fitnessExpiry: "",
      permitExpiry: "",
      status: "active"
    });
    setIsVehicleFormOpen(false);
  };

  const handleTripSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedVehicleData = vehicles.find(v => v.id === tripForm.vehicleId);
    const newTrip: TripData = {
      id: Date.now().toString(),
      vehicleNumber: selectedVehicleData?.vehicleNumber || "",
      driverName: selectedVehicleData?.driverName || "",
      netEarnings: (tripForm.fare || 0) - (tripForm.fuelCost || 0) - (tripForm.driverPayment || 0),
      ...tripForm
    } as TripData;

    setTrips([...trips, newTrip]);
    setTripForm({
      vehicleId: "",
      tripDate: "",
      origin: "",
      destination: "",
      distance: 0,
      fare: 0,
      fuelCost: 0,
      driverPayment: 0,
      status: "ongoing",
      notes: ""
    });
    setIsTripFormOpen(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'ongoing': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredVehicles = vehicles.filter(vehicle =>
    vehicle.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.driverName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTrips = trips.filter(trip =>
    trip.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trip.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trip.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trip.destination.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {language === 'ur' ? 'گاڑی اور ڈرائیور مینجمنٹ' : 'Vehicle & Driver Management'}
          </h1>
          <p className="text-gray-600 mt-1">
            {language === 'ur' ? 'گاڑیوں اور ڈرائیورز کا انتظام' : 'Manage vehicles and drivers'}
          </p>
        </div>
        <div className="flex space-x-2">
          <Dialog open={isVehicleFormOpen} onOpenChange={setIsVehicleFormOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Truck className="w-4 h-4 mr-2" />
                {language === 'ur' ? 'نیا گاڑی' : 'New Vehicle'}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {language === 'ur' ? 'نیا گاڑی شامل کریں' : 'Add New Vehicle'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleVehicleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="vehicleNumber">
                      {language === 'ur' ? 'گاڑی نمبر' : 'Vehicle Number'}
                    </Label>
                    <Input
                      id="vehicleNumber"
                      value={vehicleForm.vehicleNumber}
                      onChange={(e) => setVehicleForm({...vehicleForm, vehicleNumber: e.target.value})}
                      placeholder={language === 'ur' ? 'گاڑی نمبر درج کریں' : 'Enter vehicle number'}
                    />
                  </div>
                  <div>
                    <Label htmlFor="vehicleType">
                      {language === 'ur' ? 'گاڑی کی قسم' : 'Vehicle Type'}
                    </Label>
                    <Select
                      value={vehicleForm.vehicleType}
                      onValueChange={(value) => setVehicleForm({...vehicleForm, vehicleType: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={language === 'ur' ? 'گاڑی کی قسم منتخب کریں' : 'Select vehicle type'} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Truck">{language === 'ur' ? 'ٹرک' : 'Truck'}</SelectItem>
                        <SelectItem value="Van">{language === 'ur' ? 'ویں' : 'Van'}</SelectItem>
                        <SelectItem value="Pickup">{language === 'ur' ? 'پک اپ' : 'Pickup'}</SelectItem>
                        <SelectItem value="Trailer">{language === 'ur' ? 'ٹریلر' : 'Trailer'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="driverName">
                      {language === 'ur' ? 'ڈرائیور کا نام' : 'Driver Name'}
                    </Label>
                    <Input
                      id="driverName"
                      value={vehicleForm.driverName}
                      onChange={(e) => setVehicleForm({...vehicleForm, driverName: e.target.value})}
                      placeholder={language === 'ur' ? 'ڈرائیور کا نام درج کریں' : 'Enter driver name'}
                    />
                  </div>
                  <div>
                    <Label htmlFor="driverPhone">
                      {language === 'ur' ? 'ڈرائیور کا فون' : 'Driver Phone'}
                    </Label>
                    <Input
                      id="driverPhone"
                      value={vehicleForm.driverPhone}
                      onChange={(e) => setVehicleForm({...vehicleForm, driverPhone: e.target.value})}
                      placeholder={language === 'ur' ? 'ڈرائیور کا فون درج کریں' : 'Enter driver phone'}
                    />
                  </div>
                  <div>
                    <Label htmlFor="capacity">
                      {language === 'ur' ? 'صلاحیت (کلوگرام)' : 'Capacity (kg)'}
                    </Label>
                    <Input
                      id="capacity"
                      type="number"
                      value={vehicleForm.capacity}
                      onChange={(e) => setVehicleForm({...vehicleForm, capacity: parseInt(e.target.value)})}
                      placeholder={language === 'ur' ? 'صلاحیت درج کریں' : 'Enter capacity'}
                    />
                  </div>
                  <div>
                    <Label htmlFor="status">
                      {language === 'ur' ? 'حیثیت' : 'Status'}
                    </Label>
                    <Select
                      value={vehicleForm.status}
                      onValueChange={(value) => setVehicleForm({...vehicleForm, status: value as 'active' | 'inactive' | 'maintenance'})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">{language === 'ur' ? 'فعال' : 'Active'}</SelectItem>
                        <SelectItem value="inactive">{language === 'ur' ? 'غیر فعال' : 'Inactive'}</SelectItem>
                        <SelectItem value="maintenance">{language === 'ur' ? 'مرمت' : 'Maintenance'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="driverAddress">
                    {language === 'ur' ? 'ڈرائیور کا پتہ' : 'Driver Address'}
                  </Label>
                  <Textarea
                    id="driverAddress"
                    value={vehicleForm.driverAddress}
                    onChange={(e) => setVehicleForm({...vehicleForm, driverAddress: e.target.value})}
                    placeholder={language === 'ur' ? 'ڈرائیور کا پتہ درج کریں' : 'Enter driver address'}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="registrationDate">
                      {language === 'ur' ? 'رجسٹریشن کی تاریخ' : 'Registration Date'}
                    </Label>
                    <Input
                      id="registrationDate"
                      type="date"
                      value={vehicleForm.registrationDate}
                      onChange={(e) => setVehicleForm({...vehicleForm, registrationDate: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="insuranceExpiry">
                      {language === 'ur' ? 'انشورنس کی میعاد ختم' : 'Insurance Expiry'}
                    </Label>
                    <Input
                      id="insuranceExpiry"
                      type="date"
                      value={vehicleForm.insuranceExpiry}
                      onChange={(e) => setVehicleForm({...vehicleForm, insuranceExpiry: e.target.value})}
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsVehicleFormOpen(false)}>
                    {language === 'ur' ? 'منسوخ کریں' : 'Cancel'}
                  </Button>
                  <Button type="submit" className="bg-gradient-primary hover:bg-primary-hover text-white">
                    {language === 'ur' ? 'گاڑی شامل کریں' : 'Add Vehicle'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={isTripFormOpen} onOpenChange={setIsTripFormOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary hover:bg-primary-hover text-white">
                <Plus className="w-4 h-4 mr-2" />
                {language === 'ur' ? 'نیا ٹرپ' : 'New Trip'}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {language === 'ur' ? 'نیا ٹرپ شامل کریں' : 'Add New Trip'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleTripSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="vehicleId">
                      {language === 'ur' ? 'گاڑی منتخب کریں' : 'Select Vehicle'}
                    </Label>
                    <Select
                      value={tripForm.vehicleId}
                      onValueChange={(value) => setTripForm({...tripForm, vehicleId: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={language === 'ur' ? 'گاڑی منتخب کریں' : 'Select vehicle'} />
                      </SelectTrigger>
                      <SelectContent>
                        {vehicles.map(vehicle => (
                          <SelectItem key={vehicle.id} value={vehicle.id}>
                            {vehicle.vehicleNumber} - {vehicle.driverName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="tripDate">
                      {language === 'ur' ? 'ٹرپ کی تاریخ' : 'Trip Date'}
                    </Label>
                    <Input
                      id="tripDate"
                      type="date"
                      value={tripForm.tripDate}
                      onChange={(e) => setTripForm({...tripForm, tripDate: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="origin">
                      {language === 'ur' ? 'شروع' : 'Origin'}
                    </Label>
                    <Input
                      id="origin"
                      value={tripForm.origin}
                      onChange={(e) => setTripForm({...tripForm, origin: e.target.value})}
                      placeholder={language === 'ur' ? 'شروع کا مقام' : 'Origin location'}
                    />
                  </div>
                  <div>
                    <Label htmlFor="destination">
                      {language === 'ur' ? 'منزل' : 'Destination'}
                    </Label>
                    <Input
                      id="destination"
                      value={tripForm.destination}
                      onChange={(e) => setTripForm({...tripForm, destination: e.target.value})}
                      placeholder={language === 'ur' ? 'منزل کا مقام' : 'Destination location'}
                    />
                  </div>
                  <div>
                    <Label htmlFor="distance">
                      {language === 'ur' ? 'فاصلہ (کلومیٹر)' : 'Distance (km)'}
                    </Label>
                    <Input
                      id="distance"
                      type="number"
                      value={tripForm.distance}
                      onChange={(e) => setTripForm({...tripForm, distance: parseInt(e.target.value)})}
                      placeholder={language === 'ur' ? 'فاصلہ درج کریں' : 'Enter distance'}
                    />
                  </div>
                  <div>
                    <Label htmlFor="fare">
                      {language === 'ur' ? 'کرایہ' : 'Fare'}
                    </Label>
                    <Input
                      id="fare"
                      type="number"
                      value={tripForm.fare}
                      onChange={(e) => setTripForm({...tripForm, fare: parseInt(e.target.value)})}
                      placeholder={language === 'ur' ? 'کرایہ درج کریں' : 'Enter fare'}
                    />
                  </div>
                  <div>
                    <Label htmlFor="fuelCost">
                      {language === 'ur' ? 'ایندھن کی لاگت' : 'Fuel Cost'}
                    </Label>
                    <Input
                      id="fuelCost"
                      type="number"
                      value={tripForm.fuelCost}
                      onChange={(e) => setTripForm({...tripForm, fuelCost: parseInt(e.target.value)})}
                      placeholder={language === 'ur' ? 'ایندھن کی لاگت درج کریں' : 'Enter fuel cost'}
                    />
                  </div>
                  <div>
                    <Label htmlFor="driverPayment">
                      {language === 'ur' ? 'ڈرائیور کی ادائیگی' : 'Driver Payment'}
                    </Label>
                    <Input
                      id="driverPayment"
                      type="number"
                      value={tripForm.driverPayment}
                      onChange={(e) => setTripForm({...tripForm, driverPayment: parseInt(e.target.value)})}
                      placeholder={language === 'ur' ? 'ڈرائیور کی ادائیگی درج کریں' : 'Enter driver payment'}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="notes">
                    {language === 'ur' ? 'نوٹس' : 'Notes'}
                  </Label>
                  <Textarea
                    id="notes"
                    value={tripForm.notes}
                    onChange={(e) => setTripForm({...tripForm, notes: e.target.value})}
                    placeholder={language === 'ur' ? 'نوٹس درج کریں' : 'Enter notes'}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsTripFormOpen(false)}>
                    {language === 'ur' ? 'منسوخ کریں' : 'Cancel'}
                  </Button>
                  <Button type="submit" className="bg-gradient-primary hover:bg-primary-hover text-white">
                    {language === 'ur' ? 'ٹرپ شامل کریں' : 'Add Trip'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <Button
          variant={activeTab === 'vehicles' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('vehicles')}
          className="flex-1"
        >
          <Truck className="w-4 h-4 mr-2" />
          {language === 'ur' ? 'گاڑیاں' : 'Vehicles'}
        </Button>
        <Button
          variant={activeTab === 'trips' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('trips')}
          className="flex-1"
        >
          <MapPin className="w-4 h-4 mr-2" />
          {language === 'ur' ? 'ٹرپس' : 'Trips'}
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder={language === 'ur' ? 'تلاش کریں...' : 'Search...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              {language === 'ur' ? 'فلٹر' : 'Filter'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Vehicles Tab */}
      {activeTab === 'vehicles' && (
        <Card>
          <CardHeader>
            <CardTitle>
              {language === 'ur' ? 'گاڑیوں کی فہرست' : 'Vehicle List'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{language === 'ur' ? 'گاڑی نمبر' : 'Vehicle No.'}</TableHead>
                  <TableHead>{language === 'ur' ? 'ڈرائیور' : 'Driver'}</TableHead>
                  <TableHead>{language === 'ur' ? 'قسم' : 'Type'}</TableHead>
                  <TableHead>{language === 'ur' ? 'صلاحیت' : 'Capacity'}</TableHead>
                  <TableHead>{language === 'ur' ? 'کل ٹرپس' : 'Total Trips'}</TableHead>
                  <TableHead>{language === 'ur' ? 'کل آمدنی' : 'Total Earnings'}</TableHead>
                  <TableHead>{language === 'ur' ? 'حیثیت' : 'Status'}</TableHead>
                  <TableHead>{language === 'ur' ? 'عمل' : 'Actions'}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVehicles.map((vehicle) => (
                  <TableRow key={vehicle.id}>
                    <TableCell className="font-medium">{vehicle.vehicleNumber}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{vehicle.driverName}</div>
                        <div className="text-sm text-gray-500">{vehicle.driverPhone}</div>
                      </div>
                    </TableCell>
                    <TableCell>{vehicle.vehicleType}</TableCell>
                    <TableCell>{vehicle.capacity} kg</TableCell>
                    <TableCell>{vehicle.totalTrips}</TableCell>
                    <TableCell>₨{vehicle.totalEarnings.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(vehicle.status)}>
                        {language === 'ur' 
                          ? (vehicle.status === 'active' ? 'فعال' : 
                             vehicle.status === 'inactive' ? 'غیر فعال' : 'مرمت')
                          : vehicle.status
                        }
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="ghost">
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

      {/* Trips Tab */}
      {activeTab === 'trips' && (
        <Card>
          <CardHeader>
            <CardTitle>
              {language === 'ur' ? 'ٹرپس کی فہرست' : 'Trip List'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{language === 'ur' ? 'گاڑی نمبر' : 'Vehicle No.'}</TableHead>
                  <TableHead>{language === 'ur' ? 'ڈرائیور' : 'Driver'}</TableHead>
                  <TableHead>{language === 'ur' ? 'تاریخ' : 'Date'}</TableHead>
                  <TableHead>{language === 'ur' ? 'شروع' : 'Origin'}</TableHead>
                  <TableHead>{language === 'ur' ? 'منزل' : 'Destination'}</TableHead>
                  <TableHead>{language === 'ur' ? 'فاصلہ' : 'Distance'}</TableHead>
                  <TableHead>{language === 'ur' ? 'خالص آمدنی' : 'Net Earnings'}</TableHead>
                  <TableHead>{language === 'ur' ? 'حیثیت' : 'Status'}</TableHead>
                  <TableHead>{language === 'ur' ? 'عمل' : 'Actions'}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTrips.map((trip) => (
                  <TableRow key={trip.id}>
                    <TableCell className="font-medium">{trip.vehicleNumber}</TableCell>
                    <TableCell>{trip.driverName}</TableCell>
                    <TableCell>{trip.tripDate}</TableCell>
                    <TableCell>{trip.origin}</TableCell>
                    <TableCell>{trip.destination}</TableCell>
                    <TableCell>{trip.distance} km</TableCell>
                    <TableCell>₨{trip.netEarnings.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(trip.status)}>
                        {language === 'ur' 
                          ? (trip.status === 'completed' ? 'مکمل' : 
                             trip.status === 'ongoing' ? 'جاری' : 'منسوخ')
                          : trip.status
                        }
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="ghost">
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
    </div>
  );
}