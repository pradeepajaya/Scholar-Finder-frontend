import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import {
  Award,
  Building2,
  Calendar,
  CheckCircle2,
  ClipboardList,
  DollarSign,
  Edit,
  ExternalLink,
  Eye,
  FileText,
  GraduationCap,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Save,
  Search,
  Trash2,
  Users,
} from 'lucide-react';

import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Checkbox } from '../ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Textarea } from '../ui/textarea';
import { scholarshipApi, type ScholarshipDto } from '../../services/api';

type StatusFilter = 'all' | 'active' | 'upcoming' | 'draft' | 'closed' | 'expired';

interface ScholarshipFormState {
  title: string;
  providerName: string;
  description: string;
  status: string;
  scholarshipType: string;
  amount: string;
  currency: string;
  coveragePercentage: string;
  eligibleCountries: string;
  eligibleFields: string;
  eligibleLevels: string;
  applicationDeadline: string;
  startDate: string;
  endDate: string;
  contactEmail: string;
  applicationUrl: string;
  websiteUrl: string;
  imageUrl: string;
  requiredDocuments: string;
  additionalRequirements: string;
  isFeatured: boolean;
}

const statusFilters: StatusFilter[] = ['all', 'active', 'upcoming', 'draft', 'closed', 'expired'];

const statusLabels: Record<StatusFilter, string> = {
  all: 'All',
  active: 'Active',
  upcoming: 'Upcoming',
  draft: 'Draft',
  closed: 'Closed',
  expired: 'Expired',
};

const statusOptions = ['DRAFT', 'ACTIVE', 'CLOSED', 'EXPIRED'];
const scholarshipTypeOptions = ['FULL', 'PARTIAL', 'TUITION', 'LIVING_EXPENSES', 'MERIT', 'NEED_BASED', 'RESEARCH'];

const arrayToText = (values?: string[]) => values?.join(', ') ?? '';

const textToArray = (value: string) =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

const toFormState = (scholarship: ScholarshipDto): ScholarshipFormState => ({
  title: scholarship.title ?? '',
  providerName: scholarship.providerName ?? '',
  description: scholarship.description ?? '',
  status: scholarship.status ?? 'DRAFT',
  scholarshipType: scholarship.scholarshipType ?? 'PARTIAL',
  amount: scholarship.amount != null ? String(scholarship.amount) : '',
  currency: scholarship.currency ?? 'LKR',
  coveragePercentage:
    scholarship.coveragePercentage != null ? String(scholarship.coveragePercentage) : '',
  eligibleCountries: arrayToText(scholarship.eligibleCountries),
  eligibleFields: arrayToText(scholarship.eligibleFields),
  eligibleLevels: arrayToText(scholarship.eligibleLevels),
  applicationDeadline: scholarship.applicationDeadline ?? '',
  startDate: scholarship.startDate ?? '',
  endDate: scholarship.endDate ?? '',
  contactEmail: scholarship.contactEmail ?? '',
  applicationUrl: scholarship.applicationUrl ?? '',
  websiteUrl: scholarship.websiteUrl ?? '',
  imageUrl: scholarship.imageUrl ?? '',
  requiredDocuments: arrayToText(scholarship.requiredDocuments),
  additionalRequirements: scholarship.additionalRequirements ?? '',
  isFeatured: Boolean(scholarship.isFeatured),
});

const parseNumber = (value: string) => {
  if (!value.trim()) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const formatDate = (date?: string) => {
  if (!date) return 'No date';
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString();
};

const getDisplayStatus = (scholarship: ScholarshipDto): StatusFilter => {
  const rawStatus = (scholarship.status ?? 'DRAFT').toUpperCase();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (rawStatus === 'DRAFT') return 'draft';
  if (rawStatus === 'CLOSED') return 'closed';
  if (rawStatus === 'EXPIRED') return 'expired';

  if (scholarship.applicationDeadline) {
    const deadline = new Date(scholarship.applicationDeadline);
    if (!Number.isNaN(deadline.getTime()) && deadline < today) return 'expired';
  }

  if (scholarship.startDate) {
    const starts = new Date(scholarship.startDate);
    if (!Number.isNaN(starts.getTime()) && starts > today) return 'upcoming';
  }

  return 'active';
};

const statusBadgeClass = (status: StatusFilter) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-700';
    case 'upcoming':
      return 'bg-blue-100 text-blue-700';
    case 'draft':
      return 'bg-amber-100 text-amber-700';
    case 'closed':
      return 'bg-slate-100 text-slate-700';
    case 'expired':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-slate-100 text-slate-700';
  }
};

