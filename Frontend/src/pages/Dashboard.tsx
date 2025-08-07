import { 
  Package, 
  Receipt, 
  DollarSign, 
  Users, 
  TrendingUp, 
  TrendingDown,
  Plus,
  FileText,
  Truck,
  UserPlus
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { QuickActionCard } from "@/components/dashboard/QuickActionCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { dashboardService } from "@/services/dashboardService";

const Dashboard = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [statsData, setStatsData] = useState([]);
  const [recentShipments, setRecentShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsResponse, shipmentsResponse] = await Promise.all([
        dashboardService.getDashboardStats(),
        dashboardService.getRecentShipments()
      ]);

      const stats = statsResponse.data;
      const shipments = shipmentsResponse.data;

      // Transform stats data for the StatsCard component
      const transformedStats = [
        {
          title: t("totalShipments"),
          value: stats.totalShipments?.value?.toLocaleString() || "0",
          change: stats.totalShipments?.change || "+0%",
          changeType: stats.totalShipments?.changeType || "positive",
          icon: Package,
          description: "Total shipments"
        },
        {
          title: t("totalStaff"),
          value: stats.totalStaff?.value?.toLocaleString() || "0",
          change: stats.totalStaff?.change || "+0%",
          changeType: stats.totalStaff?.changeType || "positive",
          icon: Users,
          description: "Total staff"
        },
        {
          title: t("totalTrips"),
          value: stats.totalTrips?.value?.toLocaleString() || "0",
          change: stats.totalTrips?.change || "+0%",
          changeType: stats.totalTrips?.changeType || "positive",
          icon: Truck,
          description: "Total trips"
        },
        {
          title: t("totalShops"),
          value: stats.totalShops?.value?.toLocaleString() || "0",
          change: stats.totalShops?.change || "+0%",
          changeType: stats.totalShops?.changeType || "positive",
          icon: DollarSign,
          description: "Total shops"
        }
      ];

      setStatsData(transformedStats);
      setRecentShipments(shipments);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: t("newShipment"),
      description: "Create a new shipment entry",
      icon: Plus,
      variant: "primary" as const,
      onClick: () => navigate("/shipments")
    },
    {
      title: t("addStaff"),
      description: "Add new staff member",
      icon: UserPlus,
      variant: "default" as const,
      onClick: () => navigate("/staff")
    },
    {
      title: t("viewReports"),
      description: "View business reports",
      icon: FileText,
      variant: "secondary" as const,
      onClick: () => navigate("/reports")
    },
    {
      title: t("manageClients"),
      description: "Manage client database",
      icon: Users,
      variant: "default" as const,
      onClick: () => navigate("/customers")
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "text-green-600 bg-green-100";
      case "unpaid":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "paid":
        return language === 'ur' ? 'ادا شدہ' : 'Paid';
      case "unpaid":
        return language === 'ur' ? 'ادا نہیں ہوا' : 'Unpaid';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {t("dashboard")}
          </h1>
          <p className="text-muted-foreground">
            {t("welcomeMessage")}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 animate-pulse rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {t("dashboard")}
          </h1>
          <p className="text-red-600">Error loading dashboard: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          {t("dashboard")}
        </h1>
        <p className="text-muted-foreground">
          {t("welcomeMessage")}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            changeType={stat.changeType}
            icon={stat.icon}
            description={stat.description}
          />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-foreground mb-6">
          {t("quickActions")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickActions.map((action, index) => (
            <QuickActionCard
              key={index}
              title={action.title}
              description={action.description}
              icon={action.icon}
              variant={action.variant}
              onClick={action.onClick}
            />
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Recent Shipments */}
        <Card className="bg-card-light border-border">
          <CardHeader>
            <CardTitle className="text-card-light-foreground flex items-center">
              <Package className="w-5 h-5 mr-2 text-primary" />
              {language === 'ur' ? 'حالیہ شپمنٹس' : 'Recent Shipments'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentShipments.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  {language === 'ur' ? 'کوئی حالیہ شپمنٹ نہیں' : 'No recent shipments'}
                </p>
              ) : (
                recentShipments.map((shipment) => (
                  <div key={shipment.id} className="flex items-center justify-between p-3 bg-card rounded-lg border border-border">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-foreground">{shipment.biltyNumber}</span>
                        <Badge className={getStatusColor(shipment.paymentStatus)}>
                          {getStatusText(shipment.paymentStatus)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {shipment.senderName} → {shipment.receiverName}
                      </p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-sm font-medium text-foreground">
                          ₨ {shipment.totalCharges?.toLocaleString() || '0'}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {shipment.createdAt ? new Date(shipment.createdAt).toLocaleDateString() : ''}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Monthly Overview Chart Placeholder */}
        <Card className="bg-card-light border-border">
          <CardHeader>
            <CardTitle className="text-card-light-foreground flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-primary" />
              {t("monthlyRevenue")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 bg-gradient-card rounded-lg flex items-center justify-center border border-border">
              <div className="text-center text-muted-foreground">
                <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Chart Component</p>
                <p className="text-sm">Revenue analytics will be displayed here</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Section Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Shop Revenue Section */}
        <Card className="bg-card-light border-border">
          <CardHeader>
            <CardTitle className="text-card-light-foreground flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-primary" />
              {language === 'ur' ? 'دکان کی آمدنی' : 'Shop Revenue'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Bar Chart Placeholder for Paid/Unpaid by Month */}
            <div className="h-64 flex flex-col items-center justify-center border border-border rounded-lg bg-white">
              {/* Replace this with a real chart library like recharts or chart.js */}
              <div className="w-full h-full flex flex-col items-center justify-center">
                <div className="text-lg font-semibold mb-2">Paid vs Unpaid (Monthly)</div>
                <div className="flex items-end gap-4 h-40 w-full justify-center">
                  {/* Example static bars for 6 months */}
                  {[{month: 'Jan', paid: 8, unpaid: 2}, {month: 'Feb', paid: 7, unpaid: 3}, {month: 'Mar', paid: 9, unpaid: 1}, {month: 'Apr', paid: 6, unpaid: 4}, {month: 'May', paid: 10, unpaid: 0}, {month: 'Jun', paid: 5, unpaid: 5}].map((data, idx) => (
                    <div key={data.month} className="flex flex-col items-center">
                      <div className="flex flex-col-reverse h-32 w-8">
                        <div style={{height: `${data.paid * 10}px`}} className="bg-green-400 w-full rounded-t"></div>
                        <div style={{height: `${data.unpaid * 10}px`}} className="bg-red-400 w-full rounded-b"></div>
                      </div>
                      <div className="text-xs mt-1">{data.month}</div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-4 mt-4">
                  <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-400 inline-block rounded"></span>Paid</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-400 inline-block rounded"></span>Unpaid</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Shipment/Bilty/Trip Revenue Section (Empty for now) */}
        <Card className="bg-card-light border-border">
          <CardHeader>
            <CardTitle className="text-card-light-foreground flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-primary" />
              {language === 'ur' ? 'شپمنٹ/بلٹی/ٹرپ کی آمدنی' : 'Shipment/Bilty/Trip Revenue'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              {language === 'ur' ? 'یہ سیکشن جلد دستیاب ہوگا' : 'This section will be available soon.'}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;