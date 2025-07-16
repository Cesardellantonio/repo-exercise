import React from 'react';
import { 
  Car, 
  Wrench, 
  Package, 
  BarChart3, 
  Settings, 
  Bell,
  Calendar,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { aiService } from '../services/aiService';

interface SidebarProps {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const vehicles = aiService.getVehicles();
  const inventory = aiService.getInventory();
  const maintenance = aiService.getMaintenance();

  const activeVehicles = vehicles.filter(v => v.status === 'active').length;
  const lowInventoryItems = inventory.filter(item => item.quantity <= item.minQuantity).length;
  const overdueVehicles = vehicles.filter(v => 
    v.nextService && new Date(v.nextService) < new Date()
  ).length;

  const stats = [
    {
      label: 'Active Vehicles',
      value: activeVehicles,
      icon: Car,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      label: 'Low Inventory',
      value: lowInventoryItems,
      icon: Package,
      color: lowInventoryItems > 0 ? 'text-red-600' : 'text-green-600',
      bgColor: lowInventoryItems > 0 ? 'bg-red-100' : 'bg-green-100'
    },
    {
      label: 'Overdue Service',
      value: overdueVehicles,
      icon: AlertTriangle,
      color: overdueVehicles > 0 ? 'text-orange-600' : 'text-green-600',
      bgColor: overdueVehicles > 0 ? 'bg-orange-100' : 'bg-green-100'
    }
  ];

  const menuItems = [
    { label: 'Dashboard', icon: BarChart3, active: true },
    { label: 'Vehicles', icon: Car, active: false },
    { label: 'Maintenance', icon: Wrench, active: false },
    { label: 'Inventory', icon: Package, active: false },
    { label: 'Calendar', icon: Calendar, active: false },
    { label: 'Notifications', icon: Bell, active: false },
    { label: 'Settings', icon: Settings, active: false }
  ];

  const recentVehicles = vehicles.slice(0, 3);

  return (
    <div className={`bg-white border-r border-garage-200 ${className}`}>
      <div className="p-4">
        {/* Logo */}
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
            <Car className="text-white" size={18} />
          </div>
          <div>
            <h2 className="font-bold text-garage-800">Garage AI</h2>
            <p className="text-xs text-garage-500">Smart Management</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-garage-700 mb-3">Quick Stats</h3>
          <div className="space-y-3">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-garage-50 transition-colors">
                  <div className={`w-8 h-8 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                    <IconComponent className={stat.color} size={16} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-garage-500">{stat.label}</p>
                    <p className="text-sm font-semibold text-garage-800">{stat.value}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-garage-700 mb-3">Navigation</h3>
          <nav className="space-y-1">
            {menuItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={index}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    item.active 
                      ? 'bg-primary-100 text-primary-700' 
                      : 'text-garage-600 hover:bg-garage-50 hover:text-garage-800'
                  }`}
                >
                  <IconComponent size={16} />
                  <span className="text-sm">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Recent Vehicles */}
        <div>
          <h3 className="text-sm font-semibold text-garage-700 mb-3">Recent Vehicles</h3>
          <div className="space-y-2">
            {recentVehicles.map((vehicle) => (
              <div key={vehicle.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-garage-50 transition-colors cursor-pointer">
                <div className="w-8 h-8 bg-garage-100 rounded-lg flex items-center justify-center">
                  <Car className="text-garage-600" size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-garage-800 truncate">
                    {vehicle.year} {vehicle.make} {vehicle.model}
                  </p>
                  <p className="text-xs text-garage-500">{vehicle.mileage.toLocaleString()} miles</p>
                </div>
                <div className="flex-shrink-0">
                  {vehicle.status === 'active' ? (
                    <CheckCircle className="text-green-500" size={12} />
                  ) : (
                    <AlertTriangle className="text-orange-500" size={12} />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;