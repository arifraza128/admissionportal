/**
 * Role-Based Access Control (RBAC) middleware
 * @param  {...string} allowedRoles - e.g. 'STUDENT', 'ADMISSION_OFFICER', 'FACULTY', 'ADMIN'
 */
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required.' });
    }

    const userRole = (req.user.role || '').toUpperCase();
    const normalizedAllowedRoles = allowedRoles.map((r) => r.toUpperCase());

    if (!normalizedAllowedRoles.includes(userRole)) {
      return res.status(403).json({
        message: `Access denied. Role '${userRole}' is not authorized to access this resource.`,
      });
    }

    next();
  };
};

export default authorizeRoles;
