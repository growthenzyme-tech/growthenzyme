"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  loginUser,
  registerInitialAdmin,
  resetUserPassword,
} from "@/app/lib/auth";
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
      {/* TOP BANNER HERO (ge.jpg 4K - Revealed More, Smooth Fade)   */}
      {/* ========================================================= */}
      <section className="relative w-full h-[39vh] sm:h-[43vh] md:h-[47vh] min-h-[285px] max-h-[425px] shrink-0 overflow-hidden bg-[#EEF5EB]">
        <img
          src="/images/ge.jpg"
          alt="GrowthEnzyme Workspace Banner"
          loading="eager"
          decoding="async"
          className="w-full h-full object-cover object-[center_52%]"
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
      <div className="relative -mt-28 sm:-mt-34 md:-mt-40 lg:-mt-44 mx-auto w-full max-w-[760px] px-5 z-10 flex-1 flex flex-col justify-center my-auto">
        {/* LIGHT GREENISH FLOATING CARD (Extended length to top) */}
        <div className="rounded-[28px] sm:rounded-[32px] border border-[#ADC4A4]/80 bg-[#D7E6D1] pt-7 sm:pt-9 md:pt-10 pb-6 sm:pb-8 md:pb-10 px-6 sm:px-8 md:px-10 lg:px-11 shadow-[0_25px_60px_-15px_rgba(41,56,47,0.18)]">
          {/* CENTERED HEADLINE & SUBTITLE */}
          <div className="text-center mb-5 sm:mb-6">
            <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-[#1B2921]">
              {mode === "signin" ? "Welcome Back" : "Create Admin Account"}
            </h1>
            <p className="mt-1.5 text-xs sm:text-sm text-[#2E4735] max-w-xl mx-auto leading-relaxed">
              {mode === "signin"
                ? "Sign in to access your dashboard and continue where you left off."
                : "Set up your admin credentials to manage GrowthEnzyme articles & assets."}
            </p>
          </div>

          {/* MODE SELECTOR TABS (Pure White Container on Light Greenish Canvas) */}
          <div className="flex rounded-xl sm:rounded-2xl bg-white p-1.5 border border-[#ADC4A4] mb-5 sm:mb-6 shadow-2xs">
            <button
              type="button"
              onClick={() => {
                setMode("signin");
                setError("");
                setResetSuccess("");
              }}
              className={`flex-1 inline-flex items-center justify-center gap-2 rounded-lg sm:rounded-xl py-2 sm:py-2.5 text-xs sm:text-sm font-semibold transition cursor-pointer ${
                mode === "signin"
                  ? "bg-[#29382F] text-white shadow-xs"
                  : "text-[#2E4735] hover:text-[#1B2921]"
              }`}
            >
              <LogIn size={14} />
              <span>Sign In</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMode("register");
                setError("");
                setResetSuccess("");
              }}
              className={`flex-1 inline-flex items-center justify-center gap-2 rounded-lg sm:rounded-xl py-2 sm:py-2.5 text-xs sm:text-sm font-semibold transition cursor-pointer ${
                mode === "register"
                  ? "bg-[#29382F] text-white shadow-xs"
                  : "text-[#2E4735] hover:text-[#1B2921]"
              }`}
            >
              <Sparkles
                size={14}
                className={mode === "register" ? "text-white" : "text-[#2E4735]"}
              />
              <span>Create Admin</span>
            </button>
          </div>

          {/* FEEDBACK BANNERS */}
          {error && (
            <div className="mb-4 rounded-xl border border-red-300 bg-red-100/90 p-3.5 text-xs text-red-900 flex items-start gap-2.5 shadow-2xs">
              <AlertCircle size={16} className="shrink-0 text-red-700 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-red-950">Authentication Notice</p>
                <p className="mt-0.5 text-red-800 leading-relaxed">{error}</p>
                {mode === "signin" && error.includes("invalid-credential") && (
                  <button
                    type="button"
                    onClick={() => {
                      setMode("register");
                      setError("");
                    }}
                    className="mt-1.5 block text-xs font-bold text-[#1B2921] underline hover:text-black cursor-pointer"
                  >
                    Need to create this admin account? Click here →
                  </button>
                )}
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
          <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
            {/* FULL NAME (Only in Register Mode) */}
            {mode === "register" && (
              <div>
                <label className="mb-1.5 block text-xs sm:text-sm font-semibold text-[#1B2921]">
                  Full Name
                </label>
                <div className="relative flex items-center rounded-xl sm:rounded-2xl bg-white border border-[#ADC4A4] px-4 py-2.5 sm:py-3 transition focus-within:border-[#29382F] focus-within:ring-2 focus-within:ring-[#29382F]/15 shadow-2xs">
                  <User size={16} className="text-[#3B5A44] shrink-0 mr-3" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Administrator"
                    className="w-full bg-transparent outline-none text-xs sm:text-sm text-[#1B2921] placeholder-gray-400"
                  />
                </div>
              </div>
            )}

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
                  Password{" "}
                  {mode === "register" && (
                    <span className="text-[11px] font-normal text-[#2E4735]">
                      (min 6 chars)
                    </span>
                  )}
                </label>
                {mode === "signin" && (
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    disabled={sendingReset}
                    className="text-xs font-semibold text-[#1B2921] hover:underline cursor-pointer"
                  >
                    {sendingReset ? "Sending..." : "Forgot?"}
                  </button>
                )}
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
                    <span>
                      {mode === "signin"
                        ? "Signing In..."
                        : "Creating Account..."}
                    </span>
                  </>
                ) : (
                  <>
                    <span>
                      {mode === "signin" ? "Sign In" : "Create Admin & Sign In"}
                    </span>
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
          <div className="mt-4 pt-3 border-t border-[#ADC4A4]/60">
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
                    <strong>First-time setup?</strong> Switch to the{" "}
                    <strong>&ldquo;Create Admin&rdquo;</strong> tab above and enter
                    your desired admin email and password.
                  </li>
                  <li>
                    <strong>Already registered?</strong> Double check for typos or
                    click <strong>Forgot?</strong> above.
                  </li>
                  <li>
                    <strong>Firebase Console:</strong> Ensure{" "}
                    <em>Email/Password</em> is enabled in{" "}
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
