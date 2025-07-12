import Link from 'next/link';
import { SoulCircleIcon } from '@/components/landing/soulcircle-icon';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="px-4 lg:px-6 h-16 flex items-center justify-between bg-background fixed top-0 left-0 right-0 z-50 animate-in fade-in-0 duration-1000">
      <Link href="#" className="flex items-center gap-2" prefetch={false}>
        <SoulCircleIcon className="h-8 w-8" />
        <span className="font-bold text-lg">SoulCircle</span>
      </Link>
      <div className="flex items-center gap-4">
        <Button variant="ghost" asChild>
            <Link href="#">Log In</Link>
        </Button>
        <Button asChild>
            <Link href="#">Sign Up</Link>
        </Button>
      </div>
    </header>
  );
}
