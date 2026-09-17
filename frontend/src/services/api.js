import axios from 'axios';
import {
  MOCK_USERS,
  MOCK_COURSES,
  MOCK_APPLICATIONS,
  MOCK_DOCUMENTS,
  MOCK_REGISTRATIONS,
  MOCK_RESULTS,
  MOCK_FACULTY_STUDENTS
} from './mockData';

// Central Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 6000,
});

// Attach JWT Token to every outgoing request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intelligent Mock Engine for UI Demonstration & Live-Backend Fallback
// State persisted in localStorage to allow end-to-end interactive demo without backend
const getMockStore = (key, fallback) => {
  try {
    const saved = localStorage.getItem(`apex_mock_${key}`);
    return saved ? JSON.parse(saved) : fallback;
  } catch (e) {
    return fallback;
  }
};

const setMockStore = (key, val) => {
  try {
    localStorage.setItem(`apex_mock_${key}`, JSON.stringify(val));
  } catch (e) {
    console.error('Failed to update mock store', e);
  }
};

// Initialize in-browser mock data stores if not already set
if (!localStorage.getItem('apex_mock_courses')) {
  setMockStore('courses', MOCK_COURSES);
}
if (!localStorage.getItem('apex_mock_applications')) {
  setMockStore('applications', MOCK_APPLICATIONS);
}
if (!localStorage.getItem('apex_mock_documents')) {
  setMockStore('documents', MOCK_DOCUMENTS);
}
if (!localStorage.getItem('apex_mock_registrations')) {
  setMockStore('registrations', MOCK_REGISTRATIONS);
}
if (!localStorage.getItem('apex_mock_results')) {
  setMockStore('results', MOCK_RESULTS);
}
if (!localStorage.getItem('apex_mock_faculty_students')) {
  setMockStore('faculty_students', MOCK_FACULTY_STUDENTS);
}
if (!localStorage.getItem('apex_mock_users')) {
  setMockStore('users', MOCK_USERS);
}

