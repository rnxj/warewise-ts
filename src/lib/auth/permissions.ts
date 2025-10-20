import { createAccessControl } from 'better-auth/plugins/access';
import {
  defaultStatements,
  memberAc,
  ownerAc,
} from 'better-auth/plugins/organization/access';

// Define our custom permissions statement
const statement = {
  ...defaultStatements,
  // Custom permissions for inventory and billing
  inventory: ['create', 'read', 'update', 'delete', 'manage'],
  billing: ['read', 'manage', 'process'],
} as const;

// Create access control instance
export const ac = createAccessControl(statement);

// Define custom roles with specific permissions
export const owner = ac.newRole({
  ...ownerAc.statements,
  inventory: ['create', 'read', 'update', 'delete', 'manage'],
  billing: ['read', 'manage', 'process'],
});

export const biller = ac.newRole({
  ...memberAc.statements,
  billing: ['read', 'manage', 'process'],
  inventory: ['read'],
});

export const inventoryManager = ac.newRole({
  ...memberAc.statements,
  inventory: ['create', 'read', 'update', 'delete', 'manage'],
  billing: ['read'],
});
