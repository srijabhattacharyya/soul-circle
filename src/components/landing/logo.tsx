import Image from 'next/image';

type LogoProps = {
  className?: string;
};

export function Logo({ className }: LogoProps) {
  return (
    <Image
      src="/logo.png"
      alt="SoulCircle Logo"
      width={96}
      height={96}
      className={className}
      data-ai-hint="logo"
    />
  );
}
