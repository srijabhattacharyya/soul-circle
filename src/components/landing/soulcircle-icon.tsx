import type { SVGProps } from 'react';

export function SoulCircleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
      <path d="M8.5 14.5a3 3 0 1 0 0-5 3 3 0 0 0 0 5z" />
      <path d="M15.5 14.5a3 3 0 1 0 0-5 3 3 0 0 0 0 5z" />
    </svg>
  );
}
