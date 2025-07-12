import Image from 'next/image';
import type { ComponentProps } from 'react';

export function SoulCircleIcon(props: Omit<ComponentProps<typeof Image>, 'src' | 'alt'>) {
  return (
    <Image
      src="/logo.png"
      alt="SoulCircle Logo"
      width={40}
      height={40}
      {...props}
    />
  );
}
