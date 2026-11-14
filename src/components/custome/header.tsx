// import { Bell, LogOut, Menu } from 'lucide-react'
// import React from 'react'
// import ThemeToggle from './themeToggle'
// import { logoutAction } from '@/src/features/auth/action'
// import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
// import { Button } from '../ui/button';
// import Sidebar from './sidebar';

// interface HeaderProps { isMobileMenuOpen: boolean; setIsMobileMenuOpen(value: boolean): void }

// const Header = ({ isMobileMenuOpen, setIsMobileMenuOpen }: HeaderProps) => {
//   return (
//     <header className="h-16 fixed top-0 right-0 md:left-72 left-0 flex items-center justify-between px-4 sm:px-6 lg:px-8 border-b bg-card z-10">
//       <div className="flex items-center gap-4">
//         <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
//               <SheetTrigger asChild>
//                 <Button variant="ghost" size="icon" className="md:hidden">
//                   <Menu className="h-5 w-5" />
//                 </Button>
//               </SheetTrigger>
//               <SheetContent side="left" className="p-0 w-72">
//                 {/* <SidebarContent /> */}
//                 <Sidebar/>
//               </SheetContent>
//             </Sheet>

//         {/* <div className="hidden sm:flex relative max-w-md w-full">
//           <input
//             type="search"
//             placeholder="Search projects, tasks, or members (Cmd+K)"
//             className="w-[300px] lg:w-[400px] pl-9 bg-muted/50 border-none focus-visible:ring-1"
//           />
//         </div> */}
//       </div>

//       <div className="flex items-center gap-3">
//         <form action={logoutAction} className="border-t border-hairline p-2">
//           <button
//             type="submit"
//             className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-ink-mute hover:bg-canvas-lavender hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
//           >
//             <LogOut className="h-5 w-5 shrink-0" aria-hidden="true" />
//             Log out
//           </button>
//         </form>

//         {/* <DropdownMenu>
//               <DropdownMenuTrigger asChild> */}
//         <button className="relative">
//           <Bell className="h-5 w-5 text-muted-foreground" />
//           <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full border border-card"></span>
//         </button>

//         <ThemeToggle />
//         {/* </DropdownMenuTrigger>
//               <DropdownMenuContent align="end" className="w-80">
//                 <DropdownMenuLabel>Notifications</DropdownMenuLabel>
//                 <DropdownMenuSeparator />
//                 <div className="py-2 px-4 text-sm text-center text-muted-foreground">
//                   No new notifications
//                 </div>
//               </DropdownMenuContent>
//             </DropdownMenu> */}
//       </div>
//     </header>
//   )
// }

// export default Header