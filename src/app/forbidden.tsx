import { ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function Forbidden() {
    return (
        <div className="flex min-h-[calc(100vh-166px)] items-center justify-center rounded-2xl px-8 py-16">
            <div className="flex w-full max-w-[850px] flex-col items-center text-center">
                {/* Lock icon */}
                <div className="relative mb-8">
                    <div className="absolute inset-[-25px] rounded-full bg-red-500/[0.04] blur-2xl" />

                    <div className="relative flex h-32 w-32 items-center justify-center rounded-2xl border border-red-500/40 bg-red-500/[0.12] shadow-[0_0_40px_rgba(239,68,68,0.12)]">
                        <ShieldAlert
                            size={65}
                            strokeWidth={1.8}
                            className="text-red-400"
                        />
                    </div>
                </div>

                {/* Heading */}
                <h1 className="font-serif text-2xl font-bold tracking-tight ">
                    Unauthorized
                </h1>

                <p className="mt-4 font-serif text-xl text-muted-foreground">
                    You don&apos;t have permission to access this page.
                </p>

                <div>
                    <h2 className="font-serif text-xl font-bold ">
                        Admin and Leader Access Only
                    </h2>

                    <p className="mt-2 font-serif text-[16px] leading-7 text-foreground">
                        This section is restricted. Only users with Admin
                        or Leader roles can view this page.
                    </p>
                </div>

                {/* Dashboard button */}

                <Link href="/dashboard" className="text-blue-400 ">
                    Go to Dashboard
                </Link>
            </div>
        </div>
    );
}