'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { clearAuthError, login } from "@/redux/features/auth/auth.slice";
import { toast } from "sonner";

function Login() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleCreate = () => {
    router.push("/auth/signup");
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);

    if (!email.trim() || !password.trim()) {
      setFormError("Email and password are required.");
      return;
    }

    const result = await dispatch(login({ email, password }));

    if (login.fulfilled.match(result)) {
      const next = searchParams.get("next");
      router.push(next || "/dashboard/overview");
      toast.success("Login successfully");
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

      <div className="mt-6 flex items-center justify-center gap-6">
        <Separator className="bg-muted-foreground flex-1" />
        <span className="text-gray-500 uppercase text-xs font-semibold tracking-widest">
          continue with email
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
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error || formError) {
                  dispatch(clearAuthError());
                  setFormError(null);
                }
              }}
              placeholder="Enter your password"
              className="h-10 rounded-xs border border-black pr-10"
            />
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 hover:text-black"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {formError && <p className="text-sm text-red-600">{formError}</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}

        <Button
          type="submit"
          disabled={status === "loading" || !email.trim() || !password.trim()}
          className="mt-4 h-11 rounded-xs bg-black text-white hover:bg-black/90 flex flex-nowrap items-center"
        >
          {status === "loading" ? "Logging in..." : "Login Account"}
          <ArrowRight />
        </Button>
        <div className="text-center text-sm">
          <span className="text-gray-500 ">Don&apos;t have an account?</span>
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