const getAmountLabel = (scholarship: ScholarshipDto) => {
  if (scholarship.scholarshipType === 'FULL') return 'Fully funded';
  if (scholarship.amount != null) {
    return `${scholarship.currency ?? 'LKR'} ${Number(scholarship.amount).toLocaleString()}`;
  }
  if (scholarship.coveragePercentage != null) {
    return `${scholarship.coveragePercentage}% coverage`;
  }
  return 'Contact institution';
};

const formatValue = (value?: string | number | boolean | null) => {
  if (value === undefined || value === null || value === '') return 'Not specified';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  return String(value);
};

const formatRange = (min?: number, max?: number) => {
  if (min != null && max != null) return `${min} - ${max}`;
  if (min != null) return `${min}+`;
  if (max != null) return `Up to ${max}`;
  return 'Not specified';
};

const ListBlock = ({ title, items }: { title: string; items?: string[] }) => (
  <div className="rounded-lg border border-slate-200 p-4">
    <h4 className="mb-3 text-sm font-semibold text-slate-900">{title}</h4>
    {items?.length ? (
      <ul className="space-y-2 text-sm text-slate-700">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
            <span className="break-words">{item}</span>
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-sm text-slate-500">Not specified</p>
    )}
  </div>
);

const DetailItem = ({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value?: string | number | boolean | null;
  icon?: typeof GraduationCap;
}) => (
  <div className="rounded-lg border border-slate-200 p-4">
    <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase text-slate-500">
      {Icon && <Icon className="h-4 w-4" />}
      <span>{label}</span>
    </div>
    <p className="break-words text-sm font-medium text-slate-900">{formatValue(value)}</p>
  </div>
);

const LinkItem = ({ label, href }: { label: string; href?: string }) => (
  <div className="rounded-lg border border-slate-200 p-4">
    <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase text-slate-500">
      <ExternalLink className="h-4 w-4" />
      <span>{label}</span>
    </div>
    {href ? (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="break-all text-sm font-medium text-blue-600 hover:text-blue-700"
      >
        {href}
      </a>
    ) : (
      <p className="text-sm text-slate-500">Not specified</p>
    )}
  </div>
);

const BadgeList = ({ values }: { values?: string[] }) => {
  if (!values?.length) {
    return <span className="text-sm text-slate-500">Not specified</span>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {values.map((value) => (
        <Badge key={value} variant="secondary">
          {value}
        </Badge>
      ))}
    </div>
  );
};

