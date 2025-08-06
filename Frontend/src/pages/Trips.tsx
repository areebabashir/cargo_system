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
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { useLanguage } from "@/contexts/LanguageContext";
import { getAllVehicles, createVehicle, deleteVehicle } from '../services/vehicleService';
import { getAllDrivers, createDriver, deleteDriver } from '../services/driverService';
import { getAllTrips, createTrip, deleteTrip } from '../services/tripService';

interface VehicleData {
  _id: string;
  number: string;
  type: string;
  model: string;
  trips?: TripData[];
}

interface TripData {
  _id: string;
  driver: DriverData;
  vehicle: VehicleData;
  departureLocation: string;
  destinationLocation: string;
  createdAt?: string;
  // Add more fields as needed
}

interface DriverData {
  _id: string;
  name: string;
  phone: string;
  address: string;
  status?: 'active' | 'inactive';
  trips?: TripData[];
}

export default function Trips() {
  const { t, language } = useLanguage();
  const [vehicles, setVehicles] = useState<VehicleData[]>([]);
  const [loadingVehicles, setLoadingVehicles] = useState(false);
  const [vehicleError, setVehicleError] = useState<string | null>(null);
  const [trips, setTrips] = useState<TripData[]>([]);
  const [loadingTrips, setLoadingTrips] = useState(false);
  const [tripError, setTripError] = useState<string | null>(null);
  const [isVehicleFormOpen, setIsVehicleFormOpen] = useState(false);
  const [isTripFormOpen, setIsTripFormOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleData | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [activeTab, setActiveTab] = useState<'vehicles' | 'trips' | 'drivers'>('vehicles');
  const [drivers, setDrivers] = useState<DriverData[]>([]);
  const [loadingDrivers, setLoadingDrivers] = useState(false);
  const [driverError, setDriverError] = useState<string | null>(null);
  const [isDriverFormOpen, setIsDriverFormOpen] = useState(false);
  const [driverForm, setDriverForm] = useState<Partial<DriverData>>({
    name: "",
    phone: "",
    address: ""
  });
  const [selectedDriver, setSelectedDriver] = useState<DriverData | null>(null);

  // Vehicle form state
  const [vehicleForm, setVehicleForm] = useState<Partial<VehicleData>>({
    number: "",
    type: "",
    model: ""
  });

  // Trip form state
  const [tripForm, setTripForm] = useState<Partial<TripData>>({
    driver: null,
    vehicle: null,
    departureLocation: "",
    destinationLocation: ""
  });

  // Add loading and error states for each entity
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Add state for selected vehicle for history modal
  const [selectedVehicleForHistory, setSelectedVehicleForHistory] = useState<VehicleData | null>(null);
  const [isVehicleHistoryOpen, setIsVehicleHistoryOpen] = useState(false);

  // Add state for selected driver for history modal
  const [selectedDriverForHistory, setSelectedDriverForHistory] = useState<DriverData | null>(null);
  const [isDriverHistoryOpen, setIsDriverHistoryOpen] = useState(false);

  // Fetch all data on mount and after add/delete
  const fetchAll = async () => {
    setLoadingVehicles(true); setLoadingDrivers(true); setLoadingTrips(true);
    setVehicleError(null); setDriverError(null); setTripError(null);
    try {
      const [v, d, t] = await Promise.all([
        getAllVehicles(),
        getAllDrivers(),
        getAllTrips()
      ]);
      setVehicles(v || []);
      setDrivers(d || []);
      setTrips(t || []);
    } catch (err) {
      setVehicleError('Failed to fetch vehicles');
      setDriverError('Failed to fetch drivers');
      setTripError('Failed to fetch trips');
    } finally {
      setLoadingVehicles(false); setLoadingDrivers(false); setLoadingTrips(false);
    }
  };
  useEffect(() => { fetchAll(); }, []);

  // Add Vehicle
  const handleVehicleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newVehicle = {
      number: vehicleForm.number || "",
      type: vehicleForm.type || "",
      model: vehicleForm.model || "",
    };
    try {
      await createVehicle(newVehicle);
      setSuccessMsg('Vehicle added!');
      setVehicleForm({ number: '', type: '', model: '' });
      setIsVehicleFormOpen(false);
      fetchAll();
    } catch {
      setVehicleError('Failed to save vehicle!');
    }
  };
  // Delete Vehicle
  const handleDeleteVehicle = async (id: string) => {
    try {
      await deleteVehicle(id);
      setSuccessMsg('Vehicle deleted!');
      fetchAll();
    } catch {
      setVehicleError('Failed to delete vehicle!');
    }
  };

  // Add Driver
  const handleDriverSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newDriver = {
      name: driverForm.name || "",
      phone: driverForm.phone || "",
      address: driverForm.address || "",
      status: 'active'
    };
    try {
      await createDriver(newDriver);
      setSuccessMsg('Driver added!');
      setDriverForm({ name: '', phone: '', address: '' });
      setIsDriverFormOpen(false);
      fetchAll();
    } catch {
      setDriverError('Failed to save driver!');
    }
  };
  // Delete Driver
  const handleDeleteDriver = async (id: string) => {
    try {
      await deleteDriver(id);
      setSuccessMsg('Driver deleted!');
      fetchAll();
    } catch {
      setDriverError('Failed to delete driver!');
    }
  };

  // Add Trip
  const handleTripSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tripForm.driver || !tripForm.vehicle) return;
    const newTrip = {
      driver: tripForm.driver._id,
      vehicle: tripForm.vehicle._id,
      departureLocation: tripForm.departureLocation || '',
      destinationLocation: tripForm.destinationLocation || '',
      createdAt: tripForm.createdAt || new Date().toISOString()
    };
    try {
      await createTrip(newTrip);
      setSuccessMsg('Trip added!');
      setTripForm({ driver: null, vehicle: null, departureLocation: '', destinationLocation: '' });
      setIsTripFormOpen(false);
      fetchAll();
    } catch {
      setTripError('Failed to save trip!');
    }
  };
  // Delete Trip
  const handleDeleteTrip = async (id: string) => {
    try {
      await deleteTrip(id);
      setSuccessMsg('Trip deleted!');
      fetchAll();
    } catch {
      setTripError('Failed to delete trip!');
    }
  };

  const filteredVehicles = (vehicles || []).filter(vehicle =>
    vehicle.number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.model?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTrips = (trips || []).filter(trip =>
    trip.driver?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trip.vehicle?.number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trip.departureLocation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trip.destinationLocation?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDrivers = (drivers || []).filter(driver =>
    driver.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.address?.toLowerCase().includes(searchTerm.toLowerCase())
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
                      value={vehicleForm.number}
                      onChange={(e) => setVehicleForm({...vehicleForm, number: e.target.value})}
                      placeholder={language === 'ur' ? 'گاڑی نمبر درج کریں' : 'Enter vehicle number'}
                    />
                  </div>
                  <div>
                    <Label htmlFor="vehicleType">
                      {language === 'ur' ? 'گاڑی کی قسم' : 'Vehicle Type'}
                    </Label>
                    <Select
                      value={vehicleForm.type}
                      onValueChange={(value) => setVehicleForm({...vehicleForm, type: value})}
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
                    <Label htmlFor="vehicleModel">
                      {language === 'ur' ? 'گاڑی کا میڈل' : 'Vehicle Model'}
                    </Label>
                    <Input
                      id="vehicleModel"
                      value={vehicleForm.model}
                      onChange={(e) => setVehicleForm({...vehicleForm, model: e.target.value})}
                      placeholder={language === 'ur' ? 'گاڑی کا میڈل درج کریں' : 'Enter vehicle model'}
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
                      value={tripForm.vehicle?._id || ""}
                      onValueChange={(value) => {
                        const selected = vehicles.find(v => v._id === value);
                        setTripForm(prev => ({ ...prev, vehicle: selected || null }));
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={language === 'ur' ? 'گاڑی منتخب کریں' : 'Select vehicle'} />
                      </SelectTrigger>
                      <SelectContent>
                        {(vehicles || []).map(vehicle => (
                          <SelectItem key={vehicle._id} value={vehicle._id}>
                            {vehicle.number} - {vehicle.type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="driverId">
                      {language === 'ur' ? 'ڈرائیور منتخب کریں' : 'Select Driver'}
                    </Label>
                    <Select
                      value={tripForm.driver?._id || ""}
                      onValueChange={(value) => {
                        const selected = drivers.find(d => d._id === value);
                        setTripForm(prev => ({ ...prev, driver: selected || null }));
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={language === 'ur' ? 'ڈرائیور منتخب کریں' : 'Select driver'} />
                      </SelectTrigger>
                      <SelectContent>
                        {(drivers || []).map(driver => (
                          <SelectItem key={driver._id} value={driver._id}>
                            {driver.name} - {driver.phone}
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
                      value={tripForm.createdAt ? new Date(tripForm.createdAt).toISOString().split('T')[0] : ''}
                      onChange={(e) => setTripForm(prev => ({ ...prev, createdAt: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="origin">
                      {language === 'ur' ? 'شروع' : 'Origin'}
                    </Label>
                    <Input
                      id="origin"
                      value={tripForm.departureLocation}
                      onChange={(e) => setTripForm({...tripForm, departureLocation: e.target.value})}
                      placeholder={language === 'ur' ? 'شروع کا مقام' : 'Origin location'}
                    />
                  </div>
                  <div>
                    <Label htmlFor="destination">
                      {language === 'ur' ? 'منزل' : 'Destination'}
                    </Label>
                    <Input
                      id="destination"
                      value={tripForm.destinationLocation}
                      onChange={(e) => setTripForm({...tripForm, destinationLocation: e.target.value})}
                      placeholder={language === 'ur' ? 'منزل کا مقام' : 'Destination location'}
                    />
                  </div>
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

          <Dialog open={isDriverFormOpen} onOpenChange={setIsDriverFormOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <User className="w-4 h-4 mr-2" />
                {language === 'ur' ? 'نیا ڈرائیور' : 'New Driver'}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{language === 'ur' ? 'نیا ڈرائیور شامل کریں' : 'Add New Driver'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleDriverSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="driverName">{language === 'ur' ? 'نام' : 'Name'}</Label>
                    <Input id="driverName" value={driverForm.name} onChange={e => setDriverForm({ ...driverForm, name: e.target.value })} required />
                  </div>
                  <div>
                    <Label htmlFor="driverPhone">{language === 'ur' ? 'فون' : 'Phone'}</Label>
                    <Input id="driverPhone" value={driverForm.phone} onChange={e => setDriverForm({ ...driverForm, phone: e.target.value })} required />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="driverAddress">{language === 'ur' ? 'پتہ' : 'Address'}</Label>
                    <Input id="driverAddress" value={driverForm.address} onChange={e => setDriverForm({ ...driverForm, address: e.target.value })} required />
                  </div>
                </div>
                <Button type="submit" className="w-full bg-gradient-primary hover:bg-primary-hover text-white">
                  {language === 'ur' ? 'محفوظ کریں' : 'Save'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 mb-4">
        <Button variant={activeTab === 'vehicles' ? 'default' : 'outline'} onClick={() => setActiveTab('vehicles')}>
          {language === 'ur' ? 'گاڑیاں' : 'Vehicles'}
        </Button>
        <Button variant={activeTab === 'trips' ? 'default' : 'outline'} onClick={() => setActiveTab('trips')}>
          {language === 'ur' ? 'ٹرپس' : 'Trips'}
        </Button>
        <Button variant={activeTab === 'drivers' ? 'default' : 'outline'} onClick={() => setActiveTab('drivers')}>
          {language === 'ur' ? 'ڈرائیورز' : 'Drivers'}
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
            {loadingVehicles ? (
              <div>Loading vehicles...</div>
            ) : vehicleError ? (
              <div className="text-red-500">{vehicleError}</div>
            ) : (
              <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{language === 'ur' ? 'گاڑی نمبر' : 'Vehicle No.'}</TableHead>
                  <TableHead>{language === 'ur' ? 'قسم' : 'Type'}</TableHead>
                      <TableHead>{language === 'ur' ? 'میڈل' : 'Model'}</TableHead>
                  <TableHead>{language === 'ur' ? 'عمل' : 'Actions'}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                    {(vehicles || []).map((vehicle) => (
                      <TableRow key={vehicle._id}>
                        <TableCell className="font-medium">{vehicle.number}</TableCell>
                        <TableCell>{vehicle.type}</TableCell>
                        <TableCell>{vehicle.model}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="ghost">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDeleteVehicle(vehicle._id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => { setSelectedVehicleForHistory(vehicle); setIsVehicleHistoryOpen(true); }}>
                          <Clock className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
                {/* Trip history for selected vehicle */}
                {/* You can add a selectedVehicle state and show trip history like drivers if needed */}
              </>
            )}
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
            {loadingTrips ? (
              <div>Loading trips...</div>
            ) : tripError ? (
              <div className="text-red-500">{tripError}</div>
            ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{language === 'ur' ? 'ڈرائیور' : 'Driver'}</TableHead>
                    <TableHead>{language === 'ur' ? 'گاڑی' : 'Vehicle'}</TableHead>
                    <TableHead>{language === 'ur' ? 'روانگی' : 'Departure'}</TableHead>
                    <TableHead>{language === 'ur' ? 'منزل' : 'Destination'}</TableHead>
                  <TableHead>{language === 'ur' ? 'تاریخ' : 'Date'}</TableHead>
                    {/* Add more fields as needed */}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(trips || []).map(trip => (
                    <TableRow key={trip._id}>
                      <TableCell>{trip.driver?.name}</TableCell>
                      <TableCell>{trip.vehicle?.number}</TableCell>
                      <TableCell>{trip.departureLocation}</TableCell>
                      <TableCell>{trip.destinationLocation}</TableCell>
                      <TableCell>{trip.createdAt ? new Date(trip.createdAt).toLocaleDateString() : ''}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}

      {/* Drivers Tab */}
      {activeTab === 'drivers' && (
        <Card>
          <CardHeader>
            <CardTitle>{language === 'ur' ? 'ڈرائیورز' : 'Drivers'}</CardTitle>
            <Dialog open={isDriverFormOpen} onOpenChange={setIsDriverFormOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <User className="w-4 h-4 mr-2" />
                  {language === 'ur' ? 'نیا ڈرائیور' : 'New Driver'}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{language === 'ur' ? 'نیا ڈرائیور شامل کریں' : 'Add New Driver'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleDriverSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="driverName">{language === 'ur' ? 'نام' : 'Name'}</Label>
                      <Input id="driverName" value={driverForm.name} onChange={e => setDriverForm({ ...driverForm, name: e.target.value })} required />
                    </div>
                    <div>
                      <Label htmlFor="driverPhone">{language === 'ur' ? 'فون' : 'Phone'}</Label>
                      <Input id="driverPhone" value={driverForm.phone} onChange={e => setDriverForm({ ...driverForm, phone: e.target.value })} required />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="driverAddress">{language === 'ur' ? 'پتہ' : 'Address'}</Label>
                      <Input id="driverAddress" value={driverForm.address} onChange={e => setDriverForm({ ...driverForm, address: e.target.value })} required />
                    </div>
                  </div>
                  <Button type="submit" className="w-full bg-gradient-primary hover:bg-primary-hover text-white">
                    {language === 'ur' ? 'محفوظ کریں' : 'Save'}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            {loadingDrivers ? (
              <div>Loading drivers...</div>
            ) : driverError ? (
              <div className="text-red-500">{driverError}</div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{language === 'ur' ? 'نام' : 'Name'}</TableHead>
                      <TableHead>{language === 'ur' ? 'فون' : 'Phone'}</TableHead>
                      <TableHead>{language === 'ur' ? 'پتہ' : 'Address'}</TableHead>
                  <TableHead>{language === 'ur' ? 'عمل' : 'Actions'}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                    {(drivers || []).map(driver => (
                      <TableRow key={driver._id}>
                        <TableCell className="font-medium cursor-pointer" onClick={() => setSelectedDriver(driver)}>{driver.name}</TableCell>
                        <TableCell>{driver.phone}</TableCell>
                        <TableCell>{driver.address}</TableCell>
                    <TableCell>
                          <Button size="sm" variant="ghost" onClick={() => setSelectedDriver(driver)}>
                            <Search className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDeleteDriver(driver._id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => { setSelectedDriverForHistory(driver); setIsDriverHistoryOpen(true); }}>
                          <Clock className="w-4 h-4" />
                        </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
                {/* Trip history for selected driver */}
                {selectedDriver && selectedDriver.trips && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">{selectedDriver.name} - {language === 'ur' ? 'ٹرپ ہسٹری' : 'Trip History'}</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{language === 'ur' ? 'گاڑی نمبر' : 'Vehicle No.'}</TableHead>
                          <TableHead>{language === 'ur' ? 'منزل' : 'Destination'}</TableHead>
                          <TableHead>{language === 'ur' ? 'تاریخ' : 'Date'}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {(selectedDriver.trips || []).map(trip => (
                          <TableRow key={trip._id}>
                            <TableCell>{trip.vehicle?.number}</TableCell>
                            <TableCell>{trip.destinationLocation}</TableCell>
                            <TableCell>{trip.createdAt ? new Date(trip.createdAt).toLocaleDateString() : ''}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Vehicle History Dialog */}
      <Dialog open={isVehicleHistoryOpen} onOpenChange={setIsVehicleHistoryOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedVehicleForHistory?.number} {language === 'ur' ? 'کی ٹرپ ہسٹری' : 'Trip History'}
            </DialogTitle>
          </DialogHeader>
          {selectedVehicleForHistory && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{language === 'ur' ? 'ڈرائیور' : 'Driver'}</TableHead>
                  <TableHead>{language === 'ur' ? 'منزل' : 'Destination'}</TableHead>
                  <TableHead>{language === 'ur' ? 'تاریخ' : 'Date'}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(trips.filter(trip => trip.vehicle?._id === selectedVehicleForHistory._id)).map(trip => (
                  <TableRow key={trip._id}>
                    <TableCell>{trip.driver?.name}</TableCell>
                    <TableCell>{trip.destinationLocation}</TableCell>
                    <TableCell>{trip.createdAt ? new Date(trip.createdAt).toLocaleDateString() : ''}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </DialogContent>
      </Dialog>

      {/* Driver History Dialog */}
      <Dialog open={isDriverHistoryOpen} onOpenChange={setIsDriverHistoryOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedDriverForHistory?.name} {language === 'ur' ? 'کی ٹرپ ہسٹری' : 'Trip History'}
            </DialogTitle>
          </DialogHeader>
          {selectedDriverForHistory && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{language === 'ur' ? 'گاڑی نمبر' : 'Vehicle No.'}</TableHead>
                  <TableHead>{language === 'ur' ? 'منزل' : 'Destination'}</TableHead>
                  <TableHead>{language === 'ur' ? 'تاریخ' : 'Date'}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(trips.filter(trip => trip.driver?._id === selectedDriverForHistory._id)).map(trip => (
                  <TableRow key={trip._id}>
                    <TableCell>{trip.vehicle?.number}</TableCell>
                    <TableCell>{trip.destinationLocation}</TableCell>
                    <TableCell>{trip.createdAt ? new Date(trip.createdAt).toLocaleDateString() : ''}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}