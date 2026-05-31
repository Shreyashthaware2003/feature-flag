"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

export default function SiteHeader() {
  const pathname = usePathname();
  const isDocsPage = pathname.startsWith("/docs");
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 dark:border-white/10 bg-white/90 dark:bg-[#121212]/90 backdrop-blur-md">
      <div className="mx-auto flex h-14  items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-sm font-semibold text-black dark:text-white">
          FlagPilot
        </Link>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Theme"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
          >
            {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" asChild>
            <Link href="/">Home</Link>
          </Button>
          {!isDocsPage && (
            <Button
              variant="outline"
              size="sm"
              className="border-gray-300 text-gray-800 hover:text-gray-900 dark:border-white/20 dark:text-gray-200 dark:hover:text-white"
              asChild
            >
              <Link href="/docs">Docs</Link>
            </Button>
          )}
          <Button size="sm" className="bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200" asChild>
            <Link href="/auth/signup">Get Started</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

