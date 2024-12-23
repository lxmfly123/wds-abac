export type Comment = {
  id: string;
  content: string;
  authorId: string;
  createdAt: string;
};

export type Todo = {
  id: string;
  title: string;
  content?: string;
  authorId: string;
  completed: boolean;
  createdAt?: string;
  invitedUsers: string[];
};

export type Role = 'admin' | 'moderator' | 'user';
export type User = { id: string; blockedBy: string[]; roles: Role[] };

type Permissions = {
  comments: {
    dataType: Comment;
    action: 'view' | 'create' | 'update';
  };
  todos: {
    dataType: Todo;
    action: 'view' | 'create' | 'update' | 'delete';
  };
};

type PermissionCheck<Key extends keyof Permissions> =
  | boolean
  | ((user: User, data: Permissions[Key]['dataType']) => boolean);

type RoleWithPermissions = {
  [R in Role]: Partial<{
    [P in keyof Permissions]: Partial<{
      [A in Permissions[P]['action']]: PermissionCheck<P>;
    }>;
  }>;
};

const ROLES = {
  admin: {
    comments: {
      view: true,
      create: true,
      update: true,
    },
    todos: {
      view: true,
      create: true,
      update: true,
      delete: true,
    },
  },
  moderator: {
    comments: {
      view: true,
      create: true,
      update: true,
    },
    todos: {
      view: true,
      create: true,
      update: true,
      delete: (user, todo) => todo.completed,
    },
  },
  user: {
    comments: {
      view: (user, comment) => !user.blockedBy.includes(comment.authorId),
      create: true,
      update: (user, comment) => comment.authorId === user.id,
    },
    todos: {
      view: (user, todo) => !user.blockedBy.includes(todo.authorId),
      create: true,
      update: (user, todo) =>
        todo.authorId === user.id || todo.invitedUsers.includes(user.id),
      delete: (user, todo) => todo.authorId === user.id,
    },
  },
} as const satisfies RoleWithPermissions;

export function hasPermission<Resource extends keyof Permissions>(
  user: User,
  resource: Resource,
  action: Permissions[Resource]['action'],
  data?: Permissions[Resource]['dataType']
) {
  return user.roles.some((role) => {
    const permission = (ROLES as RoleWithPermissions)[role][resource]?.[action];
    if (!permission) return false;

    if (typeof permission === 'boolean') {
      return permission;
    } else {
      return data !== undefined && permission(user, data);
    }
  });
}
