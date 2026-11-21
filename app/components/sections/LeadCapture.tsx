
"use client";

import { useEffect, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Mail,
  Loader2,
} from "lucide-react";

import {
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "@/app/lib/firebase";
import { getGeneralSettings } from "@/app/lib/settings";

const STEPPED_POINTS =
  "58,0 201,0 201,134 142,134 142,187 0,187 0,54 58,54";

export default function LeadCapture() {
  const [visible, setVisible] = useState(true);
  const [loading, setLoading] = useState(true);

  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadSettings() {
      try {
        const settings = await getGeneralSettings();

        if (active) {
          setVisible(settings.showLeadCapture);
        }
      } catch (error) {
        console.error("Unable to load lead capture settings:", error);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadSettings();

    return () => {
      active = false;
    };
  }, []);

  async function handleSubscribe(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setMessage("Please enter your email address.");
      setSuccess(false);
      return;
    }

    setSubmitting(true);
    setMessage("");
    setSuccess(false);

    try {
      const subscriberRef = doc(
        db,
        "newsletterSubscribers",
        normalizedEmail
      );

      await setDoc(subscriberRef, {
        email: normalizedEmail,
        createdAt: serverTimestamp(),
      });

      setSuccess(true);
      setMessage("Thank you! You're successfully subscribed.");
      setEmail("");
    } catch (error: unknown) {
      console.error("Newsletter subscription error:", error);

      const firebaseError = error as { code?: string };

      if (firebaseError.code === "permission-denied") {
        setMessage(
          "This email may already be subscribed. Please try another email."
        );
      } else {
        setMessage(
          "Something went wrong. Please try again later."
        );
      }

      setSuccess(false);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading || !visible) return null;

  return (
    <section className="relative overflow-hidden bg-[#29382F] px-5 py-20 text-white sm:px-8 lg:py-28">

      {/* soft sage glow */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#91AA80]/20 blur-3xl" />

      {/* stepped frame outlines */}
      <svg
        aria-hidden="true"
        viewBox="0 0 201 187"
        fill="none"
        className="pointer-events-none absolute -bottom-10 -left-10 hidden w-[260px] opacity-40 sm:block lg:w-[340px]"
      >
        <polygon
          points={STEPPED_POINTS}
          stroke="#91AA80"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        <polygon
          points="70,14 187,14 187,120 130,120 130,173 14,173 14,66 70,66"
          stroke="#91AA80"
          strokeOpacity="0.55"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>

      {/* fine vertical rules */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, #FFFFFF 0, #FFFFFF 1px, transparent 1px, transparent 120px)",
        }}
      />

      <div className="relative mx-auto grid max-w-[1200px] items-center gap-12 lg:grid-cols-2 lg:gap-16">

        {/* LEFT CONTENT */}
        <div>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#C7F23A]">
              <Mail size={14} />
              Stay Connected
            </span>

            <span className="h-px flex-1 bg-white/20" />
          </div>

          <h2 className="mt-7 text-4xl font-bold leading-[1.05] tracking-[-0.04em] sm:text-5xl lg:text-6xl">
            Ideas that help your brand

            <span className="mt-3 block w-fit rounded-full bg-[#C7F23A] px-5 py-1.5 text-[#29382F] shadow-[0_6px_0_#91AA80] sm:px-7">
              grow further.
            </span>
          </h2>

          <p className="mt-7 max-w-xl border-l-2 border-[#C7F23A] pl-5 text-sm leading-7 text-white/70 sm:text-base">
            Get useful insights, digital trends, and growth ideas delivered
            straight to your inbox.
          </p>
        </div>

        {/* RIGHT FORM CARD */}
        <div className="relative rounded-[1.75rem] bg-white p-3 shadow-[0_8px_0_#91AA80,0_28px_50px_rgba(0,0,0,0.3)] sm:rounded-[2.25rem] sm:p-4">
          <div className="rounded-[1.25rem] border border-dashed border-[#29382F]/20 p-6 sm:rounded-[1.75rem] sm:p-8">

            <span
              aria-hidden="true"
              className="mb-4 block h-1 w-10 rounded-full bg-[#D78359]"
            />

            <h3 className="text-xl font-bold text-[#29382F] sm:text-2xl">
              Get updates from us
            </h3>

            <p className="mt-2 text-sm leading-6 text-[#506B59]">
              Stay in the loop with our latest updates and insights.
            </p>

            <form
              className="mt-6 flex flex-col gap-3 sm:flex-row"
              onSubmit={handleSubscribe}
            >
              <input
                type="email"
                required
                maxLength={254}
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setMessage("");
                }}
                disabled={submitting}
                placeholder="Enter your email address"
                className="min-w-0 flex-1 rounded-xl border border-[#29382F]/15 bg-[#F6F9F3] px-4 py-3 text-sm text-[#29382F] outline-none transition placeholder:text-[#29382F]/40 focus:border-[#29382F] focus:bg-white focus:ring-2 focus:ring-[#91AA80]/40 disabled:opacity-60"
              />

              <button
                type="submit"
                disabled={submitting}
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[#C7F23A] px-5 py-3 text-sm font-bold text-[#29382F] shadow-[0_5px_0_#8FA82A] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#D5FF55] hover:shadow-[0_7px_0_#8FA82A] active:translate-y-1 active:shadow-[0_1px_0_#8FA82A] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    Subscribing...
                    <Loader2 size={16} className="animate-spin" />
                  </>
                ) : (
                  <>
                    Subscribe
                    <ArrowRight
                      size={16}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </>
                )}
              </button>
            </form>

            {/* SUCCESS / ERROR MESSAGE */}
            {message && (
              <p
                role="status"
                aria-live="polite"
                className={`mt-4 text-sm font-medium ${
                  success ? "text-green-700" : "text-red-600"
                }`}
              >
                {message}
              </p>
            )}

            <div className="mt-5 flex items-center gap-2 border-t border-[#29382F]/10 pt-4 text-xs text-[#506B59]">
              <CheckCircle2 size={14} className="text-[#91AA80]" />
              No spam. Just useful updates.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
