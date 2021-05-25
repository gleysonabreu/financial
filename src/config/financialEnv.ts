const financialEnv = {
  financialAdminPermission: Number(process.env.FINANCIAL_ADMIN_PERMISSION) || 1,
  financialAdministrativePermission:
    Number(process.env.FINANCIAL_ADMINISTRATIVE_PERMISSION) || 3,
  financialManagerPermission:
    Number(process.env.FINANCIAL_MANAGER_PERMISSION) || 2,
};

export { financialEnv };
