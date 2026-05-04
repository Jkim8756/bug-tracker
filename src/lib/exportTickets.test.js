import { describe, expect, it } from "vitest";
import { ticketsToCsv, ticketsToJson } from "./exportTickets";

const ticket = {
  id: "BUG-1",
  title: "CSV export, comma issue",
  status: "Open",
  priority: "High",
  project: "Reporting",
  reporterName: "Maya Patel",
  assigneeName: "",
  createdAt: "2026-05-01",
  dueDate: "2026-05-08",
  internalNote: "Do not export",
};

describe("ticket export utilities", () => {
  it("escapes CSV values and preserves reviewed field order", () => {
    expect(ticketsToCsv([ticket])).toBe(
      'ID,Title,Status,Priority,Project,Reporter,Assignee,Created,Due\nBUG-1,"CSV export, comma issue",Open,High,Reporting,Maya Patel,Unassigned,2026-05-01,2026-05-08',
    );
  });

  it("omits internal fields from JSON export", () => {
    const exported = JSON.parse(ticketsToJson([ticket]));
    expect(exported[0].internalNote).toBeUndefined();
    expect(exported[0].assigneeName).toBe("Unassigned");
  });
});
