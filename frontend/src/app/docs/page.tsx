"use client";

import Link from "next/link";
import { type MouseEvent, useEffect, useMemo, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Code2, Rocket, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import SiteHeader from "@/components/site-header";

const sidebarSections = [
  {
    title: "Getting Started",
    items: [
      { label: "Introduction", href: "#introduction" },
      { label: "Installation", href: "#installation" },
      { label: "Project Setup", href: "#project-setup" },
    ],
  },
  {
    title: "Guides",
    items: [
      { label: "Create your first flag", href: "#first-flag" },
      { label: "Targeting rules", href: "#targeting-rules" },
      { label: "Rollout strategy", href: "#rollout-strategy" },
    ],
  },
  {
    title: "Reference",
    items: [
      { label: "SDK evaluate()", href: "#sdk-evaluate" },
      { label: "Environment variables", href: "#env-vars" },
      { label: "Troubleshooting", href: "#troubleshooting" },
    ],
  },
];

const onThisPage = [
  { label: "Introduction", href: "#introduction" },
  { label: "Installation", href: "#installation" },
  { label: "Create your first flag", href: "#first-flag" },
  { label: "SDK evaluate()", href: "#sdk-evaluate" },
];

const installCommand = `npm install featureflow-sdk-js`;

const sdkSnippet = `import { FeatureSDK } from "featureflow-sdk-js";

const sdk = new FeatureSDK({
  apiUrl: process.env.NEXT_PUBLIC_FEATURE_SDK_API_URL ?? "http://localhost:5001/api/v1",
});

sdk.setAccessKey(process.env.NEXT_PUBLIC_FLAG_PILOT_ACCESS_KEY!);
// Optional when evaluating with logged-in user JWT:
// sdk.setAccessToken(process.env.FLAG_PILOT_ACCESS_TOKEN!);

const decision = await sdk.evaluate("new_dashboard", {
  id: "user_92",
  country: "US",
  plan: "pro",
});

console.log(decision.enabled);`;

export default function DocsPage() {
  const mobileNavContainerRef = useRef<HTMLDivElement | null>(null);
  const mobileNavItemRefs = useRef<Record<string, HTMLAnchorElement | null>>({});

  const mobileNavItems = useMemo(
    () => sidebarSections.flatMap((section) => section.items),
    []
  );

  const sectionIds = useMemo(
    () =>
      Array.from(
        new Set(sidebarSections.flatMap((section) => section.items.map((item) => item.href.replace("#", ""))))
      ),
    []
  );
  const [activeSection, setActiveSection] = useState(sectionIds[0] ?? "introduction");

  useEffect(() => {
    if (!sectionIds.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (!visible.length) return;

        const nextActive = visible[0].target.id;
        setActiveSection(nextActive);
      },
      {
        root: null,
        rootMargin: "-110px 0px -55% 0px",
        threshold: [0.1, 0.3, 0.6],
      }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sectionIds]);

  useEffect(() => {
    const container = mobileNavContainerRef.current;
    if (!container) return;

    const activeHref = `#${activeSection}`;
    const activeItem = mobileNavItemRefs.current[activeHref];
    if (!activeItem) return;

    activeItem.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [activeSection]);

  const handleNavClick = (href: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (!el) return;

    setActiveSection(id);
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", href);
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <div className="mx-auto grid w-full grid-cols-1 gap-10 px-4 py-8 sm:px-6 lg:grid-cols-[250px_minmax(0,1fr)] lg:px-8 xl:grid-cols-[250px_minmax(0,1fr)_220px]">
        <aside className="hidden lg:block lg:sticky lg:top-24 lg:h-fit">
          <nav className="space-y-7">
            {sidebarSections.map((section) => (
              <div key={section.title}>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  {section.title}
                </p>
                <ul className="space-y-1">
                  {section.items.map((item) => (
                    <li key={item.href}>
                      <a
                        href={item.href}
                        onClick={handleNavClick(item.href)}
                        className={cn(
                          "block rounded-md px-2 py-1.5 text-sm transition",
                          activeSection === item.href.replace("#", "")
                            ? "bg-muted text-foreground text-xs font-medium"
                            : "text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        <main className="min-w-0 w-full max-w-3xl mx-auto">
          <div className="mb-6 sticky top-10 lg:hidden bg-white">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              On this page
            </p>
            <div ref={mobileNavContainerRef} className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {mobileNavItems.map((item) => (
                <a
                  key={`mobile-${item.href}`}
                  href={item.href}
                  ref={(el) => {
                    mobileNavItemRefs.current[item.href] = el;
                  }}
                  onClick={handleNavClick(item.href)}
                  className={cn(
                    "shrink-0 rounded-md border px-2.5 py-1.5 text-xs transition",
                    activeSection === item.href.replace("#", "")
                      ? "bg-muted text-foreground font-medium"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <Badge variant="secondary" className="mb-4">
              Documentation
            </Badge>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Build confidently with FlagPilot</h1>
            <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
              This guide helps you set up FlagPilot, create your first feature flag, and evaluate
              decisions safely in production.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Rocket className="h-4 w-4" /> Fast setup
                </CardTitle>
                <CardDescription className="text-xs">Install and ship your first guarded release in minutes.</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <ShieldCheck className="h-4 w-4" /> Safe rollout
                </CardTitle>
                <CardDescription className="text-xs">Gradual percentage rollout with instant rollback controls.</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Code2 className="h-4 w-4" /> Developer-friendly
                </CardTitle>
                <CardDescription className="text-xs">Simple SDK primitives and predictable environment config.</CardDescription>
              </CardHeader>
            </Card>
          </div>

          <article className="mt-12 space-y-12">
            <section id="introduction" className="scroll-mt-24">
              <h2 className="text-xl font-semibold">Introduction</h2>
              <p className="mt-3 text-sm text-muted-foreground">
                FlagPilot decouples deployment from release so your team can ship code continuously
                while controlling who sees what and when.
              </p>
            </section>

            <section id="installation" className="scroll-mt-24">
              <h2 className="text-xl font-semibold">Installation</h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Install the SDK in your application and point it to your configured API endpoint.
              </p>
              <pre className="mt-4 overflow-x-auto rounded-lg border bg-muted p-4 text-xs">
                <code>{installCommand}</code>
              </pre>
            </section>

            <section id="project-setup" className="scroll-mt-24">
              <h2 className="text-xl font-semibold">Project Setup</h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Add your API URL and access token in environment variables so the SDK can evaluate
                flags for each user context.
              </p>
              <pre className="mt-4 overflow-x-auto rounded-lg border bg-muted p-4 text-xs">
                <code>{`NEXT_PUBLIC_FEATURE_SDK_API_URL=http://localhost:5001/api/v1
NEXT_PUBLIC_FLAG_PILOT_ACCESS_KEY=ff_live_xxxxxxxxxxxxx
FLAG_PILOT_ACCESS_TOKEN=optional_user_jwt`}</code>
              </pre>
            </section>

            <section id="first-flag" className="scroll-mt-24">
              <h2 className="text-xl font-semibold">Create your first flag</h2>
              <p className="mt-3 text-sm text-muted-foreground">
                In the dashboard, create a new flag key like <code>new_dashboard</code>, add a
                default rule, and then define targeting or rollout percentage.
              </p>
            </section>

            <section id="targeting-rules" className="scroll-mt-24">
              <h2 className="text-xl font-semibold">Targeting rules</h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Use user attributes such as <code>country</code>, <code>plan</code>, or{" "}
                <code>beta_user</code> to control feature exposure with precision.
              </p>
            </section>

            <section id="rollout-strategy" className="scroll-mt-24">
              <h2 className="text-xl font-semibold">Rollout strategy</h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Start at 5%, monitor errors and business metrics, then progress to 25%, 50%, and
                eventually 100% once stable.
              </p>
            </section>

            <section id="sdk-evaluate" className="scroll-mt-24">
              <h2 className="text-xl font-semibold">SDK evaluate()</h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Evaluate a flag by passing a unique user identity and attributes.
              </p>
              <pre className="mt-4 overflow-x-auto rounded-lg border bg-muted p-4 text-xs">
                <code>{sdkSnippet}</code>
              </pre>
            </section>

            <section id="env-vars" className="scroll-mt-24">
              <h2 className="text-xl font-semibold">Environment variables</h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Keep your API URL public if needed, but store tokens securely on trusted server
                environments when possible.
              </p>
            </section>

            <section id="troubleshooting" className="scroll-mt-24">
              <h2 className="text-xl font-semibold">Troubleshooting</h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                <li>Make sure your access token is valid and not expired.</li>
                <li>Confirm API URL does not include a trailing slash mismatch.</li>
                <li>Verify flag key names match exactly between dashboard and code.</li>
              </ul>
            </section>
          </article>

          <Card className="mt-12">
            <CardHeader>
              <CardTitle>Next steps</CardTitle>
              <CardDescription className="text-xs">Continue with dashboard setup and production rollout checklist.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center gap-3">
              <Button asChild>
                <Link href="/dashboard/overview">
                  Open Dashboard <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/dashboard/flags">Manage Flags</Link>
              </Button>
            </CardContent>
          </Card>
        </main>

        <aside className="hidden xl:block">
          <div className="sticky top-24 rounded-lg border bg-card p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              On this page
            </p>
            <ul className="space-y-2">
                {onThisPage.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      onClick={handleNavClick(item.href)}
                      className={cn(
                        "text-sm transition",
                        activeSection === item.href.replace("#", "")
                          ? "text-xs font-medium text-foreground"
                          : "text-xs text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {item.label}
                    </a>
                  </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}

