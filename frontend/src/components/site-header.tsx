"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function SiteHeader() {
  const pathname = usePathname();
  const isDocsPage = pathname.startsWith("/docs");

  return (
    <header className="sticky top-0 z-40 border-b bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-14  items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-sm font-semibold text-black">
          FlagPilot
        </Link>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">Home</Link>
          </Button>
          {!isDocsPage && (
            <Button variant="outline" size="sm" asChild>
              <Link href="/docs">Docs</Link>
            </Button>
          )}
          <Button size="sm" asChild>
            <Link href="/auth/signup">Get Started</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

