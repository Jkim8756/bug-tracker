<script setup>
import { Bug, ChartNoAxesColumn, ClipboardList, LogOut, Search, Settings, UsersRound } from "lucide-vue-next";

defineProps({
  activeView: String,
  currentUser: Object,
  demoUsers: Array,
  notice: String,
  error: String,
  permissionSummary: String,
});

const emit = defineEmits(["change-view", "change-demo-user", "sign-out"]);

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: ChartNoAxesColumn },
  { id: "tickets", label: "Tickets", icon: ClipboardList },
  { id: "team", label: "Team", icon: UsersRound },
  { id: "reports", label: "Reports", icon: ChartNoAxesColumn },
  { id: "settings", label: "Settings", icon: Settings },
];
</script>

<template>
  <div class="app-layout">
    <aside class="sidebar">
      <div class="brand-lockup compact">
        <span class="brand-icon"><Bug :size="21" /></span>
        <span>BugTrack</span>
      </div>

      <nav aria-label="Primary navigation">
        <button
          v-for="item in navItems"
          :key="item.id"
          :class="['nav-item', { active: activeView === item.id }]"
          @click="emit('change-view', item.id)"
        >
          <component :is="item.icon" :size="18" />
          <span>{{ item.label }}</span>
        </button>
      </nav>

      <div class="role-panel">
        <span class="label">Current access</span>
        <strong>{{ currentUser.role }}</strong>
        <p>{{ permissionSummary }}</p>
      </div>
    </aside>

    <div class="main-pane">
      <header class="topbar">
        <div class="topbar-search">
          <Search :size="17" />
          <span>Search is available inside the ticket queue</span>
        </div>

        <div class="account-controls">
          <label>
            <span>Demo role</span>
            <select :value="currentUser.id" @change="emit('change-demo-user', $event.target.value)">
              <option v-for="user in demoUsers" :key="user.id" :value="user.id">
                {{ user.name }} - {{ user.role }}
              </option>
            </select>
          </label>
          <div class="avatar" aria-hidden="true">{{ currentUser.avatar }}</div>
          <div class="account-name">
            <strong>{{ currentUser.name }}</strong>
            <span>{{ currentUser.email }}</span>
          </div>
          <button class="icon-button" aria-label="Sign out" @click="emit('sign-out')">
            <LogOut :size="18" />
          </button>
        </div>
      </header>

      <div v-if="notice" class="banner success">{{ notice }}</div>
      <div v-if="error" class="banner error">{{ error }}</div>

      <main class="content-area">
        <slot />
      </main>
    </div>
  </div>
</template>
