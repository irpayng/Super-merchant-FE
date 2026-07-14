import {
  House,
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
      { name: 'Home', icon: 'House', url: '/dashboard' },
      { name: 'Transactions', icon: 'ArrowLeftRight', url: '/transactions' },
      { name: 'Settlements', icon: 'Banknote', url: '/settlements' },
      { name: 'Terminals', icon: 'Calculator', url: '/terminals' },
      { name: 'Disputes', icon: 'Headset', url: '/disputes' },
      { name: 'Audit Trail', icon: 'FileSearchIcon', url: '/audit-trail' },
      { name: 'Roles and Privileges', icon: 'KeyRound', url: '/roles-and-privileges' },
    ],
  },
];

export const iconMap = {
  House,
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
