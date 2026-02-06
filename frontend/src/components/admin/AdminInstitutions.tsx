import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { 
  Search, 
  Filter, 
  Eye,
  CheckCircle,
  XCircle,
  Building2,
  Mail,
  Phone,
  Globe,
  MapPin,
  Calendar,
  User,
  X
} from 'lucide-react';

interface Institution {
  id: number;
  name: string;
  type: string;
  country: string;
  city: string;
  website: string;
  email: string;
  phone: string;
  contactPerson: string;
  submittedDate: string;
  status: 'pending' | 'approved' | 'rejected';
  scholarships: number;
}

export function AdminInstitutions() {
  const [institutions] = useState<Institution[]>([
    {
      id: 1,
      name: 'University of Colombo Foundation',
      type: 'Foundation',
      country: 'Sri Lanka',
      city: 'Colombo',
      website: 'https://ucf.lk',
      email: 'info@ucf.lk',
      phone: '+94 11 2345678',
      contactPerson: 'Dr. Saman Perera',
      submittedDate: '2026-01-15',
      status: 'pending',
      scholarships: 3,
    },
    {
      id: 2,
      name: 'Sri Lanka Education Trust',
      type: 'NGO',
      country: 'Sri Lanka',
      city: 'Kandy',
      website: 'https://slet.lk',
      email: 'contact@slet.lk',
      phone: '+94 81 2234567',
      contactPerson: 'Ms. Nimal Fernando',
      submittedDate: '2026-01-14',
      status: 'pending',
      scholarships: 5,
    },
    {
      id: 3,
      name: 'National Development Bank',
      type: 'Private Organization',
      country: 'Sri Lanka',
      city: 'Colombo',
      website: 'https://ndb.lk',
      email: 'scholarships@ndb.lk',
      phone: '+94 11 2445566',
      contactPerson: 'Mr. Kamal Silva',
      submittedDate: '2026-01-13',
      status: 'approved',
      scholarships: 2,
    },
    {
      id: 4,
      name: 'ABC Foundation',
      type: 'Foundation',
      country: 'Sri Lanka',
      city: 'Galle',
      website: 'https://abc.lk',
      email: 'info@abc.lk',
      phone: '+94 91 2223344',
      contactPerson: 'Dr. Anura Gunawardena',
      submittedDate: '2026-01-10',
      status: 'approved',
      scholarships: 4,
    },
  ]);

  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInstitution, setSelectedInstitution] = useState<Institution | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const filteredInstitutions = institutions.filter((inst) => {
    const matchesStatus = filterStatus === 'all' || inst.status === filterStatus;
    const matchesSearch =
      inst.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inst.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inst.city.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleApprove = (institution: Institution) => {
    alert(`Institution "${institution.name}" approved successfully!`);
    setSelectedInstitution(null);
  };

  const handleReject = (institution: Institution) => {
    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection.');
      return;
    }
    alert(`Institution "${institution.name}" rejected. Reason: ${rejectionReason}`);
    setSelectedInstitution(null);
    setRejectionReason('');
  };

  const statusCounts = {
    all: institutions.length,
    pending: institutions.filter((i) => i.status === 'pending').length,
    approved: institutions.filter((i) => i.status === 'approved').length,
    rejected: institutions.filter((i) => i.status === 'rejected').length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-1">Institution Management</h2>
        <p className="text-slate-600">Review and manage institution registrations</p>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
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
            placeholder="Search institutions by name, type, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 border-none shadow-none focus-visible:ring-0"
          />
        </div>
      </Card>

      {/* Institutions List */}
      <div className="space-y-4">
        {filteredInstitutions.map((institution) => (
          <Card key={institution.id} className="p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Building2 className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-900">{institution.name}</h3>
                    <div className="flex flex-wrap items-center gap-3 mt-2">
                      <Badge variant="secondary">{institution.type}</Badge>
                      <Badge
                        className={
                          institution.status === 'approved'
                            ? 'bg-green-100 text-green-700'
                            : institution.status === 'pending'
                            ? 'bg-orange-100 text-orange-700'
                            : 'bg-red-100 text-red-700'
                        }
                      >
                        {institution.status.toUpperCase()}
                      </Badge>
                      <span className="text-sm text-slate-600">
                        {institution.scholarships} scholarship{institution.scholarships !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 mt-4 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>
                          {institution.city}, {institution.country}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <span>{institution.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <span>{institution.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>{institution.contactPerson}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Submitted: {new Date(institution.submittedDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        <a
                          href={institution.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Visit Website
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedInstitution(institution)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Review
                </Button>
              </div>
            </div>
          </Card>
        ))}

        {filteredInstitutions.length === 0 && (
          <Card className="p-12 text-center">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-slate-900 mb-1">No Institutions Found</h3>
            <p className="text-slate-600">Try adjusting your filters or search query</p>
          </Card>
        )}
      </div>

      {/* Review Modal */}
      {selectedInstitution && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">Review Institution</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedInstitution(null);
                  setRejectionReason('');
                }}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="p-6 space-y-6">
              {/* Institution Details */}
              <div>
                <h4 className="font-semibold text-slate-900 mb-3">Institution Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg">
                  <div>
                    <Label className="text-slate-600">Institution Name</Label>
                    <p className="font-medium text-slate-900">{selectedInstitution.name}</p>
                  </div>
                  <div>
                    <Label className="text-slate-600">Type</Label>
                    <p className="font-medium text-slate-900">{selectedInstitution.type}</p>
                  </div>
                  <div>
                    <Label className="text-slate-600">Location</Label>
                    <p className="font-medium text-slate-900">
                      {selectedInstitution.city}, {selectedInstitution.country}
                    </p>
                  </div>
                  <div>
                    <Label className="text-slate-600">Contact Person</Label>
                    <p className="font-medium text-slate-900">{selectedInstitution.contactPerson}</p>
                  </div>
                  <div>
                    <Label className="text-slate-600">Email</Label>
                    <p className="font-medium text-slate-900">{selectedInstitution.email}</p>
                  </div>
                  <div>
                    <Label className="text-slate-600">Phone</Label>
                    <p className="font-medium text-slate-900">{selectedInstitution.phone}</p>
                  </div>
                  <div className="md:col-span-2">
                    <Label className="text-slate-600">Website</Label>
                    <a
                      href={selectedInstitution.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-blue-600 hover:underline"
                    >
                      {selectedInstitution.website}
                    </a>
                  </div>
                </div>
              </div>

              {/* Scholarships Summary */}
              <div>
                <h4 className="font-semibold text-slate-900 mb-3">Scholarships</h4>
                <Card className="p-4 bg-blue-50 border-blue-200">
                  <p className="text-slate-700">
                    This institution has submitted <strong>{selectedInstitution.scholarships}</strong> scholarship
                    program{selectedInstitution.scholarships !== 1 ? 's' : ''} for review.
                  </p>
                </Card>
              </div>

              {/* Rejection Reason (if rejecting) */}
              {selectedInstitution.status === 'pending' && (
                <div>
                  <Label htmlFor="rejectionReason">Rejection Reason (if applicable)</Label>
                  <Textarea
                    id="rejectionReason"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Provide a clear reason for rejection..."
                    rows={4}
                    className="mt-2"
                  />
                </div>
              )}

              {/* Action Buttons */}
              {selectedInstitution.status === 'pending' && (
                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    onClick={() => handleApprove(selectedInstitution)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve Institution
                  </Button>
                  <Button
                    onClick={() => handleReject(selectedInstitution)}
                    variant="outline"
                    className="flex-1 border-red-600 text-red-600 hover:bg-red-50"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject Institution
                  </Button>
                </div>
              )}

              {selectedInstitution.status !== 'pending' && (
                <div className="bg-slate-100 p-4 rounded-lg text-center">
                  <p className="text-slate-700">
                    This institution has already been{' '}
                    <strong className={selectedInstitution.status === 'approved' ? 'text-green-600' : 'text-red-600'}>
                      {selectedInstitution.status}
                    </strong>
                    .
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
