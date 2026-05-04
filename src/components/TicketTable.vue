<script setup>
import { Pencil, Trash2 } from "lucide-vue-next";

defineProps({
  tickets: Array,
  currentUser: Object,
  canDeleteTicket: Boolean,
  canAssignTicket: Boolean,
  canUpdateTicket: Function,
});

const emit = defineEmits(["select-ticket", "delete-ticket"]);
</script>

<template>
  <div class="table-wrap">
    <table>
      <thead>
        <tr>
          <th>Ticket</th>
          <th>Status</th>
          <th>Priority</th>
          <th>Project</th>
          <th>Assignee</th>
          <th>Due</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="ticket in tickets" :key="ticket.id">
          <td>
            <button class="ticket-title" @click="emit('select-ticket', ticket)">
              <span>{{ ticket.id }}</span>
              <strong>{{ ticket.title }}</strong>
            </button>
          </td>
          <td><span :class="['status-pill', ticket.status.toLowerCase().replaceAll(' ', '-')]">{{ ticket.status }}</span></td>
          <td><span :class="['priority-pill', ticket.priority.toLowerCase()]">{{ ticket.priority }}</span></td>
          <td>{{ ticket.project }}</td>
          <td>{{ ticket.assigneeName || "Unassigned" }}</td>
          <td>{{ ticket.dueDate }}</td>
          <td>
            <div class="row-actions">
              <button
                class="icon-button small"
                :disabled="!canUpdateTicket(currentUser, ticket)"
                aria-label="Edit ticket"
                @click="emit('select-ticket', ticket)"
              >
                <Pencil :size="16" />
              </button>
              <button
                class="icon-button small danger"
                :disabled="!canDeleteTicket"
                aria-label="Delete ticket"
                @click="emit('delete-ticket', ticket.id)"
              >
                <Trash2 :size="16" />
              </button>
            </div>
          </td>
        </tr>
        <tr v-if="tickets.length === 0">
          <td colspan="7" class="empty-row">No tickets match the current filters.</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
