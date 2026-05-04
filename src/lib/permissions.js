export const ROLES = {
  ADMIN: "admin",
  ENGINEER: "engineer",
  PM: "pm",
};

export const ROLE_LABELS = {
  [ROLES.ADMIN]: "Admin",
  [ROLES.ENGINEER]: "Engineer",
  [ROLES.PM]: "PM",
};

export function canCreateTicket(user) {
  return [ROLES.ADMIN, ROLES.PM].includes(user?.role);
}

export function canAssignTicket(user) {
  return [ROLES.ADMIN, ROLES.PM].includes(user?.role);
}

export function canExportTickets(user) {
  return [ROLES.ADMIN, ROLES.PM].includes(user?.role);
}

export function canDeleteTicket(user) {
  return user?.role === ROLES.ADMIN;
}

export function canUpdateTicket(user, ticket) {
  if (!user || !ticket) return false;
  if ([ROLES.ADMIN, ROLES.PM].includes(user.role)) return true;
  return user.role === ROLES.ENGINEER && ticket.assigneeId === user.id;
}

export function getPermissionSummary(user) {
  if (!user) return "Sign in to view ticket access.";
  if (user.role === ROLES.ADMIN) return "Full access to tickets, assignments, exports, and team settings.";
  if (user.role === ROLES.PM) return "Can create tickets, assign engineers, update tickets, and export reports.";
  return "Can read tickets and update tickets assigned to you.";
}
