import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { 
  Users, 
  Building2, 
  GraduationCap, 
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

export function AdminDashboard() {
  const stats = [
    {
      label: 'Total Students',
      value: '2,543',
      change: '+12%',
      trend: 'up',
      icon: Users,
      color: 'blue',
    },
    {
      label: 'Active Institutions',
      value: '127',
      change: '+8%',
      trend: 'up',
      icon: Building2,
      color: 'green',
    },
    {
      label: 'Total Scholarships',
      value: '456',
      change: '+15%',
      trend: 'up',
      icon: GraduationCap,
      color: 'purple',
    },
    {
      label: 'Pending Approvals',
      value: '23',
      change: '-5%',
      trend: 'down',
      icon: Clock,
      color: 'orange',
    },
  ];

  const pendingInstitutions = [
    {
      id: 1,
      name: 'University of Colombo Foundation',
      type: 'Foundation',
      submittedDate: '2026-01-15',
      scholarships: 3,
    },
    {
      id: 2,
      name: 'Sri Lanka Education Trust',
      type: 'NGO',
      submittedDate: '2026-01-14',
      scholarships: 5,
    },
    {
      id: 3,
      name: 'National Development Bank',
      type: 'Private Organization',
      submittedDate: '2026-01-13',
      scholarships: 2,
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'approval',
      message: 'Institution "ABC Foundation" approved',
      time: '2 hours ago',
    },
    {
      id: 2,
      type: 'registration',
      message: 'New student registration: John Doe',
      time: '3 hours ago',
    },
    {
      id: 3,
      type: 'scholarship',
      message: 'New scholarship added: Commonwealth Scholarship',
      time: '5 hours ago',
    },
    {
      id: 4,
      type: 'rejection',
      message: 'Institution "XYZ Corp" rejected',
      time: '1 day ago',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-1">Dashboard Overview</h2>
        <p className="text-slate-600">Monitor platform statistics and activities</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                  <div className="flex items-center gap-1 mt-2">
                    {stat.trend === 'up' ? (
                      <ArrowUp className="w-4 h-4 text-green-600" />
                    ) : (
                      <ArrowDown className="w-4 h-4 text-red-600" />
                    )}
                    <span
                      className={`text-sm font-medium ${
                        stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {stat.change}
                    </span>
                    <span className="text-sm text-slate-500">vs last month</span>
                  </div>
                </div>
                <div
                  className={`p-3 rounded-lg ${
                    stat.color === 'blue'
                      ? 'bg-blue-100'
                      : stat.color === 'green'
                      ? 'bg-green-100'
                      : stat.color === 'purple'
                      ? 'bg-purple-100'
                      : 'bg-orange-100'
                  }`}
                >
                  <Icon
                    className={`w-6 h-6 ${
                      stat.color === 'blue'
                        ? 'text-blue-600'
                        : stat.color === 'green'
                        ? 'text-green-600'
                        : stat.color === 'purple'
                        ? 'text-purple-600'
                        : 'text-orange-600'
                    }`}
                  />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Institutions */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Pending Institutions</h3>
            <Badge variant="secondary" className="bg-orange-100 text-orange-700">
              {pendingInstitutions.length} Pending
            </Badge>
          </div>
          <div className="space-y-3">
            {pendingInstitutions.map((institution) => (
              <div
                key={institution.id}
                className="p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900">{institution.name}</h4>
                    <div className="flex items-center gap-3 mt-2 text-sm text-slate-600">
                      <Badge variant="secondary">{institution.type}</Badge>
                      <span>{institution.scholarships} scholarships</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">
                      Submitted: {new Date(institution.submittedDate).toLocaleDateString()}
                    </p>
                  </div>
                  <Clock className="w-5 h-5 text-orange-500" />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Activities */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Activities</h3>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <div
                  className={`p-2 rounded-lg ${
                    activity.type === 'approval'
                      ? 'bg-green-100'
                      : activity.type === 'rejection'
                      ? 'bg-red-100'
                      : 'bg-blue-100'
                  }`}
                >
                  {activity.type === 'approval' ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : activity.type === 'rejection' ? (
                    <AlertCircle className="w-4 h-4 text-red-600" />
                  ) : (
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate-900">{activity.message}</p>
                  <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
