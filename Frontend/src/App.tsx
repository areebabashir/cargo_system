import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider } from "./contexts/AuthContext";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Shipments from "./pages/Shipments";
import Receipts from "./pages/Receipts";
import Vouchers from "./pages/Vouchers";
import Expenses from "./pages/Expenses";
import Staff from "./pages/Staff";
import Trips from "./pages/Trips";
import Reports from "./pages/Reports";
import Claims from "./pages/Claims";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Customers from "./pages/Customers";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            
            {/* Protected Routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Dashboard />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Dashboard />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/shipments" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Shipments />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/receipts" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Receipts />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/vouchers" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Vouchers />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/expenses" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Expenses />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/staff" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Staff />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/trips" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Trips />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/reports" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Reports />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/claims" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Claims />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Settings />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/customers" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Customers />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
