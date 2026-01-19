import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Building2,
  TrendingUp,
  Users,
  FileText,
  Calendar,
  Award,
  Eye,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  Send,
  CheckCircle,
  XCircle,
  Clock,
  BarChart3,
  Star,
  Mail,
  Phone,
  GraduationCap,
  MapPin,
  DollarSign,
  ArrowLeft,
} from 'lucide-react';
import { PostScholarshipForm } from './PostScholarshipForm';

type TabType = 'overview' | 'scholarships' | 'candidates' | 'analytics' | 'announcements';

// Mock data for scholarships
const mockScholarships = [
  {
    id: 1,
    title: 'Commonwealth Scholarship 2026',
    status: 'active',
    deadline: '2026-06-30',
    applicants: 156,
    shortlisted: 23,
    selected: 5,
    amount: '$15,000',
    duration: '1 Year',
    level: 'Undergraduate',
  },
  {
    id: 2,
    title: 'Graduate Research Fellowship',
    status: 'active',
    deadline: '2026-08-15',
    applicants: 89,
    shortlisted: 15,
    selected: 0,
    amount: '$25,000',
    duration: '2 Years',
    level: 'Postgraduate',
  },
  {
    id: 3,
    title: 'Engineering Excellence Award',
    status: 'closed',
    deadline: '2026-03-31',
    applicants: 203,
    shortlisted: 30,
    selected: 10,
    amount: '$10,000',
    duration: '1 Year',
    level: 'Undergraduate',
  },
];

