import { Bell, Search, User, LogOut, Settings as SettingsIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { useNavigate } from "react-router-dom";

export function TopBar() {
  const { t, language } = useLanguage();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isRTL = language === 'ur';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 shadow-sm">
      <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
        <SidebarTrigger className="text-gray-600 hover:bg-gray-100" />
        
        <div className="relative max-w-md w-full">
          <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400`} />
          <Input
            placeholder={t("searchPlaceholder")}
            className={`${isRTL ? 'pr-10' : 'pl-10'} bg-gray-50 border-gray-200 focus:bg-white focus:border-primary`}
          />
        </div>
      </div>

      <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
        {/* Language Switcher */}
        <LanguageSwitcher variant="compact" />

        {/* Notifications */}
        <Button variant="ghost" size="sm" className="relative text-gray-600 hover:bg-gray-100">
          <Bell className="w-5 h-5" />
          <Badge 
            variant="destructive" 
            className={`absolute -top-1 ${isRTL ? '-left-1' : '-right-1'} w-5 h-5 rounded-full p-0 flex items-center justify-center text-xs`}
          >
            3
          </Badge>
        </Button>

        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'} text-gray-700 hover:bg-gray-100`}>
              <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="hidden md:block text-left">
                <div className="text-sm font-medium text-gray-900">
                  {user?.name || 'Admin User'}
                </div>
                <div className="text-xs text-gray-500">
                  {user?.email || 'admin@cargo.com'}
                </div>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>{t("myAccount")}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className={`${isRTL ? 'ml-2' : 'mr-2'} h-4 w-4`} />
              <span>{t("profile")}</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <SettingsIcon className={`${isRTL ? 'ml-2' : 'mr-2'} h-4 w-4`} />
              <span>{t("settings")}</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive" onClick={handleLogout}>
              <LogOut className={`${isRTL ? 'ml-2' : 'mr-2'} h-4 w-4`} />
              <span>{t("logout")}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}