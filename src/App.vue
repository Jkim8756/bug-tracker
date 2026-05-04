<script setup>
import { computed, onMounted, ref } from "vue";
import AuthPanel from "./components/AuthPanel.vue";
import AppShell from "./components/AppShell.vue";
import DashboardView from "./components/DashboardView.vue";
import TicketTable from "./components/TicketTable.vue";
import TicketEditor from "./components/TicketEditor.vue";
import { demoUsers, ticketPriorities, ticketStatuses } from "./data/sampleData";
import { getDashboardSummary } from "./lib/dashboard";
import {
  canAssignTicket,
  canCreateTicket,
  canDeleteTicket,
  canExportTickets,
  canUpdateTicket,
  getPermissionSummary,
} from "./lib/permissions";
import { downloadTextFile, ticketsToCsv, ticketsToJson } from "./lib/exportTickets";
import { getInitialUser, signIn, signOut, signUp } from "./services/authService";
import { deleteTicket, getEngineers, listTickets, saveTicket } from "./services/ticketService";

const currentUser = ref(null);
const tickets = ref([]);
const selectedTicket = ref(null);
const loading = ref(true);
const notice = ref("");
const error = ref("");
const activeView = ref("dashboard");
const searchQuery = ref("");
const statusFilter = ref("All");
const priorityFilter = ref("All");

const engineers = getEngineers();

const filteredTickets = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  return tickets.value.filter((ticket) => {
    const matchesSearch =
      !query ||
      [ticket.id, ticket.title, ticket.project, ticket.assigneeName, ticket.status, ticket.priority]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query));
    const matchesStatus = statusFilter.value === "All" || ticket.status === statusFilter.value;
    const matchesPriority = priorityFilter.value === "All" || ticket.priority === priorityFilter.value;
    return matchesSearch && matchesStatus && matchesPriority;
  });
});

const summary = computed(() => getDashboardSummary(tickets.value));

async function refreshTickets() {
  tickets.value = await listTickets();
}

async function boot() {
  loading.value = true;
  try {
    currentUser.value = await getInitialUser();
    await refreshTickets();
  } catch (err) {
    error.value = err.message || "Unable to load the bug tracker.";
  } finally {
    loading.value = false;
  }
}

async function handleSignIn(credentials) {
  error.value = "";
  loading.value = true;
  try {
    currentUser.value = await signIn(credentials);
    await refreshTickets();
    notice.value = `Signed in as ${currentUser.value.name}.`;
  } catch (err) {
    error.value = err.message || "Sign in failed.";
  } finally {
    loading.value = false;
  }
}

async function handleSignUp(credentials) {
  error.value = "";
  loading.value = true;
  try {
    currentUser.value = await signUp(credentials);
    await refreshTickets();
    notice.value = "Account created. Demo roles default to engineer until assigned.";
  } catch (err) {
    error.value = err.message || "Sign up failed.";
  } finally {
    loading.value = false;
  }
}

async function handleSignOut() {
  await signOut();
  currentUser.value = null;
  selectedTicket.value = null;
  notice.value = "Signed out.";
}

async function handleDemoUserChange(userId) {
  const demoUser = demoUsers.find((user) => user.id === userId);
  if (!demoUser) return;
  currentUser.value = await signIn({ email: demoUser.email, password: "demo-password", role: demoUser.role });
  notice.value = `Demo role switched to ${demoUser.role}.`;
}

function createTicket() {
  selectedTicket.value = {
    title: "",
    description: "",
    status: "Open",
    priority: "Medium",
    project: "Core App",
    reporterId: currentUser.value.id,
    reporterName: currentUser.value.name,
    assigneeId: "",
    assigneeName: "",
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
  };
  activeView.value = "tickets";
}

async function handleSaveTicket(ticket) {
  error.value = "";
  try {
    await saveTicket(ticket);
    await refreshTickets();
    selectedTicket.value = null;
    notice.value = "Ticket saved.";
  } catch (err) {
    error.value = err.message || "Unable to save ticket.";
  }
}

async function handleDeleteTicket(ticketId) {
  error.value = "";
  try {
    await deleteTicket(ticketId);
    await refreshTickets();
    selectedTicket.value = null;
    notice.value = "Ticket deleted.";
  } catch (err) {
    error.value = err.message || "Unable to delete ticket.";
  }
}