// Router simulator for exact endpoints
const handleMockRequest = async (config) => {
  const { url, method, data } = config;
  const parsedData = typeof data === 'string' ? JSON.parse(data || '{}') : (data || {});
  
  // Simulate minor network latency for realistic loading states
  await new Promise((res) => setTimeout(res, 350));

  const cleanUrl = url.replace(/^\/api/, '').replace(/^\//, '');

  // 1. AUTH ENDPOINTS
  if (cleanUrl === 'auth/login' && method.toLowerCase() === 'post') {
    const { email, password } = parsedData;
    const users = getMockStore('users', MOCK_USERS);
    const user = users.find((u) => u.email.toLowerCase() === (email || '').toLowerCase()) || {
      _id: 'user_dynamic_' + Date.now(),
      name: email.split('@')[0],
      email: email,
      role: 'STUDENT',
      department: 'Computer Science & Engineering',
      studentId: 'STU-2026-8801',
      avatar: 'ST'
    };

    return {
      status: 200,
      data: {
        token: 'MOCK_JWT_TOKEN_' + btoa(JSON.stringify(user)),
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          department: user.department,
          studentId: user.studentId || user.facultyId || user.officerId || 'ID-01'
        }
      }
    };
  }

  if (cleanUrl === 'auth/register' && method.toLowerCase() === 'post') {
    const { name, email, password, role } = parsedData;
    const users = getMockStore('users', MOCK_USERS);
    const newUser = {
      _id: 'user_' + Date.now(),
      name,
      email,
      role: role || 'STUDENT',
      department: 'Computer Science & Engineering',
      studentId: 'STU-' + Math.floor(1000 + Math.random() * 9000),
      avatar: name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()
    };
    users.push(newUser);
    setMockStore('users', users);

    return {
      status: 201,
      data: {
        token: 'MOCK_JWT_TOKEN_' + btoa(JSON.stringify(newUser)),
        user: newUser,
        message: 'Registration successful'
      }
    };
  }

  // 2. ADMISSION ENDPOINTS
  if (cleanUrl === 'admission/apply' && method.toLowerCase() === 'post') {
    const applications = getMockStore('applications', MOCK_APPLICATIONS);
    const newApp = {
      _id: 'app_' + Date.now(),
      studentId: parsedData.studentId || 'user_student_01',
      applicantName: parsedData.applicantName || 'Applicant',
      email: parsedData.email || 'applicant@example.com',
      phone: parsedData.phone || '+1 555-0199',
      dateOfBirth: parsedData.dateOfBirth || '2004-01-01',
      program: parsedData.program || 'B.Sc. Computer Science',
      term: parsedData.term || 'Fall 2026',
      status: 'PENDING',
      submissionDate: new Date().toISOString(),
      highSchool: parsedData.highSchool || 'Secondary Academy',
      gpaScore: parsedData.gpaScore || '3.80 / 4.00',
      satScore: parsedData.satScore || '1400',
      statementOfPurpose: parsedData.statementOfPurpose || '',
      documentsCount: 0,
      reviewerNotes: ''
    };
    applications.unshift(newApp);
    setMockStore('applications', applications);
    return { status: 201, data: newApp };
  }

  if (cleanUrl === 'admission/my-application' && method.toLowerCase() === 'get') {
    const applications = getMockStore('applications', MOCK_APPLICATIONS);
    const myApp = applications[0] || null;
    return { status: 200, data: myApp };
  }

  if (cleanUrl === 'admission/applications' && method.toLowerCase() === 'get') {
    const applications = getMockStore('applications', MOCK_APPLICATIONS);
    return { status: 200, data: applications };
  }

  const appDetailMatch = cleanUrl.match(/^admission\/applications\/([^/]+)$/);
  if (appDetailMatch && method.toLowerCase() === 'get') {
    const id = appDetailMatch[1];
    const applications = getMockStore('applications', MOCK_APPLICATIONS);
    const app = applications.find((a) => a._id === id) || applications[0];
    return { status: 200, data: app };
  }

  const appApproveMatch = cleanUrl.match(/^admission\/applications\/([^/]+)\/approve$/);
  if (appApproveMatch && method.toLowerCase() === 'put') {
    const id = appApproveMatch[1];
    const applications = getMockStore('applications', MOCK_APPLICATIONS);
    const index = applications.findIndex((a) => a._id === id);
    if (index !== -1) {
      applications[index].status = 'APPROVED';
      applications[index].reviewerNotes = parsedData.reviewerNotes || 'Application meets all university criteria. Approved.';
      applications[index].reviewedBy = parsedData.reviewedBy || 'Eleanor Vance';
      applications[index].reviewDate = new Date().toISOString();
      setMockStore('applications', applications);
      return { status: 200, data: applications[index] };
    }
  }

  const appRejectMatch = cleanUrl.match(/^admission\/applications\/([^/]+)\/reject$/);
  if (appRejectMatch && method.toLowerCase() === 'put') {
    const id = appRejectMatch[1];
    const applications = getMockStore('applications', MOCK_APPLICATIONS);
    const index = applications.findIndex((a) => a._id === id);
    if (index !== -1) {
      applications[index].status = 'REJECTED';
      applications[index].reviewerNotes = parsedData.reviewerNotes || 'Application does not meet prerequisite requirements.';
      applications[index].reviewedBy = parsedData.reviewedBy || 'Eleanor Vance';
      applications[index].reviewDate = new Date().toISOString();
      setMockStore('applications', applications);
      return { status: 200, data: applications[index] };
    }
  }

  // 3. DOCUMENTS ENDPOINTS
  if (cleanUrl === 'documents' && method.toLowerCase() === 'get') {
    const docs = getMockStore('documents', MOCK_DOCUMENTS);
    return { status: 200, data: docs };
  }

  if (cleanUrl === 'documents/upload' && method.toLowerCase() === 'post') {
    const docs = getMockStore('documents', MOCK_DOCUMENTS);
    const newDoc = {
      _id: 'doc_' + Date.now(),
      studentId: 'user_student_01',
      fileName: parsedData.fileName || 'Uploaded_Document.pdf',
      documentType: parsedData.documentType || 'Identity Proof',
      fileSize: parsedData.fileSize || '1.5 MB',
      uploadedAt: new Date().toISOString(),
      status: 'VERIFIED',
      url: '#'
    };
    docs.unshift(newDoc);
    setMockStore('documents', docs);
    return { status: 201, data: newDoc };
  }

  const docDeleteMatch = cleanUrl.match(/^documents\/([^/]+)$/);
  if (docDeleteMatch && method.toLowerCase() === 'delete') {
    const id = docDeleteMatch[1];
    let docs = getMockStore('documents', MOCK_DOCUMENTS);
    docs = docs.filter((d) => d._id !== id);
    setMockStore('documents', docs);
    return { status: 200, data: { message: 'Document deleted successfully', id } };
  }

  // 4. COURSES ENDPOINTS
  if (cleanUrl === 'courses' && method.toLowerCase() === 'get') {
    const courses = getMockStore('courses', MOCK_COURSES);
    return { status: 200, data: courses };
  }

  const courseDetailMatch = cleanUrl.match(/^courses\/([^/]+)$/);
  if (courseDetailMatch && method.toLowerCase() === 'get') {
    const id = courseDetailMatch[1];
    const courses = getMockStore('courses', MOCK_COURSES);
    const course = courses.find((c) => c._id === id || c.code === id) || courses[0];
    return { status: 200, data: course };
  }

  if (cleanUrl === 'courses' && method.toLowerCase() === 'post') {
    const courses = getMockStore('courses', MOCK_COURSES);
    const newCourse = {
      _id: 'crs_' + Date.now(),
      code: parsedData.code || 'CS' + Math.floor(100 + Math.random() * 800),
      name: parsedData.name || 'New Course Title',
      faculty: parsedData.faculty || 'Dr. Robert Oppen',
      capacity: Number(parsedData.capacity) || 40,
      enrolledCount: 0,
      availableSeats: Number(parsedData.capacity) || 40,
      prerequisites: Array.isArray(parsedData.prerequisites) ? parsedData.prerequisites : (parsedData.prerequisites ? [parsedData.prerequisites] : []),
      credits: Number(parsedData.credits) || 3,
      day: parsedData.day || 'Monday',
      startTime: parsedData.startTime || '10:00',
      endTime: parsedData.endTime || '11:30',
      room: parsedData.room || 'Room 101',
      department: parsedData.department || 'Computer Science',
      description: parsedData.description || 'Course description...',
      registrationStatus: 'OPEN'
    };
    courses.push(newCourse);
    setMockStore('courses', courses);
    return { status: 201, data: newCourse };
  }

  const courseUpdateMatch = cleanUrl.match(/^courses\/([^/]+)$/);
  if (courseUpdateMatch && method.toLowerCase() === 'put') {
    const id = courseUpdateMatch[1];
    const courses = getMockStore('courses', MOCK_COURSES);
    const idx = courses.findIndex((c) => c._id === id);
    if (idx !== -1) {
      courses[idx] = { ...courses[idx], ...parsedData };
      setMockStore('courses', courses);
      return { status: 200, data: courses[idx] };
    }
  }

  const courseDeleteMatch = cleanUrl.match(/^courses\/([^/]+)$/);
  if (courseDeleteMatch && method.toLowerCase() === 'delete') {
    const id = courseDeleteMatch[1];
    let courses = getMockStore('courses', MOCK_COURSES);
    courses = courses.filter((c) => c._id !== id);
    setMockStore('courses', courses);
    return { status: 200, data: { message: 'Course deleted successfully' } };
  }

  // 5. REGISTRATIONS ENDPOINTS (AUTHORITATIVE BACKEND RESPONSES SIMULATOR)
  if (cleanUrl === 'registrations/my' && method.toLowerCase() === 'get') {
    const regs = getMockStore('registrations', MOCK_REGISTRATIONS);
    return { status: 200, data: regs };
  }

  if (cleanUrl === 'registrations' && method.toLowerCase() === 'post') {
    const { courseId } = parsedData;
    const courses = getMockStore('courses', MOCK_COURSES);
    const regs = getMockStore('registrations', MOCK_REGISTRATIONS);
    const course = courses.find((c) => c._id === courseId);

    if (!course) {
      return {
        status: 404,
        data: { status: 'REJECTED', reason: 'Course not found in the university catalog.' }
      };
    }

    // 1. DUPLICATE CHECK
    const isDuplicate = regs.some((r) => r.courseId === courseId || (r.course && r.course.code === course.code));
    if (isDuplicate) {
      return {
        status: 200,
        data: {
          status: 'REJECTED',
          reason: `Student is already registered for this course (${course.code}).`
        }
      };
    }

    // 2. PREREQUISITE FAILURE TEST SIMULATION
    // If course is CS410 and student doesn't meet prerequisite or specifically triggers demo failure
    if (course.code === 'CS490') {
      return {
        status: 200,
        data: {
          status: 'REJECTED',
          reason: 'Prerequisite Quantum Physics (PHYS102) has not been completed.'
        }
      };
    }

    // 3. TIMETABLE CONFLICT TEST SIMULATION
    // If day and time overlap with an already registered course
    const conflictingReg = regs.find(
      (r) => r.course && r.course.day === course.day && r.course.startTime === course.startTime
    );
    if (conflictingReg) {
      return {
        status: 200,
        data: {
          status: 'REJECTED',
          reason: `Timetable conflict with ${conflictingReg.course.name} (${conflictingReg.course.code}) on ${course.day} at ${course.startTime}.`
        }
      };
    }

    // 4. WAITLIST (CAPACITY REACHED)
    if (course.enrolledCount >= course.capacity || course.availableSeats <= 0) {
      const waitlistReg = {
        _id: 'reg_wait_' + Date.now(),
        studentId: 'user_student_01',
        courseId: course._id,
        course: course,
        status: 'WAITLISTED',
        registeredAt: new Date().toISOString(),
        semester: 'Fall 2026'
      };
      regs.push(waitlistReg);
      setMockStore('registrations', regs);
      return {
        status: 200,
        data: {
          status: 'WAITLISTED',
          message: 'Course capacity reached. Student added to waitlist.',
          registration: waitlistReg
        }
      };
    }

    // 5. SUCCESSFUL ENROLLMENT
    course.enrolledCount += 1;
    course.availableSeats = Math.max(0, course.capacity - course.enrolledCount);
    const newReg = {
      _id: 'reg_' + Date.now(),
      studentId: 'user_student_01',
      courseId: course._id,
      course: course,
      status: 'ENROLLED',
      registeredAt: new Date().toISOString(),
      semester: 'Fall 2026'
    };
    regs.push(newReg);
    setMockStore('registrations', regs);
    setMockStore('courses', courses);

    return {
      status: 200,
      data: {
        status: 'ENROLLED',
        message: 'Course registration successful.',
        registration: newReg
      }
    };
  }

  const regDeleteMatch = cleanUrl.match(/^registrations\/([^/]+)$/);
  if (regDeleteMatch && method.toLowerCase() === 'delete') {
    const id = regDeleteMatch[1];
    let regs = getMockStore('registrations', MOCK_REGISTRATIONS);
    const targetReg = regs.find((r) => r._id === id || r.courseId === id);
    if (targetReg && targetReg.course) {
      // Restore seat
      const courses = getMockStore('courses', MOCK_COURSES);
      const cIdx = courses.findIndex((c) => c._id === targetReg.courseId);
      if (cIdx !== -1) {
        courses[cIdx].enrolledCount = Math.max(0, courses[cIdx].enrolledCount - 1);
        courses[cIdx].availableSeats = courses[cIdx].capacity - courses[cIdx].enrolledCount;
        setMockStore('courses', courses);
      }
    }
    regs = regs.filter((r) => r._id !== id && r.courseId !== id);
    setMockStore('registrations', regs);
    return { status: 200, data: { message: 'Registration dropped successfully' } };
  }

  // 6. TIMETABLE ENDPOINT
  if (cleanUrl === 'timetable' && method.toLowerCase() === 'get') {
    const regs = getMockStore('registrations', MOCK_REGISTRATIONS);
    const enrolledCourses = regs
      .filter((r) => r.status === 'ENROLLED' && r.course)
      .map((r) => r.course);
    return { status: 200, data: enrolledCourses };
  }

  // 7. RESULTS ENDPOINTS
  if (cleanUrl === 'results' && method.toLowerCase() === 'get') {
    const results = getMockStore('results', MOCK_RESULTS);
    return { status: 200, data: results };
  }

  if (cleanUrl === 'results' && method.toLowerCase() === 'post') {
    const results = getMockStore('results', MOCK_RESULTS);
    const newResult = {
      _id: 'res_' + Date.now(),
      studentId: parsedData.studentId || 'user_student_01',
      studentName: parsedData.studentName || 'Student',
      courseId: parsedData.courseId || 'crs_101',
      courseCode: parsedData.courseCode || 'CS301',
      courseName: parsedData.courseName || 'Course Name',
      faculty: parsedData.faculty || 'Dr. Robert Oppen',
      semester: parsedData.semester || 'Spring 2026',
      credits: parsedData.credits || 3,
      marks: Number(parsedData.marks) || 85,
      grade: parsedData.grade || 'A',
      gradePoint: parsedData.gradePoint || 4.0,
      status: 'PUBLISHED',
      remarks: parsedData.remarks || 'Grade finalized.'
    };
    results.push(newResult);
    setMockStore('results', results);
    return { status: 201, data: newResult };
  }

  const resultUpdateMatch = cleanUrl.match(/^results\/([^/]+)$/);
  if (resultUpdateMatch && method.toLowerCase() === 'put') {
    const id = resultUpdateMatch[1];
    const results = getMockStore('results', MOCK_RESULTS);
    const idx = results.findIndex((r) => r._id === id);
    if (idx !== -1) {
      results[idx] = { ...results[idx], ...parsedData };
      setMockStore('results', results);
      return { status: 200, data: results[idx] };
    }
  }

  // Fallback generic response
  return { status: 200, data: { success: true, message: 'Mock response executed.' } };
};

// Response Interceptor with Intelligent Mock Fallback
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // If backend is offline or network error occurs, fall back to high-fidelity mock engine
    const isNetworkError = !error.response || error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED';
    const isDevMockFallback = isNetworkError || error.response?.status === 404;

    if (isDevMockFallback) {
      console.info(`[Apex API Adapter] Utilizing intelligent client-side simulation for ${error.config?.method?.toUpperCase()} ${error.config?.url}`);
      try {
        const mockRes = await handleMockRequest(error.config);
        return Promise.resolve(mockRes);
      } catch (mockErr) {
        return Promise.reject(mockErr);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
export { api };
