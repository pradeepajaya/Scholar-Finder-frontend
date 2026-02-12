import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { 
  Search, 
  Users,
  Eye,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Calendar,
  Download
} from 'lucide-react';

interface Student {
  id: number;
  name: string;
  email: string;
  phone: string;
  city: string;
  district: string;
  olResults: string;
  alResults: string;
  currentLevel: string;
  gpa: string;
  registeredDate: string;
  applications: number;
}

export function AdminStudents() {
  const [students] = useState<Student[]>([
    {
      id: 1,
      name: 'Saman Kumara',
      email: 'saman.k@email.com',
      phone: '+94 77 1234567',
      city: 'Colombo',
      district: 'Colombo',
      olResults: '9 passes',
      alResults: '3 A passes',
      currentLevel: "Bachelor's",
      gpa: '3.8',
      registeredDate: '2026-01-10',
      applications: 5,
    },
    {
      id: 2,
      name: 'Nimal Fernando',
      email: 'nimal.f@email.com',
      phone: '+94 71 2345678',
      city: 'Kandy',
      district: 'Kandy',
      olResults: '8 passes',
      alResults: '2 A, 1 B',
      currentLevel: "Master's",
      gpa: '3.5',
      registeredDate: '2026-01-08',
      applications: 3,
    },
    {
      id: 3,
      name: 'Amaya Silva',
      email: 'amaya.s@email.com',
      phone: '+94 76 3456789',
      city: 'Galle',
      district: 'Galle',
      olResults: '9 passes',
      alResults: '3 A passes',
      currentLevel: 'PhD',
      gpa: '3.9',
      registeredDate: '2026-01-05',
      applications: 7,
    },
    {
      id: 4,
      name: 'Kamal Perera',
      email: 'kamal.p@email.com',
      phone: '+94 70 4567890',
      city: 'Jaffna',
      district: 'Jaffna',
      olResults: '8 passes',
      alResults: '1 A, 2 B',
      currentLevel: "Bachelor's",
      gpa: '3.2',
      registeredDate: '2026-01-03',
      applications: 2,
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-1">Student Management</h2>
          <p className="text-slate-600">View and manage registered students</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Download className="w-4 h-4 mr-2" />
          Export Data
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{students.length}</p>
              <p className="text-sm text-slate-600">Total Students</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-3 rounded-lg">
              <GraduationCap className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {students.filter((s) => s.currentLevel === "Bachelor's").length}
              </p>
              <p className="text-sm text-slate-600">Undergraduates</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 p-3 rounded-lg">
              <GraduationCap className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {students.filter((s) => s.currentLevel === "Master's").length}
              </p>
              <p className="text-sm text-slate-600">Masters</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="bg-orange-100 p-3 rounded-lg">
              <GraduationCap className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {students.filter((s) => s.currentLevel === 'PhD').length}
              </p>
              <p className="text-sm text-slate-600">PhD</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search Bar */}
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400" />
          <Input
            placeholder="Search students by name, email, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 border-none shadow-none focus-visible:ring-0"
          />
        </div>
      </Card>

      {/* Students Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Student</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Contact</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Location</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Academic</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Applications</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-slate-900">{student.name}</p>
                      <p className="text-sm text-slate-600">
                        Registered: {new Date(student.registeredDate).toLocaleDateString()}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Mail className="w-4 h-4" />
                        <span>{student.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
                        <Phone className="w-4 h-4" />
                        <span>{student.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <MapPin className="w-4 h-4" />
                      <span>
                        {student.city}, {student.district}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <Badge variant="secondary">{student.currentLevel}</Badge>
                      <p className="text-sm text-slate-600">GPA: {student.gpa}</p>
                      <p className="text-xs text-slate-500">O/L: {student.olResults}</p>
                      <p className="text-xs text-slate-500">A/L: {student.alResults}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-semibold text-sm">
                      {student.applications}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {filteredStudents.length === 0 && (
        <Card className="p-12 text-center">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-slate-900 mb-1">No Students Found</h3>
          <p className="text-slate-600">Try adjusting your search query</p>
        </Card>
      )}
    </div>
  );
}
