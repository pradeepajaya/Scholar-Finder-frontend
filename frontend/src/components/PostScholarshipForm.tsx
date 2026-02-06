import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Award,
  DollarSign,
  Calendar,
  FileText,
  GraduationCap,
  BookOpen,
  Users,
  Globe,
  CheckCircle,
  X,
} from 'lucide-react';

interface PostScholarshipFormProps {
  onClose: () => void;
  institutionName?: string;
}

export function PostScholarshipForm({ onClose, institutionName = "University of Colombo" }: PostScholarshipFormProps) {
  const [formData, setFormData] = useState({
    // Basic Information
    scholarshipTitle: '',
    amount: '',
    currency: 'USD',
    duration: '',
    durationType: 'years',
    deadline: '',
    numberOfAwards: '',
    
    // Eligibility Criteria
    academicLevel: [] as string[],
    minimumGPA: '',
    alResults: '',
    fieldOfStudy: [] as string[],
    ageMin: '',
    ageMax: '',
    
    // Requirements
    englishProficiency: '',
    minimumIELTS: '',
    minimumTOEFL: '',
    financialNeed: '',
    
    // Description & Details
    description: '',
    benefits: '',
    applicationProcess: '',
    requiredDocuments: [] as string[],
    
    // Contact
    contactEmail: '',
    websiteURL: '',
  });

  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const documentOptions = [
    'Academic Transcripts',
    'O/L Certificate',
    'A/L Certificate',
    'Personal Statement',
    'Recommendation Letters',
    'Passport Copy',
    'Proof of Financial Need',
    'English Proficiency Test Results',
    'CV/Resume',
    'Research Proposal',
  ];

  const fieldOptions = [
    'Engineering',
    'Medicine',
    'Science',
    'Business & Management',
    'Law',
    'Arts & Humanities',
    'Information Technology',
    'Agriculture',
    'Education',
    'Social Sciences',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Scholarship Posted:', { ...formData, institutionName });
    // Handle form submission
    onClose();
  };

  const toggleArrayField = (field: keyof typeof formData, value: string) => {
    setFormData(prev => {
      const currentArray = prev[field] as string[];
      if (currentArray.includes(value)) {
        return { ...prev, [field]: currentArray.filter(item => item !== value) };
      } else {
        return { ...prev, [field]: [...currentArray, value] };
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full my-8">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-indigo-600 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
                <Award className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Post New Scholarship</h2>
                <p className="text-purple-100">{institutionName}</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Basic Information */}
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-600" />
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="scholarshipTitle">Scholarship Title *</Label>
                <Input
                  id="scholarshipTitle"
                  placeholder="e.g., Commonwealth Scholarship 2026"
                  value={formData.scholarshipTitle}
                  onChange={(e) => setFormData({ ...formData, scholarshipTitle: e.target.value })}
                  required
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="amount">Award Amount *</Label>
                <div className="flex gap-2 mt-2">
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="px-3 py-2 border border-slate-300 rounded-lg"
                  >
                    <option value="USD">USD</option>
                    <option value="LKR">LKR</option>
                    <option value="GBP">GBP</option>
                    <option value="EUR">EUR</option>
                  </select>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="15000"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    required
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="duration">Duration *</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    id="duration"
                    type="number"
                    placeholder="1"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    required
                    className="flex-1"
                  />
                  <select
                    value={formData.durationType}
                    onChange={(e) => setFormData({ ...formData, durationType: e.target.value })}
                    className="px-3 py-2 border border-slate-300 rounded-lg"
                  >
                    <option value="months">Months</option>
                    <option value="years">Years</option>
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="deadline">Application Deadline *</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  required
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="numberOfAwards">Number of Awards</Label>
                <Input
                  id="numberOfAwards"
                  type="number"
                  placeholder="5"
                  value={formData.numberOfAwards}
                  onChange={(e) => setFormData({ ...formData, numberOfAwards: e.target.value })}
                  className="mt-2"
                />
              </div>
            </div>
          </div>

          {/* Eligibility Criteria */}
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-purple-600" />
              Eligibility Criteria
            </h3>
            <div className="space-y-4">
              <div>
                <Label>Academic Level *</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                  {['O/L', 'A/L', 'Undergraduate', 'Postgraduate', 'Doctoral', 'Post-Doctoral'].map((level) => (
                    <label key={level} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.academicLevel.includes(level)}
                        onChange={() => toggleArrayField('academicLevel', level)}
                        className="w-4 h-4 text-purple-600"
                      />
                      <span className="text-sm text-slate-700">{level}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="minimumGPA">Minimum GPA</Label>
                  <Input
                    id="minimumGPA"
                    type="number"
                    step="0.01"
                    placeholder="3.5"
                    value={formData.minimumGPA}
                    onChange={(e) => setFormData({ ...formData, minimumGPA: e.target.value })}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="alResults">A/L Results Requirement</Label>
                  <Input
                    id="alResults"
                    placeholder="e.g., AAB or better"
                    value={formData.alResults}
                    onChange={(e) => setFormData({ ...formData, alResults: e.target.value })}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="ageMin">Minimum Age</Label>
                  <Input
                    id="ageMin"
                    type="number"
                    placeholder="18"
                    value={formData.ageMin}
                    onChange={(e) => setFormData({ ...formData, ageMin: e.target.value })}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="ageMax">Maximum Age</Label>
                  <Input
                    id="ageMax"
                    type="number"
                    placeholder="35"
                    value={formData.ageMax}
                    onChange={(e) => setFormData({ ...formData, ageMax: e.target.value })}
                    className="mt-2"
                  />
                </div>
              </div>

              <div>
                <Label>Field of Study</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                  {fieldOptions.map((field) => (
                    <label key={field} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.fieldOfStudy.includes(field)}
                        onChange={() => toggleArrayField('fieldOfStudy', field)}
                        className="w-4 h-4 text-purple-600"
                      />
                      <span className="text-sm text-slate-700">{field}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Requirements */}
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-purple-600" />
              Additional Requirements
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="englishProficiency">English Proficiency Required</Label>
                  <select
                    id="englishProficiency"
                    value={formData.englishProficiency}
                    onChange={(e) => setFormData({ ...formData, englishProficiency: e.target.value })}
                    className="w-full mt-2 px-3 py-2 border border-slate-300 rounded-lg"
                  >
                    <option value="">Not Required</option>
                    <option value="IELTS">IELTS</option>
                    <option value="TOEFL">TOEFL</option>
                    <option value="both">IELTS or TOEFL</option>
                  </select>
                </div>

                {(formData.englishProficiency === 'IELTS' || formData.englishProficiency === 'both') && (
                  <div>
                    <Label htmlFor="minimumIELTS">Minimum IELTS Score</Label>
                    <Input
                      id="minimumIELTS"
                      type="number"
                      step="0.5"
                      placeholder="6.5"
                      value={formData.minimumIELTS}
                      onChange={(e) => setFormData({ ...formData, minimumIELTS: e.target.value })}
                      className="mt-2"
                    />
                  </div>
                )}

                {(formData.englishProficiency === 'TOEFL' || formData.englishProficiency === 'both') && (
                  <div>
                    <Label htmlFor="minimumTOEFL">Minimum TOEFL Score</Label>
                    <Input
                      id="minimumTOEFL"
                      type="number"
                      placeholder="90"
                      value={formData.minimumTOEFL}
                      onChange={(e) => setFormData({ ...formData, minimumTOEFL: e.target.value })}
                      className="mt-2"
                    />
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="financialNeed">Financial Need Assessment</Label>
                <select
                  id="financialNeed"
                  value={formData.financialNeed}
                  onChange={(e) => setFormData({ ...formData, financialNeed: e.target.value })}
                  className="w-full mt-2 px-3 py-2 border border-slate-300 rounded-lg"
                >
                  <option value="">Not Required</option>
                  <option value="required">Required</option>
                  <option value="preferred">Preferred but not mandatory</option>
                </select>
              </div>

              <div>
                <Label>Required Documents</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                  {documentOptions.map((doc) => (
                    <label key={doc} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.requiredDocuments.includes(doc)}
                        onChange={() => toggleArrayField('requiredDocuments', doc)}
                        className="w-4 h-4 text-purple-600"
                      />
                      <span className="text-sm text-slate-700">{doc}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Description & Details */}
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-600" />
              Description & Details
            </h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="description">Scholarship Description *</Label>
                <textarea
                  id="description"
                  placeholder="Provide a detailed description of the scholarship..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={4}
                  className="w-full mt-2 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <Label htmlFor="benefits">Benefits & Coverage</Label>
                <textarea
                  id="benefits"
                  placeholder="e.g., Tuition fees, accommodation, monthly stipend..."
                  value={formData.benefits}
                  onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                  rows={3}
                  className="w-full mt-2 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <Label htmlFor="applicationProcess">Application Process</Label>
                <textarea
                  id="applicationProcess"
                  placeholder="Describe how students should apply..."
                  value={formData.applicationProcess}
                  onChange={(e) => setFormData({ ...formData, applicationProcess: e.target.value })}
                  rows={3}
                  className="w-full mt-2 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-purple-600" />
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contactEmail">Contact Email *</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  placeholder="scholarships@university.edu"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  required
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="websiteURL">Website URL</Label>
                <Input
                  id="websiteURL"
                  type="url"
                  placeholder="https://university.edu/scholarships"
                  value={formData.websiteURL}
                  onChange={(e) => setFormData({ ...formData, websiteURL: e.target.value })}
                  className="mt-2"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-6 border-t border-slate-200">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Post Scholarship
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
