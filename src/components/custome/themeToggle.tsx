"use client"
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes';
import React, { useEffect, useState } from 'react'

const ThemeToggle = () => {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Prevent hydration mismatch by waiting until component is mounted
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
    }, []);

    if (!mounted) return <div className="w-10 h-10" />;


    return (
        <div className="ml-auto flex items-center" aria-hidden>
            <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-full bg-background transition group relative">
                <div role='tooltip' className='absolute top-10 invisible whitespace-nowrap
                    group-hover:visible text-foreground'>
                    {theme === 'light' ? 'Light mode' : 'Dark mode'}
                </div>
                {theme === 'light' ?
                    <Sun className="w-6 h-6 sm:w-8 sm:h-8 drop-shadow text-foreground cursor-pointer"
                        aria-hidden></Sun>
                    :
                    <Moon className="w-6 h-6 sm:w-8 sm:h-8 drop-shadow text-foreground cursor-pointer"
                        aria-hidden></Moon>
                }
            </button>
        </div>
    )
}

export default ThemeToggle