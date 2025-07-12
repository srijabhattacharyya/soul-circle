import type { SVGProps } from 'react';
import Image from 'next/image';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <Image
      src="https://placehold.co/96x96.png"
      alt="SoulCircle Logo"
      width={96}
      height={96}
      className={props.className}
      data-ai-hint="logo"
    />
  );
}
