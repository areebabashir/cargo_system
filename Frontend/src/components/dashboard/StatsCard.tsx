import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  description?: string;
}

export function StatsCard({ 
  title, 
  value, 
  change, 
  changeType = 'neutral', 
  icon: Icon, 
  description 
}: StatsCardProps) {
  const getChangeColor = () => {
    switch (changeType) {
      case 'positive':
        return 'text-success';
      case 'negative':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <Card className="bg-gradient-card border-border shadow-md hover:shadow-lg transition-all duration-300 group">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-foreground">{title}</CardTitle>
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground mb-1">{value}</div>
        <div className="flex items-center justify-between">
          {change && (
            <p className={`text-xs ${getChangeColor()}`}>
              {change}
            </p>
          )}
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}