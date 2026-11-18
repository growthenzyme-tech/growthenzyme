"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginUser, resetUserPassword } from "@/app/lib/auth";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  AlertCircle,
  HelpCircle,
  Check,
} from "lucide-react";

export default function AdminLogin() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState("");
  const [sendingReset, setSendingReset] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setResetSuccess("");
    setLoading(true);

    try {
      await loginUser(email.trim(), password);
      router.replace("/admin/dashboard");
    } catch (err: any) {
      setError(
        err instanceof Error
          ? err.message
          : "Authentication failed. Please verify your details."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotPassword() {
    if (!email.trim()) {
      setError("Please enter your email address above to reset password.");
      return;
    }

    try {
      setSendingReset(true);
      setError("");
      await resetUserPassword(email);
      setResetSuccess(
        `Password reset email sent to ${email.trim()}. Check your inbox.`
      );
    } catch (err: any) {
      setError(
        err?.message ||
          "Unable to send password reset email. Ensure the user exists in Firebase Auth."
      );
    } finally {
      setSendingReset(false);
    }
  }

  return (
    <main className="h-screen max-h-screen overflow-hidden bg-[#EEF5EB] flex flex-col justify-between selection:bg-[#29382F]/20 selection:text-[#1B2921]">
      {/* ========================================================= */}
      {/* TOP BANNER HERO (4k.jpg - High Clarity Hero Banner)        */}
      {/* ========================================================= */}
      <section className="relative w-full h-[39vh] sm:h-[43vh] md:h-[47vh] min-h-[285px] max-h-[425px] shrink-0 overflow-hidden bg-[#EEF5EB]">
        <img
          src="/images/4k.jpg"
          alt="GrowthEnzyme Hero Banner"
          loading="eager"
          decoding="async"
          className="w-full h-full object-cover object-[center_50%]"
        />

        {/* Graceful image fade: reveals photo details clearly up top, softly melting into light greenish canvas */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent via-40% to-[#EEF5EB]/95" />
        <div className="absolute bottom-0 left-0 right-0 h-24 sm:h-28 bg-gradient-to-t from-[#EEF5EB] via-[#EEF5EB]/70 to-transparent pointer-events-none" />

        {/* Top Left Brand Logo (High-Clarity Master Icon, Positioned to Left) */}
        <div className="absolute top-4 left-3 sm:top-5 sm:left-4 md:left-5 z-20">
          <Link
            href="/"
            className="group block transition-all duration-300 hover:scale-105 focus:outline-none"
            aria-label="GrowthEnzyme Home"
          >
            <img
              src="/images/logo.png"
              alt="GrowthEnzyme"
              className="h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 object-contain drop-shadow-[0_6px_16px_rgba(41,56,47,0.18)]"
            />
          </Link>
        </div>
      </section>

      {/* ========================================================= */}
      {/* MAIN CONTENT & LIGHT GREENISH CANVAS LOGIN CARD           */}
      {/* ========================================================= */}
      <div className="relative -mt-24 sm:-mt-28 md:-mt-32 lg:-mt-36 mx-auto w-full max-w-[700px] px-5 z-10 flex-1 flex flex-col justify-center my-auto">
        {/* LIGHT GREENISH FLOATING CARD */}
        <div className="rounded-[28px] sm:rounded-[32px] border border-[#ADC4A4]/80 bg-[#D7E6D1] pt-7 sm:pt-9 md:pt-10 pb-6 sm:pb-8 md:pb-10 px-6 sm:px-8 md:px-10 lg:px-11 shadow-[0_25px_60px_-15px_rgba(41,56,47,0.18)]">
          {/* CENTERED HEADLINE & SUBTITLE */}
          <div className="text-center mb-6 sm:mb-7">
            <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-[#1B2921]">
              Welcome Back
            </h1>
            <p className="mt-1.5 text-xs sm:text-sm text-[#2E4735] max-w-xl mx-auto leading-relaxed">
              Sign in to access your dashboard and continue where you left off.
            </p>
          </div>

          {/* FEEDBACK BANNERS */}
          {error && (
            <div className="mb-4 rounded-xl border border-red-300 bg-red-100/90 p-3.5 text-xs text-red-900 flex items-start gap-2.5 shadow-2xs">
              <AlertCircle size={16} className="shrink-0 text-red-700 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-red-950">Authentication Notice</p>
                <p className="mt-0.5 text-red-800 leading-relaxed">{error}</p>
              </div>
            </div>
          )}

          {resetSuccess && (
            <div className="mb-4 rounded-xl border border-[#ADC4A4] bg-white p-3.5 text-xs font-semibold text-[#1B2921] flex items-center gap-2 shadow-2xs">
              <Check size={16} className="text-[#1B2921]" />
              <span>{resetSuccess}</span>
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* EMAIL ADDRESS */}
            <div>
              <label className="mb-1.5 block text-xs sm:text-sm font-semibold text-[#1B2921]">
                Email Address
              </label>
              <div className="relative flex items-center rounded-xl sm:rounded-2xl bg-white border border-[#ADC4A4] px-4 py-2.5 sm:py-3 transition focus-within:border-[#29382F] focus-within:ring-2 focus-within:ring-[#29382F]/15 shadow-2xs">
                <Mail size={16} className="text-[#3B5A44] shrink-0 mr-3" />
                <input
                  type="email"
                  required
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-transparent outline-none text-xs sm:text-sm text-[#1B2921] placeholder-gray-400"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs sm:text-sm font-semibold text-[#1B2921]">
                  Password
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  disabled={sendingReset}
                  className="text-xs font-semibold text-[#1B2921] hover:underline cursor-pointer"
                >
                  {sendingReset ? "Sending..." : "Forgot?"}
                </button>
              </div>

              <div className="relative flex items-center rounded-xl sm:rounded-2xl bg-white border border-[#ADC4A4] px-4 py-2.5 sm:py-3 transition focus-within:border-[#29382F] focus-within:ring-2 focus-within:ring-[#29382F]/15 shadow-2xs">
                <Lock size={16} className="text-[#3B5A44] shrink-0 mr-3" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-transparent outline-none text-xs sm:text-sm text-[#1B2921] placeholder-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[#3B5A44] hover:text-[#1B2921] transition cursor-pointer ml-2"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <div className="pt-2 sm:pt-2.5">
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full py-3 sm:py-3.5 px-6 font-semibold text-xs sm:text-sm text-white bg-[#29382F] hover:bg-[#1D2821] active:scale-[0.99] transition-all shadow-md hover:shadow-lg cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2 group"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight
                      size={16}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* EXPANDABLE TROUBLESHOOTING HINT */}
          <div className="mt-5 pt-3.5 border-t border-[#ADC4A4]/60">
            <button
              type="button"
              onClick={() => setShowHelp(!showHelp)}
              className="w-full inline-flex items-center justify-between text-xs text-[#2E4735] hover:text-[#1B2921] transition cursor-pointer"
            >
              <span className="inline-flex items-center gap-1.5 font-medium">
                <HelpCircle size={13} className="text-[#1B2921]" />
                Troubleshooting sign-in issues
              </span>
              <span className="font-bold">{showHelp ? "Hide" : "Show"}</span>
            </button>

            {showHelp && (
              <div className="mt-2.5 p-3.5 rounded-xl border border-[#ADC4A4] bg-white/95 text-xs text-[#1B2921] space-y-1.5 leading-relaxed shadow-2xs">
                <p className="font-semibold text-[#142318]">Quick Solutions:</p>
                <ul className="list-disc pl-4 space-y-1 text-[11px]">
                  <li>
                    <strong>Double check your credentials</strong> for typos or
                    click <strong>Forgot?</strong> above to reset your password.
                  </li>
                  <li>
                    <strong>Firebase Console:</strong> Ensure{" "}
                    <em>Email/Password</em> sign-in provider is enabled in{" "}
                    <a
                      href="https://console.firebase.google.com/project/growthenzyme-cms/authentication/providers"
                      target="_blank"
                      rel="noreferrer"
                      className="underline font-bold text-[#142318]"
                    >
                      Firebase Console &gt; Authentication &gt; Sign-in method
                    </a>
                    .
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FOOTER NOTE */}
      <footer className="text-center py-2 sm:py-2.5 text-[11px] text-gray-400 shrink-0">
        &copy; {new Date().getFullYear()} GrowthEnzyme. All rights reserved.
      </footer>
    </main>
  );
}
