const permissions = {
  ADMIN: process.env.FINANCIAL_ADMIN_PERMISSION || 'ADMIN',
  FINANCIAL: process.env.FINANCIAL_ADMINISTRATIVE_PERMISSION || 'FINANCIAL',
  MANAGER: process.env.FINANCIAL_MANAGER_PERMISSION || 'MANAGER',
};

export { permissions };
