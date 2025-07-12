import type { SVGProps } from 'react';
import Image from 'next/image';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <Image
      src="/logo.png"
      alt="SoulCircle Logo"
      width={96}
      height={96}
      className={props.className}
    />
  );
}
