// Date, Time, Currency, and Status Formatters

export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

export const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export const getStatusBadgeVariant = (status) => {
  if (!status) return 'neutral';
  const s = status.toUpperCase();
  switch (s) {
    case 'APPROVED':
    case 'ENROLLED':
    case 'ACTIVE':
    case 'SUCCESS':
    case 'COMPLETED':
      return 'success';
    case 'PENDING':
    case 'UNDER_REVIEW':
    case 'WAITLISTED':
    case 'IN_PROGRESS':
      return 'warning';
    case 'REJECTED':
    case 'DROPPED':
    case 'INACTIVE':
    case 'FAILED':
      return 'danger';
    case 'SUBMITTED':
    case 'REGISTERED':
    case 'CONFIRMED':
      return 'info';
    default:
      return 'neutral';
  }
};

export const getGradePoint = (grade) => {
  const map = {
    'A+': 4.0,
    'A': 4.0,
    'A-': 3.7,
    'B+': 3.3,
    'B': 3.0,
    'B-': 2.7,
    'C+': 2.3,
    'C': 2.0,
    'C-': 1.7,
    'D': 1.0,
    'F': 0.0,
  };
  return map[grade] !== undefined ? map[grade] : 0.0;
};

export const calculateCGPA = (results = []) => {
  if (!results.length) return '0.00';
  let totalPoints = 0;
  let totalCredits = 0;

  results.forEach(res => {
    const credits = res.credits || (res.course && res.course.credits) || 3;
    const grade = res.grade || 'A';
    totalPoints += getGradePoint(grade) * credits;
    totalCredits += credits;
  });

  if (totalCredits === 0) return '0.00';
  return (totalPoints / totalCredits).toFixed(2);
};
