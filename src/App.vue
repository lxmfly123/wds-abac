<script setup lang="ts">
import { reactive } from 'vue';
import type { Role, Permission } from 'src/auth-rbac';
import PermissionChecker from '@components/PermissionChecker.vue';
import PermissionCheckerAbac from '@components/PermissionCheckerAbac.vue';
import type { Todo, Comment, User } from 'src/auth-abac';

const permissions = reactive<Permission[]>([
  'view:comments',
  'create:comments',
  'update:comments',
  'delete:comments',
]);

// ABAC
const users: readonly User[] = [
  {
    id: '1',
    roles: ['admin'],
    blockedBy: [],
  },
  {
    id: '2',
    roles: ['user'],
    blockedBy: [],
  },
] as const;

const todos: Todo[] = [
  {
    id: '1',
    title: 'todo 1',
    authorId: '1',
    completed: false,
    invitedUsers: ['2'],
  },
  {
    id: '2',
    title: 'todo 2',
    authorId: '1',
    completed: false,
    invitedUsers: [],
  },
] as const;
</script>

<template>
  <!-- <permission-checker
    role="moderator"
    :permissions="permissions"
  ></permission-checker> -->
  <div v-for="user in users" :key="user.id">
    <div>User No.{{ user.id }}</div>
    <div v-for="todo in todos" :key="todo.id" style="padding: 0 1em">
      <div>Todo No.{{ todo.id }}</div>
      <div
        v-for="action in ['view', 'create', 'update', 'delete']"
        :key="action"
      >
        <permission-checker-abac
          :user="user"
          resource="todos"
          :action="action"
          :data="todo"
        ></permission-checker-abac>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