function exportTickets(format) {
  if (!canExportTickets(currentUser.value)) {
    error.value = "Your role cannot export tickets.";
    return;
  }

  const timestamp = new Date().toISOString().slice(0, 10);
  if (format === "json") {
    downloadTextFile(`bugtrack-tickets-${timestamp}.json`, ticketsToJson(filteredTickets.value), "application/json");
    return;
  }
  downloadTextFile(`bugtrack-tickets-${timestamp}.csv`, ticketsToCsv(filteredTickets.value), "text/csv");
}

onMounted(boot);
</script>

<template>
  <AuthPanel
    v-if="!currentUser"
    :loading="loading"
    :error="error"
    @sign-in="handleSignIn"
    @sign-up="handleSignUp"
  />

  <AppShell
    v-else
    :active-view="activeView"
    :current-user="currentUser"
    :demo-users="demoUsers"
    :notice="notice"
    :error="error"
    :permission-summary="getPermissionSummary(currentUser)"
    @change-view="activeView = $event"
    @sign-out="handleSignOut"
    @change-demo-user="handleDemoUserChange"
  >
    <DashboardView
      v-if="activeView === 'dashboard'"
      :summary="summary"
      :tickets="tickets"
      :can-create="canCreateTicket(currentUser)"
      @create-ticket="createTicket"
      @view-tickets="activeView = 'tickets'"
    />

    <section v-else-if="activeView === 'tickets'" class="workspace">
      <div class="section-heading">
        <div>
          <p class="section-kicker">Ticket Queue</p>
          <h1>Track, assign, and resolve bugs</h1>
        </div>
        <div class="toolbar">
          <button
            class="button secondary"
            :disabled="!canExportTickets(currentUser)"
            @click="exportTickets('json')"
          >
            Export JSON
          </button>
          <button
            class="button secondary"
            :disabled="!canExportTickets(currentUser)"
            @click="exportTickets('csv')"
          >
            Export CSV
          </button>
          <button
            class="button primary"
            :disabled="!canCreateTicket(currentUser)"
            @click="createTicket"
          >
            New Ticket
          </button>
        </div>
      </div>

      <div class="filters-row">
        <label class="search-box">
          <span>Search</span>
          <input v-model="searchQuery" type="search" placeholder="Ticket, project, assignee..." />
        </label>
        <label>
          <span>Status</span>
          <select v-model="statusFilter">
            <option>All</option>
            <option v-for="status in ticketStatuses" :key="status">{{ status }}</option>
          </select>
        </label>
        <label>
          <span>Priority</span>
          <select v-model="priorityFilter">
            <option>All</option>
            <option v-for="priority in ticketPriorities" :key="priority">{{ priority }}</option>
          </select>
        </label>
      </div>

      <TicketTable
        :tickets="filteredTickets"
        :current-user="currentUser"
        :can-delete-ticket="canDeleteTicket(currentUser)"
        :can-assign-ticket="canAssignTicket(currentUser)"
        :can-update-ticket="canUpdateTicket"
        @select-ticket="selectedTicket = $event"
        @delete-ticket="handleDeleteTicket"
      />
    </section>

    <section v-else class="workspace muted-workspace">
      <div class="section-heading">
        <div>
          <p class="section-kicker">{{ activeView }}</p>
          <h1>{{ activeView === "team" ? "Team roles" : activeView === "reports" ? "Reports" : "Settings" }}</h1>
        </div>
      </div>
      <p>
        This area is reserved for the next implementation slice. The current build focuses on auth,
        role-aware ticket operations, exports, and dashboard visuals.
      </p>
    </section>

    <TicketEditor
      v-if="selectedTicket"
      :ticket="selectedTicket"
      :engineers="engineers"
      :statuses="ticketStatuses"
      :priorities="ticketPriorities"
      :current-user="currentUser"
      :can-assign="canAssignTicket(currentUser)"
      :can-delete="canDeleteTicket(currentUser)"
      :can-save="canUpdateTicket(currentUser, selectedTicket)"
      @close="selectedTicket = null"
      @save="handleSaveTicket"
      @delete="handleDeleteTicket"
    />
  </AppShell>
</template>
