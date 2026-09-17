import React from 'react';
import {
  BarChart3,
  TrendingUp,
  PieChart,
  Users,
  BookOpen,
  CheckCircle2,
  Download
} from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';

const SystemReports = () => {
  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">University System Reports & Analytics</h1>
          <p className="page-description">
            Enrollment capacity metrics, admission yield analytics, and faculty course distribution
          </p>
        </div>

        <Button variant="secondary" icon={Download} onClick={() => window.print()}>
          Export Full Report
        </Button>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-3 gap-6">
        <Card title="Admission Conversion Yield" subtitle="Fall 2026 Intake">
          <div className="flex items-center justify-between my-2">
            <span className="text-3xl font-extrabold text-primary">75.0%</span>
            <Badge variant="success" size="md">Strong Yield</Badge>
          </div>
          <p className="text-xs text-muted mb-4">
            3 out of 4 submitted undergraduate dossiers approved with verified credentials.
          </p>
          <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
            <div className="bg-emerald-500 h-3 rounded-full" style={{ width: '75%' }} />
          </div>
        </Card>

        <Card title="Course Capacity Utilization" subtitle="Catalog-wide registration fill rate">
          <div className="flex items-center justify-between my-2">
            <span className="text-3xl font-extrabold text-primary">82.4%</span>
            <Badge variant="info" size="md">Optimal Load</Badge>
          </div>
          <p className="text-xs text-muted mb-4">
            192 seats filled out of 233 aggregate classroom capacity.
          </p>
          <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
            <div className="bg-blue-600 h-3 rounded-full" style={{ width: '82.4%' }} />
          </div>
        </Card>

        <Card title="Academic Retention Rate" subtitle="Undergraduate cohort progression">
          <div className="flex items-center justify-between my-2">
            <span className="text-3xl font-extrabold text-primary">96.8%</span>
            <Badge variant="success" size="md">High Retention</Badge>
          </div>
          <p className="text-xs text-muted mb-4">
            Student cohort maintaining cumulative GPA ≥ 3.00 with zero dropouts.
          </p>
          <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
            <div className="bg-purple-600 h-3 rounded-full" style={{ width: '96.8%' }} />
          </div>
        </Card>
      </div>

      {/* Breakdown Tables */}
      <div className="grid grid-cols-2 gap-6">
        <Card title="Department Course Load">
          <div className="space-y-3">
            <div className="p-3 rounded-lg border border-color flex items-center justify-between">
              <div>
                <div className="font-bold text-sm text-primary">Computer Science & Engineering</div>
                <div className="text-xs text-muted">4 Assigned Subjects • 145 Students</div>
              </div>
              <span className="font-mono text-xs font-bold text-emerald-600">88% Capacity</span>
            </div>

            <div className="p-3 rounded-lg border border-color flex items-center justify-between">
              <div>
                <div className="font-bold text-sm text-primary">Artificial Intelligence & Data</div>
                <div className="text-xs text-muted">1 Assigned Subject • 35 Students</div>
              </div>
              <span className="font-mono text-xs font-bold text-amber-600">100% (Full)</span>
            </div>

            <div className="p-3 rounded-lg border border-color flex items-center justify-between">
              <div>
                <div className="font-bold text-sm text-primary">Quantum Information Systems</div>
                <div className="text-xs text-muted">1 Assigned Subject • 12 Students</div>
              </div>
              <span className="font-mono text-xs font-bold text-blue-600">48% Capacity</span>
            </div>
          </div>
        </Card>

        <Card title="Application Pipeline Summary">
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="font-semibold text-secondary">Total Submissions Received</span>
              <span className="font-bold text-primary">4 Dossiers</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900">
              <span className="font-semibold">Approved & Enrolled</span>
              <span className="font-bold">3 Candidates</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-900">
              <span className="font-semibold">Prerequisite Shortfalls (Rejected)</span>
              <span className="font-bold">1 Candidate</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-900">
              <span className="font-semibold">Average Admitted High School GPA</span>
              <span className="font-bold">3.88 / 4.00</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SystemReports;
