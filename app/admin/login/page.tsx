"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginUser, registerInitialAdmin, resetUserPassword } from "@/app/lib/auth";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  User,
  Loader2,
  AlertCircle,
  HelpCircle,
  Check,
  Sparkles,
  LogIn,
} from "lucide-react";

export default function AdminLogin() {
  const router = useRouter();

  const [mode, setMode] = useState<"signin" | "register">("signin");
  const [name, setName] = useState("");
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
      if (mode === "signin") {
        await loginUser(email.trim(), password);
        router.replace("/admin/dashboard");
      } else {
        await registerInitialAdmin(email.trim(), password, name);
        router.replace("/admin/dashboard");
      }
    } catch (err: any) {
      setError(
        err instanceof Error ? err.message : "Authentication failed. Please verify your details."
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
      setResetSuccess(`Password reset email sent to ${email.trim()}. Check your inbox.`);
    } catch (err: any) {
      setError(
        err?.message || "Unable to send password reset email. Ensure the user exists in Firebase Auth."
      );
    } finally {
      setSendingReset(false);
    }
  }

  return (
    <main className="min-h-screen bg-white flex flex-col justify-between selection:bg-[#D78359]/20 selection:text-[#29382F]">
      
      {/* ========================================================= */}
      {/* TOP BANNER HERO (MARKETING.jpg with smooth gradient fade) */}
      {/* ========================================================= */}
      <section className="relative w-full h-64 sm:h-72 md:h-84 overflow-hidden">
        <img
          src="/images/MARKETING.jpg"
          alt="GrowthEnzyme Marketing & Tech"
          className="w-full h-full object-cover object-center scale-[1.02]"
        />

        {/* Seamless linear gradient fade into white background */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/40 to-white" />

        {/* Top Floating Brand Badge (similar to Aurora Tech in reference) */}
        <div className="absolute top-5 right-5 sm:top-7 sm:right-9 z-20">
          <Link
            href="/"
            className="group flex items-center gap-2.5 rounded-full bg-white/90 backdrop-blur-md px-4 py-2 border border-[#29382F]/10 shadow-[0_4px_20px_rgba(41,56,47,0.08)] transition-all hover:bg-white hover:scale-105"
          >
            <div className="h-6 w-6 rounded-full bg-[#29382F] flex items-center justify-center text-[10px] font-bold text-white shadow-xs">
              GE
            </div>
            <div className="flex flex-col">
              <span className="font-heading text-xs font-bold tracking-wider text-[#29382F] uppercase">
                GrowthEnzyme
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* ========================================================= */}
      {/* FLOATING LOGIN CONTENT & CARD CONTAINER                   */}
      {/* ========================================================= */}
      <div className="relative -mt-16 sm:-mt-20 mx-auto w-full max-w-md px-5 z-10 pb-16 flex-1 flex flex-col justify-center">

        {/* CENTERED HEADLINE & SUBTITLE (Matching Reference Layout) */}
        <div className="text-center mb-6">
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1B2921]">
            {mode === "signin" ? "Welcome Back" : "Create Admin Account"}
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-[#506B59] max-w-sm mx-auto leading-relaxed">
            {mode === "signin"
              ? "Sign in to access your dashboard and continue where you left off."
              : "Set up your admin credentials to manage GrowthEnzyme articles & assets."}
          </p>
        </div>

        {/* FLOATING FORM CARD */}
        <div className="rounded-3xl border border-[#29382F]/10 bg-[#F4F6F1] p-6 sm:p-8 shadow-[0_20px_50px_rgba(41,56,47,0.08)] backdrop-blur-xs">

          {/* MODE SELECTOR TABS (Sign In vs Create Admin) */}
          <div className="flex rounded-2xl bg-white/80 p-1 border border-[#29382F]/8 mb-6 shadow-2xs">
            <button
              type="button"
              onClick={() => {
                setMode("signin");
                setError("");
                setResetSuccess("");
              }}
              className={`flex-1 inline-flex items-center justify-center gap-2 rounded-xl py-2 text-xs font-semibold transition cursor-pointer ${
                mode === "signin"
                  ? "bg-[#29382F] text-white shadow-xs"
                  : "text-[#506B59] hover:text-[#29382F]"
              }`}
            >
              <LogIn size={13} />
              <span>Sign In</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMode("register");
                setError("");
                setResetSuccess("");
              }}
              className={`flex-1 inline-flex items-center justify-center gap-2 rounded-xl py-2 text-xs font-semibold transition cursor-pointer ${
                mode === "register"
                  ? "bg-[#29382F] text-white shadow-xs"
                  : "text-[#506B59] hover:text-[#29382F]"
              }`}
            >
              <Sparkles size={13} className={mode === "register" ? "text-[#D78359]" : "text-[#506B59]"} />
              <span>Create Admin</span>
            </button>
          </div>

          {/* FEEDBACK BANNERS */}
          {error && (
            <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-xs sm:text-sm text-red-700 flex items-start gap-2.5">
              <AlertCircle size={16} className="shrink-0 text-red-600 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold">Authentication Notice</p>
                <p className="mt-0.5 text-xs text-red-600 leading-relaxed">{error}</p>
                {mode === "signin" && error.includes("invalid-credential") && (
                  <button
                    type="button"
                    onClick={() => {
                      setMode("register");
                      setError("");
                    }}
                    className="mt-2 text-xs font-bold text-[#D78359] underline hover:text-[#C26233] cursor-pointer"
                  >
                    Need to create this admin account? Click here →
                  </button>
                )}
              </div>
            </div>
          )}

          {resetSuccess && (
            <div className="mb-5 rounded-2xl border border-[#B6CBA9] bg-[#E8EEE5] p-3.5 text-xs sm:text-sm font-semibold text-[#29382F] flex items-center gap-2">
              <Check size={16} className="text-[#29382F]" />
              <span>{resetSuccess}</span>
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* FULL NAME (Only in Register Mode) */}
            {mode === "register" && (
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-[#29382F]">
                  Full Name
                </label>
                <div className="relative flex items-center rounded-2xl bg-white border border-[#29382F]/15 px-3.5 py-2.5 transition hover:border-[#29382F]/30 focus-within:border-[#29382F] focus-within:ring-2 focus-within:ring-[#29382F]/10 shadow-2xs">
                  <User size={16} className="text-[#506B59]/70 shrink-0 mr-2.5" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Administrator"
                    className="w-full bg-transparent outline-none text-xs sm:text-sm text-[#29382F] placeholder-gray-400"
                  />
                </div>
              </div>
            )}

            {/* EMAIL ADDRESS */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[#29382F]">
                Email Address
              </label>
              <div className="relative flex items-center rounded-2xl bg-white border border-[#29382F]/15 px-3.5 py-2.5 transition hover:border-[#29382F]/30 focus-within:border-[#29382F] focus-within:ring-2 focus-within:ring-[#29382F]/10 shadow-2xs">
                <Mail size={16} className="text-[#506B59]/70 shrink-0 mr-2.5" />
                <input
                  type="email"
                  required
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-transparent outline-none text-xs sm:text-sm text-[#29382F] placeholder-gray-400"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-[#29382F]">
                  Password {mode === "register" && <span className="text-[10px] font-normal text-gray-500">(min 6 chars)</span>}
                </label>
                {mode === "signin" && (
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    disabled={sendingReset}
                    className="text-[11px] font-semibold text-[#D78359] hover:underline cursor-pointer"
                  >
                    {sendingReset ? "Sending..." : "Forgot?"}
                  </button>
                )}
              </div>

              <div className="relative flex items-center rounded-2xl bg-white border border-[#29382F]/15 px-3.5 py-2.5 transition hover:border-[#29382F]/30 focus-within:border-[#29382F] focus-within:ring-2 focus-within:ring-[#29382F]/10 shadow-2xs">
                <Lock size={16} className="text-[#506B59]/70 shrink-0 mr-2.5" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-transparent outline-none text-xs sm:text-sm text-[#29382F] placeholder-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-[#29382F] transition cursor-pointer ml-2"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* SUBMIT BUTTON (Rounded Gradient Pill Button matching reference) */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full py-3 sm:py-3.5 px-6 font-semibold text-xs sm:text-sm text-white bg-gradient-to-r from-[#173D32] via-[#29382F] to-[#D78359] hover:from-[#133027] hover:to-[#C26233] transition-all shadow-md hover:shadow-lg cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2 group"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>{mode === "signin" ? "Signing In..." : "Creating Account..."}</span>
                  </>
                ) : (
                  <>
                    <span>{mode === "signin" ? "Sign In" : "Create Admin & Sign In"}</span>
                    <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* EXPANDABLE TROUBLESHOOTING HINT */}
          <div className="mt-6 pt-5 border-t border-[#29382F]/10">
            <button
              type="button"
              onClick={() => setShowHelp(!showHelp)}
              className="w-full inline-flex items-center justify-between text-xs text-[#506B59] hover:text-[#29382F] transition cursor-pointer"
            >
              <span className="inline-flex items-center gap-1.5 font-medium">
                <HelpCircle size={13} className="text-[#D78359]" />
                Troubleshooting sign-in issues
              </span>
              <span className="text-[11px] font-bold">{showHelp ? "Hide" : "Show"}</span>
            </button>

            {showHelp && (
              <div className="mt-3 p-3.5 rounded-2xl border border-amber-200 bg-amber-50/70 text-xs text-[#38493F] space-y-2 leading-relaxed">
                <p className="font-semibold text-amber-950">Quick Solutions:</p>
                <ul className="list-disc pl-4 space-y-1.5 text-[11px]">
                  <li>
                    <strong>First-time setup?</strong> Switch to the <strong>&ldquo;Create Admin&rdquo;</strong> tab above and enter your desired admin email and password.
                  </li>
                  <li>
                    <strong>Already registered?</strong> Double check for typos or click <strong>Forgot?</strong> above.
                  </li>
                  <li>
                    <strong>Firebase Console:</strong> Ensure <em>Email/Password</em> is enabled in <a href="https://console.firebase.google.com/project/growthenzyme-cms/authentication/providers" target="_blank" rel="noreferrer" className="underline font-bold text-[#29382F]">Firebase Console &gt; Authentication &gt; Sign-in method</a>.
                  </li>
                </ul>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* FOOTER NOTE */}
      <footer className="text-center py-4 text-xs text-[#506B59]/70">
        &copy; {new Date().getFullYear()} GrowthEnzyme. All rights reserved.
      </footer>
    </main>
  );
}
