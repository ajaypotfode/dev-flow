"use client"
import { getCurrentUser } from '@/src/features/auth/action';
import { CheckSquare, FolderKanban, LayoutDashboard, LineChart, MenuSquare, Settings, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { Badge } from '../ui/badge';

interface SidebarProps { setIsMobileMenuOpen(value:boolean): void }

const Sidebar = ({setIsMobileMenuOpen }: SidebarProps) => {
    const location = usePathname();
    const [currentuser, setCurrentuser] = useState<{
        name: string;
        id: string;
        role: string;
        email: string;
    } | null>(null);

    useEffect(() => {
        const fetchuser = async () => {
            const user = await getCurrentUser();

            setCurrentuser(user);
        }
        fetchuser();
    }, [])

    const navItems = [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { name: "Projects", href: "/projects", icon: FolderKanban },
        { name: "Tasks", href: "/tasks", icon: CheckSquare },
        { name: "Team", href: "/team", icon: Users },
        { name: "Analytics", href: "/analytics", icon: LineChart },
        // { name: "Settings", href: "/settings", icon: Settings },
    ];

    const ROLE_COLOR: Record<string, string> = {
        leader: "bg-purple-500/10 text-purple-500 border-purple-500/20",
        admin: "bg-blue-500/10 text-blue-500 border-blue-500/20",
        member: "bg-secondary text-secondary-foreground",
        // viewer: "bg-muted text-muted-foreground",
    };

    return (
        <aside className={`fixed z-50 inset-y-0 left-0 min-h-screen w-72 max-w-screen `}>
            <div className="flex flex-col h-full bg-card">
                <div className="h-16 flex justify-between items-center px-6 border-b">
                    <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
                            DF
                        </div>
                        DevFlow
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
                    {/* <div className="px-2 pb-4 mb-4 border-b">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Workspace</p>
                        <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50 hover:bg-muted cursor-pointer transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded bg-blue-500/20 text-blue-500 flex items-center justify-center font-medium text-sm">
                                    A
                                </div>
                                <div className="text-sm font-medium">Acme Corp</div>
                            </div>
                            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-muted-foreground"><path d="M4.18179 6.18181C4.35753 6.00608 4.64245 6.00608 4.81819 6.18181L7.49999 8.86362L10.1818 6.18181C10.3575 6.00608 10.6424 6.00608 10.8182 6.18181C10.9939 6.35755 10.9939 6.64247 10.8182 6.81821L7.81819 9.81821C7.73379 9.9026 7.61934 9.95001 7.49999 9.95001C7.38064 9.95001 7.26618 9.9026 7.18179 9.81821L4.18179 6.81821C4.00605 6.64247 4.00605 6.35755 4.18179 6.18181Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                        </div>
                    </div> */}

                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-2 mt-4">Menu</p>
                    <div className='flex flex-col gap-3'>
                        {navItems.map((item) => (
                            <Link key={item.name} href={item.href}>
                                <div
                                    className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors cursor-pointer ${location === item.href ?
                                        "text-primary font-medium bg-primary/10 "
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                        }`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <item.icon className="w-5 h-5" />
                                    {item.name}
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="p-4 border-t">
                    <div className="flex items-center gap-3">
                        {/* <Avatar className="h-9 w-9">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar> */}
                        {
                            currentuser && <div className="flex-1 min-w-0">
                                <div className='flex gap-2'>
                                    <p className="text-sm font-medium truncate">{currentuser.name}</p>

                                    <Badge variant="outline" className={`text-[10px] ${ROLE_COLOR[currentuser.role] ?? ROLE_COLOR.member}`}>
                                        {currentuser.role.charAt(0).toUpperCase() + currentuser.role.slice(1)}
                                    </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground truncate">{currentuser.email}</p>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </aside>
    );

}

export default Sidebar