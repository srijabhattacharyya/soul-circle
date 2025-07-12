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
      <path d="M12 22a10 10 0 1 0-10-10" />
      <path d="M12 2a10 10 0 1 0 10 10" />
      <path d="M7 12c0 2.76 2.24 5 5 5s5-2.24 5-5" />
      <path d="M10 9a2 2 0 1 1 4 0" />
    </svg>
  );
}
