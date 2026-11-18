"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  loginUser,
  loginWithGoogle,
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
} from "lucide-react";

function GoogleIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

function AppleIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 7.15c.66-.8 1.11-1.92.99-3.04-.96.04-2.12.64-2.8 1.44-.59.69-1.11 1.83-.97 2.92 1.07.08 2.16-.54 2.78-1.32z" />
    </svg>
  );
}

export default function AdminLogin() {
  const router = useRouter();

  const [mode, setMode] = useState<"signin" | "register">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState(false);
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

  async function handleGoogleSignIn() {
    setError("");
    setResetSuccess("");
    setSocialLoading(true);

    try {
      await loginWithGoogle();
      router.replace("/admin/dashboard");
    } catch (err: any) {
      setError(
        err?.message ||
          "Unable to complete Google sign-in. Please ensure Google Auth is enabled in Firebase Console."
      );
    } finally {
      setSocialLoading(false);
    }
  }

  function handleAppleSignIn() {
    setError(
      "Apple sign-in is not configured for this project. Please sign in with Email or Google."
    );
  }

  async function handleForgotPassword() {
    if (!email.trim()) {
      setError("Please enter your email address above to reset your password.");
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
    <main className="min-h-screen bg-white flex flex-col justify-between selection:bg-[#D78359]/20 selection:text-[#29382F]">
      {/* ========================================================= */}
      {/* TOP BANNER HERO (Cropped login.jpg, coffee cup removed)    */}
      {/* ========================================================= */}
      <section className="relative w-full h-52 sm:h-60 md:h-64 overflow-hidden">
        <img
          src="/images/login.jpg"
          alt="GrowthEnzyme Workspace Banner"
          className="w-full h-full object-cover object-top"
        />

        {/* Seamless linear gradient fade into clean white background */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/30 to-white" />

        {/* Top Right Brand Logo (matching reference Aurora Tech placement) */}
        <div className="absolute top-5 right-5 sm:top-7 sm:right-10 z-20">
          <Link
            href="/"
            className="group flex flex-col items-end gap-0.5 transition-opacity hover:opacity-80"
          >
            <div className="flex items-center gap-2">
              <img
                src="/images/logo-tab.png"
                alt="GrowthEnzyme Logo"
                className="h-6 w-6 sm:h-7 sm:w-7 object-contain"
              />
              <span className="font-heading text-xs sm:text-sm font-extrabold tracking-[0.2em] text-[#1B2921] uppercase">
                GrowthEnzyme
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* ========================================================= */}
      {/* MAIN CONTENT & LOGIN CARD CONTAINER                       */}
      {/* ========================================================= */}
      <div className="relative -mt-6 sm:-mt-8 mx-auto w-full max-w-[430px] px-5 z-10 pb-12 flex-1 flex flex-col justify-center">
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

        {/* FLOATING CARD CONTAINER */}
        <div className="rounded-[28px] border border-[#29382F]/10 bg-[#F4F6F1] p-6 sm:p-8 shadow-[0_20px_50px_rgba(41,56,47,0.06)]">
          {/* FEEDBACK BANNERS */}
          {error && (
            <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-700 flex items-start gap-2.5">
              <AlertCircle size={15} className="shrink-0 text-red-600 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold">Authentication Notice</p>
                <p className="mt-0.5 text-red-600 leading-relaxed">{error}</p>
                {mode === "signin" && error.includes("invalid-credential") && (
                  <button
                    type="button"
                    onClick={() => {
                      setMode("register");
                      setError("");
                    }}
                    className="mt-2 block text-xs font-bold text-[#D78359] underline hover:text-[#C26233] cursor-pointer"
                  >
                    Need to create this admin account? Click here →
                  </button>
                )}
              </div>
            </div>
          )}

          {resetSuccess && (
            <div className="mb-5 rounded-2xl border border-[#B6CBA9] bg-[#E8EEE5] p-3.5 text-xs font-semibold text-[#29382F] flex items-center gap-2">
              <Check size={15} className="text-[#29382F]" />
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
                  Password{" "}
                  {mode === "register" && (
                    <span className="text-[10px] font-normal text-gray-500">
                      (min 6 chars)
                    </span>
                  )}
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
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* SUBMIT BUTTON (Gradient Pill Button matching reference) */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full py-3 sm:py-3.5 px-6 font-semibold text-xs sm:text-sm text-white bg-gradient-to-r from-[#173D32] via-[#29382F] to-[#D78359] hover:from-[#133027] hover:to-[#C26233] transition-all shadow-md hover:shadow-lg cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2 group"
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
                      size={15}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* OR CONTINUE WITH DIVIDER (Matching Reference Mockup) */}
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#29382F]/10" />
            </div>
            <span className="relative bg-[#F4F6F1] px-3 text-[10px] sm:text-[11px] font-semibold tracking-wider text-[#506B59]/75 uppercase">
              OR CONTINUE WITH
            </span>
          </div>

          {/* SOCIAL SSO BUTTONS (Google & Apple) */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={socialLoading}
              className="flex items-center justify-center gap-2 rounded-2xl border border-[#29382F]/12 bg-white py-2.5 px-3 text-xs font-semibold text-[#29382F] shadow-2xs hover:bg-[#FAFBF9] hover:border-[#29382F]/25 transition cursor-pointer disabled:opacity-60"
            >
              {socialLoading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <GoogleIcon className="h-4 w-4 shrink-0" />
              )}
              <span>Google</span>
            </button>

            <button
              type="button"
              onClick={handleAppleSignIn}
              className="flex items-center justify-center gap-2 rounded-2xl border border-[#29382F]/12 bg-white py-2.5 px-3 text-xs font-semibold text-[#29382F] shadow-2xs hover:bg-[#FAFBF9] hover:border-[#29382F]/25 transition cursor-pointer"
            >
              <AppleIcon className="h-4 w-4 shrink-0 text-black" />
              <span>Apple</span>
            </button>
          </div>

          {/* MODE TOGGLE LINK (Sign In <-> Create Admin) */}
          <div className="mt-6 text-center pt-1">
            {mode === "signin" ? (
              <p className="text-xs text-[#506B59]">
                First-time setup?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("register");
                    setError("");
                    setResetSuccess("");
                  }}
                  className="font-bold text-[#D78359] hover:underline cursor-pointer"
                >
                  Create Admin Account
                </button>
              </p>
            ) : (
              <p className="text-xs text-[#506B59]">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("signin");
                    setError("");
                    setResetSuccess("");
                  }}
                  className="font-bold text-[#29382F] hover:underline cursor-pointer"
                >
                  Sign In
                </button>
              </p>
            )}
          </div>

          {/* EXPANDABLE TROUBLESHOOTING HINT */}
          <div className="mt-5 pt-4 border-t border-[#29382F]/10">
            <button
              type="button"
              onClick={() => setShowHelp(!showHelp)}
              className="w-full inline-flex items-center justify-between text-[11px] text-[#506B59] hover:text-[#29382F] transition cursor-pointer"
            >
              <span className="inline-flex items-center gap-1.5 font-medium">
                <HelpCircle size={12} className="text-[#D78359]" />
                Troubleshooting sign-in issues
              </span>
              <span className="font-bold">{showHelp ? "Hide" : "Show"}</span>
            </button>

            {showHelp && (
              <div className="mt-3 p-3.5 rounded-2xl border border-amber-200 bg-amber-50/70 text-xs text-[#38493F] space-y-2 leading-relaxed">
                <p className="font-semibold text-amber-950">Quick Solutions:</p>
                <ul className="list-disc pl-4 space-y-1.5 text-[11px]">
                  <li>
                    <strong>First-time setup?</strong> Click{" "}
                    <strong>&ldquo;Create Admin Account&rdquo;</strong> above to
                    register your administrator credentials.
                  </li>
                  <li>
                    <strong>Already registered?</strong> Double check for typos
                    or click <strong>Forgot?</strong> next to password.
                  </li>
                  <li>
                    <strong>Firebase Console:</strong> Ensure{" "}
                    <em>Email/Password</em> is enabled in{" "}
                    <a
                      href="https://console.firebase.google.com/project/growthenzyme-cms/authentication/providers"
                      target="_blank"
                      rel="noreferrer"
                      className="underline font-bold text-[#29382F]"
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
      <footer className="text-center py-4 text-xs text-[#506B59]/70">
        &copy; {new Date().getFullYear()} GrowthEnzyme. All rights reserved.
      </footer>
    </main>
  );
}
