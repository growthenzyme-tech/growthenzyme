"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser, registerInitialAdmin, resetUserPassword } from "@/app/lib/auth";
import { Eye, EyeOff, Loader2, AlertCircle, HelpCircle, UserPlus, LogIn, Check, Sparkles } from "lucide-react";

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
        const { profile } = await loginUser(email, password);
        if (profile) {
          router.push("/admin/dashboard");
        }
      } else {
        const { profile } = await registerInitialAdmin(email, password, name);
        if (profile) {
          router.push("/admin/dashboard");
        }
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
    <main className="min-h-screen flex items-center justify-center bg-[#F8FAF6] px-5 py-12">
      <div className="w-full max-w-md rounded-2xl bg-white p-7 sm:p-9 shadow-sm border border-[#29382F]/10">
        
        {/* BRAND HEADER */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase text-[#D78359]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#D78359]" />
            GrowthEnzyme CMS
          </div>
          <h1 className="mt-2 font-heading text-2xl sm:text-3xl font-bold tracking-tight text-[#29382F]">
            {mode === "signin" ? "Welcome back" : "Create Admin Account"}
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-[#506B59]">
            {mode === "signin"
              ? "Sign in with your authorized admin credentials."
              : "Set up your admin access to manage GrowthEnzyme articles & assets."}
          </p>
        </div>

        {/* MODE TABS */}
        <div className="flex rounded-xl bg-[#FAFBF9] p-1 border border-[#29382F]/10 mb-6">
          <button
            type="button"
            onClick={() => {
              setMode("signin");
              setError("");
              setResetSuccess("");
            }}
            className={`flex-1 inline-flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-semibold transition cursor-pointer ${
              mode === "signin"
                ? "bg-white text-[#29382F] shadow-xs"
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
            className={`flex-1 inline-flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-semibold transition cursor-pointer ${
              mode === "register"
                ? "bg-white text-[#29382F] shadow-xs"
                : "text-[#506B59] hover:text-[#29382F]"
            }`}
          >
            <Sparkles size={13} className="text-[#D78359]" />
            <span>Create Admin</span>
          </button>
        </div>

        {/* FEEDBACK BANNERS */}
        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-xs sm:text-sm text-red-700 flex items-start gap-2.5">
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
          <div className="mb-5 rounded-xl border border-[#B6CBA9] bg-[#E8EEE5] p-3.5 text-xs sm:text-sm font-semibold text-[#29382F] flex items-center gap-2">
            <Check size={16} className="text-[#29382F]" />
            <span>{resetSuccess}</span>
          </div>
        )}

        {/* LOGIN / REGISTER FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[#29382F]">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Administrator"
                className="w-full rounded-xl border border-[#29382F]/15 bg-white px-3.5 py-2.5 text-xs sm:text-sm text-[#29382F] placeholder-gray-400 outline-none transition hover:border-[#29382F]/30 focus:border-[#29382F]"
              />
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#29382F]">
              Email address
            </label>
            <input
              type="email"
              required
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. admin@growthenzyme.com"
              className="w-full rounded-xl border border-[#29382F]/15 bg-white px-3.5 py-2.5 text-xs sm:text-sm text-[#29382F] placeholder-gray-400 outline-none transition hover:border-[#29382F]/30 focus:border-[#29382F]"
            />
          </div>

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
                  className="text-[11px] font-medium text-[#D78359] hover:underline cursor-pointer"
                >
                  {sendingReset ? "Sending..." : "Forgot password?"}
                </button>
              )}
            </div>
            
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === "signin" ? "Enter your password" : "Create a password (min 6 characters)"}
                className="w-full rounded-xl border border-[#29382F]/15 bg-white pl-3.5 pr-10 py-2.5 text-xs sm:text-sm text-[#29382F] placeholder-gray-400 outline-none transition hover:border-[#29382F]/30 focus:border-[#29382F]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#29382F] transition cursor-pointer"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 rounded-xl bg-[#29382F] py-3 text-xs sm:text-sm font-semibold text-white shadow-xs transition hover:bg-[#D78359] cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                <span>{mode === "signin" ? "Verifying credentials..." : "Creating admin account..."}</span>
              </>
            ) : mode === "signin" ? (
              <span>Sign in</span>
            ) : (
              <span>Create Admin &amp; Sign in</span>
            )}
          </button>
        </form>

        {/* EXPANDABLE TROUBLESHOOTING CARD */}
        <div className="mt-6 pt-5 border-t border-gray-100">
          <button
            type="button"
            onClick={() => setShowHelp(!showHelp)}
            className="w-full inline-flex items-center justify-between text-xs text-[#506B59] hover:text-[#29382F] transition cursor-pointer"
          >
            <span className="inline-flex items-center gap-1.5 font-medium">
              <HelpCircle size={13} className="text-[#D78359]" />
              Fixing `auth/invalid-credential` error
            </span>
            <span className="text-[11px] font-bold">{showHelp ? "Hide" : "Show"}</span>
          </button>

          {showHelp && (
            <div className="mt-3 p-3.5 rounded-xl border border-amber-200 bg-amber-50/70 text-xs text-[#38493F] space-y-2 leading-relaxed">
              <p className="font-semibold text-amber-950">Quick Solutions:</p>
              <ul className="list-disc pl-4 space-y-1.5 text-[11px]">
                <li>
                  <strong>First-time setup?</strong> Switch to the <strong>&ldquo;Create Admin&rdquo;</strong> tab above and enter your desired admin email and password.
                </li>
                <li>
                  <strong>Already have an account?</strong> Double check for typos or click <strong>Forgot password?</strong> above.
                </li>
                <li>
                  <strong>Firebase Console setup:</strong> Ensure <em>Email/Password</em> is enabled in <a href="https://console.firebase.google.com/project/growthenzyme-cms/authentication/providers" target="_blank" rel="noreferrer" className="underline font-bold text-[#29382F]">Firebase Console &gt; Authentication &gt; Sign-in method</a>.
                </li>
              </ul>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}
