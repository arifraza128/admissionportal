import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  User,
  GraduationCap,
  BookOpen,
  Send,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import useToast from '../../hooks/useToast';
import { admissionService } from '../../services/admissionService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const AdmissionApply = () => {
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    applicantName: user?.name || 'Arif Raza',
    email: user?.email || 'arif@example.com',
    phone: '+1 (555) 382-9901',
    dateOfBirth: '2003-05-14',
    address: '450 University Avenue, Apt 4B, Cambridge, MA',
    highSchool: 'Apex International STEM Academy',
    graduationYear: '2022',
    gpaScore: '3.92 / 4.00',
    satScore: '1480',
    program: 'B.Sc. Computer Science & Engineering',
    term: 'Fall 2026',
    statementOfPurpose:
      'Passionate about computer systems architecture, algorithmic efficiency, and scalable distributed computing platforms.',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await admissionService.apply(formData);
      showSuccess(
        'Application Submitted!',
        'Your admission application has been registered. Please upload your supporting documents.'
      );
      navigate('/student/upload-documents');
    } catch (err) {
      showError(
        'Submission Failed',
        err.response?.data?.message || 'Could not submit application.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Undergraduate Admission Application</h1>
          <p className="page-description">
            Complete your official application dossier for the upcoming academic session
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Step 1: Personal Information */}
        <Card
          title="1. Personal & Contact Information"
          subtitle="Ensure your contact details match official government records"
          className="mb-6"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label" htmlFor="applicantName">
                Full Legal Name *
              </label>
              <input
                id="applicantName"
                name="applicantName"
                type="text"
                required
                className="form-input"
                value={formData.applicantName}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="email">
                Email Address *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="form-input"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="phone">
                Contact Phone *
              </label>
              <input
                id="phone"
                name="phone"
                type="text"
                required
                className="form-input"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="dateOfBirth">
                Date of Birth *
              </label>
              <input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                required
                className="form-input"
                value={formData.dateOfBirth}
                onChange={handleChange}
              />
            </div>

            <div className="form-group col-span-2">
              <label className="form-label" htmlFor="address">
                Residential Address *
              </label>
              <input
                id="address"
                name="address"
                type="text"
                required
                className="form-input"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
          </div>
        </Card>

        {/* Step 2: Academic Background */}
        <Card
          title="2. Academic Qualifications"
          subtitle="Secondary schooling grades and standardized evaluation scores"
          className="mb-6"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label" htmlFor="highSchool">
                High School / Previous College *
              </label>
              <input
                id="highSchool"
                name="highSchool"
                type="text"
                required
                className="form-input"
                value={formData.highSchool}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="graduationYear">
                Graduation Year *
              </label>
              <input
                id="graduationYear"
                name="graduationYear"
                type="number"
                required
                className="form-input"
                value={formData.graduationYear}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="gpaScore">
                Cumulative GPA / Percentage *
              </label>
              <input
                id="gpaScore"
                name="gpaScore"
                type="text"
                required
                className="form-input"
                placeholder="e.g. 3.90 / 4.00"
                value={formData.gpaScore}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="satScore">
                SAT / ACT Score (Optional)
              </label>
              <input
                id="satScore"
                name="satScore"
                type="text"
                className="form-input"
                placeholder="e.g. 1480"
                value={formData.satScore}
                onChange={handleChange}
              />
            </div>
          </div>
        </Card>

        {/* Step 3: Program & Statement */}
        <Card
          title="3. Program Choice & Statement of Purpose"
          subtitle="Select your preferred academic department and career objective"
          className="mb-6"
        >
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="form-group">
              <label className="form-label" htmlFor="program">
                Intended Academic Program *
              </label>
              <select
                id="program"
                name="program"
                required
                className="form-select"
                value={formData.program}
                onChange={handleChange}
              >
                <option value="B.Sc. Computer Science & Engineering">B.Sc. Computer Science & Engineering</option>
                <option value="B.Sc. Artificial Intelligence & Data Science">B.Sc. Artificial Intelligence & Data Science</option>
                <option value="B.Sc. Software Engineering">B.Sc. Software Engineering</option>
                <option value="B.Sc. Cyber Security">B.Sc. Cyber Security</option>
                <option value="B.Sc. Information Technology">B.Sc. Information Technology</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="term">
                Enrollment Term *
              </label>
              <select
                id="term"
                name="term"
                required
                className="form-select"
                value={formData.term}
                onChange={handleChange}
              >
                <option value="Fall 2026">Fall 2026</option>
                <option value="Spring 2027">Spring 2027</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="statementOfPurpose">
              Statement of Purpose (SOP) *
            </label>
            <textarea
              id="statementOfPurpose"
              name="statementOfPurpose"
              rows={4}
              required
              className="form-textarea"
              placeholder="Briefly describe your academic aspirations, motivations, and background..."
              value={formData.statementOfPurpose}
              onChange={handleChange}
            />
          </div>
        </Card>

        <div className="flex justify-end gap-3">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            icon={Send}
          >
            Submit Application
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdmissionApply;
