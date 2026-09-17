import React, { useState } from 'react';
import {
  User,
  Mail,
  GraduationCap,
  Phone,
  MapPin,
  Shield,
  Save,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import useToast from '../../hooks/useToast';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const Profile = () => {
  const { user } = useAuth();
  const { showSuccess } = useToast();

  const [formData, setFormData] = useState({
    name: user?.name || 'Arif Raza',
    email: user?.email || 'arif@example.com',
    studentId: user?.studentId || 'STU-2026-8801',
    department: 'Computer Science & Engineering',
    semester: 'Semester 4',
    advisor: 'Dr. Robert Oppen',
    phone: '+1 (555) 382-9901',
    address: '450 University Avenue, Apt 4B, Cambridge, MA',
    emergencyContact: 'Sarah Raza (+1 555-901-2244) [Mother]',
  });

  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      showSuccess('Profile Updated', 'Your student contact preferences have been saved.');
    }, 400);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Student Profile & Academic Record</h1>
          <p className="page-description">
            Manage your personal contact info, emergency contacts, and view advisor details
          </p>
        </div>
      </div>

      <form onSubmit={handleSave}>
        <div className="grid grid-cols-3 gap-6">
          {/* Identity Card */}
          <div className="col-span-1">
            <Card className="text-center p-6">
              <div
                className="mx-auto mb-4 w-24 h-24 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 text-white font-extrabold text-2xl flex items-center justify-center shadow-lg"
                style={{
                  width: 80,
                  height: 80,
                  margin: '0 auto 1rem',
                  background: 'linear-gradient(135deg, #2563eb, #38bdf8)',
                  color: '#ffffff',
                }}
              >
                {user?.name
                  ? user.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .substring(0, 2)
                      .toUpperCase()
                  : 'AR'}
              </div>

              <h3 className="font-bold text-base text-primary">{formData.name}</h3>
              <p className="text-xs text-muted mb-4">{formData.email}</p>

              <div className="space-y-2 text-left text-xs border-t pt-4">
                <div className="flex justify-between">
                  <span className="text-muted">Student ID:</span>
                  <span className="font-mono font-bold text-primary">{formData.studentId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Department:</span>
                  <span className="font-semibold text-primary">CSE</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Status:</span>
                  <span className="font-bold text-emerald-600">Active / Enrolled</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Edit Details */}
          <div className="col-span-2 space-y-6">
            <Card title="Personal & Academic Information">
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label" htmlFor="name">
                    Full Legal Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    className="form-input"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="email">
                    Institutional Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    disabled
                    className="form-input bg-slate-100 cursor-not-allowed"
                    value={formData.email}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="phone">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="text"
                    className="form-input"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Academic Advisor
                  </label>
                  <input
                    type="text"
                    disabled
                    className="form-input bg-slate-100 cursor-not-allowed"
                    value={formData.advisor}
                  />
                </div>

                <div className="form-group col-span-2">
                  <label className="form-label" htmlFor="address">
                    Current Residential Address
                  </label>
                  <input
                    id="address"
                    name="address"
                    type="text"
                    className="form-input"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group col-span-2">
                  <label className="form-label" htmlFor="emergencyContact">
                    Emergency Contact Details
                  </label>
                  <input
                    id="emergencyContact"
                    name="emergencyContact"
                    type="text"
                    className="form-input"
                    value={formData.emergencyContact}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t mt-4">
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={saving}
                  icon={Save}
                >
                  Save Profile Changes
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Profile;
