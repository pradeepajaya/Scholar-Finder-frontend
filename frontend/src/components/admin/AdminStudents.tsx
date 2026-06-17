import { useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  AlertCircle,
  Calendar,
  Download,
  Eye,
  FileText,
  GraduationCap,
  Loader2,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  Search,
  Users,
} from 'lucide-react';

import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Input } from '../ui/input';
import {
  scholarshipApi,
  type StudentApplicationResponse,
  type StudentProfileResponse,
} from '../../services/api';

const formatDate = (value?: string) => {
  if (!value) return 'Not recorded';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString();
};

const firstText = (...values: Array<string | undefined | null>) =>
  values.find((value) => value && value.trim())?.trim() ?? 'Not specified';

const detailText = (value?: string | number | null) => {
  if (value === undefined || value === null) return 'Not specified';
  const text = String(value).trim();
  return text || 'Not specified';
};

const arrayText = (values?: string[]) =>
  values?.length ? values.join(', ') : 'Not specified';

const formatLevel = (student: StudentProfileResponse) =>
  firstText(student.intendedLevel, student.highestEducation, student.currentStatus);

const formatOlResults = (student: StudentProfileResponse) => {
  if (student.olPassed != null) return `${student.olPassed} passes`;
  const counts = [
    student.olACount != null ? `${student.olACount} A` : '',
    student.olBCount != null ? `${student.olBCount} B` : '',
    student.olCCount != null ? `${student.olCCount} C` : '',
  ].filter(Boolean);
  return counts.length ? counts.join(', ') : 'Not recorded';
};

const formatAlResults = (student: StudentProfileResponse) => {
  const grades = [
    student.grade1 ? `${student.subject1 || 'Subject 1'}: ${student.grade1}` : '',
    student.grade2 ? `${student.subject2 || 'Subject 2'}: ${student.grade2}` : '',
    student.grade3 ? `${student.subject3 || 'Subject 3'}: ${student.grade3}` : '',
  ].filter(Boolean);
  return grades.length ? grades.join(', ') : 'Not recorded';
};

const isLevel = (student: StudentProfileResponse, patterns: string[]) => {
  const level = formatLevel(student).toLowerCase();
  return patterns.some((pattern) => level.includes(pattern));
};

const statusClass = (status?: string) => {
  switch ((status ?? '').toUpperCase()) {
    case 'ACCEPTED':
    case 'SELECTED':
      return 'bg-green-100 text-green-700';
    case 'SHORTLISTED':
    case 'UNDER_REVIEW':
      return 'bg-blue-100 text-blue-700';
    case 'REJECTED':
      return 'bg-red-100 text-red-700';
    case 'WITHDRAWN':
      return 'bg-slate-100 text-slate-700';
    default:
      return 'bg-amber-100 text-amber-700';
  }
};

function DetailItem({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 break-words text-sm font-medium text-slate-900">{detailText(value)}</p>
    </div>
  );
}

function DetailSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-lg border border-slate-200 p-4">
      <h3 className="mb-4 font-semibold text-slate-900">{title}</h3>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
    </section>
  );
}

