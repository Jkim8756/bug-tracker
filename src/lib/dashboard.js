export function countBy(tickets, field) {
  return tickets.reduce((counts, ticket) => {
    counts[ticket[field]] = (counts[ticket[field]] || 0) + 1;
    return counts;
  }, {});
}

export function getDashboardSummary(tickets) {
  const activeTickets = tickets.filter((ticket) => ticket.status !== "Resolved");
  const criticalTickets = tickets.filter((ticket) => ticket.priority === "Critical");
  const unassignedTickets = tickets.filter((ticket) => !ticket.assigneeId);
  const resolvedTickets = tickets.filter((ticket) => ticket.status === "Resolved");

  return {
    total: tickets.length,
    active: activeTickets.length,
    critical: criticalTickets.length,
    unassigned: unassignedTickets.length,
    resolved: resolvedTickets.length,
    statusCounts: countBy(tickets, "status"),
    priorityCounts: countBy(tickets, "priority"),
    assigneeCounts: countBy(
      tickets.map((ticket) => ({ ...ticket, assigneeName: ticket.assigneeName || "Unassigned" })),
      "assigneeName",
    ),
  };
}
