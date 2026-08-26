
import useToolkit from '../useToolkit';

const usePermissions = () => {
  const { user } = useToolkit();
  const userRoles = user?.user?.roles?.map((item: any) => item?.code) || [];

  // Get all privileges from all roles.
  // The API returns each privilege as an object ({ id, code, description, modules }),
  // so normalize to the `code` string. Tolerate plain strings too, in case the
  // shape ever changes.
  const userPrivileges: string[] = (user?.user?.roles?.flatMap((role: any) =>
    role?.privileges || []
  ) || []).map((p: any) => (typeof p === 'string' ? p : p?.code)).filter(Boolean);

  // Role-based checks (legacy)
  const isSuperAdmin = userRoles?.includes('super_admin');
  const isBankAdmin = userRoles?.includes('bank_admin');
  // Portal admin = super_admin OR bank_admin (both should see all pages)
  const isPortalAdmin = isSuperAdmin || isBankAdmin;
  const isReconciliationAdmin = userRoles?.includes('reconciliation');
  const isCustomerCareAdmin = userRoles?.includes('customer_care');
  const isSettlementsAdmin = userRoles?.includes('settlement');
  const isOperationsAdmin = userRoles?.includes('operations');
  const isAuditAdmin = userRoles?.includes('audit');
  const isTechSupportAdmin = userRoles?.includes('support');
  const isComplianceAdmin = userRoles?.includes('compliance');
  const isFinanceAdmin = userRoles?.includes('finance');

  // Privilege-based checks
  const hasPrivilege = (privilege: string) => userPrivileges.includes(privilege);

  const canManageKyc = hasPrivilege('manage_kyc');
  const canManageUserProfile = hasPrivilege('manage_user_profile');
  const canManageUserWallet = hasPrivilege('manage_user_wallet');
  const canManageDispute = hasPrivilege('manage_dispute');
  const canManagePrivilege = hasPrivilege('manage_privilege');
  const canManageSystemConfiguration = hasPrivilege('manage_system_configuration');
  const canViewSystemConfiguration = hasPrivilege('view_system_configuration');
  const canManageTerminal = hasPrivilege('manage_terminal');
  const canManageInventory = hasPrivilege('manage_inventory');
  const canAccessFinancialReport = hasPrivilege('access_financial_report');
  const canAudit = hasPrivilege('audit');
  const canViewTransaction = hasPrivilege('view_transaction');

  return {
    userRoles,
    userPrivileges,
    isSuperAdmin,
    isBankAdmin,
    isPortalAdmin,
    isReconciliationAdmin,
    isCustomerCareAdmin,
    isSettlementsAdmin,
    isOperationsAdmin,
    isAuditAdmin,
    isTechSupportAdmin,
    isComplianceAdmin,
    isFinanceAdmin,
    // Privilege-based
    hasPrivilege,
    canManageKyc,
    canManageUserProfile,
    canManageUserWallet,
    canManageDispute,
    canManagePrivilege,
    canManageSystemConfiguration,
    canViewSystemConfiguration,
    canManageTerminal,
    canManageInventory,
    canAccessFinancialReport,
    canAudit,
    canViewTransaction,
  };
};

export default usePermissions;
