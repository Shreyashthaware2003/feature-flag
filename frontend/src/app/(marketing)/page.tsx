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

export default function Home() {
    const router = useRouter();
    const { accessToken } = useAppSelector((state) => state.auth);
    const [percentage, setPercentage] = useState([65]);
    const [isRolloutEnabled, setIsRolloutEnabled] = useState(true);
    const isLoggedIn = Boolean(accessToken ?? getStoredAccessToken());

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
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white">
                <nav className=" px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <span className="text-xl font-bold text-black">Flag Pilot</span>
                        <div className="hidden md:flex items-center gap-8">
                            <Link href="/docs" className="text-sm font-medium text-gray-700 hover:text-gray-900">
                                Docs
                            </Link>
                            <a href="#" className="text-sm font-medium text-gray-700 hover:text-gray-900">
                                GitHub
                            </a>
                            <a href="#" className="text-sm font-medium text-gray-700 hover:text-gray-900">
                                Changelog
                            </a>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button
                            onClick={handleSignInClick}
                            variant={'ghost'}
                            className="text-xs font-medium text-gray-700 hover:text-gray-900 px-4 cursor-pointer"
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
                            <Badge variant="outline" className="mb-6 border-none bg-gray-200 text-gray-800 font-semibold py-3 text-[10px] tracking-wider flex flex-nowrap items-center justify-center gap-2">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gray-500 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-gray-800"></span>
                                </span>
                                NEW: EDGE-CASE TARGETING V2.0
                            </Badge>
                            <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6">
                                Control Feature
                                <br />
                                Rollouts with
                                <br />
                                <span className="text-black">Precision</span>
                            </h1>
                            <p className="text-lg text-gray-600 mb-8 max-w-md">
                                Scale with confidence. Deploy dark features, run complex A/B tests, and
                                target users by region, age, or custom behavior—all from a single,
                                high-performance orchestration engine.
                            </p>
                            <div className="flex items-center gap-4 text-xs">
                                <Button
                                    onClick={handleGetStartedClick}
                                    className="bg-black hover:bg-gray-800 text-white px-6 cursor-pointer"
                                >
                                    Get Started
                                </Button>
                                <button onClick={handleDocsClick} className="flex items-center gap-2 text-gray-700 font-medium hover:text-gray-900 cursor-pointer">
                                    View Docs <ArrowRight size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Right - Dashboard Mockup */}
                        <div className="relative">
                            <div className="bg-white border border-gray-200 rounded-lg shadow-xl p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-8 rounded-sm bg-gray-200 flex items-center justify-center">
                                            <ToggleRight className='text-gray-900' />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900">
                                                New Dashboard UI
                                            </p>
                                            <p className="text-xs text-gray-500">Jan 24, new Geo APIs</p>
                                        </div>
                                    </div>
                                    <Switch checked={isRolloutEnabled} onCheckedChange={setIsRolloutEnabled} />
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-xs font-semibold text-gray-900">
                                                ROLLOUT PERCENTAGE
                                            </span>
                                            <span className="text-xs font-bold text-gray-900">
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
                                        <p className="text-xs font-semibold text-gray-900 mb-3">
                                            TARGETING RULES
                                        </p>
                                        <div className="bg-gray-100 rounded p-3 space-y-2 space-x-3">
                                            {targeting_rules.map((item) => (
                                                <Badge key={item.value} className='text-[10px] py-2 bg-gray-200 text-black'>{item.value}</Badge>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section 2 - Tagline */}
                <section className="bg-gray-100 rounded-md py-16 lg:py-24">
                    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                            Built for scale, engineered for precision.
                        </h2>
                        <p className="text-lg text-gray-600">
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
                                <div key={item.title} className="border border-gray-200 rounded-lg p-6">
                                    <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                                        <Icon />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">{item.title}</h3>
                                    <p className="text-sm text-gray-600">
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
                            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                                Integrated in minutes, not months.
                            </h2>
                            <p className="text-lg text-gray-600 mb-8">
                                Our SDKs are lightweight, type-safe, and designed for maximum performance.
                                Manage complexity without sacrificing developer experience.
                            </p>

                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <CheckCircle2 className="text-gray-900 flex-shrink-0 mt-1" size={20} />
                                    <div>
                                        <h4 className="font-semibold text-gray-900">
                                            Zero-latency local evaluation
                                        </h4>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <CheckCircle2 className="text-gray-900 flex-shrink-0 mt-1" size={20} />
                                    <div>
                                        <h4 className="font-semibold text-gray-900">
                                            TypeScript definitions included
                                        </h4>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <CheckCircle2 className="text-gray-900 flex-shrink-0 mt-1" size={20} />
                                    <div>
                                        <h4 className="font-semibold text-gray-900">
                                            Real-time event streaming
                                        </h4>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right - Code Mockup */}
                        <div>
                            <div className="bg-[#282c34] rounded-lg shadow-xl p-6 font-mono text-sm overflow-hidden">
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
                <section className="bg-black rounded-2xl my-16 lg:my-24 mx-4 sm:mx-6 lg:mx-8 px-6 lg:px-12 py-16 lg:py-20 text-center">
                    <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                        Ready to orchestrate your next release?
                    </h2>
                    <p className="text-lg text-gray-300 mb-10">
                        Join 1,000+ engineering teams shipping code faster and safer than ever
                        before.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button className="bg-white text-black hover:bg-gray-100 px-8 py-6 text-sm font-semibold">
                            Start Free Trial
                        </Button>
                        <Button
                            variant="ghost"
                            asChild
                            className="border border-white/80 bg-transparent text-white hover:bg-white hover:text-black px-8 py-6 text-sm font-semibold"
                        >
                            <Link href="/architecture">See Architecture</Link>
                        </Button>
                    </div>
                </section>
            </div>

            {/* Footer */}
            <footer className="bg-gray-50 border-t border-gray-200 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row items-center justify-between">
                        <span className="text-lg font-bold text-black mb-4 sm:mb-0">
                            Flag Pilot
                        </span>
                        <div className="flex items-center gap-8 text-sm text-gray-600">
                            <span>© 2026 Flag Pilot Inc. Precision engineering for feature management.</span>
                            <div className="flex gap-6">
                                <a href="#" className="hover:text-gray-900">
                                    Privacy
                                </a>
                                <a href="#" className="hover:text-gray-900">
                                    Terms
                                </a>
                                <a href="#" className="hover:text-gray-900">
                                    Security
                                </a>
                                <a href="#" className="hover:text-gray-900">
                                    Status
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
