<template>
  <div :style="{ backgroundColor: canDo ? 'green' : 'red' }" class="permission">
    {{ resource }}:{{ action }}
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { hasPermission } from 'src/auth-abac';
import type { User, Role, Todo, Comment } from 'src/auth-abac';

const props = defineProps<{
  user: Parameters<typeof hasPermission>[0];
  resource: Parameters<typeof hasPermission>[1];
  action: Parameters<typeof hasPermission>[2];
  data?: Parameters<typeof hasPermission>[3];
}>();

const canDo = computed(() =>
  hasPermission(props.user, props.resource, props.action, props.data)
);
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
