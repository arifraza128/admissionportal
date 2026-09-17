import React, { useState } from 'react';
import {
  Users,
  BookOpen,
  Award,
  Mail,
  CheckCircle2,
  Building
} from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';

const FACULTY_MEMBERS = [
  {
    id: 'fac_01',
    name: 'Dr. Robert Oppen',
    email: 'robert.oppen@example.com',
    department: 'Computer Science & Engineering',
    title: 'Professor & Head of Lab',
    coursesCount: 3,
    courses: ['CS301 (Data Structures)', 'CS305 (DBMS)', 'CS450 (Cloud Computing)'],
    office: 'Building 4, Room 402',
    status: 'ACTIVE'
  },
  {
    id: 'fac_02',
    name: 'Dr. Sophia Chen',
    email: 'sophia.chen@example.com',
    department: 'Artificial Intelligence',
    title: 'Associate Professor',
    coursesCount: 2,
    courses: ['CS410 (Machine Learning)', 'AI201 (Intro to AI)'],
    office: 'AI Center, Room 102',
    status: 'ACTIVE'
  },
  {
    id: 'fac_03',
    name: 'Prof. Marcus Vance',
    email: 'marcus.vance@example.com',
    department: 'Computer Science & Engineering',
    title: 'Assistant Professor',
    coursesCount: 2,
    courses: ['CS320 (Computer Networks)', 'CS101 (Intro to CS)'],
    office: 'Building 2, Room 210',
    status: 'ACTIVE'
  },
  {
    id: 'fac_04',
    name: 'Dr. Liam Thorne',
    email: 'liam.thorne@example.com',
    department: 'Quantum Information Science',
    title: 'Principal Research Scientist',
    coursesCount: 1,
    courses: ['CS490 (Quantum Computing)'],
    office: 'Quantum Lab, Room Q-10',
    status: 'ACTIVE'
  }
];

const ManageFaculty = () => {
  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Faculty & Department Assignments</h1>
          <p className="page-description">
            Monitor professor course loads, academic departments, and laboratory assignments
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {FACULTY_MEMBERS.map((fac) => (
          <Card key={fac.id} className="card-elevated">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <h3 className="font-bold text-base text-primary">{fac.name}</h3>
                <p className="text-xs text-muted">{fac.title} • {fac.department}</p>
              </div>
              <Badge variant="success" size="sm">
                {fac.status}
              </Badge>
            </div>

            <div className="space-y-2 text-xs text-secondary border-t pt-3">
              <div className="flex items-center justify-between">
                <span className="text-muted flex items-center gap-1">
                  <Mail size={14} /> Email:
                </span>
                <span className="font-semibold text-primary">{fac.email}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted flex items-center gap-1">
                  <Building size={14} /> Office:
                </span>
                <span className="font-semibold text-primary">{fac.office}</span>
              </div>

              <div className="pt-2">
                <span className="text-muted block mb-1 font-semibold">Assigned Courses ({fac.coursesCount}):</span>
                <div className="flex flex-wrap gap-1">
                  {fac.courses.map((c, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-mono text-[11px] font-bold">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ManageFaculty;