export function AdminScholarships() {
  const [scholarships, setScholarships] = useState<ScholarshipDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<StatusFilter>('all');
  const [editingScholarship, setEditingScholarship] = useState<ScholarshipDto | null>(null);
  const [viewingScholarship, setViewingScholarship] = useState<ScholarshipDto | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ScholarshipDto | null>(null);
  const [form, setForm] = useState<ScholarshipFormState | null>(null);

  useEffect(() => {
    void loadScholarships();
  }, []);

  const loadScholarships = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await scholarshipApi.getAllScholarships();
      setScholarships(response.data ?? []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load scholarships';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredScholarships = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return scholarships.filter((scholarship) => {
      const displayStatus = getDisplayStatus(scholarship);
      const matchesStatus = filterStatus === 'all' || displayStatus === filterStatus;
      const matchesSearch =
        !query ||
        scholarship.title.toLowerCase().includes(query) ||
        (scholarship.providerName ?? '').toLowerCase().includes(query) ||
        String(scholarship.id).includes(query) ||
        (scholarship.contactEmail ?? '').toLowerCase().includes(query);

      return matchesStatus && matchesSearch;
    });
  }, [filterStatus, scholarships, searchQuery]);

  const statusCounts = useMemo(
    () =>
      statusFilters.reduce(
        (counts, status) => {
          counts[status] =
            status === 'all'
              ? scholarships.length
              : scholarships.filter((scholarship) => getDisplayStatus(scholarship) === status).length;
          return counts;
        },
        {} as Record<StatusFilter, number>,
      ),
    [scholarships],
  );

  const openEditDialog = (scholarship: ScholarshipDto) => {
    setEditingScholarship(scholarship);
    setForm(toFormState(scholarship));
  };

  const updateForm = <K extends keyof ScholarshipFormState>(key: K, value: ScholarshipFormState[K]) => {
    setForm((current) => (current ? { ...current, [key]: value } : current));
  };

  const handleSave = async () => {
    if (!editingScholarship || !form) return;

    try {
      setIsSaving(true);
      const payload = {
        title: form.title.trim(),
        providerName: form.providerName.trim(),
        description: form.description.trim(),
        status: form.status,
        scholarshipType: form.scholarshipType,
        amount: parseNumber(form.amount),
        currency: form.currency.trim(),
        coveragePercentage: parseNumber(form.coveragePercentage),
        eligibleCountries: textToArray(form.eligibleCountries),
        eligibleFields: textToArray(form.eligibleFields),
        eligibleLevels: textToArray(form.eligibleLevels),
        applicationDeadline: form.applicationDeadline || undefined,
        startDate: form.startDate || undefined,
        endDate: form.endDate || undefined,
        contactEmail: form.contactEmail.trim(),
        applicationUrl: form.applicationUrl.trim(),
        websiteUrl: form.websiteUrl.trim(),
        imageUrl: form.imageUrl.trim(),
        requiredDocuments: textToArray(form.requiredDocuments),
        additionalRequirements: form.additionalRequirements.trim(),
        isFeatured: form.isFeatured,
      };

      const response = await scholarshipApi.updateScholarship(editingScholarship.id, payload);
      const updated = response.data;
      setScholarships((current) =>
        current.map((scholarship) => (scholarship.id === updated.id ? updated : scholarship)),
      );
      toast.success('Scholarship updated');
      setEditingScholarship(null);
      setForm(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update scholarship');
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      setIsDeleting(true);
      await scholarshipApi.deleteScholarship(deleteTarget.id);
      setScholarships((current) => current.filter((scholarship) => scholarship.id !== deleteTarget.id));
      toast.success('Scholarship deleted');
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete scholarship');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-1">Scholarship Management</h2>
          <p className="text-slate-600">{scholarships.length} scholarship records</p>
        </div>
        <Button variant="outline" onClick={loadScholarships} disabled={isLoading}>
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          Refresh
        </Button>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2">
        {statusFilters.map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
              filterStatus === status
                ? 'bg-blue-600 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            {statusLabels[status]}
            <span className="ml-2 font-semibold">({statusCounts[status] ?? 0})</span>
          </button>
        ))}
      </div>

      <Card className="p-4">
        <div className="flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400" />
          <Input
            placeholder="Search by title, institution, ID, or email"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="flex-1 border-none shadow-none focus-visible:ring-0"
          />
        </div>
      </Card>

      {error && (
        <Card className="p-6 border-red-200 bg-red-50">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-red-700">{error}</p>
            <Button variant="outline" onClick={loadScholarships}>
              Retry
            </Button>
          </div>
        </Card>
      )}

      {isLoading ? (
        <Card className="p-12 text-center">
          <Loader2 className="w-10 h-10 text-blue-600 mx-auto mb-3 animate-spin" />
          <h3 className="text-lg font-semibold text-slate-900">Loading scholarships</h3>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredScholarships.map((scholarship) => {
            const displayStatus = getDisplayStatus(scholarship);
            const countries = scholarship.eligibleCountries?.length
              ? scholarship.eligibleCountries.join(', ')
              : 'Multiple locations';
            const levels = scholarship.eligibleLevels?.length ? scholarship.eligibleLevels : ['All levels'];

            return (
              <Card key={scholarship.id} className="p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <GraduationCap className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-slate-900 break-words">{scholarship.title}</h3>
                      <p className="text-sm text-slate-600">ID {scholarship.id}</p>
                    </div>
                  </div>
                  <Badge className={statusBadgeClass(displayStatus)}>
                    {statusLabels[displayStatus].toUpperCase()}
                  </Badge>
                </div>

                <div className="space-y-2 text-sm mb-4">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Building2 className="w-4 h-4" />
                    <span className="break-words">{scholarship.providerName || 'Institution'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <DollarSign className="w-4 h-4" />
                    <span>{getAmountLabel(scholarship)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <MapPin className="w-4 h-4" />
                    <span className="break-words">{countries}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Deadline: {formatDate(scholarship.applicationDeadline)}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {scholarship.scholarshipType && <Badge variant="secondary">{scholarship.scholarshipType}</Badge>}
                  {levels.map((level) => (
                    <Badge key={level} variant="secondary">
                      {level}
                    </Badge>
                  ))}
                  {scholarship.isFeatured && <Badge variant="secondary">Featured</Badge>}
                </div>

                <div className="flex items-center justify-between gap-3 pt-4 border-t">
                  <div>
                    <span className="text-sm text-slate-600">Applicants:</span>
                    <span className="ml-2 font-semibold text-slate-900">
                      {scholarship.totalApplications ?? 0}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      title="View scholarship"
                      aria-label="View scholarship"
                      onClick={() => setViewingScholarship(scholarship)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      title="Edit scholarship"
                      aria-label="Edit scholarship"
                      onClick={() => openEditDialog(scholarship)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      title="Delete scholarship"
                      aria-label="Delete scholarship"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => setDeleteTarget(scholarship)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {!isLoading && filteredScholarships.length === 0 && (
        <Card className="p-12 text-center">
          <GraduationCap className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-slate-900 mb-1">No scholarships found</h3>
          <p className="text-slate-600">Try another search or status filter</p>
        </Card>
      )}

      <Dialog
        open={Boolean(editingScholarship && form)}
        onOpenChange={(open) => {
          if (!open && !isSaving) {
            setEditingScholarship(null);
            setForm(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit scholarship</DialogTitle>
            <DialogDescription>
              The institution will receive an alert after these changes are saved.
            </DialogDescription>
          </DialogHeader>

          {form && (
            <div className="grid gap-5">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={form.title}
                    onChange={(event) => updateForm('title', event.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="providerName">Institution</Label>
                  <Input
                    id="providerName"
                    value={form.providerName}
                    onChange={(event) => updateForm('providerName', event.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Institution email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={form.contactEmail}
                    onChange={(event) => updateForm('contactEmail', event.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={form.status} onValueChange={(value) => updateForm('status', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select
                    value={form.scholarshipType}
                    onValueChange={(value) => updateForm('scholarshipType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {scholarshipTypeOptions.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    inputMode="decimal"
                    value={form.amount}
                    onChange={(event) => updateForm('amount', event.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Input
                    id="currency"
                    value={form.currency}
                    onChange={(event) => updateForm('currency', event.target.value.toUpperCase())}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="coveragePercentage">Coverage percentage</Label>
                  <Input
                    id="coveragePercentage"
                    inputMode="numeric"
                    value={form.coveragePercentage}
                    onChange={(event) => updateForm('coveragePercentage', event.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="applicationDeadline">Application deadline</Label>
                  <Input
                    id="applicationDeadline"
                    type="date"
                    value={form.applicationDeadline}
                    onChange={(event) => updateForm('applicationDeadline', event.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={form.startDate}
                    onChange={(event) => updateForm('startDate', event.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={form.endDate}
                    onChange={(event) => updateForm('endDate', event.target.value)}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    className="min-h-28"
                    value={form.description}
                    onChange={(event) => updateForm('description', event.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="eligibleCountries">Eligible countries</Label>
                  <Input
                    id="eligibleCountries"
                    value={form.eligibleCountries}
                    onChange={(event) => updateForm('eligibleCountries', event.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="eligibleLevels">Eligible levels</Label>
                  <Input
                    id="eligibleLevels"
                    value={form.eligibleLevels}
                    onChange={(event) => updateForm('eligibleLevels', event.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="eligibleFields">Eligible fields</Label>
                  <Input
                    id="eligibleFields"
                    value={form.eligibleFields}
                    onChange={(event) => updateForm('eligibleFields', event.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="requiredDocuments">Required documents</Label>
                  <Input
                    id="requiredDocuments"
                    value={form.requiredDocuments}
                    onChange={(event) => updateForm('requiredDocuments', event.target.value)}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="additionalRequirements">Additional requirements</Label>
                  <Textarea
                    id="additionalRequirements"
                    value={form.additionalRequirements}
                    onChange={(event) => updateForm('additionalRequirements', event.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="applicationUrl">Application URL</Label>
                  <Input
                    id="applicationUrl"
                    value={form.applicationUrl}
                    onChange={(event) => updateForm('applicationUrl', event.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="websiteUrl">Website URL</Label>
                  <Input
                    id="websiteUrl"
                    value={form.websiteUrl}
                    onChange={(event) => updateForm('websiteUrl', event.target.value)}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="imageUrl">Image URL</Label>
                  <Input
                    id="imageUrl"
                    value={form.imageUrl}
                    onChange={(event) => updateForm('imageUrl', event.target.value)}
                  />
                </div>
              </div>

              <label className="flex items-center gap-3 rounded-md border p-3 text-sm font-medium">
                <Checkbox
                  checked={form.isFeatured}
                  onCheckedChange={(checked) => updateForm('isFeatured', checked === true)}
                />
                Featured scholarship
              </label>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setEditingScholarship(null);
                setForm(null);
              }}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving || !form?.title.trim()}>
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(viewingScholarship)} onOpenChange={(open) => !open && setViewingScholarship(null)}>
        <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-y-auto">
          {viewingScholarship && (
            <>
              <DialogHeader>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-2">
                    <DialogTitle className="text-2xl">{viewingScholarship.title}</DialogTitle>
                    <DialogDescription className="flex flex-wrap items-center gap-2 text-sm">
                      <span>{viewingScholarship.providerName || 'Institution not specified'}</span>
                      <span className="text-slate-300">|</span>
                      <span>Scholarship ID {viewingScholarship.id}</span>
                    </DialogDescription>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge className={statusBadgeClass(getDisplayStatus(viewingScholarship))}>
                      {statusLabels[getDisplayStatus(viewingScholarship)].toUpperCase()}
                    </Badge>
                    {viewingScholarship.isFeatured && <Badge variant="secondary">Featured</Badge>}
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-6">
                {viewingScholarship.imageUrl && (
                  <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
                    <img
                      src={viewingScholarship.imageUrl}
                      alt={viewingScholarship.title}
                      className="h-48 w-full object-cover"
                    />
                  </div>
                )}

                <section className="rounded-lg border border-slate-200 bg-slate-50 p-5">
                  <div className="mb-3 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <h3 className="font-semibold text-slate-900">Overview</h3>
                  </div>
                  <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">
                    {viewingScholarship.description || 'No description provided.'}
                  </p>
                </section>

                <section>
                  <div className="mb-3 flex items-center gap-2">
                    <Award className="h-5 w-5 text-blue-600" />
                    <h3 className="font-semibold text-slate-900">Key Details</h3>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <DetailItem label="Funding" value={getAmountLabel(viewingScholarship)} icon={DollarSign} />
                    <DetailItem label="Type" value={viewingScholarship.scholarshipType} icon={Award} />
                    <DetailItem label="Applications" value={viewingScholarship.totalApplications ?? 0} icon={Users} />
                    <DetailItem label="Views" value={viewingScholarship.viewsCount ?? 0} icon={Eye} />
                    <DetailItem
                      label="Coverage"
                      value={
                        viewingScholarship.coveragePercentage != null
                          ? `${viewingScholarship.coveragePercentage}%`
                          : null
                      }
                      icon={DollarSign}
                    />
                    <DetailItem
                      label="Duration"
                      value={
                        viewingScholarship.durationMonths != null
                          ? `${viewingScholarship.durationMonths} months`
                          : null
                      }
                      icon={Calendar}
                    />
                    <DetailItem label="Institution ID" value={viewingScholarship.institutionId} icon={Building2} />
                    <DetailItem label="Raw status" value={viewingScholarship.status ?? 'DRAFT'} icon={CheckCircle2} />
                  </div>
                </section>

                <section>
                  <div className="mb-3 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <h3 className="font-semibold text-slate-900">Timeline</h3>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <DetailItem label="Application deadline" value={formatDate(viewingScholarship.applicationDeadline)} />
                    <DetailItem label="Program start" value={formatDate(viewingScholarship.startDate)} />
                    <DetailItem label="Program end" value={formatDate(viewingScholarship.endDate)} />
                  </div>
                </section>

                <section>
                  <div className="mb-3 flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-blue-600" />
                    <h3 className="font-semibold text-slate-900">Eligibility</h3>
                  </div>
                  <div className="grid gap-3 lg:grid-cols-3">
                    <div className="rounded-lg border border-slate-200 p-4">
                      <p className="mb-3 text-xs font-semibold uppercase text-slate-500">Countries</p>
                      <BadgeList values={viewingScholarship.eligibleCountries} />
                    </div>
                    <div className="rounded-lg border border-slate-200 p-4">
                      <p className="mb-3 text-xs font-semibold uppercase text-slate-500">Study levels</p>
                      <BadgeList values={viewingScholarship.eligibleLevels} />
                    </div>
                    <div className="rounded-lg border border-slate-200 p-4">
                      <p className="mb-3 text-xs font-semibold uppercase text-slate-500">Fields</p>
                      <BadgeList values={viewingScholarship.eligibleFields} />
                    </div>
                  </div>
                </section>

                <section>
                  <div className="mb-3 flex items-center gap-2">
                    <ClipboardList className="h-5 w-5 text-blue-600" />
                    <h3 className="font-semibold text-slate-900">Academic Requirements</h3>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <DetailItem label="GPA minimum" value={viewingScholarship.minGpa} />
                    <DetailItem label="Age range" value={formatRange(viewingScholarship.minAge, viewingScholarship.maxAge)} />
                    <DetailItem label="A/L passes" value={viewingScholarship.minAlPasses} />
                    <DetailItem label="A/L stream" value={viewingScholarship.requiredAlStream} />
                    <DetailItem label="Z-score minimum" value={viewingScholarship.minZScore} />
                    <DetailItem label="English test" value={viewingScholarship.requiredEnglishTest} />
                    <DetailItem label="English score" value={viewingScholarship.minEnglishScore} />
                    <DetailItem label="Max household income" value={viewingScholarship.maxHouseholdIncome} />
                  </div>
                </section>

                <section>
                  <div className="mb-3 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-blue-600" />
                    <h3 className="font-semibold text-slate-900">Priority Flags</h3>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    <DetailItem label="Financial need required" value={viewingScholarship.requiresFinancialNeed} />
                    <DetailItem label="Sports achievement required" value={viewingScholarship.sportsAchievementRequired} />
                    <DetailItem label="Leadership required" value={viewingScholarship.leadershipRequired} />
                    <DetailItem label="First-generation priority" value={viewingScholarship.firstGenerationPriority} />
                    <DetailItem label="Disability friendly" value={viewingScholarship.disabilityFriendly} />
                    <DetailItem label="Return home required" value={viewingScholarship.returnToHomeRequired} />
                  </div>
                </section>

                <section className="grid gap-4 lg:grid-cols-2">
                  <ListBlock title="Benefits" items={viewingScholarship.benefits} />
                  <ListBlock title="Required documents" items={viewingScholarship.requiredDocuments} />
                  <ListBlock title="Selection criteria" items={viewingScholarship.selectionCriteria} />
                  <ListBlock title="Application steps" items={viewingScholarship.applicationSteps} />
                </section>

                {viewingScholarship.additionalRequirements && (
                  <section className="rounded-lg border border-slate-200 p-4">
                    <h3 className="mb-2 font-semibold text-slate-900">Additional Requirements</h3>
                    <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">
                      {viewingScholarship.additionalRequirements}
                    </p>
                  </section>
                )}

                <section>
                  <div className="mb-3 flex items-center gap-2">
                    <Mail className="h-5 w-5 text-blue-600" />
                    <h3 className="font-semibold text-slate-900">Contact And Links</h3>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <DetailItem label="Contact email" value={viewingScholarship.contactEmail} icon={Mail} />
                    <DetailItem label="Contact phone" value={viewingScholarship.contactPhone} icon={Phone} />
                    <LinkItem label="Application URL" href={viewingScholarship.applicationUrl} />
                    <LinkItem label="Website URL" href={viewingScholarship.websiteUrl} />
                    <DetailItem label="Provider display" value={viewingScholarship.providerName} icon={Building2} />
                  </div>
                </section>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open && !isDeleting) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete scholarship</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget?.title} will be removed from scholarship listings and the institution will be alerted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(event) => {
                event.preventDefault();
                void confirmDelete();
              }}
              className="bg-red-600 text-white hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
