const storedUserRoles: string[] = typeof window !== 'undefined'
  ? JSON.parse(sessionStorage.getItem('userRoles') || localStorage.getItem('userRoles') || '[]')
  : [];

// Privileges are persisted as plain code strings at login. For sessions created
// before that key existed, fall back to deriving them from the stored authUser,
// whose roles carry privilege objects ({ id, code, description, modules }).
const deriveStoredPrivileges = (): string[] => {
  if (typeof window === 'undefined') return [];
  const stored = sessionStorage.getItem('userPrivileges') || localStorage.getItem('userPrivileges');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // fall through to authUser derivation
    }
  }
  try {
    const authUser = JSON.parse(sessionStorage.getItem('authUser') || localStorage.getItem('authUser') || 'null');
    return (authUser?.roles?.flatMap((role: any) => role?.privileges || []) || [])
      .map((p: any) => (typeof p === 'string' ? p : p?.code))
      .filter(Boolean);
  } catch {
    return [];
  }
};

const storedUserPrivileges: string[] = deriveStoredPrivileges();

const isSuperAdmin = storedUserRoles.includes('super_admin');
const isOperationsAdmin = storedUserRoles.includes('operations');
const isCustomerCareAdmin = storedUserRoles.includes('customer_care');

const hasStoredPrivilege = (privilege: string) => storedUserPrivileges.includes(privilege);
const canManageUserWallet = hasStoredPrivilege('manage_user_wallet');

export {
  storedUserRoles,
  storedUserPrivileges,
  isSuperAdmin,
  isOperationsAdmin,
  isCustomerCareAdmin,
  hasStoredPrivilege,
  canManageUserWallet,
}
