import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Plus, X, Upload, Building2, CheckCircle, Home, Edit, Trash2 } from 'lucide-react';
import { Checkbox } from './ui/checkbox';

interface Scholarship {
  name: string;
  code: string;
  description: string;
  type: string;
  fieldsEligible: string[];
  levelsEligible: string[];
  countriesEligible: string[];
  startDate: string;
  endDate: string;
  website: string;
  amount: string;
  minOL: string;
  minAL: string;
  minGPA: string;
  requiredDocuments: string[];
}

export function InstitutionRegistration() {
  const [institutionData, setInstitutionData] = useState({
    name: '',
    type: '',
    country: '',
    city: '',
    website: '',
    email: '',
    phone: '',
    contactPerson: '',
  });

  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [currentScholarship, setCurrentScholarship] = useState<Scholarship>({
    name: '',
    code: '',
    description: '',
    type: '',
    fieldsEligible: [],
    levelsEligible: [],
    countriesEligible: [],
    startDate: '',
    endDate: '',
    website: '',
    amount: '',
    minOL: '',
    minAL: '',
    minGPA: '',
    requiredDocuments: [],
  });

  const [showScholarshipForm, setShowScholarshipForm] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const fields = ['Engineering', 'Medicine', 'IT', 'Business', 'Science', 'Arts', 'Law', 'Education'];
  const levels = ["Bachelor's", "Master's", 'PhD', 'Diploma', 'Postgraduate Diploma'];
  const countries = ['Sri Lanka', 'USA', 'UK', 'Australia', 'Canada', 'Germany', 'Singapore', 'Japan'];
  const documents = ['O/L Certificate', 'A/L Certificate', 'Degree Certificate', 'Transcripts', 'CV', 'Personal Statement', 'Recommendation Letters', 'Research Proposal'];

  const toggleArrayField = (field: keyof Scholarship, value: string) => {
    const currentArray = currentScholarship[field] as string[];
    if (currentArray.includes(value)) {
      setCurrentScholarship({
        ...currentScholarship,
        [field]: currentArray.filter(item => item !== value),
      });
    } else {
      setCurrentScholarship({
        ...currentScholarship,
        [field]: [...currentArray, value],
      });
    }
  };

  const addScholarship = () => {
    if (currentScholarship.name && currentScholarship.description) {
      setScholarships([...scholarships, currentScholarship]);
      setCurrentScholarship({
        name: '',
        code: '',
        description: '',
        type: '',
        fieldsEligible: [],
        levelsEligible: [],
        countriesEligible: [],
        startDate: '',
        endDate: '',
        website: '',
        amount: '',
        minOL: '',
        minAL: '',
        minGPA: '',
        requiredDocuments: [],
      });
      setShowScholarshipForm(false);
    }
  };

  const removeScholarship = (index: number) => {
    setScholarships(scholarships.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    console.log('Institution Data:', institutionData);
    console.log('Scholarships:', scholarships);
    setIsSubmitted(true);
  };

  const handleEdit = () => {
    setIsSubmitted(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this registration? This action cannot be undone.')) {
      // Reset all data
      setInstitutionData({
        name: '',
        type: '',
        country: '',
        city: '',
        website: '',
        email: '',
        phone: '',
        contactPerson: '',
      });
      setScholarships([]);
      setIsSubmitted(false);
    }
  };

  const handleReturnHome = () => {
    // Reset all data and return to initial state
    setInstitutionData({
      name: '',
      type: '',
      country: '',
      city: '',
      website: '',
      email: '',
      phone: '',
      contactPerson: '',
    });
    setScholarships([]);
    setIsSubmitted(false);
    // If you have a navigation function, call it here
    // For example: navigate('/') or window.location.href = '/'
  };

  // If submitted, show success message with action buttons
  if (isSubmitted) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <Card className="p-8 md:p-12 text-center">
          <div className="flex flex-col items-center gap-6">
            {/* Success Icon */}
            <div className="bg-green-100 p-6 rounded-full">
              <CheckCircle className="w-16 h-16 text-green-600" />
            </div>

            {/* Success Message */}
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-3">
                Registration Submitted Successfully!
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl">
                Your institution registration has been submitted for review. Our admin team will review your submission and contact you at <strong>{institutionData.email}</strong> within 3-5 business days.
              </p>
            </div>

            {/* Submitted Details Summary */}
            <div className="w-full max-w-2xl bg-slate-50 rounded-lg p-6 text-left">
              <h3 className="font-semibold text-slate-900 mb-4">Submission Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Institution Name:</span>
                  <span className="font-medium text-slate-900">{institutionData.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Type:</span>
                  <span className="font-medium text-slate-900">{institutionData.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Location:</span>
                  <span className="font-medium text-slate-900">{institutionData.city}, {institutionData.country}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Scholarships Added:</span>
                  <span className="font-medium text-slate-900">{scholarships.length}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-2xl pt-4">
              <Button
                onClick={handleEdit}
                variant="outline"
                className="flex-1 py-6 text-base border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                <Edit className="w-5 h-5 mr-2" />
                Edit Submission
              </Button>
              
              <Button
                onClick={handleDelete}
                variant="outline"
                className="flex-1 py-6 text-base border-2 border-red-600 text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-5 h-5 mr-2" />
                Delete Submission
              </Button>
              
              <Button
                onClick={handleReturnHome}
                className="flex-1 py-6 text-base bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
              >
                <Home className="w-5 h-5 mr-2" />
                Return to Home
              </Button>
            </div>

            {/* Additional Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-2xl w-full">
              <p className="text-sm text-blue-900">
                <strong>Next Steps:</strong> Once approved, your institution profile and scholarships will be published on our platform. You'll receive login credentials to manage your scholarships and track applications.
              </p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Institution Registration</h2>
        <p className="text-slate-600">Register your institution and scholarship programs</p>
      </div>

      {/* Institution Details */}
      <Card className="p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-100 p-3 rounded-lg">
            <Building2 className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900">Institution Profile</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="instName">Institution Name *</Label>
            <Input
              id="instName"
              value={institutionData.name}
              onChange={(e) => setInstitutionData({ ...institutionData, name: e.target.value })}
              placeholder="University of Example" className="mx-[0px] my-[10px]"
            />
          </div>

          <div>
            <Label htmlFor="instType">Institution Type *</Label>
            <Select value={institutionData.type} onValueChange={(value) => setInstitutionData({ ...institutionData, type: value })}>
              <SelectTrigger className="mx-[0px] my-[10px]">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="University">University</SelectItem>
                <SelectItem value="NGO">NGO</SelectItem>
                <SelectItem value="Government">Government</SelectItem>
                <SelectItem value="Private Organization">Private Organization</SelectItem>
                <SelectItem value="Foundation">Foundation</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="instCountry">Country *</Label>
            <Input
              id="instCountry"
              value={institutionData.country}
              onChange={(e) => setInstitutionData({ ...institutionData, country: e.target.value })}
              placeholder="Sri Lanka" className="mx-[0px] my-[10px]"
            />
          </div>

          <div>
            <Label htmlFor="instCity">City</Label>
            <Input
              id="instCity"
              value={institutionData.city}
              onChange={(e) => setInstitutionData({ ...institutionData, city: e.target.value })}
              placeholder="Colombo" className="mx-[0px] my-[10px]"
            />
          </div>

          <div>
            <Label htmlFor="instWebsite">Website / URL</Label>
            <Input
              id="instWebsite"
              type="url"
              value={institutionData.website}
              onChange={(e) => setInstitutionData({ ...institutionData, website: e.target.value })}
              placeholder="https://example.edu" className="mx-[0px] my-[10px]"
            />
          </div>

          <div>
            <Label htmlFor="instEmail">Contact Email *</Label>
            <Input
              id="instEmail"
              type="email"
              value={institutionData.email}
              onChange={(e) => setInstitutionData({ ...institutionData, email: e.target.value })}
              placeholder="contact@example.edu" className="mx-[0px] my-[10px]"
            />
          </div>

          <div>
            <Label htmlFor="instPhone">Contact Phone</Label>
            <Input
              id="instPhone"
              value={institutionData.phone}
              onChange={(e) => setInstitutionData({ ...institutionData, phone: e.target.value })}
              placeholder="+94 11 XXX XXXX" className="mx-[0px] my-[10px]"
            />
          </div>

          <div>
            <Label htmlFor="instContact">Contact Person *</Label>
            <Input
              id="instContact"
              value={institutionData.contactPerson}
              onChange={(e) => setInstitutionData({ ...institutionData, contactPerson: e.target.value })}
              placeholder="John Doe" className="mx-[0px] my-[10px]"
            />
          </div>
        </div>
      </Card>

      {/* Scholarships Section */}
      <Card className="p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-slate-900">Scholarship Programs</h3>
          <Button
            onClick={() => setShowScholarshipForm(!showScholarshipForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Scholarship
          </Button>
        </div>

        {/* Added Scholarships */}
        {scholarships.length > 0 && (
          <div className="mb-6 space-y-3">
            {scholarships.map((scholarship, index) => (
              <div key={index} className="p-4 bg-slate-50 rounded-lg flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-900">{scholarship.name}</h4>
                  <p className="text-sm text-slate-600 mt-1">{scholarship.description.substring(0, 100)}...</p>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    <Badge variant="secondary">{scholarship.type}</Badge>
                    <Badge variant="secondary">{scholarship.amount}</Badge>
                    <Badge variant="secondary">{scholarship.levelsEligible.length} Levels</Badge>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeScholarship(index)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Scholarship Form */}
        {showScholarshipForm && (
          <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 space-y-4">
            <h4 className="font-semibold text-slate-900 mb-4">New Scholarship Details</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="schName">Scholarship Name *</Label>
                <Input
                  id="schName"
                  value={currentScholarship.name}
                  onChange={(e) => setCurrentScholarship({ ...currentScholarship, name: e.target.value })}
                  placeholder="Commonwealth Scholarship"
                />
              </div>

              <div>
                <Label htmlFor="schCode">Scholarship Code</Label>
                <Input
                  id="schCode"
                  value={currentScholarship.code}
                  onChange={(e) => setCurrentScholarship({ ...currentScholarship, code: e.target.value })}
                  placeholder="CS2026"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="schDesc">Description *</Label>
              <Textarea
                id="schDesc"
                value={currentScholarship.description}
                onChange={(e) => setCurrentScholarship({ ...currentScholarship, description: e.target.value })}
                placeholder="Full description of the scholarship program..."
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="schType">Scholarship Type *</Label>
                <Select value={currentScholarship.type} onValueChange={(value) => setCurrentScholarship({ ...currentScholarship, type: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Fully Funded">Fully Funded</SelectItem>
                    <SelectItem value="Partial">Partial</SelectItem>
                    <SelectItem value="Merit-based">Merit-based</SelectItem>
                    <SelectItem value="Need-based">Need-based</SelectItem>
                    <SelectItem value="Research">Research</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="schAmount">Amount *</Label>
                <Input
                  id="schAmount"
                  value={currentScholarship.amount}
                  onChange={(e) => setCurrentScholarship({ ...currentScholarship, amount: e.target.value })}
                  placeholder="Up to LKR 150,000"
                />
              </div>

              <div>
                <Label htmlFor="schStart">Application Start Date *</Label>
                <Input
                  id="schStart"
                  type="date"
                  value={currentScholarship.startDate}
                  onChange={(e) => setCurrentScholarship({ ...currentScholarship, startDate: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="schEnd">Application End Date *</Label>
                <Input
                  id="schEnd"
                  type="date"
                  value={currentScholarship.endDate}
                  onChange={(e) => setCurrentScholarship({ ...currentScholarship, endDate: e.target.value })}
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="schWebsite">Scholarship Website / Apply Link *</Label>
                <Input
                  id="schWebsite"
                  type="url"
                  value={currentScholarship.website}
                  onChange={(e) => setCurrentScholarship({ ...currentScholarship, website: e.target.value })}
                  placeholder="https://apply.example.com"
                />
              </div>
            </div>

            {/* Eligibility Criteria */}
            <div className="border-t pt-4">
              <h5 className="font-semibold text-slate-900 mb-3">Eligibility Criteria</h5>
              
              <div className="space-y-4">
                <div>
                  <Label>Fields of Study Eligible</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {fields.map((field) => (
                      <Badge
                        key={field}
                        onClick={() => toggleArrayField('fieldsEligible', field)}
                        className={`cursor-pointer ${
                          currentScholarship.fieldsEligible.includes(field)
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                        }`}
                      >
                        {field}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Level Eligible</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {levels.map((level) => (
                      <Badge
                        key={level}
                        onClick={() => toggleArrayField('levelsEligible', level)}
                        className={`cursor-pointer ${
                          currentScholarship.levelsEligible.includes(level)
                            ? 'bg-green-600 text-white hover:bg-green-700'
                            : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                        }`}
                      >
                        {level}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Countries Eligible</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {countries.map((country) => (
                      <Badge
                        key={country}
                        onClick={() => toggleArrayField('countriesEligible', country)}
                        className={`cursor-pointer ${
                          currentScholarship.countriesEligible.includes(country)
                            ? 'bg-purple-600 text-white hover:bg-purple-700'
                            : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                        }`}
                      >
                        {country}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="minOL">Minimum O/L Passes</Label>
                    <Input
                      id="minOL"
                      type="number"
                      value={currentScholarship.minOL}
                      onChange={(e) => setCurrentScholarship({ ...currentScholarship, minOL: e.target.value })}
                      placeholder="9"
                    />
                  </div>

                  <div>
                    <Label htmlFor="minAL">Minimum A/L Subjects</Label>
                    <Input
                      id="minAL"
                      type="number"
                      value={currentScholarship.minAL}
                      onChange={(e) => setCurrentScholarship({ ...currentScholarship, minAL: e.target.value })}
                      placeholder="3"
                    />
                  </div>

                  <div>
                    <Label htmlFor="minGPA">Minimum GPA</Label>
                    <Input
                      id="minGPA"
                      value={currentScholarship.minGPA}
                      onChange={(e) => setCurrentScholarship({ ...currentScholarship, minGPA: e.target.value })}
                      placeholder="3.0"
                    />
                  </div>
                </div>

                <div>
                  <Label>Required Documents</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {documents.map((doc) => (
                      <Badge
                        key={doc}
                        onClick={() => toggleArrayField('requiredDocuments', doc)}
                        className={`cursor-pointer ${
                          currentScholarship.requiredDocuments.includes(doc)
                            ? 'bg-orange-600 text-white hover:bg-orange-700'
                            : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                        }`}
                      >
                        {doc}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <Button onClick={addScholarship} className="bg-blue-600 hover:bg-blue-700 text-white">
                Add Scholarship
              </Button>
              <Button variant="outline" onClick={() => setShowScholarshipForm(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={!institutionData.name || !institutionData.email || scholarships.length === 0}
          className="bg-green-600 hover:bg-green-700 text-white px-8"
        >
          Submit for Review
        </Button>
      </div>
    </div>
  );
}