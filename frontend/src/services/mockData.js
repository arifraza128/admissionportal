// High-fidelity Mock Dataset for Standalone Demo & Graceful Backend Fallback

export const MOCK_USERS = [
  {
    _id: 'user_student_01',
    name: 'Arif Raza',
    email: 'arif@example.com',
    role: 'STUDENT',
    department: 'Computer Science & Engineering',
    studentId: 'STU-2026-8801',
    semester: 'Semester 4',
    cgpa: '3.82',
    avatar: 'AR'
  },
  {
    _id: 'user_officer_01',
    name: 'Eleanor Vance',
    email: 'officer@example.com',
    role: 'ADMISSION_OFFICER',
    department: 'Office of Admissions',
    officerId: 'ADM-OFF-102',
    avatar: 'EV'
  },
  {
    _id: 'user_faculty_01',
    name: 'Dr. Robert Oppen',
    email: 'faculty@example.com',
    role: 'FACULTY',
    department: 'Computer Science & Engineering',
    facultyId: 'FAC-CS-401',
    title: 'Professor & Head of AI Lab',
    avatar: 'RO'
  },
  {
    _id: 'user_admin_01',
    name: 'System Administrator',
    email: 'admin@example.com',
    role: 'ADMIN',
    department: 'Central IT & Operations',
    adminId: 'ADM-ROOT-001',
    avatar: 'SA'
  }
];

export const MOCK_COURSES = [
  {
    _id: 'crs_101',
    code: 'CS301',
    name: 'Advanced Data Structures & Algorithms',
    faculty: 'Dr. Robert Oppen',
    facultyId: 'user_faculty_01',
    capacity: 45,
    enrolledCount: 38,
    availableSeats: 7,
    prerequisites: ['CS201 (Data Structures)', 'CS202 (Discrete Math)'],
    credits: 4,
    day: 'Monday',
    startTime: '09:00',
    endTime: '10:30',
    room: 'Hall B-204',
    department: 'Computer Science',
    description: 'Deep exploration of graph algorithms, balanced trees, amortized analysis, and dynamic programming.',
    registrationStatus: 'OPEN'
  },
  {
    _id: 'crs_102',
    code: 'CS305',
    name: 'Database Management Systems',
    faculty: 'Dr. Robert Oppen',
    facultyId: 'user_faculty_01',
    capacity: 50,
    enrolledCount: 42,
    availableSeats: 8,
    prerequisites: ['CS101 (Intro to Programming)'],
    credits: 3,
    day: 'Tuesday',
    startTime: '11:00',
    endTime: '12:30',
    room: 'Lab CS-3',
    department: 'Computer Science',
    description: 'Relational algebra, SQL mastery, indexing techniques, transactions, ACID properties and NoSQL fundamentals.',
    registrationStatus: 'OPEN'
  },
  {
    _id: 'crs_103',
    code: 'CS410',
    name: 'Machine Learning & Neural Networks',
    faculty: 'Dr. Sophia Chen',
    facultyId: 'fac_02',
    capacity: 35,
    enrolledCount: 35,
    availableSeats: 0,
    prerequisites: ['CS301 (Data Structures)', 'MATH204 (Linear Algebra)'],
    credits: 4,
    day: 'Wednesday',
    startTime: '09:00',
    endTime: '10:30',
    room: 'Auditorium 1',
    department: 'Artificial Intelligence',
    description: 'Supervised and unsupervised learning, gradient descent optimization, backpropagation, and CNNs.',
    registrationStatus: 'FULL'
  },
  {
    _id: 'crs_104',
    code: 'CS320',
    name: 'Computer Networks & Distributed Systems',
    faculty: 'Prof. Marcus Vance',
    facultyId: 'fac_03',
    capacity: 40,
    enrolledCount: 29,
    availableSeats: 11,
    prerequisites: ['CS201 (Data Structures)'],
    credits: 3,
    day: 'Thursday',
    startTime: '13:00',
    endTime: '14:30',
    room: 'Hall C-102',
    department: 'Computer Science',
    description: 'OSI and TCP/IP stack, socket programming, routing protocols, flow control and distributed consensus.',
    registrationStatus: 'OPEN'
  },
  {
    _id: 'crs_105',
    code: 'CS450',
    name: 'Cloud Computing & DevOps Architecture',
    faculty: 'Dr. Robert Oppen',
    facultyId: 'user_faculty_01',
    capacity: 40,
    enrolledCount: 36,
    availableSeats: 4,
    prerequisites: ['CS320 (Computer Networks)'],
    credits: 3,
    day: 'Friday',
    startTime: '10:30',
    endTime: '12:00',
    room: 'Cloud Sandbox Lab',
    department: 'Computer Science',
    description: 'Containerization, Kubernetes clustering, CI/CD automation, serverless microservices, and infrastructure as code.',
    registrationStatus: 'OPEN'
  },
  {
    _id: 'crs_106',
    code: 'CS490',
    name: 'Quantum Computing Fundamentals',
    faculty: 'Dr. Liam Thorne',
    facultyId: 'fac_04',
    capacity: 25,
    enrolledCount: 12,
    availableSeats: 13,
    prerequisites: ['MATH204 (Linear Algebra)', 'PHYS102 (Quantum Physics)'],
    credits: 3,
    day: 'Monday',
    startTime: '09:00',
    endTime: '10:30', // Same slot as CS301 to simulate conflict test!
    room: 'Quantum Lab Q-1',
    department: 'Computer Science',
    description: 'Qubits, quantum superposition, entanglement, Grover and Shor algorithms.',
    registrationStatus: 'OPEN'
  }
];

