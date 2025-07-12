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
      <path d="M12 2a10 10 0 0 0-9.4 14.8" />
      <path d="M12 22a10 10 0 0 0 9.4-14.8" />
      <path d="M7 9h10" />
      <path d="M7 15h10" />
    </svg>
  );
}
