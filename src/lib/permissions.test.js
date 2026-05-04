import { describe, expect, it } from "vitest";
import { canAssignTicket, canDeleteTicket, canExportTickets, canUpdateTicket, ROLES } from "./permissions";

const ticket = { id: "BUG-1", assigneeId: "eng-1" };

describe("role permissions", () => {
  it("gives admins full ticket access", () => {
    const user = { id: "admin-1", role: ROLES.ADMIN };
    expect(canAssignTicket(user)).toBe(true);
    expect(canDeleteTicket(user)).toBe(true);
    expect(canExportTickets(user)).toBe(true);
    expect(canUpdateTicket(user, ticket)).toBe(true);
  });

  it("allows PMs to assign and export but not delete", () => {
    const user = { id: "pm-1", role: ROLES.PM };
    expect(canAssignTicket(user)).toBe(true);
    expect(canDeleteTicket(user)).toBe(false);
    expect(canExportTickets(user)).toBe(true);
  });

  it("allows engineers to update only assigned tickets", () => {
    expect(canUpdateTicket({ id: "eng-1", role: ROLES.ENGINEER }, ticket)).toBe(true);
    expect(canUpdateTicket({ id: "eng-2", role: ROLES.ENGINEER }, ticket)).toBe(false);
  });
});
