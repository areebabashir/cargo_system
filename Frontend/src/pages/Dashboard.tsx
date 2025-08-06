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
import { StatsCard } from "@/components/dashboard/StatsCard";
import { QuickActionCard } from "@/components/dashboard/QuickActionCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

const Dashboard = () => {
  const { t } = useLanguage();

  const statsData = [
    {
      title: t("totalShipments"),
      value: "2,847",
      change: "+12.5% from last month",
      changeType: "positive" as const,
      icon: Package,
      description: "Total shipments"
    },
    {
      title: t("pendingShipments"),
      value: "324",
      change: "+8.2% from last week",
      changeType: "positive" as const,
      icon: Package,
      description: "Pending delivery"
    },
    {
      title: t("totalReceipts"),
      value: "₨ 2,45,000",
      change: "+18.7% from last month",
      changeType: "positive" as const,
      icon: Receipt,
      description: "Total receipts"
    },
    {
      title: t("outstandingPayments"),
      value: "₨ 45,600",
      change: "-5.3% from last month",
      changeType: "negative" as const,
      icon: DollarSign,
      description: "Pending payments"
    }
  ];

  const quickActions = [
    {
      title: t("newShipment"),
      description: "Create a new shipment entry",
      icon: Plus,
      variant: "primary" as const,
      onClick: () => console.log("New shipment")
    },
    {
      title: t("newReceipt"),
      description: "Generate a new receipt",
      icon: Receipt,
      variant: "default" as const,
      onClick: () => console.log("New receipt")
    },
    {
      title: t("addExpense"),
      description: "Record business expenses",
      icon: DollarSign,
      variant: "default" as const,
      onClick: () => console.log("Add expense")
    },
    {
      title: t("addStaff"),
      description: "Add new staff member",
      icon: UserPlus,
      variant: "default" as const,
      onClick: () => console.log("Add staff")
    },
    {
      title: t("viewReports"),
      description: "View business reports",
      icon: FileText,
      variant: "secondary" as const,
      onClick: () => console.log("View reports")
    },
    {
      title: t("manageClients"),
      description: "Manage client database",
      icon: Users,
      variant: "default" as const,
      onClick: () => console.log("Manage clients")
    }
  ];

  const recentShipments = [
    { id: "SH001", client: "Ahmad Trading Co.", status: "In Transit", amount: "₨ 15,000", date: "2024-01-15" },
    { id: "SH002", client: "Khan Logistics", status: "Delivered", amount: "₨ 8,500", date: "2024-01-14" },
    { id: "SH003", client: "Metro Cargo", status: "Pending", amount: "₨ 12,000", date: "2024-01-14" },
    { id: "SH004", client: "Express Movers", status: "In Transit", amount: "₨ 20,000", date: "2024-01-13" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "text-success bg-success/10";
      case "In Transit":
        return "text-warning bg-warning/10";
      case "Pending":
        return "text-destructive bg-destructive/10";
      default:
        return "text-muted-foreground bg-muted";
    }
  };

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
              Recent Shipments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentShipments.map((shipment) => (
                <div key={shipment.id} className="flex items-center justify-between p-3 bg-card rounded-lg border border-border">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-foreground">{shipment.id}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(shipment.status)}`}>
                        {shipment.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{shipment.client}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-sm font-medium text-foreground">{shipment.amount}</span>
                      <span className="text-xs text-muted-foreground">{shipment.date}</span>
                    </div>
                  </div>
                </div>
              ))}
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
    </div>
  );
};

export default Dashboard;