/**
 * Converts HH:mm time string (e.g. "10:30") to minutes from midnight (630)
 * @param {string} timeStr - Time in HH:mm format
 * @returns {number} Minutes from midnight
 */
export const timeToMinutes = (timeStr) => {
  if (!timeStr || typeof timeStr !== 'string') return 0;
  const parts = timeStr.trim().split(':');
  const hours = parseInt(parts[0], 10) || 0;
  const minutes = parseInt(parts[1], 10) || 0;
  return hours * 60 + minutes;
};

/**
 * Checks if two course schedule intervals overlap on the same day.
 * Rule: existing.start < new.end AND new.start < existing.end
 * 
 * @param {Object} schedule1 - { day, start, end }
 * @param {Object} schedule2 - { day, start, end }
 * @returns {boolean} true if overlapping conflict exists
 */
export const isScheduleConflicting = (schedule1, schedule2) => {
  if (!schedule1 || !schedule2) return false;
  if (!schedule1.day || !schedule2.day) return false;

  // Day check (case-insensitive)
  if (schedule1.day.toLowerCase() !== schedule2.day.toLowerCase()) {
    return false;
  }

  const start1 = timeToMinutes(schedule1.start);
  const end1 = timeToMinutes(schedule1.end);
  const start2 = timeToMinutes(schedule2.start);
  const end2 = timeToMinutes(schedule2.end);

  // Exact collision rule: start1 < end2 AND start2 < end1
  return start1 < end2 && start2 < end1;
};

export default {
  timeToMinutes,
  isScheduleConflicting,
};