export const MOCK_APPLICATIONS = [
  {
    _id: 'app_001',
    studentId: 'user_student_01',
    applicantName: 'Arif Raza',
    email: 'arif@example.com',
    phone: '+1 (555) 382-9901',
    dateOfBirth: '2003-05-14',
    program: 'B.Sc. Computer Science & Engineering',
    term: 'Fall 2026',
    status: 'APPROVED',
    submissionDate: '2026-08-10T10:30:00Z',
    reviewedBy: 'Eleanor Vance',
    reviewDate: '2026-08-14T14:15:00Z',
    highSchool: 'Apex International Academy',
    gpaScore: '3.92 / 4.00',
    satScore: '1480',
    statementOfPurpose: 'Passionate about distributed systems, operating system architectures, and high-performance computation.',
    documentsCount: 4,
    reviewerNotes: 'Strong mathematical foundation and outstanding entrance exam percentile. Admission approved with honors scholarship consideration.'
  },
  {
    _id: 'app_002',
    studentId: 'user_student_02',
    applicantName: 'Sophia Lin',
    email: 'sophia.lin@example.com',
    phone: '+1 (555) 772-1049',
    dateOfBirth: '2004-01-22',
    program: 'B.Sc. Artificial Intelligence & Data Science',
    term: 'Fall 2026',
    status: 'UNDER_REVIEW',
    submissionDate: '2026-08-18T09:12:00Z',
    highSchool: 'Westview STEM High',
    gpaScore: '3.85 / 4.00',
    satScore: '1420',
    statementOfPurpose: 'Aspiring to conduct research in computer vision and bio-medical imaging machine learning pipelines.',
    documentsCount: 3,
    reviewerNotes: 'Academic transcripts verified. Pending department seat allocation review.'
  },
  {
    _id: 'app_003',
    studentId: 'user_student_03',
    applicantName: 'Liam O’Connor',
    email: 'liam.oc@example.com',
    phone: '+1 (555) 203-8819',
    dateOfBirth: '2003-11-05',
    program: 'B.Sc. Cyber Security',
    term: 'Fall 2026',
    status: 'PENDING',
    submissionDate: '2026-08-20T16:45:00Z',
    highSchool: 'St. Patrick Collegiate',
    gpaScore: '3.65 / 4.00',
    satScore: '1350',
    statementOfPurpose: 'Eager to focus on offensive penetration testing and resilient cryptographic protocols.',
    documentsCount: 2,
    reviewerNotes: ''
  },
  {
    _id: 'app_004',
    studentId: 'user_student_04',
    applicantName: 'Ethan Garcia',
    email: 'ethan.g@example.com',
    phone: '+1 (555) 661-3940',
    dateOfBirth: '2003-09-18',
    program: 'B.Sc. Software Engineering',
    term: 'Fall 2026',
    status: 'REJECTED',
    submissionDate: '2026-08-05T11:20:00Z',
    reviewedBy: 'Eleanor Vance',
    reviewDate: '2026-08-09T10:00:00Z',
    highSchool: 'Oakridge Secondary',
    gpaScore: '2.40 / 4.00',
    satScore: '980',
    statementOfPurpose: 'Looking to join the university for software development.',
    documentsCount: 1,
    reviewerNotes: 'Does not meet minimum prerequisites in High School Calculus and Physics.'
  }
];

export const MOCK_DOCUMENTS = [
  {
    _id: 'doc_101',
    studentId: 'user_student_01',
    fileName: 'Official_HighSchool_Transcript.pdf',
    documentType: 'Academic Transcript',
    fileSize: '2.4 MB',
    uploadedAt: '2026-08-10T10:35:00Z',
    status: 'VERIFIED',
    url: 'https://example.com/docs/transcript.pdf'
  },
  {
    _id: 'doc_102',
    studentId: 'user_student_01',
    fileName: 'National_ID_Passport_Copy.pdf',
    documentType: 'Government Identity Proof',
    fileSize: '1.1 MB',
    uploadedAt: '2026-08-10T10:36:00Z',
    status: 'VERIFIED',
    url: 'https://example.com/docs/id.pdf'
  },
  {
    _id: 'doc_103',
    studentId: 'user_student_01',
    fileName: 'Recommendation_Letter_Math_Dept.pdf',
    documentType: 'Recommendation Letter',
    fileSize: '780 KB',
    uploadedAt: '2026-08-10T10:40:00Z',
    status: 'VERIFIED',
    url: 'https://example.com/docs/lor.pdf'
  },
  {
    _id: 'doc_104',
    studentId: 'user_student_01',
    fileName: 'Statement_of_Purpose_ArifRaza.pdf',
    documentType: 'Personal Essay / SOP',
    fileSize: '450 KB',
    uploadedAt: '2026-08-10T10:42:00Z',
    status: 'VERIFIED',
    url: 'https://example.com/docs/sop.pdf'
  }
];

