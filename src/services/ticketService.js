import { demoUsers, sampleTickets } from "../data/sampleData";
import { hasSupabaseConfig, supabase } from "../lib/supabaseClient";

const STORAGE_KEY = "bugtrack-local-tickets";

function readLocalTickets() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleTickets));
    return sampleTickets;
  }
  return JSON.parse(saved);
}

function writeLocalTickets(tickets) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
  return tickets;
}

function normalizeSupabaseTicket(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    status: row.status,
    priority: row.priority,
    project: row.project,
    reporterId: row.reporter_id,
    reporterName: row.reporter_name,
    assigneeId: row.assignee_id,
    assigneeName: row.assignee_name,
    createdAt: row.created_at?.slice(0, 10),
    dueDate: row.due_date,
    activity: row.activity,
  };
}

function toSupabaseTicket(ticket) {
  return {
    title: ticket.title,
    description: ticket.description,
    status: ticket.status,
    priority: ticket.priority,
    project: ticket.project,
    reporter_id: ticket.reporterId,
    reporter_name: ticket.reporterName,
    assignee_id: ticket.assigneeId || null,
    assignee_name: ticket.assigneeName || null,
    due_date: ticket.dueDate,
    activity: ticket.activity,
  };
}

export async function listTickets() {
  if (hasSupabaseConfig) {
    const { data, error } = await supabase
      .from("tickets")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data.map(normalizeSupabaseTicket);
  }

  return readLocalTickets();
}

export async function saveTicket(ticket) {
  if (hasSupabaseConfig) {
    if (ticket.id?.startsWith("BUG-")) {
      const { error } = await supabase.from("tickets").update(toSupabaseTicket(ticket)).eq("id", ticket.id);
      if (error) throw error;
      return ticket;
    }

    const { data, error } = await supabase.from("tickets").insert(toSupabaseTicket(ticket)).select("*").single();
    if (error) throw error;
    return normalizeSupabaseTicket(data);
  }

  const tickets = readLocalTickets();
  const existingIndex = tickets.findIndex((item) => item.id === ticket.id);
  const assignee = demoUsers.find((user) => user.id === ticket.assigneeId);
  const nextTicket = {
    ...ticket,
    assigneeName: assignee?.name || "",
  };

  if (existingIndex >= 0) {
    tickets.splice(existingIndex, 1, nextTicket);
    return writeLocalTickets([...tickets])[existingIndex];
  }

  const created = {
    ...nextTicket,
    id: `BUG-${1030 + tickets.length + 1}`,
    createdAt: new Date().toISOString().slice(0, 10),
    activity: "Created locally",
  };
  writeLocalTickets([created, ...tickets]);
  return created;
}

export async function deleteTicket(ticketId) {
  if (hasSupabaseConfig) {
    const { error } = await supabase.from("tickets").delete().eq("id", ticketId);
    if (error) throw error;
    return;
  }

  writeLocalTickets(readLocalTickets().filter((ticket) => ticket.id !== ticketId));
}

export function getEngineers() {
  return demoUsers.filter((user) => user.role === "engineer");
}
