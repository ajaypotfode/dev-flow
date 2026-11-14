'use client'
import { useState } from "react";
// import { useLocation } from "wouter";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
// import apiClient from "@/src/axios/axios";
import { useRouter } from "next/navigation";
import { loginAction } from "@/src/features/auth/action";
import { useToastModal } from "@/src/context/toastContext";
import { EyeClosed, EyeClosedIcon, EyeIcon, EyeOffIcon } from "lucide-react";
// import { useAuth } from "@/context/auth-context";

export default function Login() {
    //   const { user, isLoading, login } = useAuth();
    //   const [, navigate] = useLocation();
    const router = useRouter()
    const { openToast } = useToastModal();

    const [loginData, setLoginData] = useState({
        email: '',
        password: ""
    })
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [showpassword, setShowpassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSubmitting(true);

        const response = await loginAction(loginData);
        // console.log("response :",response);

        if (response.error) {
            openToast(response.error, 'error');
        } else {
            router.push('/dashboard')
            openToast("Logged in SuccessFully !!", 'success');
        }
        setSubmitting(false)
    };


    return (
        <div className="min-h-screen w-full flex bg-background">


            {/* Right: Form */}
            <div className="w-full  flex items-center justify-center p-8">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center lg:text-left">
                        <div className="lg:hidden text-2xl font-bold text-primary mb-2">DevFlow</div>
                        <h2 className="text-3xl font-bold tracking-tight text-foreground">Welcome back</h2>
                        <p className="mt-2 text-muted-foreground">
                            Sign in to your workspace. New to DevFlow? Ask your admin to invite you.
                        </p>
                    </div>

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@company.com"
                                required
                                autoComplete="email"
                                value={loginData.email}
                                onChange={e => setLoginData({ ...loginData, email: e.target.value })}
                                className="h-12 bg-muted/50"
                            />
                        </div>
                        <div className="space-y-2 ">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={`${showpassword ? "text" : "password"}`}
                                    required
                                    placeholder="Enter password"
                                    autoComplete="current-password"
                                    value={loginData.password}
                                    onChange={e => setLoginData({ ...loginData, password: e.target.value })}
                                    className="h-12 bg-muted/50"
                                />
                                <button type="button" onClick={(e) => { e.preventDefault(); setShowpassword(!showpassword) }} className="absolute top-2 right-2">
                                    {showpassword ? <EyeIcon /> : <EyeOffIcon />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
                                {error}
                            </div>
                        )}

                        <Button type="submit" className="w-full h-12 text-base font-medium" disabled={submitting}>
                            {submitting ? (
                                <span className="flex items-center gap-2">
                                    <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                                    Signing in…
                                </span>
                            ) : "Sign in"}
                        </Button>
                    </form>

                    <p className="text-center text-sm text-muted-foreground">
                        Dont have an account?{" "}
                        <span className="font-semibold text-primary">Contact your workspace admin to get invited.</span>
                    </p>
                </div>
            </div>
        </div>
    );
}
