'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ArrowRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { login } from "@/redux/features/auth/auth.slice";

function Login() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleCreate = () => {
    router.push("/auth/signup");
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await dispatch(login({ email, password }));

    if (login.fulfilled.match(result)) {
      const next = searchParams.get("next");
      router.push(next || "/dashboard/overview");
    }
  };

  return (
    <div className="flex flex-col text-black max-w-lg w-full">
      <div className="flex flex-col gap-6">
        <h1 className="text-4xl font-semibold">Log in to your account</h1>
        <span className="text-gray-500 text-base">
          Join the community of elite developers.
        </span>
      </div>

      <div className="flex flex-col gap-4 mt-10">
        <Button className="bg-transparent border border-black rounded-xs h-10 hover:bg-black hover:text-white transition">
          Continue with Google
        </Button>
        <Button className="bg-transparent border border-black rounded-xs h-10 hover:bg-black hover:text-white transition">
          Continue with Github
        </Button>
      </div>

      <div className="mt-6 flex items-center justify-center gap-6">
        <Separator className="bg-muted-foreground flex-1" />
        <span className="text-gray-500 uppercase text-xs font-semibold tracking-widest">
          or continue with
        </span>
        <Separator className="bg-muted-foreground flex-1" />
      </div>

      <form onSubmit={handleLogin} className="flex flex-col gap-5 mt-8">
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Work Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="h-10 rounded-xs border border-black"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <Button
          type="submit"
          disabled={status === "loading"}
          className="mt-4 h-11 rounded-xs bg-black text-white hover:bg-black/90 flex flex-nowrap items-center"
        >
          {status === "loading" ? "Logging in..." : "Login Account"}
          <ArrowRight />
        </Button>
        <div className="text-center text-sm">
          <span className="text-gray-500 ">Don't have an account?</span>
          <Button
            type="button"
            onClick={handleCreate}
            variant="link"
            className="text-black"
          >
            Create Account
          </Button>
        </div>
      </form>
    </div>
  );
}

export default Login;
