<script setup>
import { computed, ref, watch } from "vue";
import { X } from "lucide-vue-next";

const props = defineProps({
  ticket: Object,
  engineers: Array,
  statuses: Array,
  priorities: Array,
  currentUser: Object,
  canAssign: Boolean,
  canDelete: Boolean,
  canSave: Boolean,
});

const emit = defineEmits(["close", "save", "delete"]);
const draft = ref({ ...props.ticket });

watch(
  () => props.ticket,
  (ticket) => {
    draft.value = { ...ticket };
  },
);

const isExisting = computed(() => Boolean(draft.value.id));

function save() {
  emit("save", { ...draft.value });
}
</script>

<template>
  <div class="drawer-backdrop" role="presentation" @click.self="emit('close')">
    <aside class="ticket-drawer" aria-label="Ticket editor">
      <header>
        <div>
          <span>{{ isExisting ? draft.id : "New ticket" }}</span>
          <h2>{{ isExisting ? "Edit ticket" : "Create ticket" }}</h2>
        </div>
        <button class="icon-button" aria-label="Close editor" @click="emit('close')">
          <X :size="18" />
        </button>
      </header>

      <label class="field">
        <span>Title</span>
        <input v-model="draft.title" :disabled="!canSave" />
      </label>

      <label class="field">
        <span>Description</span>
        <textarea v-model="draft.description" :disabled="!canSave" rows="5"></textarea>
      </label>

      <div class="form-grid">
        <label class="field">
          <span>Status</span>
          <select v-model="draft.status" :disabled="!canSave">
            <option v-for="status in statuses" :key="status">{{ status }}</option>
          </select>
        </label>

        <label class="field">
          <span>Priority</span>
          <select v-model="draft.priority" :disabled="!canSave">
            <option v-for="priority in priorities" :key="priority">{{ priority }}</option>
          </select>
        </label>
      </div>

      <div class="form-grid">
        <label class="field">
          <span>Project</span>
          <input v-model="draft.project" :disabled="!canSave" />
        </label>

        <label class="field">
          <span>Due date</span>
          <input v-model="draft.dueDate" :disabled="!canSave" type="date" />
        </label>
      </div>

      <label class="field">
        <span>Assignee</span>
        <select v-model="draft.assigneeId" :disabled="!canAssign">
          <option value="">Unassigned</option>
          <option v-for="engineer in engineers" :key="engineer.id" :value="engineer.id">
            {{ engineer.name }}
          </option>
        </select>
      </label>

      <p v-if="!canSave" class="inline-error">
        Your current role can view this ticket but cannot update it.
      </p>

      <footer>
        <button class="button secondary" @click="emit('close')">Cancel</button>
        <button v-if="isExisting" class="button danger" :disabled="!canDelete" @click="emit('delete', draft.id)">
          Delete
        </button>
        <button class="button primary" :disabled="!canSave || !draft.title" @click="save">Save ticket</button>
      </footer>
    </aside>
  </div>
</template>