export function AdminStudents() {
  const [students, setStudents] = useState<StudentProfileResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<StudentProfileResponse | null>(null);
  const [applications, setApplications] = useState<StudentApplicationResponse[]>([]);
  const [isApplicationsLoading, setIsApplicationsLoading] = useState(false);
  const [applicationsError, setApplicationsError] = useState('');

  useEffect(() => {
    void loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await scholarshipApi.getAllStudentProfiles();
      setStudents(response.data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load students');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredStudents = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return students;

    return students.filter((student) =>
      [
        student.fullName,
        student.email,
        student.mobile,
        student.city,
        student.district,
        student.province,
        formatLevel(student),
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query)),
    );
  }, [searchQuery, students]);

  const openApplications = async (student: StudentProfileResponse) => {
    setSelectedStudent(student);
    setApplications([]);
    setApplicationsError('');

    try {
      setIsApplicationsLoading(true);
      const response = await scholarshipApi.getStudentApplications(student.userId);
      setApplications(response.data ?? []);
    } catch (err) {
      setApplicationsError(
        err instanceof Error ? err.message : 'Failed to load candidate applications',
      );
    } finally {
      setIsApplicationsLoading(false);
    }
  };

  const exportData = () => {
    const header = ['Student ID', 'Name', 'Email', 'Phone', 'Location', 'Level', 'GPA', 'Applications'];
    const rows = students.map((student) => [
      student.userId,
      student.fullName,
      student.email ?? '',
      student.mobile ?? '',
      [student.city, student.district].filter(Boolean).join(', '),
      formatLevel(student),
      student.calculatedGpa ?? '',
      student.applicationCount ?? 0,
    ]);

    const csv = [header, ...rows]
      .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'student-management-export.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const applicationCount = students.reduce(
    (total, student) => total + (student.applicationCount ?? 0),
    0,
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-1">Student Management</h2>
          <p className="text-slate-600">View registered students and candidate applications</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadStudents} disabled={isLoading}>
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            Refresh
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={exportData}
            disabled={!students.length}
          >
            <Download className="w-4 h-4" />
            Export Data
          </Button>
        </div>
      </div>

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
                {students.filter((student) => isLevel(student, ['undergraduate', 'bachelor'])).length}
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
                {students.filter((student) => isLevel(student, ['postgraduate', 'master'])).length}
              </p>
              <p className="text-sm text-slate-600">Postgraduates</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="bg-amber-100 p-3 rounded-lg">
              <FileText className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{applicationCount}</p>
              <p className="text-sm text-slate-600">Applications</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-4">
        <div className="flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400" />
          <Input
            placeholder="Search students by name, email, phone, level, or location"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="flex-1 border-none shadow-none focus-visible:ring-0"
          />
        </div>
      </Card>

      {error && (
        <Card className="border-red-200 bg-red-50 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-2 text-sm text-red-700">
              <AlertCircle className="mt-0.5 w-4 h-4" />
              <p>{error}</p>
            </div>
            <Button variant="outline" onClick={loadStudents}>
              Retry
            </Button>
          </div>
        </Card>
      )}

      {isLoading ? (
        <Card className="p-12 text-center">
          <Loader2 className="w-10 h-10 text-blue-600 mx-auto mb-3 animate-spin" />
          <h3 className="text-lg font-semibold text-slate-900">Loading students</h3>
        </Card>
      ) : (
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
                  <tr key={student.userId} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-slate-900">{student.fullName}</p>
                        <p className="text-sm text-slate-600">ID: {student.userId}</p>
                        <p className="text-xs text-slate-500">
                          Registered: {formatDate(student.createdAt)}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Mail className="w-4 h-4" />
                          <span className="break-all">{student.email || 'No email'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <Phone className="w-4 h-4" />
                          <span>{student.mobile || 'No phone'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <MapPin className="w-4 h-4" />
                        <span>{firstText([student.city, student.district].filter(Boolean).join(', '))}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <Badge variant="secondary">{formatLevel(student)}</Badge>
                        <p className="text-sm text-slate-600">
                          GPA: {student.calculatedGpa ?? 'Not recorded'}
                        </p>
                        <p className="text-xs text-slate-500">O/L: {formatOlResults(student)}</p>
                        <p className="text-xs text-slate-500">A/L: {formatAlResults(student)}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-semibold text-sm">
                        {student.applicationCount ?? 0}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Button variant="ghost" size="sm" onClick={() => void openApplications(student)}>
                        <Eye className="w-4 h-4" />
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {!isLoading && filteredStudents.length === 0 && (
        <Card className="p-12 text-center">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-slate-900 mb-1">No students found</h3>
          <p className="text-slate-600">Try adjusting your search query</p>
        </Card>
      )}

      <Dialog
        open={Boolean(selectedStudent)}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedStudent(null);
            setApplications([]);
            setApplicationsError('');
          }
        }}
      >
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Applicant details</DialogTitle>
            <DialogDescription>
              {selectedStudent
                ? `Registration profile and submitted applications for ${selectedStudent.fullName}.`
                : 'Select a student to view applicant details.'}
            </DialogDescription>
          </DialogHeader>

          {selectedStudent && (
            <div className="space-y-5">
              <div className="grid gap-3 rounded-lg border bg-slate-50 p-4 text-sm sm:grid-cols-3">
                <div>
                  <p className="font-medium text-slate-900">Candidate</p>
                  <p className="text-slate-600">{selectedStudent.fullName}</p>
                </div>
                <div>
                  <p className="font-medium text-slate-900">Contact</p>
                  <p className="text-slate-600 break-all">{selectedStudent.email || 'No email'}</p>
                </div>
                <div>
                  <p className="font-medium text-slate-900">Academic level</p>
                  <p className="text-slate-600">{formatLevel(selectedStudent)}</p>
                </div>
              </div>

              <DetailSection title="Personal information">
                <DetailItem label="Full name" value={selectedStudent.fullName} />
                <DetailItem label="Student ID" value={selectedStudent.userId} />
                <DetailItem label="Email" value={selectedStudent.email} />
                <DetailItem label="Mobile" value={selectedStudent.mobile} />
                <DetailItem label="Date of birth" value={formatDate(selectedStudent.dateOfBirth)} />
                <DetailItem label="Age" value={selectedStudent.age} />
                <DetailItem label="Gender" value={selectedStudent.gender} />
                <DetailItem label="Nationality" value={selectedStudent.nationality} />
                <DetailItem label="NIC / Passport" value={selectedStudent.nicPassport} />
                <DetailItem label="City" value={selectedStudent.city} />
                <DetailItem label="District" value={selectedStudent.district} />
                <DetailItem label="Province" value={selectedStudent.province} />
                <DetailItem label="Preferred language" value={selectedStudent.preferredLanguage} />
                <DetailItem label="Profile completion" value={`${selectedStudent.profileCompletionPercentage ?? 0}%`} />
              </DetailSection>

              <DetailSection title="Education plan">
                <DetailItem label="Highest education" value={selectedStudent.highestEducation} />
                <DetailItem label="Current status" value={selectedStudent.currentStatus} />
                <DetailItem label="Intended level" value={selectedStudent.intendedLevel} />
                <DetailItem label="Intended year" value={selectedStudent.intendedYear} />
                <DetailItem label="Preferred mode" value={selectedStudent.preferredMode} />
                <DetailItem label="Preferred location" value={selectedStudent.preferredLocation} />
                <DetailItem label="Scholarship type" value={selectedStudent.scholarshipType} />
                <DetailItem label="Willing to return" value={selectedStudent.willingToReturn} />
              </DetailSection>

              <DetailSection title="O/L results">
                <DetailItem label="Year" value={selectedStudent.olYear} />
                <DetailItem label="Type" value={selectedStudent.olType} />
                <DetailItem label="Medium" value={selectedStudent.olMedium} />
                <DetailItem label="Passed subjects" value={selectedStudent.olPassed} />
                <DetailItem label="A passes" value={selectedStudent.olACount} />
                <DetailItem label="B passes" value={selectedStudent.olBCount} />
                <DetailItem label="C passes" value={selectedStudent.olCCount} />
                <DetailItem label="Maths grade" value={selectedStudent.mathsGrade} />
                <DetailItem label="Science grade" value={selectedStudent.scienceGrade} />
                <DetailItem label="English grade" value={selectedStudent.englishGrade} />
              </DetailSection>

              <DetailSection title="A/L results">
                <DetailItem label="Year" value={selectedStudent.alYear} />
                <DetailItem label="Stream" value={selectedStudent.alStream} />
                <DetailItem label="Medium" value={selectedStudent.alMedium} />
                <DetailItem
                  label="Subject 1"
                  value={selectedStudent.subject1 ? `${selectedStudent.subject1}: ${selectedStudent.grade1 || 'Not specified'}` : undefined}
                />
                <DetailItem
                  label="Subject 2"
                  value={selectedStudent.subject2 ? `${selectedStudent.subject2}: ${selectedStudent.grade2 || 'Not specified'}` : undefined}
                />
                <DetailItem
                  label="Subject 3"
                  value={selectedStudent.subject3 ? `${selectedStudent.subject3}: ${selectedStudent.grade3 || 'Not specified'}` : undefined}
                />
                <DetailItem label="Z-score" value={selectedStudent.zScore} />
                <DetailItem label="Calculated GPA" value={selectedStudent.calculatedGpa} />
              </DetailSection>

              <DetailSection title="English and financial information">
                <DetailItem label="English test" value={selectedStudent.englishTest} />
                <DetailItem label="Overall score" value={selectedStudent.overallScore} />
                <DetailItem label="Exam year" value={selectedStudent.examYear} />
                <DetailItem label="Household income" value={selectedStudent.householdIncome} />
                <DetailItem label="Dependents" value={selectedStudent.dependents} />
                <DetailItem label="Employment status" value={selectedStudent.employmentStatus} />
                <DetailItem label="Government assistance" value={selectedStudent.governmentAssistance} />
              </DetailSection>

              <DetailSection title="Background and preferences">
                <DetailItem label="Background" value={selectedStudent.background} />
                <DetailItem label="Disability" value={selectedStudent.disability} />
                <DetailItem label="Sports" value={selectedStudent.sports} />
                <DetailItem label="Leadership" value={selectedStudent.leadership} />
                <DetailItem label="First generation" value={selectedStudent.firstGeneration} />
                <DetailItem label="Preferred countries" value={arrayText(selectedStudent.preferredCountries)} />
                <DetailItem label="Preferred fields" value={arrayText(selectedStudent.preferredFields)} />
              </DetailSection>

              <section className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-semibold text-slate-900">Submitted applications</h3>
                  <Badge variant="secondary">{applications.length} shown</Badge>
                </div>

              {isApplicationsLoading ? (
                <div className="py-10 text-center">
                  <Loader2 className="w-8 h-8 text-blue-600 mx-auto mb-3 animate-spin" />
                  <p className="text-sm text-slate-600">Loading candidate applications</p>
                </div>
              ) : applicationsError ? (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  {applicationsError}
                </div>
              ) : applications.length === 0 ? (
                <div className="rounded-lg border border-slate-200 p-8 text-center">
                  <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                  <h3 className="font-semibold text-slate-900">No applications submitted</h3>
                  <p className="mt-1 text-sm text-slate-600">
                    This candidate does not have scholarship applications yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {applications.map((application) => (
                    <div
                      key={application.applicationId}
                      className="rounded-lg border border-slate-200 p-4"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h3 className="font-semibold text-slate-900">
                            {application.scholarshipTitle}
                          </h3>
                          <p className="text-sm text-slate-600">
                            {application.providerName || 'Provider not recorded'}
                          </p>
                        </div>
                        <Badge className={statusClass(application.status)}>
                          {(application.status || 'SUBMITTED').replace(/_/g, ' ')}
                        </Badge>
                      </div>
                      <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Calendar className="w-4 h-4" />
                          <span>Applied: {formatDate(application.appliedAt)}</span>
                        </div>
                        <div className="text-slate-600">
                          Match: {application.matchPercentage != null ? `${application.matchPercentage}%` : 'N/A'}
                        </div>
                        <div className="text-slate-600">
                          Application ID: {application.applicationId}
                        </div>
                      </div>
                      {application.requiredDocuments?.length ? (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {application.requiredDocuments.map((document) => (
                            <Badge key={document} variant="secondary">
                              {document}
                            </Badge>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              )}
              </section>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
