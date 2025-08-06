import { useState } from "react";
import { Plus, Search, Filter, MoreHorizontal, Eye, Edit, Trash2, Receipt, Download, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";

interface ReceiptData {
  id: string;
  receiptNumber: string;
  shipmentId: string;
  client: string;
  amount: string;
  paymentMethod: "Cash" | "Bank Transfer" | "Cheque" | "Online";
  status: "Paid" | "Pending" | "Overdue";
  date: string;
  dueDate: string;
  description: string;
}

const Receipts = () => {
  const { t, language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const receipts: ReceiptData[] = [
    {
      id: "1",
      receiptNumber: "RCP001",
      shipmentId: "TK001",
      client: "Ahmad Trading Co.",
      amount: "₨ 15,000",
      paymentMethod: "Bank Transfer",
      status: "Paid",
      date: "2024-01-15",
      dueDate: "2024-01-20",
      description: "Shipment delivery charges"
    },
    {
      id: "2",
      receiptNumber: "RCP002",
      shipmentId: "TK002",
      client: "Metro Enterprises",
      amount: "₨ 8,500",
      paymentMethod: "Cash",
      status: "Paid",
      date: "2024-01-14",
      dueDate: "2024-01-19",
      description: "Express delivery fee"
    },
    {
      id: "3",
      receiptNumber: "RCP003",
      shipmentId: "TK003",
      client: "Express Logistics",
      amount: "₨ 22,000",
      paymentMethod: "Cheque",
      status: "Pending",
      date: "2024-01-13",
      dueDate: "2024-01-18",
      description: "Heavy cargo transportation"
    },
    {
      id: "4",
      receiptNumber: "RCP004",
      shipmentId: "TK004",
      client: "Prime Movers",
      amount: "₨ 12,000",
      paymentMethod: "Online",
      status: "Overdue",
      date: "2024-01-10",
      dueDate: "2024-01-15",
      description: "Standard delivery charges"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-success/10 text-success border-success/20";
      case "Pending":
        return "bg-warning/10 text-warning border-warning/20";
      case "Overdue":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const getStatusText = (status: string) => {
    const statusMap = {
      "Paid": language === 'ur' ? 'ادا شدہ' : 'Paid',
      "Pending": language === 'ur' ? 'زیر التواء' : 'Pending',
      "Overdue": language === 'ur' ? 'مدت ختم' : 'Overdue'
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  const getPaymentMethodText = (method: string) => {
    const methodMap = {
      "Cash": language === 'ur' ? 'نقد' : 'Cash',
      "Bank Transfer": language === 'ur' ? 'بینک ٹرانسفر' : 'Bank Transfer',
      "Cheque": language === 'ur' ? 'چیک' : 'Cheque',
      "Online": language === 'ur' ? 'آن لائن' : 'Online'
    };
    return methodMap[method as keyof typeof methodMap] || method;
  };

  const filteredReceipts = receipts.filter(receipt => {
    const matchesSearch = receipt.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         receipt.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         receipt.shipmentId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || receipt.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const totalAmount = receipts.reduce((sum, receipt) => {
    const amount = parseInt(receipt.amount.replace(/[₨,\s]/g, ''));
    return sum + amount;
  }, 0);

  const paidAmount = receipts
    .filter(r => r.status === 'Paid')
    .reduce((sum, receipt) => {
      const amount = parseInt(receipt.amount.replace(/[₨,\s]/g, ''));
      return sum + amount;
    }, 0);

  const pendingAmount = receipts
    .filter(r => r.status === 'Pending' || r.status === 'Overdue')
    .reduce((sum, receipt) => {
      const amount = parseInt(receipt.amount.replace(/[₨,\s]/g, ''));
      return sum + amount;
    }, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {language === 'ur' ? 'واؤچرز کا انتظام' : 'Receipts Management'}
          </h1>
          <p className="text-muted-foreground mt-2">
            {language === 'ur' ? 'تمام واؤچرز اور ادائیگیوں کا ریکارڈ' : 'Manage all receipts and payments'}
          </p>
        </div>
        <Button className="bg-gradient-primary hover:bg-primary-hover text-white">
          <Plus className="w-4 h-4 mr-2" />
          {language === 'ur' ? 'نیا واؤچر بنائیں' : 'New Receipt'}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{language === 'ur' ? 'کل واؤچرز' : 'Total Receipts'}</p>
                <p className="text-2xl font-bold text-foreground">{receipts.length}</p>
              </div>
              <Receipt className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{language === 'ur' ? 'کل رقم' : 'Total Amount'}</p>
                <p className="text-2xl font-bold text-foreground">₨ {totalAmount.toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{language === 'ur' ? 'ادا شدہ رقم' : 'Paid Amount'}</p>
                <p className="text-2xl font-bold text-success">₨ {paidAmount.toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{language === 'ur' ? 'باقی رقم' : 'Pending Amount'}</p>
                <p className="text-2xl font-bold text-warning">₨ {pendingAmount.toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-warning" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="bg-card-light border-border">
        <CardHeader className="pb-4">
          <CardTitle className="text-card-light-foreground">
            {language === 'ur' ? 'تلاش اور فلٹر' : 'Search & Filter'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder={language === 'ur' ? 'واؤچر نمبر یا کلائنٹ کا نام تلاش کریں...' : 'Search by receipt number or client...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder={language === 'ur' ? 'حالت کے مطابق فلٹر' : 'Filter by status'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{language === 'ur' ? 'تمام' : 'All Status'}</SelectItem>
                <SelectItem value="paid">{language === 'ur' ? 'ادا شدہ' : 'Paid'}</SelectItem>
                <SelectItem value="pending">{language === 'ur' ? 'زیر التواء' : 'Pending'}</SelectItem>
                <SelectItem value="overdue">{language === 'ur' ? 'مدت ختم' : 'Overdue'}</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="border-border">
              <Download className="w-4 h-4 mr-2" />
              {language === 'ur' ? 'ایکسپورٹ' : 'Export'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Receipts Table */}
      <Card className="bg-card-light border-border">
        <CardHeader>
          <CardTitle className="text-card-light-foreground">
            {language === 'ur' ? 'تمام واؤچرز' : 'All Receipts'} ({filteredReceipts.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead className="text-card-light-foreground">{language === 'ur' ? 'واؤچر نمبر' : 'Receipt #'}</TableHead>
                  <TableHead className="text-card-light-foreground">{language === 'ur' ? 'بلٹی نمبر' : 'Shipment ID'}</TableHead>
                  <TableHead className="text-card-light-foreground">{language === 'ur' ? 'کلائنٹ' : 'Client'}</TableHead>
                  <TableHead className="text-card-light-foreground">{language === 'ur' ? 'رقم' : 'Amount'}</TableHead>
                  <TableHead className="text-card-light-foreground">{language === 'ur' ? 'ادائیگی کا طریقہ' : 'Payment Method'}</TableHead>
                  <TableHead className="text-card-light-foreground">{language === 'ur' ? 'حالت' : 'Status'}</TableHead>
                  <TableHead className="text-card-light-foreground">{language === 'ur' ? 'تاریخ' : 'Date'}</TableHead>
                  <TableHead className="text-card-light-foreground">{language === 'ur' ? 'آخری تاریخ' : 'Due Date'}</TableHead>
                  <TableHead className="text-card-light-foreground"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReceipts.map((receipt) => (
                  <TableRow key={receipt.id} className="border-border hover:bg-muted/50">
                    <TableCell className="font-medium text-card-light-foreground">{receipt.receiptNumber}</TableCell>
                    <TableCell className="text-card-light-foreground">{receipt.shipmentId}</TableCell>
                    <TableCell className="text-card-light-foreground">{receipt.client}</TableCell>
                    <TableCell className="font-medium text-card-light-foreground">{receipt.amount}</TableCell>
                    <TableCell className="text-card-light-foreground">{getPaymentMethodText(receipt.paymentMethod)}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(receipt.status)}>
                        {getStatusText(receipt.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-card-light-foreground">{receipt.date}</TableCell>
                    <TableCell className="text-card-light-foreground">{receipt.dueDate}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>{language === 'ur' ? 'اعمال' : 'Actions'}</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            {language === 'ur' ? 'تفصیل دیکھیں' : 'View Details'}
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="mr-2 h-4 w-4" />
                            {language === 'ur' ? 'پرنٹ کریں' : 'Print Receipt'}
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            {language === 'ur' ? 'تبدیل کریں' : 'Edit'}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            {language === 'ur' ? 'حذف کریں' : 'Delete'}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Receipts;