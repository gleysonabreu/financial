import { permissions } from '@config/permissions';

function validPermissions(type: string): boolean {
  const permissionsValid = [
    permissions.ADMIN,
    permissions.FINANCIAL,
    permissions.MANAGER,
  ];

  if (!permissionsValid.includes(type)) {
    return false;
  }

  return true;
}

export { validPermissions };
