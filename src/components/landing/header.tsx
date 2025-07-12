import Link from 'next/link';
import { SoulCircleIcon } from '@/components/landing/soulcircle-icon';

export function Header() {
  return (
    <header className="px-4 lg:px-6 h-14 flex items-center bg-background fixed top-0 left-0 right-0 z-50 animate-in fade-in-0 duration-1000">
      <Link href="#" className="flex items-center justify-center" prefetch={false}>
        <SoulCircleIcon className="h-6 w-6 text-primary" />
        <span className="sr-only">SoulCircle</span>
      </Link>
    </header>
  );
}
