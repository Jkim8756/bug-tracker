<script setup>
import { computed, ref } from "vue";
import { Bug, LockKeyhole, ShieldCheck } from "lucide-vue-next";
import { demoUsers } from "../data/sampleData";

defineProps({
  loading: Boolean,
  error: String,
});

const emit = defineEmits(["sign-in", "sign-up"]);

const mode = ref("sign-in");
const email = ref("pm@bugtrack.local");
const password = ref("demo-password");
const name = ref("");
const selectedUserId = ref("usr-pm");

const selectedDemoUser = computed(() => demoUsers.find((user) => user.id === selectedUserId.value));

function useDemoUser() {
  const user = selectedDemoUser.value;
  email.value = user.email;
  password.value = "demo-password";
}

function submit() {
  if (mode.value === "sign-up") {
    emit("sign-up", { email: email.value, password: password.value, name: name.value });
    return;
  }
  emit("sign-in", {
    email: email.value,
    password: password.value,
    role: selectedDemoUser.value?.role,
  });
}
</script>

<template>
  <main class="auth-page">
    <section class="auth-visual" aria-label="BugTrack overview">
      <div class="brand-lockup">
        <span class="brand-icon"><Bug :size="23" /></span>
        <span>BugTrack</span>
      </div>
      <div class="auth-copy">
        <h1>Operational bug tracking for product teams.</h1>
        <p>
          Run locally with sample tickets first, then connect Supabase Auth, PostgreSQL, and Vercel when the
          environment is ready.
        </p>
      </div>
      <div class="auth-metrics">
        <div>
          <strong>3</strong>
          <span>Role profiles</span>
        </div>
        <div>
          <strong>2</strong>
          <span>Export formats</span>
        </div>
        <div>
          <strong>Live</strong>
          <span>Dashboard visuals</span>
        </div>
      </div>
    </section>

    <section class="auth-card" aria-label="Authentication">
      <div class="auth-tabs" role="tablist" aria-label="Authentication mode">
        <button :class="{ active: mode === 'sign-in' }" @click="mode = 'sign-in'">Sign in</button>
        <button :class="{ active: mode === 'sign-up' }" @click="mode = 'sign-up'">Sign up</button>
      </div>

      <div class="auth-card-heading">
        <LockKeyhole :size="22" />
        <div>
          <h2>{{ mode === "sign-in" ? "Access workspace" : "Create local account" }}</h2>
          <p>{{ mode === "sign-in" ? "Use a demo account or real Supabase credentials." : "Local signups default to engineer." }}</p>
        </div>
      </div>

      <label v-if="mode === 'sign-in'" class="field">
        <span>Demo role</span>
        <select v-model="selectedUserId" @change="useDemoUser">
          <option v-for="user in demoUsers" :key="user.id" :value="user.id">
            {{ user.name }} - {{ user.role }}
          </option>
        </select>
      </label>

      <label v-if="mode === 'sign-up'" class="field">
        <span>Name</span>
        <input v-model="name" autocomplete="name" placeholder="Your name" />
      </label>

      <label class="field">
        <span>Email</span>
        <input v-model="email" type="email" autocomplete="email" placeholder="you@example.com" />
      </label>

      <label class="field">
        <span>Password</span>
        <input v-model="password" type="password" autocomplete="current-password" placeholder="Password" />
      </label>

      <p v-if="error" class="inline-error">{{ error }}</p>

      <button class="button primary full-width" :disabled="loading" @click="submit">
        {{ loading ? "Working..." : mode === "sign-in" ? "Sign in" : "Create account" }}
      </button>

      <div class="security-note">
        <ShieldCheck :size="18" />
        <span>Authorization is planned for Supabase RLS. Client role checks are used for local UX only.</span>
      </div>
    </section>
  </main>
</template>
