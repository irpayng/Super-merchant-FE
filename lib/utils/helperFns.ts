// import { notify } from "@/hooks/misc/notify";
// import moment from "moment";

// export const copyToClipboard = (item: any, title: string) => {
//   navigator.clipboard.writeText(item);
//   notify({ type: "success", header: `${title} Copied` });
// };

export function parseTableFilterDate(dateStr: string): Date {
  const [day, month, year] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function splitAndCapitalizeString(str: any) {
  return str
    .replace(/([A-Z])/g, ' $1')
    .trim()
    .split(' ')
    .map(
      (word: any) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
    )
    .join(' ');
}

export function getYearBoundaries(year = new Date().getFullYear()) {
  const firstDate = new Date(year, 0, 1);
  const lastDate = new Date(year, 11, 31);

  const formatLocal = (date: any) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  return {
    firstDate: formatLocal(firstDate),
    lastDate: formatLocal(lastDate),
  };
}

export const splitSnakeCase = (word: string) => {
  return word.replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase());
};

// export const formatStandardDate = (date: string) => {
//   return moment(date).format("Do MMM, YYYY || h:mmA");
// };

export const displayValue = (value: any) =>
  value === null || value === undefined || value === '' ? 'N/A' : value;

export const getInitials = (name: string) => {
  if (!name) return '';
  const words = name.trim().split(' ');
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
};

// Utility: random pleasant background color
export const randomBgColor = () => {
  const colors = [
    'bg-blue-700',
    'bg-green-700',
    'bg-purple-700',
    'bg-pink-700',
    'bg-indigo-700',
    'bg-amber-700',
    'bg-emerald-700',
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

export const isLocalEnv = process.env.NODE_ENV === 'development';
