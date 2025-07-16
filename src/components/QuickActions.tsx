import React from 'react';
import { 
  Plus, 
  Calendar, 
  Search, 
  Download,
  AlertCircle,
  TrendingUp,
  Clock,
  DollarSign
} from 'lucide-react';

interface QuickActionsProps {
  className?: string;
}

const QuickActions: React.FC<QuickActionsProps> = ({ className }) => {
  const quickActions = [
    {
      label: 'Add Vehicle',
      icon: Plus,
      color: 'bg-blue-500 hover:bg-blue-600',
      description: 'Register a new vehicle'
    },
    {
      label: 'Schedule Service',
      icon: Calendar,
      color: 'bg-green-500 hover:bg-green-600',
      description: 'Book maintenance appointment'
    },
    {
      label: 'Search Records',
      icon: Search,
      color: 'bg-purple-500 hover:bg-purple-600',
      description: 'Find maintenance history'
    },
    {
      label: 'Export Data',
      icon: Download,
      color: 'bg-orange-500 hover:bg-orange-600',
      description: 'Download reports'
    }
  ];

  const insights = [
    {
      label: 'Service Alerts',
      value: '2 vehicles',
      icon: AlertCircle,
      trend: 'due soon',
      color: 'text-orange-600'
    },
    {
      label: 'Monthly Savings',
      value: '$245',
      icon: TrendingUp,
      trend: '+12% vs last month',
      color: 'text-green-600'
    },
    {
      label: 'Avg Service Time',
      value: '2.5 hours',
      icon: Clock,
      trend: '15 min faster',
      color: 'text-blue-600'
    },
    {
      label: 'Total Costs',
      value: '$1,280',
      icon: DollarSign,
      trend: 'this month',
      color: 'text-purple-600'
    }
  ];

  return (
    <div className={`bg-white rounded-lg border border-garage-200 ${className}`}>
      <div className="p-4">
        {/* Quick Actions */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-garage-800 mb-3">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action, index) => {
              const IconComponent = action.icon;
              return (
                <button
                  key={index}
                  className={`${action.color} text-white p-3 rounded-lg transition-colors group`}
                >
                  <div className="flex items-center space-x-2">
                    <IconComponent size={18} />
                    <div className="text-left">
                      <p className="text-sm font-medium">{action.label}</p>
                      <p className="text-xs opacity-90">{action.description}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Smart Insights */}
        <div>
          <h3 className="text-lg font-semibold text-garage-800 mb-3">Smart Insights</h3>
          <div className="space-y-3">
            {insights.map((insight, index) => {
              const IconComponent = insight.icon;
              return (
                <div key={index} className="flex items-center justify-between p-3 bg-garage-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                      <IconComponent className={insight.color} size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-garage-800">{insight.label}</p>
                      <p className="text-xs text-garage-500">{insight.trend}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-garage-800">{insight.value}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="mt-6 p-4 bg-gradient-to-r from-primary-50 to-blue-50 rounded-lg border border-primary-200">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <TrendingUp className="text-white" size={16} />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-primary-800 mb-1">AI Recommendation</h4>
              <p className="text-sm text-primary-700 mb-2">
                Your Honda Civic is due for an oil change in 500 miles. Book now to maintain optimal performance.
              </p>
              <button className="text-xs bg-primary-500 text-white px-3 py-1 rounded-full hover:bg-primary-600 transition-colors">
                Schedule Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;