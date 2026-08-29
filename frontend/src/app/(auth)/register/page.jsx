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

export default function RegisterPage() {
  const { register } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error("Please enter your name");
      return;
    }

    if (!form.email.trim()) {
      toast.error("Please enter your email");
      return;
    }

    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      await register({
        name: form.name,
        email: form.email,
        password: form.password,
      });

      toast.success("Account created successfully");

      window.location.href = "/login";
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Registration failed"
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
              Your intelligent
              <span className="block text-brand-primary">
                AI workspace.
              </span>
            </h2>

            <p className="mt-5 max-w-md text-sm leading-7 text-text-secondary">
              Create your account and start having intelligent
              conversations with your AI assistant. Upload files,
              ask questions and get contextual answers.
            </p>
          </div>

          {/* Features */}
          <div className="mt-8 space-y-3">
            <Feature
              icon={<MessageSquare size={17} />}
              title="Smart Conversations"
              description="Chat naturally with your AI assistant."
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

          {/* Bottom status */}
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
              Create your account
            </h1>

            <p className="mt-1 text-xs text-text-secondary">
              Start chatting with your AI assistant
            </p>
          </div>

          {/* Register Card */}
          <div className="rounded-3xl border border-border-color bg-bg-secondary/90 p-5 shadow-2xl backdrop-blur-xl">

            {/* Card header */}
            <div className="mb-5 flex items-center gap-3 rounded-xl border border-border-color bg-bg-primary/60 p-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-light text-brand-primary">
                <Cpu size={16} />
              </div>

              <div>
                <p className="text-xs font-bold text-text-primary">
                  Create your account
                </p>

                <div className="mt-0.5 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-primary" />

                  <span className="text-[9px] font-medium text-text-secondary">
                    Ready to get started
                  </span>
                </div>
              </div>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="space-y-3"
            >
              {/* Name */}
              <FormField
                label="Name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your name"
                autoComplete="name"
                disabled={loading}
              />

              {/* Email */}
              <FormField
                label="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
                autoComplete="email"
                disabled={loading}
              />

              {/* Password */}
              <PasswordField
                label="Password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                visible={showPassword}
                setVisible={setShowPassword}
                disabled={loading}
              />

              {/* Confirm password */}
              <PasswordField
                label="Confirm Password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                visible={showConfirmPassword}
                setVisible={setShowConfirmPassword}
                disabled={loading}
              />

              {/* Submit */}
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
                    Creating account...
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    Create account
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-border-color" />

              <span className="text-[9px] font-semibold uppercase tracking-wider text-text-secondary">
                Already registered?
              </span>

              <div className="h-px flex-1 bg-border-color" />
            </div>

            {/* Login */}
            <Link
              href="/login"
              className="flex w-full items-center justify-center rounded-xl border border-border-color bg-bg-primary py-2.5 text-sm font-semibold text-text-primary transition hover:border-brand-primary/50 hover:bg-bg-secondary hover:text-brand-primary"
            >
              Login to your account
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

/* ================= FORM FIELD ================= */

function FormField({
  label,
  name,
  type,
  value,
  onChange,
  placeholder,
  autoComplete,
  disabled,
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-text-secondary"
      >
        {label}
      </label>

      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        disabled={disabled}
        className="w-full rounded-xl border border-border-color bg-bg-primary px-3.5 py-2.5 text-sm text-text-primary outline-none placeholder:text-text-secondary/60 transition-all focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15 disabled:cursor-not-allowed disabled:opacity-60"
      />
    </div>
  );
}

/* ================= PASSWORD FIELD ================= */

function PasswordField({
  label,
  name,
  value,
  onChange,
  placeholder,
  visible,
  setVisible,
  disabled,
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-text-secondary"
      >
        {label}
      </label>

      <div className="relative">
        <input
          id={name}
          type={visible ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete="new-password"
          disabled={disabled}
          className="w-full rounded-xl border border-border-color bg-bg-primary px-3.5 py-2.5 pr-11 text-sm text-text-primary outline-none placeholder:text-text-secondary/60 transition-all focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15 disabled:cursor-not-allowed disabled:opacity-60"
        />

        <button
          type="button"
          onClick={() => setVisible((prev) => !prev)}
          disabled={disabled}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-text-secondary transition hover:bg-bg-secondary hover:text-text-primary disabled:opacity-50"
          aria-label={
            visible ? "Hide password" : "Show password"
          }
        >
          {visible ? (
            <EyeOff size={17} />
          ) : (
            <Eye size={17} />
          )}
        </button>
      </div>
    </div>
  );
}