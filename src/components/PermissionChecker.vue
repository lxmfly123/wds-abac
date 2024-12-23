<template>
  <div>
    <h2 style="text-transform: uppercase">{{ role }}</h2>
    <div style="display: flex; gap: 1em">
      <div
        v-for="permission in permissions"
        :key="permission"
        class="permission"
        :style="{
          backgroundColor: hasPermission({ id: 'user-id', role }, permission)
            ? 'green'
            : 'red',
        }"
      >
        {{ permission }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { hasPermission } from 'src/auth-rbac';
import type { Role, Permission } from 'src/auth-rbac';

const props = defineProps<{ role: Role; permissions: Permission[] }>();
</script>

<style lang="scss" scoped>
.permission {
  padding: 0.375em 0.5em;
  color: white;
  border-radius: 0.25em;
  transition: all 0.15s ease-in-out;
  cursor: pointer;
}
.permission:hover {
  box-shadow: 0 4px 10px rgb(180, 180, 180);
  // filter: drop-shadow(0 0 2em #646cffaa);
}
</style>
