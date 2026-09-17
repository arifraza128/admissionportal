import React, { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Shield,
  CheckCircle2,
  Mail,
  User
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import useToast from '../../hooks/useToast';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ManageUsers = () => {
  const { showSuccess, showError } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: 'password123',
    role: 'STUDENT',
    department: 'Computer Science & Engineering',
  });
  const [creating, setCreating] = useState(false);

  const fetchUsers = async () => {
    try {
      const data = await adminService.getUsers();
      setUsers(data || []);
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) {
      showError('Validation Error', 'Please complete all required fields.');
      return;
    }

    setCreating(true);
    try {
      await adminService.createUser(newUser);
      showSuccess('User Created', `Account for ${newUser.name} created successfully.`);
      setShowAddModal(false);
      setNewUser({
        name: '',
        email: '',
        password: 'password123',
        role: 'STUDENT',
        department: 'Computer Science & Engineering',
      });
      await fetchUsers();
    } catch (err) {
      showError('Creation Failed', 'Could not create user account.');
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullPage text="Retrieving identity directory..." />;
  }

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">User Accounts Management</h1>
          <p className="page-description">
            Provision identities and control role privileges for Students, Faculty, Officers, and Admins
          </p>
        </div>

        <Button
          variant="primary"
          icon={UserPlus}
          onClick={() => setShowAddModal(true)}
        >
          Add New User
        </Button>
      </div>

      {/* Filters */}
      <div className="card p-4 flex items-center justify-between gap-4 flex-wrap">
        <div className="input-with-icon flex-1 min-w-[260px]">
          <Search size={18} className="input-icon-left" />
          <input
            type="text"
            className="form-input"
            placeholder="Search by user name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter size={18} className="text-muted" />
          <span className="text-xs font-semibold text-muted">Role Filter:</span>
          <select
            className="form-select text-xs py-2"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="ALL">All Roles</option>
            <option value="STUDENT">Student</option>
            <option value="FACULTY">Faculty</option>
            <option value="ADMISSION_OFFICER">Admission Officer</option>
            <option value="ADMIN">System Admin</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <Card title={`Registered Accounts (${filteredUsers.length})`}>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Department</th>
                <th>ID / Reference</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u._id || u.email}>
                  <td>
                    <div className="font-bold text-primary">{u.name}</div>
                    <div className="text-xs text-muted">{u.email}</div>
                  </td>
                  <td>
                    <Badge variant={u.role === 'ADMIN' ? 'danger' : u.role === 'ADMISSION_OFFICER' ? 'warning' : u.role === 'FACULTY' ? 'info' : 'success'} size="sm">
                      {u.role}
                    </Badge>
                  </td>
                  <td>
                    <span className="text-xs text-secondary">{u.department || 'General'}</span>
                  </td>
                  <td>
                    <span className="font-mono text-xs font-bold px-2 py-1 rounded bg-slate-100 text-slate-800">
                      {u.studentId || u.facultyId || u.officerId || u.adminId || 'USR-01'}
                    </span>
                  </td>
                  <td>
                    <Badge variant="success" size="sm">Active</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add User Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Provision New User Account"
        subtitle="Create credentials and assign system role permissions"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleCreateUser}
              isLoading={creating}
              icon={UserPlus}
            >
              Create Account
            </Button>
          </>
        }
      >
        <form className="space-y-4">
          <div className="form-group">
            <label className="form-label" htmlFor="newName">
              Full Legal Name *
            </label>
            <input
              id="newName"
              type="text"
              required
              className="form-input"
              placeholder="e.g. John Doe"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="newEmail">
              Institutional Email *
            </label>
            <input
              id="newEmail"
              type="email"
              required
              className="form-input"
              placeholder="e.g. jdoe@example.com"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label" htmlFor="newRole">
                System Role *
              </label>
              <select
                id="newRole"
                className="form-select"
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              >
                <option value="STUDENT">Student</option>
                <option value="FACULTY">Faculty Member</option>
                <option value="ADMISSION_OFFICER">Admission Officer</option>
                <option value="ADMIN">System Administrator</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="newDept">
                Department *
              </label>
              <input
                id="newDept"
                type="text"
                className="form-input"
                value={newUser.department}
                onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
              />
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageUsers;
