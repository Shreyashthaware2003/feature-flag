import { Skeleton } from "@/components/ui/skeleton";
import GuestGuard from "@/modules/auth/GuestGuard";
import { Rocket } from "lucide-react";
import React, { ReactNode } from "react";

type AuthLayoutProps = {
    children: ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <GuestGuard>
            <div className="flex min-h-screen w-full">

            {/* LEFT PANEL */}
            <section className="relative w-full md:w-1/2 bg-black hidden sm:flex flex-col justify-center items-center p-8 overflow-hidden">

                {/* Background overlay */}
                <div className="absolute inset-0 geometric-overlay"></div>

                {/* Decorative elements */}
                <div className="code-pattern text-[200px] absolute top-[-20px] left-[20px] text-white/10">
                    {"{"}
                </div>
                <div className="code-pattern text-[180px] absolute bottom-[-20px] right-[40px] text-white/10">
                    {"}"}
                </div>
                <div className="code-pattern text-[120px] absolute top-[20%] right-[10%] text-white/10">
                    *
                </div>

                {/* Content */}
                <div className="relative z-10 max-w-md w-full flex flex-col items-center text-center md:items-start md:text-left">

                    {/* Logo */}
                    <div className="flex items-center gap-2 mb-6">
                        <span
                            className="material-symbols-outlined text-white text-4xl"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                            <Rocket className="fill-white" />
                        </span>
                        <span className="text-2xl font-bold text-white tracking-wide">
                            FeatureFlow
                        </span>
                    </div>

                    {/* Heading */}
                    <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
                        Get started with FeatureFlow
                    </h1>

                    {/* Description */}
                    <p className="text-neutral-400 mb-6">
                        Deploy with confidence. Scale feature rollouts across your entire
                        infrastructure with precision engineering.
                    </p>

                    {/* Dashboard Mockup */}
                    <div className="hidden md:block w-full h-48 bg-white/5 rounded border border-white/10 p-4">
                        <div className="flex gap-2 mb-6">
                            <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                            <Skeleton className="w-12 h-1 bg-white/20 rounded mt-0.5" />
                            
                        </div>
                        <div className="space-y-4 w-full">
                            <Skeleton className="w-full h-2 bg-white/10 rounded"></Skeleton>
                            <Skeleton className="w-4/5 h-2 bg-white/10 rounded"></Skeleton>
                            <Skeleton className="w-3/4 h-2 bg-white/10 rounded"></Skeleton>
                            <Skeleton className="w-1/2 h-2 bg-white/10 rounded"></Skeleton>
                        </div>
                    </div>
                </div>
            </section>

            {/* RIGHT PANEL (FORM) */}
            <section className="w-full md:w-1/2 bg-white flex items-center justify-center p-8">
                {children}
            </section>
            </div>
        </GuestGuard>
    );
}
