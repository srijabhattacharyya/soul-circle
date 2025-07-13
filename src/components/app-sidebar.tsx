
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from './auth-provider';

import {
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from '@/components/ui/sidebar';
import {
    Home,
    Info,
    Scale,
    BookHeart,
    User,
    CloudSun,
    Zap,
    Settings,
    LogOut,
    ChevronDown,
    HeartHandshake,
    Database
} from 'lucide-react';

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
    const pathname = usePathname();
    const isActive = pathname === href;
    return (
        <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive}>
                <Link href={href}>{children}</Link>
            </SidebarMenuButton>
        </SidebarMenuItem>
    )
}

const NavSubMenu = ({ title, icon, children }: { title: string; icon: React.ReactNode, children: React.ReactNode }) => {
    const pathname = usePathname();
    const isCareCircleActive = pathname.startsWith('/care-circle');
    
    return (
        <SidebarMenuItem>
            <SidebarMenuButton isActive={isCareCircleActive}>
                {icon}
                <span>{title}</span>
                <ChevronDown className="ml-auto size-4" />
            </SidebarMenuButton>
            <SidebarMenuSub>{children}</SidebarMenuSub>
        </SidebarMenuItem>
    )
}

const NavSubLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
     const pathname = usePathname();
    const isActive = pathname === href;
    return (
         <SidebarMenuSubItem>
            <SidebarMenuSubButton asChild isActive={isActive}>
                <Link href={href}>{children}</Link>
            </SidebarMenuSubButton>
        </SidebarMenuSubItem>
    )
}

export function AppSidebar() {
  const { user } = useAuth();
  const pathname = usePathname();

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center justify-between">
            <Link href="/" className="font-bold text-lg text-foreground">
                SoulCircle
            </Link>
            <SidebarTrigger className='hidden md:flex' />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
            <NavLink href="/"><Home /><span>Home</span></NavLink>
            <NavLink href="/about"><Info /><span>About</span></NavLink>
            <NavLink href="/legal"><Scale /><span>Legal</span></NavLink>
            <NavLink href="/resources"><BookHeart /><span>Resources</span></NavLink>
            <NavLink href="/care-circle"><HeartHandshake /><span>Care Circle</span></NavLink>

            <>
                <hr className="my-2 border-border"/>
                <NavSubMenu title="My Circle" icon={<User />}>
                    <NavSubLink href="/profile"><User /><span>Profile</span></NavSubLink>
                    <NavSubLink href="/inner-weather"><CloudSun /><span>Inner Weather</span></NavSubLink>
                    <NavSubLink href="/mind-haven"><BookHeart /><span>Mind Haven</span></NavSubLink>
                    <NavSubLink href="/soothe-studio"><Zap /><span>Soothe Studio</span></NavSubLink>
                </NavSubMenu>
                
                 <hr className="my-2 border-border"/>
                 <NavLink href="/settings"><Settings /><span>Settings</span></NavLink>
                 <NavLink href="/seed-data"><Database /><span>Seed Data</span></NavLink>
            </>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
         <NavLink href="/logout"><LogOut /><span>Logout</span></NavLink>
      </SidebarFooter>
    </>
  );
}
