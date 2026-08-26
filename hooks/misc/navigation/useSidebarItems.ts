import {
  LayoutDashboard,
  Users,
  Smartphone,
  Hash,
  History,
  ShieldCheck,
  MessageSquareWarning,
  ScrollText,
  PieChart,
  Receipt,
  Banknote,
  KeyRound,
  Bell,
} from 'lucide-react';
import { PAGE_ENUMS } from '../permissions/pageEnums';
import usePermissions from '../permissions/usePermissions';

export const iconMap = {
  LayoutDashboard,
  Users,
  Smartphone,
  Hash,
  History,
  ShieldCheck,
  MessageSquareWarning,
  ScrollText,
  PieChart,
  Receipt,
  Banknote,
  KeyRound,
  Bell,
};

export interface NavItem {
  name: string;
  icon: string;
  url?: string;
  children?: NavItem[];
  shouldDisplay: boolean;
  tag: string;
  badgeCount?: number;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

/**
 * Super-merchant (bank) portal navigation.
 *
 * Banks onboard merchants (TID/serial upload), monitor their terminal estate,
 * watch transaction activity, and manage disputes raised by their merchants.
 */
const useSidebarItems = () => {
  const {
    isPortalAdmin,
    isOperationsAdmin,
    isTechSupportAdmin,
    isComplianceAdmin,
    isCustomerCareAdmin,
    hasPrivilege,
    canManageUserProfile,
    canManagePrivilege,
    canManageTerminal,
    canViewTransaction,
    canManageDispute,
    canAudit,
    canManageSystemConfiguration,
  } = usePermissions();

  const sidebarItems: NavSection[] = [
    {
      title: 'Dashboard',
      items: [
        {
          name: 'Overview',
          icon: 'LayoutDashboard',
          url: '/dashboard',
          shouldDisplay: true,
          tag: PAGE_ENUMS.OVERVIEW.DASHBOARD,
        },
      ],
    },

    {
      title: 'Merchants',
      items: [
        {
          name: 'Merchants',
          icon: 'Users',
          url: '/merchants',
          shouldDisplay:
            isPortalAdmin ||
            canManageUserProfile ||
            isOperationsAdmin ||
            isTechSupportAdmin ||
            isComplianceAdmin,
          tag: PAGE_ENUMS.USER_MGT.USERS,
        },
      ],
    },

    {
      title: 'Terminals',
      items: [
        {
          name: 'Terminals',
          icon: 'Smartphone',
          url: '/terminals',
          shouldDisplay:
            isPortalAdmin ||
            canManageTerminal ||
            isOperationsAdmin ||
            isTechSupportAdmin,
          tag: PAGE_ENUMS.OPERATIONS.TERMINALS,
        },
        {
          name: 'Terminal IDs',
          icon: 'Hash',
          url: '/terminal-id',
          shouldDisplay:
            isPortalAdmin ||
            canManageTerminal ||
            isOperationsAdmin ||
            isTechSupportAdmin,
          tag: PAGE_ENUMS.OPERATIONS.TERMINAL_IDS,
        },
      ],
    },

    {
      title: 'Transactions',
      items: [
        {
          name: 'Transactions',
          icon: 'History',
          url: '/transactions',
          shouldDisplay:
            isPortalAdmin ||
            canViewTransaction ||
            isOperationsAdmin ||
            isTechSupportAdmin ||
            isComplianceAdmin,
          tag: PAGE_ENUMS.TRANSACTIONS.TRANSACTION_HISTORY,
        },
        {
          name: 'Settlements',
          icon: 'Banknote',
          url: '/settlements',
          shouldDisplay:
            isPortalAdmin ||
            canViewTransaction ||
            isOperationsAdmin,
          tag: PAGE_ENUMS.TRANSACTIONS.SETTLEMENTS,
        },
        {
          name: 'Disputes',
          icon: 'MessageSquareWarning',
          url: '/disputes',
          shouldDisplay:
            isPortalAdmin ||
            canManageDispute ||
            isOperationsAdmin ||
            isCustomerCareAdmin,
          tag: PAGE_ENUMS.TRANSACTIONS.DISPUTES,
        },
      ],
    },

    {
      title: 'Settings',
      items: [
        {
          name: 'Commissions',
          icon: 'PieChart',
          url: '/settings',
          shouldDisplay:
            isPortalAdmin ||
            canManageSystemConfiguration,
          tag: PAGE_ENUMS.SETTINGS.COMMISSIONS,
        },
      ],
    },

    {
      title: 'Administration',
      items: [
        {
          name: 'Portal Users',
          icon: 'ShieldCheck',
          url: '/roles-and-privileges',
          shouldDisplay: isPortalAdmin || canManagePrivilege || hasPrivilege('manage_bank_users'),
          tag: PAGE_ENUMS.USER_MGT.ADMINS,
        },
        {
          name: 'Audit Logs',
          icon: 'ScrollText',
          url: '/audit-trail',
          shouldDisplay: isPortalAdmin || canAudit,
          tag: PAGE_ENUMS.SYSTEM.AUDIT_LOGS,
        },
      ],
    },
  ];

  return {
    sidebarItems,
  };
};

export default useSidebarItems;
