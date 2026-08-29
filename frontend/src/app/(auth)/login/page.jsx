"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  Loader2,
  Sparkles,
  Cpu,
  ShieldCheck,
  MessageSquare,
  Zap,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email.trim()) {
      toast.error("Please enter your email");
      return;
    }

    if (!form.password) {
      toast.error("Please enter your password");
      return;
    }

    try {
      setLoading(true);

      await login(form);

      toast.success("Login successful");

      window.location.href = "/";
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-bg-primary px-4 py-4 text-text-primary smooth-transition">

      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-150px] top-[-150px] h-[450px] w-[450px] rounded-full bg-brand-primary/10 blur-3xl" />

        <div className="absolute bottom-[-180px] right-[-120px] h-[400px] w-[400px] rounded-full bg-brand-secondary/10 blur-3xl" />
      </div>

      {/* Main two-column layout */}
      <div className="relative z-10 flex h-full w-full max-w-5xl items-center justify-center gap-10 lg:gap-20">

        {/* ================= LEFT SIDE ================= */}
        <section className="hidden flex-1 flex-col justify-center lg:flex">

          {/* Logo */}
          <div className="mb-7 flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-brand shadow-lg shadow-brand-primary/20">
              <Sparkles
                size={27}
                className="animate-pulse text-white"
              />
            </div>

            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-text-primary">
                Gemini Assistant
              </h1>

              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-primary">
                AI Powered Workspace
              </p>
            </div>
          </div>

          {/* Main heading */}
          <div className="max-w-lg">
            <h2 className="text-4xl font-extrabold leading-tight tracking-tight text-text-primary xl:text-5xl">
              Welcome back to your
              <span className="block text-brand-primary">
                AI workspace.
              </span>
            </h2>

            <p className="mt-5 max-w-md text-sm leading-7 text-text-secondary">
              Continue your conversations with your AI assistant.
              Ask questions, work with your documents and get
              intelligent contextual responses.
            </p>
          </div>

          {/* Features */}
          <div className="mt-8 space-y-3">
            <Feature
              icon={<MessageSquare size={17} />}
              title="Continue Conversations"
              description="Pick up where you left off with your previous chats."
            />

            <Feature
              icon={<Zap size={17} />}
              title="Fast AI Responses"
              description="Get quick and intelligent answers powered by Gemini."
            />

            <Feature
              icon={<ShieldCheck size={17} />}
              title="Secure Workspace"
              description="Your account and conversations stay protected."
            />
          </div>

          {/* Online status */}
          <div className="mt-8 flex items-center gap-2 text-xs font-medium text-text-secondary">
            <span className="h-2 w-2 animate-pulse rounded-full bg-brand-primary" />
            Gemini Assistant is online
          </div>
        </section>

        {/* ================= RIGHT SIDE ================= */}
        <section className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="mb-5 flex flex-col items-center text-center lg:hidden">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-brand shadow-lg shadow-brand-primary/20">
              <Sparkles
                size={23}
                className="animate-pulse text-white"
              />
            </div>

            <h1 className="text-2xl font-extrabold text-text-primary">
              Welcome back
            </h1>

            <p className="mt-1 text-xs text-text-secondary">
              Login to continue to your AI assistant
            </p>
          </div>

          {/* Login card */}
          <div className="rounded-3xl border border-border-color bg-bg-secondary/90 p-5 shadow-2xl backdrop-blur-xl">

            {/* Card header */}
            <div className="mb-5 flex items-center gap-3 rounded-xl border border-border-color bg-bg-primary/60 p-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-light text-brand-primary">
                <Cpu size={16} />
              </div>

              <div>
                <p className="text-xs font-bold text-text-primary">
                  Welcome back
                </p>

                <div className="mt-0.5 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-primary" />

                  <span className="text-[9px] font-medium text-text-secondary">
                    AI Assistant Online
                  </span>
                </div>
              </div>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-text-secondary"
                >
                  Email
                </label>

                <input
                  id="email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  autoComplete="email"
                  disabled={loading}
                  className="w-full rounded-xl border border-border-color bg-bg-primary px-3.5 py-2.5 text-sm text-text-primary outline-none placeholder:text-text-secondary/60 transition-all focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-text-secondary"
                >
                  Password
                </label>

                <div className="relative">
                  <input
                    id="password"
                    type={
                      showPassword ? "text" : "password"
                    }
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    disabled={loading}
                    className="w-full rounded-xl border border-border-color bg-bg-primary px-3.5 py-2.5 pr-11 text-sm text-text-primary outline-none placeholder:text-text-secondary/60 transition-all focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15 disabled:cursor-not-allowed disabled:opacity-60"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (prev) => !prev
                      )
                    }
                    disabled={loading}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-text-secondary transition hover:bg-bg-secondary hover:text-text-primary disabled:opacity-50"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>
                </div>
              </div>

              {/* Login button */}
              <button
                type="submit"
                disabled={loading}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-brand py-3 text-sm font-bold text-white shadow-lg shadow-brand-primary/15 transition-all hover:opacity-90 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />
                    Logging in...
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    Login
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-border-color" />

              <span className="text-[9px] font-semibold uppercase tracking-wider text-text-secondary">
                New here?
              </span>

              <div className="h-px flex-1 bg-border-color" />
            </div>

            {/* Register */}
            <Link
              href="/register"
              className="flex w-full items-center justify-center rounded-xl border border-border-color bg-bg-primary py-2.5 text-sm font-semibold text-text-primary transition hover:border-brand-primary/50 hover:bg-bg-secondary hover:text-brand-primary"
            >
              Create an account
            </Link>
          </div>

          {/* Footer */}
          <p className="mt-3 text-center text-[9px] font-medium text-text-secondary">
            Your account and conversations are secure.
          </p>
        </section>
      </div>
    </main>
  );
}

/* ================= FEATURE ================= */

function Feature({ icon, title, description }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-light text-brand-primary">
        {icon}
      </div>

      <div>
        <h3 className="text-xs font-bold text-text-primary">
          {title}
        </h3>

        <p className="mt-0.5 text-[10px] text-text-secondary">
          {description}
        </p>
      </div>
    </div>
  );
}