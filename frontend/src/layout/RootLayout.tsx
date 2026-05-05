"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import RootSidebar from "./RootSidebar";

type RootLayoutProps = {
    children: ReactNode;
    title?: string;
    description?: string;
};

export default function RootLayout({ children, title, description }: RootLayoutProps) {
    const [collapsed, setCollapsed] = useState(false);
    const pathname = usePathname();

    const pageTitle =
        pathname === "/dashboard/overview" ? "Overview" : "Dashboard";
    const pageDescription =
        pathname === "/dashboard/overview"
            ? "Track rollout health, activity, and quick actions."
            : "Manage feature flags and run user evaluations.";

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.ctrlKey && event.code === "Slash") {
                event.preventDefault();
                setCollapsed((prev) => !prev);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    return (
        <div className="flex min-h-screen bg-gray-50">
            <RootSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

            <main className="min-w-0 flex-1 dark:bg-[#191919] ">
                <section className="p-6 max-w-7xl mx-auto max-h-screen overflow-y-auto">
                    <header className="mb-6">
                        {title && (
                            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                {title}
                            </p>
                        )}
                        <h1 className="mt-1 text-2xl font-semibold text-foreground">
                            {pageTitle}
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {description ?? pageDescription}
                        </p>
                    </header>

                    {children}
                </section>
            </main>
        </div>
    );
}