export const MOCK_REGISTRATIONS = [
  {
    _id: 'reg_201',
    studentId: 'user_student_01',
    courseId: 'crs_101',
    course: MOCK_COURSES[0],
    status: 'ENROLLED',
    registeredAt: '2026-08-25T09:30:00Z',
    semester: 'Fall 2026'
  },
  {
    _id: 'reg_202',
    studentId: 'user_student_01',
    courseId: 'crs_102',
    course: MOCK_COURSES[1],
    status: 'ENROLLED',
    registeredAt: '2026-08-25T09:32:00Z',
    semester: 'Fall 2026'
  },
  {
    _id: 'reg_203',
    studentId: 'user_student_01',
    courseId: 'crs_104',
    course: MOCK_COURSES[3],
    status: 'ENROLLED',
    registeredAt: '2026-08-25T09:35:00Z',
    semester: 'Fall 2026'
  }
];

export const MOCK_RESULTS = [
  {
    _id: 'res_001',
    studentId: 'user_student_01',
    studentName: 'Arif Raza',
    studentEmail: 'arif@example.com',
    courseId: 'crs_101',
    courseCode: 'CS301',
    courseName: 'Advanced Data Structures & Algorithms',
    faculty: 'Dr. Robert Oppen',
    semester: 'Spring 2026',
    credits: 4,
    marks: 92,
    grade: 'A',
    gradePoint: 4.0,
    status: 'PUBLISHED',
    remarks: 'Exemplary performance in algorithmic problem solving and lab assignments.'
  },
  {
    _id: 'res_002',
    studentId: 'user_student_01',
    studentName: 'Arif Raza',
    studentEmail: 'arif@example.com',
    courseId: 'crs_102',
    courseCode: 'CS305',
    courseName: 'Database Management Systems',
    faculty: 'Dr. Robert Oppen',
    semester: 'Spring 2026',
    credits: 3,
    marks: 88,
    grade: 'A-',
    gradePoint: 3.7,
    status: 'PUBLISHED',
    remarks: 'Excellent mastery of query optimization and schema normalization.'
  },
  {
    _id: 'res_003',
    studentId: 'user_student_01',
    studentName: 'Arif Raza',
    studentEmail: 'arif@example.com',
    courseId: 'crs_104',
    courseCode: 'CS320',
    courseName: 'Computer Networks & Distributed Systems',
    faculty: 'Prof. Marcus Vance',
    semester: 'Spring 2026',
    credits: 3,
    marks: 85,
    grade: 'B+',
    gradePoint: 3.3,
    status: 'PUBLISHED',
    remarks: 'Good understanding of transport layer protocols and sockets.'
  },
  {
    _id: 'res_004',
    studentId: 'user_student_01',
    studentName: 'Arif Raza',
    studentEmail: 'arif@example.com',
    courseId: 'crs_legacy_01',
    courseCode: 'MATH204',
    courseName: 'Linear Algebra & Differential Equations',
    faculty: 'Dr. Samuel K',
    semester: 'Fall 2025',
    credits: 4,
    marks: 95,
    grade: 'A+',
    gradePoint: 4.0,
    status: 'PUBLISHED',
    remarks: 'Perfect score in final matrix analysis capstone.'
  }
];

export const MOCK_FACULTY_STUDENTS = [
  {
    _id: 'user_student_01',
    studentId: 'STU-2026-8801',
    name: 'Arif Raza',
    email: 'arif@example.com',
    attendance: '96%',
    marks: 92,
    grade: 'A',
    status: 'ENROLLED',
    remarks: 'Excellent engagement and lab performance.'
  },
  {
    _id: 'stu_002',
    studentId: 'STU-2026-8812',
    name: 'Maya Patel',
    email: 'maya.p@example.com',
    attendance: '91%',
    marks: 84,
    grade: 'B+',
    status: 'ENROLLED',
    remarks: 'Consistent homework submissions.'
  },
  {
    _id: 'stu_003',
    studentId: 'STU-2026-8825',
    name: 'Lucas Bernard',
    email: 'lucas.b@example.com',
    attendance: '88%',
    marks: 78,
    grade: 'B',
    status: 'ENROLLED',
    remarks: 'Good progress in second term.'
  },
  {
    _id: 'stu_004',
    studentId: 'STU-2026-8833',
    name: 'Chloe Zhang',
    email: 'chloe.z@example.com',
    attendance: '98%',
    marks: 96,
    grade: 'A+',
    status: 'ENROLLED',
    remarks: 'Highest score in midterm examination.'
  },
  {
    _id: 'stu_005',
    studentId: 'STU-2026-8849',
    name: 'Daniel Kim',
    email: 'daniel.k@example.com',
    attendance: '74%',
    marks: 68,
    grade: 'C+',
    status: 'ENROLLED',
    remarks: 'Needs improvement in laboratory projects.'
  }
];
