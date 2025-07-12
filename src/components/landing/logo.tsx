import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="96"
      height="96"
      viewBox="0 0 96 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="48" cy="48" r="48" fill="hsl(var(--primary))" />
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        fill="hsl(var(--primary-foreground))"
        fontSize="40"
        fontFamily="var(--font-headline)"
        fontWeight="bold"
      >
        SC
      </text>
    </svg>
  );
}
