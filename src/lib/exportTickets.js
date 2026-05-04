const EXPORT_FIELDS = [
  ["id", "ID"],
  ["title", "Title"],
  ["status", "Status"],
  ["priority", "Priority"],
  ["project", "Project"],
  ["reporterName", "Reporter"],
  ["assigneeName", "Assignee"],
  ["createdAt", "Created"],
  ["dueDate", "Due"],
];

function normalizeTicket(ticket) {
  return {
    id: ticket.id,
    title: ticket.title,
    status: ticket.status,
    priority: ticket.priority,
    project: ticket.project,
    reporterName: ticket.reporterName,
    assigneeName: ticket.assigneeName || "Unassigned",
    createdAt: ticket.createdAt,
    dueDate: ticket.dueDate,
  };
}

function escapeCsvValue(value) {
  const text = value == null ? "" : String(value);
  if (/[",\n\r]/.test(text)) {
    return `"${text.replaceAll('"', '""')}"`;
  }
  return text;
}

export function ticketsToJson(tickets) {
  return JSON.stringify(tickets.map(normalizeTicket), null, 2);
}

export function ticketsToCsv(tickets) {
  const header = EXPORT_FIELDS.map(([, label]) => label).join(",");
  const rows = tickets.map((ticket) => {
    const normalized = normalizeTicket(ticket);
    return EXPORT_FIELDS.map(([field]) => escapeCsvValue(normalized[field])).join(",");
  });
  return [header, ...rows].join("\n");
}

export function downloadTextFile(filename, content, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
