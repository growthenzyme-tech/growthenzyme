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
    <main className="min-h-screen bg-[#EFF4EB] flex flex-col justify-between selection:bg-[#29382F]/20 selection:text-[#1B2921]">
      {/* ========================================================= */}
      {/* TOP BANNER HERO (4K Botanical Growth Architecture)        */}
      {/* ========================================================= */}
      <section className="relative w-full h-60 sm:h-72 md:h-80 overflow-hidden bg-[#9BB08E]">
        <img
          src="/images/botanical-growth-4k.jpg"
          alt="GrowthEnzyme Botanical Growth Architecture"
          className="w-full h-full object-cover object-[center_45%]"
        />

        {/* Seamless linear gradient fade into pale sage page background */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#EFF4EB]/25 to-[#EFF4EB]" />

        {/* Top Right Brand Badge */}
        <div className="absolute top-5 right-5 sm:top-7 sm:right-10 z-20">
          <Link
            href="/"
            className="group flex flex-col items-end gap-0.5 transition-opacity hover:opacity-85"
          >
            <div className="flex items-center gap-2">
              <img
                src="/images/logo-tab.png"
                alt="GrowthEnzyme Logo"
                className="h-6 w-6 sm:h-7 sm:w-7 object-contain drop-shadow-xs"
              />
              <span className="font-heading text-xs sm:text-sm font-extrabold tracking-[0.2em] text-[#1B2921] uppercase">
                GrowthEnzyme
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* ========================================================= */}
      {/* MAIN CONTENT & EXPANDED BRAND GREEN LOGIN CARD (#B6CBA9)  */}
      {/* ========================================================= */}
      <div className="relative -mt-6 sm:-mt-8 mx-auto w-full max-w-[620px] px-5 z-10 pb-12 flex-1 flex flex-col justify-center">
        {/* BRAND GREEN FLOATING CARD (#B6CBA9 from user swatch) */}
        <div className="rounded-[28px] border border-[#9BB58D]/60 bg-[#B6CBA9] p-7 sm:p-10 md:p-11 shadow-[0_20px_50px_rgba(41,56,47,0.15)]">
          {/* CENTERED HEADLINE & SUBTITLE */}
          <div className="text-center mb-7">
            <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-[#1B2921]">
              {mode === "signin" ? "Welcome Back" : "Create Admin Account"}
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-[#324939] max-w-lg mx-auto leading-relaxed">
              {mode === "signin"
                ? "Sign in to access your dashboard and continue where you left off."
                : "Set up your admin credentials to manage GrowthEnzyme articles & assets."}
            </p>
          </div>

          {/* MODE SELECTOR TABS (Sign In vs Create Admin) */}
          <div className="flex rounded-2xl bg-[#EAF1E4] p-1.5 border border-[#8FA881] mb-6 shadow-2xs">
            <button
              type="button"
              onClick={() => {
                setMode("signin");
                setError("");
                setResetSuccess("");
              }}
              className={`flex-1 inline-flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs sm:text-sm font-semibold transition cursor-pointer ${
                mode === "signin"
                  ? "bg-[#29382F] text-white shadow-xs"
                  : "text-[#324939] hover:text-[#1B2921]"
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
              className={`flex-1 inline-flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs sm:text-sm font-semibold transition cursor-pointer ${
                mode === "register"
                  ? "bg-[#29382F] text-white shadow-xs"
                  : "text-[#324939] hover:text-[#1B2921]"
              }`}
            >
              <Sparkles
                size={14}
                className={mode === "register" ? "text-white" : "text-[#324939]"}
              />
              <span>Create Admin</span>
            </button>
          </div>

          {/* FEEDBACK BANNERS */}
          {error && (
            <div className="mb-5 rounded-2xl border border-red-300 bg-red-100/90 p-4 text-xs sm:text-sm text-red-900 flex items-start gap-2.5 shadow-2xs">
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
                    className="mt-2 block text-xs font-bold text-[#1B2921] underline hover:text-black cursor-pointer"
                  >
                    Need to create this admin account? Click here →
                  </button>
                )}
              </div>
            </div>
          )}

          {resetSuccess && (
            <div className="mb-5 rounded-2xl border border-[#8FA881] bg-[#EAF1E4] p-4 text-xs sm:text-sm font-semibold text-[#1B2921] flex items-center gap-2 shadow-2xs">
              <Check size={16} className="text-[#1B2921]" />
              <span>{resetSuccess}</span>
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {/* FULL NAME (Only in Register Mode) */}
            {mode === "register" && (
              <div>
                <label className="mb-1.5 block text-xs sm:text-sm font-semibold text-[#1B2921]">
                  Full Name
                </label>
                <div className="relative flex items-center rounded-2xl bg-[#EAF1E4] border border-[#8FA881] px-4 py-3 transition focus-within:border-[#1B2921] focus-within:ring-2 focus-within:ring-[#1B2921]/20 shadow-2xs">
                  <User size={17} className="text-[#415C47] shrink-0 mr-3" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Administrator"
                    className="w-full bg-transparent outline-none text-xs sm:text-sm text-[#142318] placeholder-[#5A7750]"
                  />
                </div>
              </div>
            )}

            {/* EMAIL ADDRESS */}
            <div>
              <label className="mb-1.5 block text-xs sm:text-sm font-semibold text-[#1B2921]">
                Email Address
              </label>
              <div className="relative flex items-center rounded-2xl bg-[#EAF1E4] border border-[#8FA881] px-4 py-3 transition focus-within:border-[#1B2921] focus-within:ring-2 focus-within:ring-[#1B2921]/20 shadow-2xs">
                <Mail size={17} className="text-[#415C47] shrink-0 mr-3" />
                <input
                  type="email"
                  required
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-transparent outline-none text-xs sm:text-sm text-[#142318] placeholder-[#5A7750]"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs sm:text-sm font-semibold text-[#1B2921]">
                  Password{" "}
                  {mode === "register" && (
                    <span className="text-[11px] font-normal text-[#324939]">
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

              <div className="relative flex items-center rounded-2xl bg-[#EAF1E4] border border-[#8FA881] px-4 py-3 transition focus-within:border-[#1B2921] focus-within:ring-2 focus-within:ring-[#1B2921]/20 shadow-2xs">
                <Lock size={17} className="text-[#415C47] shrink-0 mr-3" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-transparent outline-none text-xs sm:text-sm text-[#142318] placeholder-[#5A7750]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[#415C47] hover:text-[#1B2921] transition cursor-pointer ml-2"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <div className="pt-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full py-3.5 sm:py-4 px-6 font-semibold text-xs sm:text-sm text-white bg-[#29382F] hover:bg-[#1D2821] active:scale-[0.99] transition-all shadow-md hover:shadow-lg cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2 group"
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
          <div className="mt-7 pt-5 border-t border-[#8FA881]/50">
            <button
              type="button"
              onClick={() => setShowHelp(!showHelp)}
              className="w-full inline-flex items-center justify-between text-xs sm:text-sm text-[#324939] hover:text-[#1B2921] transition cursor-pointer"
            >
              <span className="inline-flex items-center gap-1.5 font-medium">
                <HelpCircle size={14} className="text-[#1B2921]" />
                Troubleshooting sign-in issues
              </span>
              <span className="text-xs font-bold">
                {showHelp ? "Hide" : "Show"}
              </span>
            </button>

            {showHelp && (
              <div className="mt-3.5 p-4 rounded-2xl border border-[#8FA881] bg-[#A5BE97]/30 text-xs sm:text-sm text-[#1B2921] space-y-2 leading-relaxed">
                <p className="font-semibold text-[#142318]">Quick Solutions:</p>
                <ul className="list-disc pl-4 space-y-1.5 text-xs">
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
      <footer className="text-center py-4 text-xs text-[#415C47]">
        &copy; {new Date().getFullYear()} GrowthEnzyme. All rights reserved.
      </footer>
    </main>
  );
}
