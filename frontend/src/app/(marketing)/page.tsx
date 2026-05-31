'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Flag,
    Target,
    Percent,
    Code2,
    ArrowRight,
    CheckCircle2,
    ToggleRight,
    Sun,
    Moon,
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { useState } from 'react';
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/redux/hooks';
import { getStoredAccessToken } from '@/redux/features/auth/token-storage';
import Link from 'next/link';
import { useTheme } from 'next-themes';

export default function Home() {
    const router = useRouter();
    const { resolvedTheme, setTheme } = useTheme();
    const { accessToken } = useAppSelector((state) => state.auth);
    const [percentage, setPercentage] = useState([65]);
    const [isRolloutEnabled, setIsRolloutEnabled] = useState(true);
    const isLoggedIn = Boolean(accessToken ?? getStoredAccessToken());
    const isDark = resolvedTheme === "dark";

    const handleSignInClick = () => {
        router.push(isLoggedIn ? '/dashboard/overview' : '/auth/login');
    };

    const handleGetStartedClick = () => {
        router.push(isLoggedIn ? '/dashboard/overview' : '/auth/signup');
    };

    const handleDocsClick = () => {
        router.push('/docs');
    };

    const targeting_rules = [
        {
            value: "COUNTRY: US, GB"
        },
        {
            value: "AGE>18"
        },
        {
            value: "BETA_USER: TRUE"
        }
    ];

    const features = [
        {
            title: "Feature Flags",
            description:
                "Kill switches and dynamic config updates that propagate globally in under 200ms.",
            icon: Flag,
        },
        {
            title: "Targeted Rollouts",
            description:
                "Precise user segments based on country, app, platform, or any custom attribute.",
            icon: Target,
        },
        {
            title: "Percentage Rollout",
            description:
                "Canary releases and gradual expansion with automated multi-region monitoring.",
            icon: Percent,
        },
        {
            title: "SDK Integration",
            description:
                "Native support for React, Node, Go, Rust, and Python. Simple 5-line setup.",
            icon: Code2,
        },
    ];

    const code = `import { FeatureSDK } from "featureflow-sdk-js";

const sdk = new FeatureSDK({
  apiUrl: process.env.NEXT_PUBLIC_FEATURE_SDK_API_URL ?? "http://localhost:5001/api/v1",
});

sdk.setAccessKey(process.env.NEXT_PUBLIC_FLAG_PILOT_ACCESS_KEY!);
// Optional for authenticated dashboard flows:
// sdk.setAccessToken(userAccessToken);

export default async function Dashboard() {
  const decision = await sdk.evaluate("new_dashboard", {
    id: "user_92",
    country: "US",
    plan: "pro",
  });

  return decision.enabled ? <NewDashboard /> : <LegacyDashboard />;
}`

    return (
        <div className="min-h-screen bg-white text-black dark:bg-[#121212] dark:text-gray-100">
            {/* Header */}
            <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur dark:border-white/10 dark:bg-[#121212]/95">
                <nav className=" px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <span className="text-xl font-bold text-black dark:text-white">FlagPilot</span>
                        <div className="hidden md:flex items-center gap-8">
                            <Link href="/docs" className="text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                                Docs
                            </Link>
                            <a
                                href="https://github.com/Shreyashthaware2003/feature-flag"
                                target="_blank"
                                rel="noreferrer"
                                className="text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                            >
                                GitHub
                            </a>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button
                            variant={'ghost'}
                            size="icon"
                            aria-label="Theme"
                            onClick={() => setTheme(isDark ? "light" : "dark")}
                            className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                        >
                            {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                        </Button>
                        <Button
                            onClick={handleSignInClick}
                            variant={'ghost'}
                            className="text-xs font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white px-4 cursor-pointer"
                        >
                            Sign In
                        </Button>
                        <Button onClick={handleGetStartedClick} className="bg-black hover:bg-gray-800 text-white text-xs">
                            Get Started
                        </Button>
                    </div>
                </nav>
            </header>

            <div className='flex flex-col max-w-7xl mx-auto'>

                {/* Hero Section */}
                <section className=" px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Left Content */}
                        <div>
                            <Badge variant="outline" className="mb-6 flex flex-nowrap items-center justify-center gap-2 border-none bg-gray-200 py-3 text-[10px] font-semibold tracking-wider text-gray-800 dark:bg-[#1f1f1f] dark:text-gray-200">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gray-500 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-gray-800 dark:bg-gray-300"></span>
                                </span>
                                NEW: EDGE-CASE TARGETING V2.0
                            </Badge>
                            <h1 className="mb-6 text-5xl font-bold leading-tight lg:text-6xl">
                                Control Feature
                                <br />
                                Rollouts with
                                <br />
                                <span className="text-black dark:text-white">Precision</span>
                            </h1>
                            <p className="mb-8 max-w-md text-lg text-gray-600 dark:text-gray-300">
                                Scale with confidence. Deploy dark features, run complex A/B tests, and target users by region, age, or custom behavior - all from a single, high-performance orchestration engine.
                            </p>
                            <div className="flex items-center gap-4 text-xs">
                                <Button
                                    onClick={handleGetStartedClick}
                                    className="bg-black hover:bg-gray-800 text-white px-6 cursor-pointer"
                                >
                                    Get Started
                                </Button>
                                <button onClick={handleDocsClick} className="flex cursor-pointer items-center gap-2 font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                                    View Docs <ArrowRight size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Right - Dashboard Mockup */}
                        <div className="relative">
                            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-xl dark:border-white/10 dark:bg-[#1a1a1a]">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-8 w-10 items-center justify-center rounded-sm bg-gray-200 dark:bg-[#252525]">
                                            <ToggleRight className='text-gray-900 dark:text-gray-100' />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                                New Dashboard UI
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Jan 24, new Geo APIs</p>
                                        </div>
                                    </div>
                                    <Switch checked={isRolloutEnabled} onCheckedChange={setIsRolloutEnabled} />
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-xs font-semibold text-gray-900 dark:text-gray-100">
                                                ROLLOUT PERCENTAGE
                                            </span>
                                            <span className="text-xs font-bold text-gray-900 dark:text-gray-100">
                                                {percentage[0]}%
                                            </span>
                                        </div>
                                        <Slider value={percentage}
                                            onValueChange={setPercentage}
                                            max={100}
                                            step={1}
                                            disabled={!isRolloutEnabled}
                                            className={isRolloutEnabled ? "cursor-pointer" : "cursor-not-allowed"} />
                                    </div>

                                    <div>
                                        <p className="text-xs font-semibold text-gray-900 dark:text-gray-100 mb-3">
                                            TARGETING RULES
                                        </p>
                                        <div className="space-x-3 space-y-2 rounded bg-gray-100 p-3 dark:bg-[#242424]">
                                            {targeting_rules.map((item) => (
                                                <Badge key={item.value} className='bg-gray-200 py-2 text-[10px] text-black dark:bg-[#2e2e2e] dark:text-gray-100'>{item.value}</Badge>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section 2 - Tagline */}
                <section className="bg-gray-100 dark:bg-[#1a1a1a] rounded-md py-16 lg:py-24">
                    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                            Built for scale, engineered for precision.
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-300">
                            The tools you need to move fast without breaking things. Orchestrate every
                            release with confidence.
                        </p>
                    </div>
                </section>

                {/* Features Grid */}
                <section className=" px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Features */}
                        {features.map((item) => {
                            const Icon = item.icon;
                            return (
                                <div key={item.title} className="border border-gray-200 dark:border-white/10 dark:bg-[#1b1b1b] rounded-lg p-6">
                                    <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                                        <Icon />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">{item.title}</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                        {item.description}
                                    </p>
                                </div>
                            )
                        })}
                    </div>
                </section>

                {/* Integration Section */}
                <section className=" px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Left Content */}
                        <div>
                            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                                Integrated in minutes, not months.
                            </h2>
                            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                                Our SDKs are lightweight, type-safe, and designed for maximum performance.
                                Manage complexity without sacrificing developer experience.
                            </p>

                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <CheckCircle2 className="mt-1 flex-shrink-0 text-gray-900 dark:text-gray-100" size={20} />
                                    <div>
                                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                                            Zero-latency local evaluation
                                        </h4>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <CheckCircle2 className="mt-1 flex-shrink-0 text-gray-900 dark:text-gray-100" size={20} />
                                    <div>
                                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                                            TypeScript definitions included
                                        </h4>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <CheckCircle2 className="mt-1 flex-shrink-0 text-gray-900 dark:text-gray-100" size={20} />
                                    <div>
                                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                                            Real-time event streaming
                                        </h4>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right - Code Mockup */}
                        <div>
                            <div className="overflow-hidden rounded-lg bg-[#282c34] p-6 font-mono text-sm shadow-xl">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                    <span className="text-gray-500 text-xs">app.tsx</span>
                                </div>
                                <SyntaxHighlighter
                                    language="tsx"
                                    style={oneDark}
                                    wrapLongLines
                                    customStyle={{ margin: 0, overflowX: "hidden" }}
                                    codeTagProps={{ style: { whiteSpace: "pre-wrap", wordBreak: "break-word" } }}
                                >
                                    {code}
                                </SyntaxHighlighter>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="bg-black dark:bg-[#1a1a1a] rounded-2xl my-16 lg:my-24 mx-4 sm:mx-6 lg:mx-8 px-6 lg:px-12 py-16 lg:py-20 text-center">
                    <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                        Ready to orchestrate your next release?
                    </h2>
                    <p className="text-lg text-gray-300 mb-10">
                        Built as a personal project to demonstrate modern feature flagging,
                        safe rollouts, and production-minded engineering decisions.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button onClick={handleGetStartedClick} className="bg-white text-black hover:bg-gray-100 px-8 py-6 text-sm font-semibold">
                            Start Free Trial
                        </Button>
                        <Button
                            variant="ghost"
                            asChild
                            className="border border-white/80 bg-transparent text-white dark:hover:bg-white dark:hover:text-black px-8 py-6 text-sm font-semibold"
                        >
                            <Link href="/architecture">See Architecture</Link>
                        </Button>
                    </div>
                </section>
            </div>
            {/* Footer */}
            <footer className="bg-gray-50 dark:bg-[#151515] border-t border-gray-200 dark:border-white/10 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col gap-6 sm:gap-5">
                        <span className="text-lg font-bold text-black dark:text-white text-center sm:text-left">
                            FlagPilot
                        </span>
                        <div className="flex flex-col gap-4 text-sm text-gray-600 dark:text-gray-300 sm:flex-row sm:items-center sm:justify-between">
                            <span className="text-center sm:text-left">Copyright 2026 FlagPilot Inc. Precision engineering for feature management.</span>
                            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 sm:justify-end">
                                <Link href="/docs" className="hover:text-gray-900 dark:hover:text-white">
                                    Docs
                                </Link>
                                <Link href="/architecture" className="hover:text-gray-900 dark:hover:text-white">
                                    Architecture
                                </Link>
                                <a
                                    href="https://github.com/Shreyashthaware2003/feature-flag"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="hover:text-gray-900 dark:hover:text-white"
                                >
                                    GitHub
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
