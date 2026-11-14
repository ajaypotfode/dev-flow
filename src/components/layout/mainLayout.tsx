"use client"
import React, { useState } from 'react'
import Sidebar from '@/src/components/custome/sidebar'
import { usePathname } from 'next/navigation'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '../ui/sheet';
// import Header from '@/src/components/custome/header';
import { Button } from '../ui/button';
import { Bell, LogOut, Menu } from 'lucide-react';
import { logoutAction } from '@/src/features/auth/action';
import ThemeToggle from '../custome/themeToggle';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();
    const condition = pathname !== '/auth/login' && pathname !== '/auth/signup'
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <>
            
<div className="flex min-h-screen">
   {condition&& <header className="fixed top-0 right-0 left-0  z-10 flex h-16 items-center justify-between border-b bg-card px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
            <Sheet
                open={isMobileMenuOpen}
                onOpenChange={setIsMobileMenuOpen}
            >
                <SheetTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        // className="md:hidden"
                    >
                        <Menu className=" z-40 h-5 w-5" />
                    </Button>
                </SheetTrigger>

                <SheetContent
                    side="left"
                    className="w-80! p-0"
                >
                     <SheetTitle className="sr-only">
            Navigation Menu
        </SheetTitle>
                    <Sidebar setIsMobileMenuOpen={setIsMobileMenuOpen} />
                </SheetContent>
            </Sheet>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-3">
            {/* Logout */}
            <form
                action={logoutAction}
                className="border-t border-hairline p-2"
            >
                <button
                    type="submit"
                    className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-ink-mute hover:bg-canvas-lavender hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                    <LogOut
                        className="h-5 w-5 shrink-0"
                        aria-hidden="true"
                    />
                    Log out
                </button>
            </form>

            {/* Notifications */}
            <button
                type="button"
                className="relative"
                aria-label="Notifications"
            >
                <Bell className="h-5 w-5 text-muted-foreground" />

                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full border border-card bg-destructive" />
            </button>

            {/* Theme Toggle */}
            <ThemeToggle />
        </div>
    </header>}

    {/* Main Content */}
    <main
        className={`flex-1 w-full bg-background p-8! dark:bg-background ${
            condition ? "mt-16" : ""
        }`}
    >
        {children}
    </main>
</div>

        </>
    )
}

export default MainLayout