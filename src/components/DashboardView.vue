<script setup>
import { AlertTriangle, ClipboardPlus, ListChecks } from "lucide-vue-next";
import StatCard from "./StatCard.vue";

defineProps({
  summary: Object,
  tickets: Array,
  canCreate: Boolean,
});

const emit = defineEmits(["create-ticket", "view-tickets"]);

function percent(value, total) {
  if (!total) return 0;
  return Math.round((value / total) * 100);
}
</script>

<template>
  <section class="workspace">
    <div class="section-heading">
      <div>
        <p class="section-kicker">Dashboard</p>
        <h1>Account summary</h1>
      </div>
      <div class="toolbar">
        <button class="button secondary" @click="emit('view-tickets')">
          <ListChecks :size="17" />
          View Tickets
        </button>
        <button class="button primary" :disabled="!canCreate" @click="emit('create-ticket')">
          <ClipboardPlus :size="17" />
          New Ticket
        </button>
      </div>
    </div>

    <div class="stat-grid">
      <StatCard label="Total tickets" :value="summary.total" detail="All tracked issues" />
      <StatCard label="Active" :value="summary.active" detail="Open, in progress, review" tone="teal" />
      <StatCard label="Critical" :value="summary.critical" detail="Needs immediate attention" tone="red" />
      <StatCard label="Unassigned" :value="summary.unassigned" detail="Needs PM routing" tone="amber" />
    </div>

    <div class="dashboard-grid">
      <article class="panel chart-panel">
        <div class="panel-heading">
          <div>
            <h2>Status distribution</h2>
            <p>Current lifecycle mix</p>
          </div>
          <span class="panel-icon"><AlertTriangle :size="18" /></span>
        </div>
        <div
          class="donut-chart"
          :style="{
            '--open': percent(summary.statusCounts.Open || 0, summary.total),
            '--progress': percent(summary.statusCounts['In Progress'] || 0, summary.total),
            '--review': percent(summary.statusCounts.Review || 0, summary.total),
          }"
        >
          <span>{{ summary.resolved }}</span>
          <small>resolved</small>
        </div>
        <div class="legend">
          <span><i class="dot open"></i>Open {{ summary.statusCounts.Open || 0 }}</span>
          <span><i class="dot progress"></i>In Progress {{ summary.statusCounts["In Progress"] || 0 }}</span>
          <span><i class="dot review"></i>Review {{ summary.statusCounts.Review || 0 }}</span>
          <span><i class="dot resolved"></i>Resolved {{ summary.statusCounts.Resolved || 0 }}</span>
        </div>
      </article>

      <article class="panel">
        <div class="panel-heading">
          <div>
            <h2>Priority mix</h2>
            <p>Active response pressure</p>
          </div>
        </div>
        <div class="bar-list">
          <div v-for="priority in ['Critical', 'High', 'Medium', 'Low']" :key="priority" class="bar-row">
            <span>{{ priority }}</span>
            <div class="bar-track">
              <i :style="{ width: `${percent(summary.priorityCounts[priority] || 0, summary.total)}%` }"></i>
            </div>
            <strong>{{ summary.priorityCounts[priority] || 0 }}</strong>
          </div>
        </div>
      </article>

      <article class="panel">
        <div class="panel-heading">
          <div>
            <h2>Assignment load</h2>
            <p>Engineer workload snapshot</p>
          </div>
        </div>
        <div class="assignment-list">
          <div v-for="(count, name) in summary.assigneeCounts" :key="name" class="assignment-row">
            <span>{{ name }}</span>
            <strong>{{ count }}</strong>
          </div>
        </div>
      </article>

      <article class="panel activity-panel">
        <div class="panel-heading">
          <div>
            <h2>Recent activity</h2>
            <p>Latest ticket movement</p>
          </div>
        </div>
        <ol class="activity-list">
          <li v-for="ticket in tickets.slice(0, 4)" :key="ticket.id">
            <strong>{{ ticket.id }}</strong>
            <span>{{ ticket.activity }}</span>
          </li>
        </ol>
      </article>
    </div>
  </section>
</template>
