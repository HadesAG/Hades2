'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LucideIcon } from 'lucide-react';

interface EnhancedDashboardCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: LucideIcon;
  iconColor: string;
  iconBgColor: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  className?: string;
}

export function EnhancedDashboardCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor,
  iconBgColor,
  trend,
  className = ""
}: EnhancedDashboardCardProps) {
  return (
    <Card className={`platform-card-enhanced group hover:scale-105 transition-all duration-300 ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            {trend && (
              <Badge 
                variant="outline" 
                className={`mb-2 text-xs ${
                  trend.isPositive 
                    ? 'border-green-500/30 text-green-400 bg-green-500/10' 
                    : 'border-red-500/30 text-red-400 bg-red-500/10'
                }`}
              >
                {trend.value}
              </Badge>
            )}
            
            <p className="text-2xl font-bold text-white mb-1 group-hover:text-red-400 transition-colors">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </p>
            
            <p className="text-lg font-semibold text-white mb-1">{title}</p>
            <p className="text-sm text-gray-400">{subtitle}</p>
          </div>
          
          <div className={`w-12 h-12 ${iconBgColor} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
            <Icon className={`h-6 w-6 ${iconColor}`} />
          </div>
        </div>
        
        {/* Glow effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none" />
      </CardContent>
    </Card>
  );
}