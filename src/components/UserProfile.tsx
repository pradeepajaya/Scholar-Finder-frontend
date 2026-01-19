import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  User,
  GraduationCap,
  MapPin,
  Mail,
  Phone,
  Edit,
  FileText,
  Bookmark,
  CheckCircle2,
  Clock,
  Award,
} from 'lucide-react';

export function UserProfile() {
  const profileCompletion = 85;

  const savedScholarships = [
    {
      id: 1,
      name: 'Commonwealth Master\'s Scholarship',
      deadline: '2026-03-31',
      status: 'saved',
    },
    {
      id: 2,
      name: 'Australia Awards Scholarship',
      deadline: '2026-04-30',
      status: 'saved',
    },
  ];

  const appliedScholarships = [
    {
      id: 1,
      name: 'Fulbright Scholarship',
      appliedDate: '2026-01-10',
      status: 'under-review',
    },
    {
      id: 2,
      name: 'DAAD Master\'s Scholarship',
      appliedDate: '2026-01-05',
      status: 'submitted',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">My Profile</h1>
        <p className="text-slate-600">Manage your information and track your scholarship applications</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Sidebar */}
        <div className="space-y-6">
          <Card className="p-6">
            <div className="text-center mb-4">
              <Avatar className="w-24 h-24 mx-auto mb-4">
                <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200" />
                <AvatarFallback>SP</AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-bold text-slate-900">Saman Perera</h2>
              <p className="text-sm text-slate-600">saman.perera@email.com</p>
              <Button variant="outline" size="sm" className="mt-3">
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </div>

            <div className="space-y-3 pt-4 border-t">
              <div className="flex items-center gap-3 text-sm">
                <GraduationCap className="w-4 h-4 text-slate-400" />
                <span className="text-slate-700">A/L - Science Stream</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span className="text-slate-700">Colombo, Sri Lanka</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-slate-400" />
                <span className="text-slate-700">saman.perera@email.com</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-slate-400" />
                <span className="text-slate-700">+94 77 123 4567</span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Profile Completion</h3>
            <Progress value={profileCompletion} className="h-2 mb-2" />
            <p className="text-sm text-slate-600 mb-4">{profileCompletion}% complete</p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span className="text-slate-700">Personal Information</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span className="text-slate-700">Academic Qualifications</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span className="text-slate-700">English Proficiency</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-500" />
                <span className="text-slate-700">Upload Documents</span>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-4" size="sm">
              Complete Profile
            </Button>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Award className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-slate-900">Scholarship Matches</h3>
            </div>
            <p className="text-3xl font-bold text-blue-600 mb-1">12</p>
            <p className="text-sm text-slate-600">scholarships match your profile</p>
            <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white" size="sm">
              View Matches
            </Button>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="saved">Saved</TabsTrigger>
              <TabsTrigger value="applied">Applied</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <Card className="p-6">
                <h3 className="text-xl font-semibold text-slate-900 mb-4">Academic Profile</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Current Status</p>
                    <p className="font-medium text-slate-900">A/L Student</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Intended Level</p>
                    <p className="font-medium text-slate-900">Bachelor's Degree</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Stream</p>
                    <p className="font-medium text-slate-900">Science</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Z-Score</p>
                    <p className="font-medium text-slate-900">1.8523</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">A/L Subjects</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      <Badge variant="secondary">Physics (A)</Badge>
                      <Badge variant="secondary">Chemistry (A)</Badge>
                      <Badge variant="secondary">Biology (B)</Badge>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">English Proficiency</p>
                    <p className="font-medium text-slate-900">IELTS 7.5</p>
                  </div>
                </div>
                <Button variant="outline" className="mt-4">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Academic Info
                </Button>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-semibold text-slate-900 mb-4">Preferences</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-slate-500 mb-2">Preferred Countries</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge>USA</Badge>
                      <Badge>UK</Badge>
                      <Badge>Australia</Badge>
                      <Badge>Canada</Badge>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-2">Fields of Interest</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge>Engineering</Badge>
                      <Badge>Computer Science</Badge>
                      <Badge>Medicine</Badge>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-2">Scholarship Type</p>
                    <Badge>Fully Funded</Badge>
                  </div>
                </div>
                <Button variant="outline" className="mt-4">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Preferences
                </Button>
              </Card>
            </TabsContent>

            <TabsContent value="saved">
              <Card className="p-6">
                <h3 className="text-xl font-semibold text-slate-900 mb-4">
                  Saved Scholarships ({savedScholarships.length})
                </h3>
                <div className="space-y-4">
                  {savedScholarships.map((scholarship) => (
                    <div
                      key={scholarship.id}
                      className="p-4 border border-slate-200 rounded-lg hover:border-blue-300 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-900 mb-1">
                            {scholarship.name}
                          </h4>
                          <p className="text-sm text-slate-600">
                            Deadline: {new Date(scholarship.deadline).toLocaleDateString('en-GB')}
                          </p>
                        </div>
                        <Bookmark className="w-5 h-5 text-blue-600 fill-blue-600" />
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                          Apply Now
                        </Button>
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="applied">
              <Card className="p-6">
                <h3 className="text-xl font-semibold text-slate-900 mb-4">
                  Applied Scholarships ({appliedScholarships.length})
                </h3>
                <div className="space-y-4">
                  {appliedScholarships.map((scholarship) => (
                    <div
                      key={scholarship.id}
                      className="p-4 border border-slate-200 rounded-lg"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-slate-900">
                          {scholarship.name}
                        </h4>
                        <Badge
                          className={
                            scholarship.status === 'under-review'
                              ? 'bg-orange-100 text-orange-700'
                              : 'bg-blue-100 text-blue-700'
                          }
                        >
                          {scholarship.status === 'under-review' ? 'Under Review' : 'Submitted'}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600 mb-3">
                        Applied on: {new Date(scholarship.appliedDate).toLocaleDateString('en-GB')}
                      </p>
                      <Button size="sm" variant="outline">
                        Track Application
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="documents">
              <Card className="p-6">
                <h3 className="text-xl font-semibold text-slate-900 mb-4">My Documents</h3>
                <div className="space-y-3">
                  {[
                    { name: 'O/L Certificate', status: 'uploaded' },
                    { name: 'A/L Certificate', status: 'uploaded' },
                    { name: 'NIC Copy', status: 'uploaded' },
                    { name: 'IELTS Certificate', status: 'uploaded' },
                    { name: 'CV / Resume', status: 'pending' },
                    { name: 'Personal Statement', status: 'pending' },
                  ].map((doc, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border border-slate-200 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-slate-400" />
                        <span className="text-sm font-medium text-slate-900">{doc.name}</span>
                      </div>
                      {doc.status === 'uploaded' ? (
                        <Badge className="bg-green-100 text-green-700">Uploaded</Badge>
                      ) : (
                        <Button size="sm" variant="outline">
                          Upload
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
