import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { 
  Search, 
  GraduationCap,
  Eye,
  Edit,
  Trash2,
  Building2,
  Calendar,
  DollarSign,
  MapPin
} from 'lucide-react';

interface Scholarship {
  id: number;
  name: string;
  code: string;
  institution: string;
  type: string;
  amount: string;
  level: string[];
  country: string;
  startDate: string;
  endDate: string;
  applicants: number;
  status: 'active' | 'expired' | 'upcoming';
}

export function AdminScholarships() {
  const [scholarships] = useState<Scholarship[]>([
    {
      id: 1,
      name: 'Commonwealth Scholarship',
      code: 'CS2026',
      institution: 'University of Colombo Foundation',
      type: 'Fully Funded',
      amount: 'Up to LKR 150,000',
      level: ["Bachelor's", "Master's"],
      country: 'UK',
      startDate: '2026-01-01',
      endDate: '2026-03-31',
      applicants: 45,
      status: 'active',
    },
    {
      id: 2,
      name: 'Engineering Excellence Award',
      code: 'EEA2026',
      institution: 'Sri Lanka Education Trust',
      type: 'Merit-based',
      amount: 'LKR 100,000',
      level: ["Bachelor's"],
      country: 'Sri Lanka',
      startDate: '2026-02-01',
      endDate: '2026-04-30',
      applicants: 78,
      status: 'active',
    },
    {
      id: 3,
      name: 'Graduate Research Grant',
      code: 'GRG2026',
      institution: 'National Development Bank',
      type: 'Research',
      amount: 'Up to LKR 200,000',
      level: ["Master's", 'PhD'],
      country: 'Sri Lanka',
      startDate: '2026-03-01',
      endDate: '2026-05-31',
      applicants: 23,
      status: 'upcoming',
    },
    {
      id: 4,
      name: 'Undergraduate Support Fund',
      code: 'USF2025',
      institution: 'ABC Foundation',
      type: 'Need-based',
      amount: 'LKR 75,000',
      level: ["Bachelor's"],
      country: 'Sri Lanka',
      startDate: '2025-10-01',
      endDate: '2025-12-31',
      applicants: 120,
      status: 'expired',
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'upcoming' | 'expired'>('all');

  const filteredScholarships = scholarships.filter((sch) => {
    const matchesStatus = filterStatus === 'all' || sch.status === filterStatus;
    const matchesSearch =
      sch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sch.institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sch.code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const statusCounts = {
    all: scholarships.length,
    active: scholarships.filter((s) => s.status === 'active').length,
    upcoming: scholarships.filter((s) => s.status === 'upcoming').length,
    expired: scholarships.filter((s) => s.status === 'expired').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-1">Scholarship Management</h2>
          <p className="text-slate-600">View and manage all scholarship programs</p>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {(['all', 'active', 'upcoming', 'expired'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
              filterStatus === status
                ? 'bg-blue-600 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
            <span className="ml-2 font-semibold">({statusCounts[status]})</span>
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400" />
          <Input
            placeholder="Search scholarships by name, code, or institution..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 border-none shadow-none focus-visible:ring-0"
          />
        </div>
      </Card>

      {/* Scholarships Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredScholarships.map((scholarship) => (
          <Card key={scholarship.id} className="p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <GraduationCap className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{scholarship.name}</h3>
                  <p className="text-sm text-slate-600">{scholarship.code}</p>
                </div>
              </div>
              <Badge
                className={
                  scholarship.status === 'active'
                    ? 'bg-green-100 text-green-700'
                    : scholarship.status === 'upcoming'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-slate-100 text-slate-700'
                }
              >
                {scholarship.status.toUpperCase()}
              </Badge>
            </div>

            <div className="space-y-2 text-sm mb-4">
              <div className="flex items-center gap-2 text-slate-600">
                <Building2 className="w-4 h-4" />
                <span>{scholarship.institution}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <DollarSign className="w-4 h-4" />
                <span>{scholarship.amount}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <MapPin className="w-4 h-4" />
                <span>{scholarship.country}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Calendar className="w-4 h-4" />
                <span>
                  {new Date(scholarship.startDate).toLocaleDateString()} -{' '}
                  {new Date(scholarship.endDate).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="secondary">{scholarship.type}</Badge>
              {scholarship.level.map((level) => (
                <Badge key={level} variant="secondary">
                  {level}
                </Badge>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <div>
                <span className="text-sm text-slate-600">Applicants:</span>
                <span className="ml-2 font-semibold text-slate-900">{scholarship.applicants}</span>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">
                  <Eye className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredScholarships.length === 0 && (
        <Card className="p-12 text-center">
          <GraduationCap className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-slate-900 mb-1">No Scholarships Found</h3>
          <p className="text-slate-600">Try adjusting your filters or search query</p>
        </Card>
      )}
    </div>
  );
}
