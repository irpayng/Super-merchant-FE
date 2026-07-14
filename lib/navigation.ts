import {
  LayoutGrid,
  Users,
  Calculator,
  Banknote,
  ArrowLeftRight,
  Wallet,
  Headset,
  Bell,
  KeyRound,
  ShieldCheck,
  FileSearchIcon,
} from 'lucide-react';

export interface NavItem {
  id?: string;
  name: string;
  icon: string;
  url?: string;
  children?: NavItem[];
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export const navigation: NavSection[] = [
  {
    title: '',
    items: [
      { name: 'Dashboard', icon: 'LayoutGrid', url: '/dashboard' },
      { name: 'All Merchants', icon: 'Users', url: '/merchants' },
      { name: 'All Terminals', icon: 'Calculator', url: '/terminals' },
      { name: 'All Transactions', icon: 'ArrowLeftRight', url: '/transactions' },
      { name: 'Settlements', icon: 'Banknote', url: '/settlements' },
      { name: 'Disputes', icon: 'Headset', url: '/disputes' },
      { name: 'Audit Trail', icon: 'FileSearchIcon', url: '/audit-trail' },
      { name: 'Roles and Privileges', icon: 'KeyRound', url: '/roles-and-privileges' },
    ],
  },
];

export const iconMap = {
  LayoutGrid,
  Users,
  Banknote,
  Calculator,
  ArrowLeftRight,
  Wallet,
  Headset,
  Bell,
  KeyRound,
  ShieldCheck,
  FileSearchIcon,
};
