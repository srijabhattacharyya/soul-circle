
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
    LogIn,
    LogOut,
    ChevronDown,
    HeartHandshake,
    LineChart,
    Notebook,
    Star,
    Library,
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

const NavSubMenu = ({ title, icon, children, paths }: { title: string; icon: React.ReactNode, children: React.ReactNode, paths: string[] }) => {
    const pathname = usePathname();
    const isActive = paths.some(path => pathname.startsWith(path));
    
    return (
        <SidebarMenuItem>
            <SidebarMenuButton isActive={isActive}>
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
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
            <NavLink href="/home"><Home /><span>Home</span></NavLink>
            {user ? (
              <>
                <NavLink href="/"><Home /><span>Dashboard</span></NavLink>
                <NavSubMenu title="My Tools" icon={<User />} paths={['/care-circle', '/inner-weather', '/mind-haven', '/soothe-studio']}>
                    <NavSubLink href="/care-circle"><HeartHandshake /><span>Care Circle</span></NavSubLink>
                    <NavSubLink href="/inner-weather"><CloudSun /><span>Inner Weather</span></NavSubLink>
                    <NavSubLink href="/mind-haven"><BookHeart /><span>Mind Haven</span></NavSubLink>
                    <NavSubLink href="/soothe-studio"><Zap /><span>Soothe Studio</span></NavSubLink>
                </NavSubMenu>
                <NavSubMenu title="My History" icon={<LineChart />} paths={['/mood-history', '/journal-history', '/saved-items']}>
                    <NavSubLink href="/mood-history"><LineChart /><span>Mood History</span></NavSubLink>
                    <NavSubLink href="/journal-history"><Notebook /><span>Journal History</span></NavSubLink>
                    <NavSubLink href="/saved-items"><Star /><span>Saved Items</span></NavSubLink>
                </NavSubMenu>
                <NavLink href="/resources"><Library /><span>Resource Library</span></NavLink>
                 <hr className="my-2 border-border"/>
                 <NavLink href="/profile"><User /><span>My Profile</span></NavLink>
                 <NavLink href="/settings"><Settings /><span>Settings</span></NavLink>
              </>
            ) : (
                 <>
                    <NavLink href="/learn-more"><Info /><span>About</span></NavLink>
                    <NavLink href="/legal"><Scale /><span>Legal & Privacy</span></NavLink>
                    <NavLink href="/care-circle"><HeartHandshake /><span>Meet the Counsellors</span></NavLink>
                     <hr className="my-2 border-border"/>
                    <NavLink href="/login"><LogIn /><span>Login to view more</span></NavLink>
                </>
            )}
        </SidebarMenu>
      </SidebarContent>
       {user && (
          <SidebarFooter>
            <NavLink href="/logout"><LogOut /><span>Logout</span></NavLink>
          </SidebarFooter>
        )}
    </>
  );
}
