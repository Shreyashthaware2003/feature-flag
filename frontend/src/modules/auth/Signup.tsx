'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { clearAuthError, signup } from "@/redux/features/auth/auth.slice";
import { toast } from "sonner";
import { GoogleIcon } from "@/components/icons/google-icons";

function Signup() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { status, error } = useAppSelector((state) => state.auth);

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [formError, setFormError] = useState<string | null>(null);

    const handleCreateAccount = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFormError(null);

        if (!fullName.trim() || !email.trim() || !password.trim()) {
            setFormError("Full name, email, and password are required.");
            return;
        }

        const result = await dispatch(
            signup({
                full_name: fullName,
                email,
                password,
            })
        );

        if (signup.fulfilled.match(result)) {
            router.push("/dashboard/overview");
            toast.success("Account created successfully")
        }
    };

    const handleLogin = () => router.push("/auth/login");

    return (
        <div className="flex flex-col text-black max-w-lg w-full">
            <div className="flex flex-col gap-6">
                <h1 className="text-4xl font-semibold">Create your account</h1>
                <span className="text-gray-500 text-base">
                    Join the community of elite developers.
                </span>
            </div>

            <div className="flex flex-col gap-4 mt-10">
                <Button onClick={() => toast.warning('This option is not available yet.')} className="bg-transparent border border-black rounded-xs h-10 text-black hover:bg-black hover:text-white transition">
                    <GoogleIcon />
                    Continue with Google
                </Button>
            </div>

            <div className="mt-6 flex items-center justify-center gap-6">
                <Separator className="bg-muted-foreground flex-1" />
                <span className="text-gray-500 uppercase text-xs font-semibold tracking-widest">
                    or continue with
                </span>
                <Separator className="bg-muted-foreground flex-1" />
            </div>

            <form onSubmit={handleCreateAccount} className="flex flex-col gap-5 mt-8">
                <div className="flex flex-col gap-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                        id="fullName"
                        value={fullName}
                        onChange={(e) => {
                            setFullName(e.target.value);
                            if (error || formError) {
                                dispatch(clearAuthError());
                                setFormError(null);
                            }
                        }}
                        placeholder="John Doe"
                        className="h-10 rounded-xs border border-black"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <Label htmlFor="email">Work Email</Label>
                    <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            if (error || formError) {
                                dispatch(clearAuthError());
                                setFormError(null);
                            }
                        }}
                        placeholder="you@company.com"
                        className="h-10 rounded-xs border border-black"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            if (error || formError) {
                                dispatch(clearAuthError());
                                setFormError(null);
                            }
                        }}
                        placeholder="Enter your password"
                        className="h-10 rounded-xs border border-black"
                    />
                </div>

                {formError && <p className="text-sm text-red-600">{formError}</p>}
                {error && <p className="text-sm text-red-600">{error}</p>}

                <Button
                    type="submit"
                    disabled={
                        status === "loading" ||
                        !fullName.trim() ||
                        !email.trim() ||
                        !password.trim()
                    }
                    className="mt-4 h-11 rounded-xs bg-black text-white hover:bg-black/90 flex flex-nowrap items-center"
                >
                    {status === "loading" ? "Creating..." : "Create Account"}
                    <ArrowRight />
                </Button>

                <div className="text-center text-sm">
                    <span className="text-gray-500">Already have an account?</span>
                    <Button type="button" onClick={handleLogin} variant="link" className="text-black">
                        Log In
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default Signup;
