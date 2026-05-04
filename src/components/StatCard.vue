<script setup>
defineProps({
  label: String,
  value: [String, Number],
  detail: String,
  tone: {
    type: String,
    default: "slate",
  },
});
</script>

<template>
  <article :class="['stat-card', tone]">
    <span>{{ label }}</span>
    <strong>{{ value }}</strong>
    <p>{{ detail }}</p>
  </article>
</template>
