"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import RootSidebar from "./RootSidebar";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

type RootLayoutProps = {
    children: ReactNode;
    title?: string;
    description?: string;
};

export default function RootLayout({ children, title, description }: RootLayoutProps) {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const pathname = usePathname();

    const pageMeta = (() => {
        if (pathname === "/dashboard/overview") {
            return {
                title: "Overview",
                description: "Track rollout health, activity, and quick actions.",
            };
        }

        if (pathname === "/dashboard/flags") {
            return {
                title: "Feature Flags",
                description: "Create, edit, and manage your rollout configuration.",
            };
        }

        if (pathname === "/dashboard/evaluate") {
            return {
                title: "Evaluation",
                description: "Test decisions with sample users before rollout.",
            };
        }

        if (pathname === "/dashboard/access-keys") {
            return {
                title: "Access Keys",
                description: "Generate, copy, and revoke consumer integration keys.",
            };
        }

        return {
            title: "Dashboard",
            description: "Manage feature flags and run user evaluations.",
        };
    })();

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
            <RootSidebar
                collapsed={collapsed}
                setCollapsed={setCollapsed}
                mobileOpen={mobileOpen}
                setMobileOpen={setMobileOpen}
            />

            <main className="min-w-0 flex-1 dark:bg-[#191919]  max-h-screen overflow-y-auto">
                <section className="p-6 max-w-7xl mx-auto">
                    <div className="mb-4 flex items-center gap-3 md:hidden">
                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            aria-label="Open menu"
                            onClick={() => setMobileOpen(true)}
                        >
                            <Menu className="h-4 w-4" />
                        </Button>
                        <p className="text-sm font-medium text-muted-foreground">Menu</p>
                    </div>

                    <header className="mb-6">
                        {title && (
                            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                {title}
                            </p>
                        )}
                        <h1 className="mt-1 text-2xl font-semibold text-foreground">{pageMeta.title}</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {description ?? pageMeta.description}
                        </p>
                    </header>

                    {children}
                </section>
            </main>
        </div>
    );
}