// Mock data for candidates
const mockCandidates = [
  {
    id: 1,
    name: 'Saman Perera',
    email: 'saman.perera@email.com',
    phone: '+94 77 123 4567',
    location: 'Colombo, Sri Lanka',
    scholarship: 'Commonwealth Scholarship 2026',
    matchScore: 95,
    gpa: 3.9,
    alResults: 'AAA',
    status: 'pending',
    appliedDate: '2026-01-10',
    level: 'Undergraduate',
  },
  {
    id: 2,
    name: 'Nimal Silva',
    email: 'nimal.silva@email.com',
    phone: '+94 76 234 5678',
    location: 'Kandy, Sri Lanka',
    scholarship: 'Commonwealth Scholarship 2026',
    matchScore: 92,
    gpa: 3.8,
    alResults: 'AAB',
    status: 'shortlisted',
    appliedDate: '2026-01-12',
    level: 'Undergraduate',
  },
  {
    id: 3,
    name: 'Kamala Fernando',
    email: 'kamala.fernando@email.com',
    phone: '+94 75 345 6789',
    location: 'Galle, Sri Lanka',
    scholarship: 'Graduate Research Fellowship',
    matchScore: 98,
    gpa: 4.0,
    alResults: 'AAA',
    status: 'pending',
    appliedDate: '2026-01-08',
    level: 'Postgraduate',
  },
  {
    id: 4,
    name: 'Rajitha Wijesinghe',
    email: 'rajitha.w@email.com',
    phone: '+94 71 456 7890',
    location: 'Jaffna, Sri Lanka',
    scholarship: 'Commonwealth Scholarship 2026',
    matchScore: 88,
    gpa: 3.7,
    alResults: 'ABB',
    status: 'selected',
    appliedDate: '2026-01-15',
    level: 'Undergraduate',
  },
  {
    id: 5,
    name: 'Priya Jayawardena',
    email: 'priya.j@email.com',
    phone: '+94 77 567 8901',
    location: 'Matara, Sri Lanka',
    scholarship: 'Commonwealth Scholarship 2026',
    matchScore: 90,
    gpa: 3.75,
    alResults: 'AAB',
    status: 'pending',
    appliedDate: '2026-01-11',
    level: 'Undergraduate',
  },
  {
    id: 6,
    name: 'Dinesh Kumar',
    email: 'dinesh.k@email.com',
    phone: '+94 76 678 9012',
    location: 'Batticaloa, Sri Lanka',
    scholarship: 'Commonwealth Scholarship 2026',
    matchScore: 87,
    gpa: 3.65,
    alResults: 'ABB',
    status: 'pending',
    appliedDate: '2026-01-13',
    level: 'Undergraduate',
  },
  {
    id: 7,
    name: 'Thilini Rathnayake',
    email: 'thilini.r@email.com',
    phone: '+94 75 789 0123',
    location: 'Kurunegala, Sri Lanka',
    scholarship: 'Commonwealth Scholarship 2026',
    matchScore: 93,
    gpa: 3.85,
    alResults: 'AAA',
    status: 'shortlisted',
    appliedDate: '2026-01-09',
    level: 'Undergraduate',
  },
  {
    id: 8,
    name: 'Harsha Dissanayake',
    email: 'harsha.d@email.com',
    phone: '+94 71 890 1234',
    location: 'Negombo, Sri Lanka',
    scholarship: 'Commonwealth Scholarship 2026',
    matchScore: 85,
    gpa: 3.6,
    alResults: 'ABB',
    status: 'pending',
    appliedDate: '2026-01-14',
    level: 'Undergraduate',
  },
  {
    id: 9,
    name: 'Nadeesha Perera',
    email: 'nadeesha.p@email.com',
    phone: '+94 77 901 2345',
    location: 'Anuradhapura, Sri Lanka',
    scholarship: 'Commonwealth Scholarship 2026',
    matchScore: 91,
    gpa: 3.8,
    alResults: 'AAB',
    status: 'pending',
    appliedDate: '2026-01-12',
    level: 'Undergraduate',
  },
  {
    id: 10,
    name: 'Ruwan Bandara',
    email: 'ruwan.b@email.com',
    phone: '+94 76 012 3456',
    location: 'Ratnapura, Sri Lanka',
    scholarship: 'Commonwealth Scholarship 2026',
    matchScore: 89,
    gpa: 3.7,
    alResults: 'ABB',
    status: 'pending',
    appliedDate: '2026-01-11',
    level: 'Undergraduate',
  },
  {
    id: 11,
    name: 'Amali Wijesekera',
    email: 'amali.w@email.com',
    phone: '+94 75 123 4567',
    location: 'Badulla, Sri Lanka',
    scholarship: 'Commonwealth Scholarship 2026',
    matchScore: 84,
    gpa: 3.55,
    alResults: 'ABB',
    status: 'pending',
    appliedDate: '2026-01-16',
    level: 'Undergraduate',
  },
  {
    id: 12,
    name: 'Suresh Gunasekara',
    email: 'suresh.g@email.com',
    phone: '+94 71 234 5678',
    location: 'Trincomalee, Sri Lanka',
    scholarship: 'Commonwealth Scholarship 2026',
    matchScore: 86,
    gpa: 3.65,
    alResults: 'ABB',
    status: 'pending',
    appliedDate: '2026-01-14',
    level: 'Undergraduate',
  },
  {
    id: 13,
    name: 'Sandali Mendis',
    email: 'sandali.m@email.com',
    phone: '+94 77 345 6789',
    location: 'Gampaha, Sri Lanka',
    scholarship: 'Graduate Research Fellowship',
    matchScore: 96,
    gpa: 3.95,
    alResults: 'AAA',
    status: 'shortlisted',
    appliedDate: '2026-01-09',
    level: 'Postgraduate',
  },
  {
    id: 14,
    name: 'Lakshan De Silva',
    email: 'lakshan.d@email.com',
    phone: '+94 76 456 7890',
    location: 'Colombo, Sri Lanka',
    scholarship: 'Graduate Research Fellowship',
    matchScore: 94,
    gpa: 3.88,
    alResults: 'AAA',
    status: 'pending',
    appliedDate: '2026-01-10',
    level: 'Postgraduate',
  },
  {
    id: 15,
    name: 'Dilini Jayasuriya',
    email: 'dilini.j@email.com',
    phone: '+94 75 567 8901',
    location: 'Kandy, Sri Lanka',
    scholarship: 'Graduate Research Fellowship',
    matchScore: 92,
    gpa: 3.82,
    alResults: 'AAB',
    status: 'pending',
    appliedDate: '2026-01-11',
    level: 'Postgraduate',
  },
  {
    id: 16,
    name: 'Chandana Rodrigo',
    email: 'chandana.r@email.com',
    phone: '+94 71 678 9012',
    location: 'Moratuwa, Sri Lanka',
    scholarship: 'Engineering Excellence Award',
    matchScore: 97,
    gpa: 3.92,
    alResults: 'AAA',
    status: 'selected',
    appliedDate: '2026-01-05',
    level: 'Undergraduate',
  },
  {
    id: 17,
    name: 'Tharaka Gamage',
    email: 'tharaka.g@email.com',
    phone: '+94 77 789 0123',
    location: 'Kiribathgoda, Sri Lanka',
    scholarship: 'Engineering Excellence Award',
    matchScore: 95,
    gpa: 3.9,
    alResults: 'AAA',
    status: 'selected',
    appliedDate: '2026-01-06',
    level: 'Undergraduate',
  },
  {
    id: 18,
    name: 'Nuwan Ranasinghe',
    email: 'nuwan.r@email.com',
    phone: '+94 76 890 1234',
    location: 'Maharagama, Sri Lanka',
    scholarship: 'Engineering Excellence Award',
    matchScore: 93,
    gpa: 3.85,
    alResults: 'AAB',
    status: 'selected',
    appliedDate: '2026-01-07',
    level: 'Undergraduate',
  },
];

export function InstitutionDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [selectedScholarship, setSelectedScholarship] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [timePeriod, setTimePeriod] = useState('30');
  const [editingDeadline, setEditingDeadline] = useState<number | null>(null);
  const [newDeadline, setNewDeadline] = useState('');
  const [selectedScholarshipDetail, setSelectedScholarshipDetail] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedCandidateProfile, setSelectedCandidateProfile] = useState<number | null>(null);
  const [showPostScholarshipForm, setShowPostScholarshipForm] = useState(false);

  const handleDeadlineChange = (scholarshipId: number) => {
    console.log(`Changing deadline for scholarship ${scholarshipId} to ${newDeadline}`);
    setEditingDeadline(null);
    setNewDeadline('');
  };

  const handleStatusChange = (candidateId: number, newStatus: string) => {
    console.log(`Changing candidate ${candidateId} status to ${newStatus}`);
  };

  const handleAnnouncement = (candidateId: number) => {
    console.log(`Sending announcement to candidate ${candidateId}`);
  };

  const filteredCandidates = mockCandidates
    .filter((c) => selectedScholarship === 'all' || c.scholarship === selectedScholarship)
    .filter(
      (c) =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((c) => statusFilter === 'all' || c.status === statusFilter)
    .sort((a, b) => b.matchScore - a.matchScore) // Sort by match score (highest first)
    .slice(0, 10); // Limit to top 10 candidates

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-600 p-3 rounded-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-3xl font-bold text-blue-900">8</p>
          <p className="text-sm text-blue-700">Active Scholarships</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-600 p-3 rounded-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-3xl font-bold text-purple-900">448</p>
          <p className="text-sm text-purple-700">Total Applicants</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-600 p-3 rounded-lg">
              <Award className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-3xl font-bold text-green-900">68</p>
          <p className="text-sm text-green-700">Shortlisted</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-orange-600 p-3 rounded-lg">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-3xl font-bold text-orange-900">15</p>
          <p className="text-sm text-orange-700">Selected Candidates</p>
        </Card>
      </div>

      {/* Recent Applications */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-slate-900">Recent Applications</h3>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>
        <div className="space-y-4">
          {filteredCandidates.slice(0, 5).map((candidate) => (
            <div
              key={candidate.id}
              className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-full">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">{candidate.name}</h4>
                  <p className="text-sm text-slate-600">{candidate.scholarship}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <p className="font-semibold text-slate-900">{candidate.matchScore}% Match</p>
                  </div>
                  <p className="text-sm text-slate-600">{candidate.appliedDate}</p>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setSelectedCandidateProfile(candidate.id)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Review
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const renderScholarships = () => {
    // If a scholarship is selected for detail view, show that instead
    if (selectedScholarshipDetail) {
      const scholarship = mockScholarships.find(s => s.id === selectedScholarshipDetail);
      if (!scholarship) return null;

      const scholarshipCandidates = mockCandidates
        .filter(c => c.scholarship === scholarship.title)
        .sort((a, b) => b.matchScore - a.matchScore);

      return (
        <div className="space-y-6">
          {/* Back Button */}
          <Button 
            variant="outline" 
            onClick={() => setSelectedScholarshipDetail(null)}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Scholarships
          </Button>

          {/* Scholarship Header */}
          <Card className="p-8 bg-gradient-to-br from-blue-50 via-white to-blue-50 shadow-lg border border-blue-100">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-lg">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900">{scholarship.title}</h2>
                    <p className="text-slate-600 mt-1">Detailed Overview & Applicant List</p>
                  </div>
                </div>
              </div>
              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold shadow-sm ${
                  scholarship.status === 'active'
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                    : 'bg-gradient-to-r from-slate-400 to-slate-500 text-white'
                }`}
              >
                {scholarship.status.toUpperCase()}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-blue-100">
                <div className="flex items-center gap-2 mb-3">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                  <p className="text-sm font-medium text-slate-600">Amount</p>
                </div>
                <p className="text-2xl font-bold text-slate-900">{scholarship.amount}</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-blue-100">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-5 h-5 text-purple-600" />
                  <p className="text-sm font-medium text-slate-600">Duration</p>
                </div>
                <p className="text-2xl font-bold text-slate-900">{scholarship.duration}</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-blue-100">
                <div className="flex items-center gap-2 mb-3">
                  <GraduationCap className="w-5 h-5 text-indigo-600" />
                  <p className="text-sm font-medium text-slate-600">Level</p>
                </div>
                <p className="text-2xl font-bold text-slate-900">{scholarship.level}</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-blue-100">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-5 h-5 text-orange-600" />
                  <p className="text-sm font-medium text-slate-600">Deadline</p>
                </div>
                <p className="text-2xl font-bold text-slate-900">{scholarship.deadline}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6 mt-6 pt-6 border-t border-blue-200">
              <div className="text-center bg-white/60 backdrop-blur-sm p-4 rounded-xl">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Users className="w-6 h-6 text-slate-600" />
                  <p className="text-4xl font-bold text-slate-900">{scholarship.applicants}</p>
                </div>
                <p className="text-sm font-medium text-slate-600">Total Applicants</p>
              </div>
              <div className="text-center bg-white/60 backdrop-blur-sm p-4 rounded-xl">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Star className="w-6 h-6 text-blue-600" />
                  <p className="text-4xl font-bold text-blue-600">{scholarship.shortlisted}</p>
                </div>
                <p className="text-sm font-medium text-slate-600">Shortlisted</p>
              </div>
              <div className="text-center bg-white/60 backdrop-blur-sm p-4 rounded-xl">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <p className="text-4xl font-bold text-green-600">{scholarship.selected}</p>
                </div>
                <p className="text-sm font-medium text-slate-600">Selected</p>
              </div>
            </div>
          </Card>

          {/* Applicants List */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900">All Applicants</h3>
                <p className="text-sm text-slate-600 mt-1">Sorted by match score (highest to lowest)</p>
              </div>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export List
              </Button>
            </div>

            <div className="space-y-3">
              {scholarshipCandidates.map((candidate, index) => (
                <div 
                  key={candidate.id}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-white border border-slate-200 rounded-lg hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="relative">
                      <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-full">
                        <GraduationCap className="w-5 h-5 text-white" />
                      </div>
                      <div className="absolute -top-1 -right-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white">
                        {index + 1}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900">{candidate.name}</h4>
                      <p className="text-sm text-slate-600">{candidate.email}</p>
                    </div>
                    <div className="flex items-center gap-6">
                      <div>
                        <p className="text-xs text-slate-600">GPA</p>
                        <p className="font-semibold text-slate-900">{candidate.gpa}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-600">A/L Results</p>
                        <p className="font-semibold text-slate-900">{candidate.alResults}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                        <span className="text-xl font-bold text-slate-900">{candidate.matchScore}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      candidate.status === 'selected' ? 'bg-green-100 text-green-700' :
                      candidate.status === 'shortlisted' ? 'bg-blue-100 text-blue-700' :
                      candidate.status === 'rejected' ? 'bg-red-100 text-red-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}
                    </span>
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      );
    }

    // Original scholarship list view
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">Manage Scholarships</h2>
          <Button 
            className="bg-purple-600 hover:bg-purple-700 text-white"
            onClick={() => setShowPostScholarshipForm(true)}
          >
            <FileText className="w-4 h-4 mr-2" />
            Add New Scholarship
          </Button>
        </div>

        <div className="grid gap-6">
          {mockScholarships.map((scholarship) => (
            <Card key={scholarship.id} className="p-8 bg-gradient-to-br from-blue-50 via-white to-blue-50 shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100 bg-[rgba(107,171,246,0.18)]">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-lg">
                      <Award className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900">{scholarship.title}</h3>
                    <span
                      className={`px-4 py-1.5 rounded-full text-xs font-semibold shadow-sm ${
                        scholarship.status === 'active'
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                          : 'bg-gradient-to-r from-slate-400 to-slate-500 text-white'
                      }`}
                    >
                      {scholarship.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
                    <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-blue-100">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="w-4 h-4 text-blue-600" />
                        <p className="text-sm font-medium text-slate-600">Amount</p>
                      </div>
                      <p className="text-lg font-bold text-slate-900">{scholarship.amount}</p>
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-blue-100">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-4 h-4 text-purple-600" />
                        <p className="text-sm font-medium text-slate-600">Duration</p>
                      </div>
                      <p className="text-lg font-bold text-slate-900">{scholarship.duration}</p>
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-blue-100">
                      <div className="flex items-center gap-2 mb-2">
                        <GraduationCap className="w-4 h-4 text-indigo-600" />
                        <p className="text-sm font-medium text-slate-600">Level</p>
                      </div>
                      <p className="text-lg font-bold text-slate-900">{scholarship.level}</p>
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-blue-100">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-orange-600" />
                        <p className="text-sm font-medium text-slate-600">Deadline</p>
                      </div>
                      {editingDeadline === scholarship.id ? (
                        <div className="flex items-center gap-2 mt-1">
                          <Input
                            type="date"
                            value={newDeadline}
                            onChange={(e) => setNewDeadline(e.target.value)}
                            className="h-8 text-xs"
                          />
                          <Button
                            size="sm"
                            onClick={() => handleDeadlineChange(scholarship.id)}
                            className="h-8 px-2 bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingDeadline(null)}
                            className="h-8 px-2"
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <p className="text-lg font-bold text-slate-900">{scholarship.deadline}</p>
                          <button
                            onClick={() => {
                              setEditingDeadline(scholarship.id);
                              setNewDeadline(scholarship.deadline);
                            }}
                            className="text-blue-600 hover:text-blue-700 p-1 hover:bg-blue-50 rounded transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-blue-200 pt-6 mt-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div className="flex items-center gap-8">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <Users className="w-5 h-5 text-slate-600" />
                        <p className="text-3xl font-bold text-slate-900">{scholarship.applicants}</p>
                      </div>
                      <p className="text-sm font-medium text-slate-600">Applicants</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <Star className="w-5 h-5 text-blue-600" />
                        <p className="text-3xl font-bold text-blue-600">{scholarship.shortlisted}</p>
                      </div>
                      <p className="text-sm font-medium text-slate-600">Shortlisted</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <p className="text-3xl font-bold text-green-600">{scholarship.selected}</p>
                      </div>
                      <p className="text-sm font-medium text-slate-600">Selected</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedScholarshipDetail(scholarship.id)}
                      className="flex-1 md:flex-initial bg-white hover:bg-blue-50 border-blue-300 text-blue-700 font-semibold hover:border-blue-400 shadow-sm"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex-1 md:flex-initial bg-white hover:bg-purple-50 border-purple-300 text-purple-700 font-semibold hover:border-purple-400 shadow-sm"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="bg-white hover:bg-red-50 border-red-300 text-red-600 hover:text-red-700 font-semibold hover:border-red-400 shadow-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  const renderCandidates = () => (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Top 10 Candidates</h2>
          <p className="text-sm text-slate-600 mt-1">Showing best matches sorted by compatibility score</p>
        </div>
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:flex-initial">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search candidates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full md:w-64 shadow-md"
            />
          </div>
          <select
            value={selectedScholarship}
            onChange={(e) => setSelectedScholarship(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg text-sm"
          >
            <option value="all">All Scholarships</option>
            {mockScholarships.map((s) => (
              <option key={s.id} value={s.title}>
                {s.title}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg text-sm"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending Review</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="selected">Selected</option>
            <option value="rejected">Rejected</option>
          </select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredCandidates.map((candidate, index) => (
          <Card 
            key={candidate.id} 
            className={`p-6 hover:shadow-lg transition-shadow ${
              candidate.status === 'selected' 
                ? 'bg-gradient-to-br from-green-100 via-green-50 to-white border-green-300' 
                : candidate.status === 'shortlisted' 
                ? 'bg-gradient-to-br from-blue-100 via-blue-50 to-white border-blue-300' 
                : candidate.status === 'rejected'
                ? 'bg-gradient-to-br from-red-100 via-red-50 to-white border-red-300'
                : 'bg-gradient-to-br from-slate-100 via-slate-50 to-white border-slate-300'
            }`}
          >
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Candidate Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className={`p-4 rounded-full ${
                        candidate.status === 'selected' 
                          ? 'bg-gradient-to-br from-green-600 to-emerald-600' 
                          : candidate.status === 'shortlisted' 
                          ? 'bg-gradient-to-br from-blue-600 to-indigo-600' 
                          : candidate.status === 'rejected'
                          ? 'bg-gradient-to-br from-red-600 to-rose-600'
                          : 'bg-gradient-to-br from-slate-600 to-slate-700'
                      }`}>
                        <GraduationCap className="w-6 h-6 text-white" />
                      </div>
                      <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center border-2 border-white">
                        {index + 1}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{candidate.name}</h3>
                      <p className="text-sm text-slate-600">{candidate.scholarship}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    <span className="text-xl font-bold text-slate-900">{candidate.matchScore}%</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-600">Email</p>
                      <p className="text-sm font-medium text-slate-900">{candidate.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-600">Phone</p>
                      <p className="text-sm font-medium text-slate-900">{candidate.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-600">Location</p>
                      <p className="text-sm font-medium text-slate-900">{candidate.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-600">Applied</p>
                      <p className="text-sm font-medium text-slate-900">{candidate.appliedDate}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="bg-blue-50 px-3 py-1 rounded-full">
                    <p className="text-sm font-medium text-blue-700">GPA: {candidate.gpa}</p>
                  </div>
                  <div className="bg-purple-50 px-3 py-1 rounded-full">
                    <p className="text-sm font-medium text-purple-700">
                      A/L: {candidate.alResults}
                    </p>
                  </div>
                  <div className="bg-indigo-50 px-3 py-1 rounded-full">
                    <p className="text-sm font-medium text-indigo-700">{candidate.level}</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2 lg:w-64">
                <Label className="text-sm font-medium text-slate-700">Status</Label>
                <select
                  value={candidate.status}
                  onChange={(e) => handleStatusChange(candidate.id, e.target.value)}
                  className={`px-3 py-2 border rounded-lg text-sm font-medium ${
                    candidate.status === 'selected'
                      ? 'border-green-300 bg-green-50 text-green-700'
                      : candidate.status === 'shortlisted'
                      ? 'border-blue-300 bg-blue-50 text-blue-700'
                      : candidate.status === 'rejected'
                      ? 'border-red-300 bg-red-50 text-red-700'
                      : 'border-slate-300 bg-white text-slate-700'
                  }`}
                >
                  <option value="pending">Pending Review</option>
                  <option value="shortlisted">Shortlisted</option>
                  <option value="selected">Selected</option>
                  <option value="rejected">Rejected</option>
                </select>

                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => setSelectedCandidateProfile(candidate.id)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Full Profile
                </Button>

                {candidate.status === 'selected' && (
                  <Button
                    size="sm"
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => handleAnnouncement(candidate.id)}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send Announcement
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Analytics & Insights</h2>
        <select
          value={timePeriod}
          onChange={(e) => setTimePeriod(e.target.value)}
          className="px-4 py-2 border border-slate-300 rounded-lg text-sm"
        >
          <option value="7">Last 7 Days</option>
          <option value="30">Last 30 Days</option>
          <option value="90">Last 3 Months</option>
          <option value="180">Last 6 Months</option>
          <option value="365">Last Year</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900">Application Rate</h3>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-slate-900 mb-2">+24%</p>
          <p className="text-sm text-slate-600">Compared to previous period</p>
          <div className="mt-4 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 rounded-full" style={{ width: '75%' }}></div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900">Average Match Score</h3>
            <BarChart3 className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-slate-900 mb-2">87.5%</p>
          <p className="text-sm text-slate-600">Quality of applicants</p>
          <div className="mt-4 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full" style={{ width: '87.5%' }}></div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900">Selection Rate</h3>
            <Award className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-3xl font-bold text-slate-900 mb-2">3.4%</p>
          <p className="text-sm text-slate-600">Candidates selected</p>
          <div className="mt-4 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-purple-500 rounded-full" style={{ width: '34%' }}></div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="font-semibold text-slate-900 mb-4">Applications Over Time</h3>
        <div className="h-64 flex items-end justify-between gap-2">
          {[45, 62, 58, 73, 85, 92, 78, 95, 110, 98, 115, 103].map((value, index) => (
            <div key={index} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg transition-all hover:from-blue-700 hover:to-blue-500" style={{ height: `${(value / 120) * 100}%` }}></div>
              <p className="text-xs text-slate-600">
                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][index]}
              </p>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Top Performing Scholarships</h3>
          <div className="space-y-3">
            {mockScholarships.map((scholarship, index) => (
              <div key={scholarship.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 text-sm">{scholarship.title}</p>
                    <p className="text-xs text-slate-600">{scholarship.applicants} applications</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-900">{scholarship.shortlisted}</p>
                  <p className="text-xs text-slate-600">shortlisted</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Candidate Distribution</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-slate-600">Pending Review</p>
                <p className="text-sm font-semibold text-slate-900">365 (81.5%)</p>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-slate-500 rounded-full" style={{ width: '81.5%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-slate-600">Shortlisted</p>
                <p className="text-sm font-semibold text-slate-900">68 (15.2%)</p>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '15.2%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-slate-600">Selected</p>
                <p className="text-sm font-semibold text-slate-900">15 (3.3%)</p>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: '3.3%' }}></div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderAnnouncements = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Announcements</h2>
        <Button className="bg-purple-600 hover:bg-purple-700 text-white">
          <Send className="w-4 h-4 mr-2" />
          Create Announcement
        </Button>
      </div>

      <Card className="p-6">
        <h3 className="font-semibold text-slate-900 mb-4">Selected Candidates</h3>
        <div className="space-y-4">
          {filteredCandidates
            .filter((c) => c.status === 'selected')
            .map((candidate) => (
              <div
                key={candidate.id}
                className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-green-600 p-3 rounded-full">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">{candidate.name}</h4>
                    <p className="text-sm text-slate-600">{candidate.scholarship}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => handleAnnouncement(candidate.id)}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send Selection Email
                  </Button>
                </div>
              </div>
            ))}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold text-slate-900 mb-4">Bulk Announcements</h3>
        <div className="space-y-4">
          <div>
            <Label>Recipient Group</Label>
            <select className="w-full mt-2 px-4 py-2 border border-slate-300 rounded-lg">
              <option>All Applicants</option>
              <option>Shortlisted Candidates</option>
              <option>Selected Candidates</option>
              <option>Rejected Candidates</option>
            </select>
          </div>
          <div>
            <Label>Scholarship</Label>
            <select className="w-full mt-2 px-4 py-2 border border-slate-300 rounded-lg">
              <option>All Scholarships</option>
              {mockScholarships.map((s) => (
                <option key={s.id}>{s.title}</option>
              ))}
            </select>
          </div>
          <div>
            <Label>Message Template</Label>
            <select className="w-full mt-2 px-4 py-2 border border-slate-300 rounded-lg">
              <option>Selection Announcement</option>
              <option>Shortlist Notification</option>
              <option>Application Received</option>
              <option>Deadline Reminder</option>
              <option>Custom Message</option>
            </select>
          </div>
          <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
            <Send className="w-4 h-4 mr-2" />
            Send Bulk Announcement
          </Button>
        </div>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-br from-purple-600 to-indigo-600 p-3 rounded-xl">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Institution Dashboard</h1>
              <p className="text-slate-600">University of Colombo</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8 border-b border-slate-200">
          <div className="flex gap-6 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'scholarships', label: 'Scholarships', icon: FileText },
              { id: 'candidates', label: 'Candidates', icon: Users },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp },
              { id: 'announcements', label: 'Announcements', icon: Send },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-purple-600 text-purple-600 font-medium'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'scholarships' && renderScholarships()}
        {activeTab === 'candidates' && renderCandidates()}
        {activeTab === 'analytics' && renderAnalytics()}
        {activeTab === 'announcements' && renderAnnouncements()}
      </div>

      {/* Post Scholarship Form Modal */}
      {showPostScholarshipForm && (
        <PostScholarshipForm 
          onClose={() => setShowPostScholarshipForm(false)}
          institutionName="University of Colombo"
        />
      )}

      {/* Candidate Profile Modal */}
      {selectedCandidateProfile && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-indigo-600 p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
                    <GraduationCap className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {mockCandidates.find(c => c.id === selectedCandidateProfile)?.name}
                    </h2>
                    <p className="text-purple-100">Full Candidate Profile</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedCandidateProfile(null)}
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <XCircle className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div className="p-8 space-y-6">
              {(() => {
                const candidate = mockCandidates.find(c => c.id === selectedCandidateProfile);
                if (!candidate) return null;

                return (
                  <>
                    {/* Match Score Banner */}
                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-xl p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-yellow-800 mb-1">Match Score</p>
                          <div className="flex items-center gap-2">
                            <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                            <span className="text-4xl font-bold text-yellow-900">{candidate.matchScore}%</span>
                          </div>
                        </div>
                        <div className={`px-4 py-2 rounded-full font-semibold ${
                          candidate.status === 'selected' ? 'bg-green-100 text-green-700' :
                          candidate.status === 'shortlisted' ? 'bg-blue-100 text-blue-700' :
                          candidate.status === 'rejected' ? 'bg-red-100 text-red-700' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}
                        </div>
                      </div>
                    </div>

                    {/* Personal Information */}
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-4">Personal Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-slate-50 p-4 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Mail className="w-4 h-4 text-slate-600" />
                            <p className="text-sm font-medium text-slate-600">Email</p>
                          </div>
                          <p className="text-base font-semibold text-slate-900">{candidate.email}</p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Phone className="w-4 h-4 text-slate-600" />
                            <p className="text-sm font-medium text-slate-600">Phone</p>
                          </div>
                          <p className="text-base font-semibold text-slate-900">{candidate.phone}</p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <MapPin className="w-4 h-4 text-slate-600" />
                            <p className="text-sm font-medium text-slate-600">Location</p>
                          </div>
                          <p className="text-base font-semibold text-slate-900">{candidate.location}</p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Calendar className="w-4 h-4 text-slate-600" />
                            <p className="text-sm font-medium text-slate-600">Applied Date</p>
                          </div>
                          <p className="text-base font-semibold text-slate-900">{candidate.appliedDate}</p>
                        </div>
                      </div>
                    </div>

                    {/* Academic Information */}
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-4">Academic Qualifications</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                          <p className="text-sm font-medium text-blue-700 mb-2">GPA</p>
                          <p className="text-3xl font-bold text-blue-900">{candidate.gpa}</p>
                        </div>
                        <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
                          <p className="text-sm font-medium text-purple-700 mb-2">A/L Results</p>
                          <p className="text-3xl font-bold text-purple-900">{candidate.alResults}</p>
                        </div>
                        <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-lg">
                          <p className="text-sm font-medium text-indigo-700 mb-2">Level</p>
                          <p className="text-3xl font-bold text-indigo-900">{candidate.level}</p>
                        </div>
                      </div>
                    </div>

                    {/* Scholarship Application */}
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-4">Scholarship Application</h3>
                      <div className="bg-purple-50 border border-purple-200 p-6 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Award className="w-6 h-6 text-purple-600" />
                          <div>
                            <p className="text-sm font-medium text-purple-700">Applied For</p>
                            <p className="text-lg font-bold text-purple-900">{candidate.scholarship}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4 border-t border-slate-200">
                      <Button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white">
                        <Download className="w-4 h-4 mr-2" />
                        Download Full Application
                      </Button>
                      {candidate.status === 'selected' && (
                        <Button 
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => handleAnnouncement(candidate.id)}
                        >
                          <Send className="w-4 h-4 mr-2" />
                          Send Selection Email
                        </Button>
                      )}
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}