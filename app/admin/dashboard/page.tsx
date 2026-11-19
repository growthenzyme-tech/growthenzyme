
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/app/lib/firebase";
import { logoutUser } from "@/app/lib/auth";
import { getAllBlogs, type Blog } from "@/app/lib/blog";
import { FileEdit, CheckCircle2 } from "lucide-react";
import {
  BookOpen,
  BriefcaseBusiness,
  Image as ImageIcon,
  ArrowUpRight,
  LogOut,
  LayoutDashboard,
  Sparkles,
} from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
const [blogs, setBlogs] = useState<Blog[]>([]);
const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace("/admin/login");
        return;
      }

      try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          await logoutUser();
          router.replace("/admin/login");
          return;
        }

        const data = userSnap.data();

        const hasLegacyRole = ["admin", "writer"].includes(data.role);

        const hasCustomRole =
          typeof data.roleId === "string" && data.roleId.length > 0;

        if (data.isActive !== true || (!hasLegacyRole && !hasCustomRole)) {
          await logoutUser();
          router.replace("/admin/login");
          return;
        }

        setProfile(data);
      } catch {
        await logoutUser();
        router.replace("/admin/login");
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);


  useEffect(() => {
  async function fetchDashboardStats() {
    try {
      const data = await getAllBlogs();
      setBlogs(data as Blog[]);
    } catch (error) {
      console.error("Error loading dashboard blog statistics:", error);
    } finally {
      setStatsLoading(false);
    }
  }

  fetchDashboardStats();
}, []);

  async function handleLogout() {
    await logoutUser();
    router.replace("/admin/login");
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FFFDF8]">
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#B6CBA9] text-[#29382F]">
            <LayoutDashboard size={23} />
          </div>
          <p className="text-sm font-semibold text-[#29382F]">
            Checking authentication...
          </p>
          <div className="h-1 w-32 overflow-hidden rounded-full bg-[#E5E9DF]">
            <div className="h-full w-1/2 animate-pulse rounded-full bg-[#506B59]" />
          </div>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  const dashboardCards = [
    {
      title: "Blogs",
      description: "Manage blog articles, create content and publish your latest insights.",
      icon: BookOpen,
      number: "01",
      accent: "#B6CBA9",
      href: "/admin/blogs",
    },
    {
      title: "Case Studies",
      description: "Manage project case studies and showcase your business results.",
      icon: BriefcaseBusiness,
      number: "02",
      accent: "#F5F0E5",
      href: "/admin/case-studies",
    },
    {
      title: "Media Library",
      description: "Organize and manage images and other website media assets.",
      icon: ImageIcon,
      number: "03",
      accent: "#E8EDE3",
      href: "/admin/media",
    },
  ];

  const totalBlogs = blogs.length;

const publishedBlogs = blogs.filter(
  (blog) => blog.status === "published"
).length;

const draftBlogs = blogs.filter(
  (blog) => blog.status === "draft"
).length;

  return (
    <main className="min-h-screen bg-[#FFFDF8] p-5 sm:p-8 lg:p-10">
      <div className="mx-auto max-w-6xl space-y-9">

        {/* Header */}
        <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#506B59]">
              <LayoutDashboard size={14} />
              GrowthEnzyme CMS
            </div>

            <h1
              className="text-3xl font-bold tracking-tight text-[#29382F] sm:text-4xl"
              style={{
                fontFamily: "var(--font-heading), Georgia, serif",
              }}
            >
              Dashboard
            </h1>

            <p className="mt-2 text-sm text-[#29382F]/65">
              Welcome back, {profile.name}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#DDE4D9] bg-white px-5 py-3 text-sm font-semibold text-[#29382F] transition hover:border-[#D78359] hover:bg-[#F5F0E5] hover:text-[#D78359]"
          >
            <LogOut size={17} />
            Logout
          </button>
        </header>

        {/* Welcome Banner */}
        <section className="relative isolate overflow-hidden rounded-2xl bg-[#B6CBA9] px-6 py-8 text-[#29382F] sm:px-9 sm:py-10">
          <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-[#FFFDF8]/30 blur-3xl" />

          <div className="relative flex flex-col justify-between gap-7 sm:flex-row sm:items-center">
            <div className="max-w-xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#29382F]/15 bg-white/25 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#29382F]">
                <Sparkles size={13} />
                Welcome to your workspace
              </div>

              <h2
                className="text-3xl font-bold leading-tight sm:text-4xl"
                style={{
                  fontFamily: "var(--font-heading), Georgia, serif",
                }}
              >
                Good to see you, {profile.name}.
              </h2>

              <p className="mt-3 max-w-lg text-sm leading-7 text-[#29382F]/80">
                Manage your website content, showcase your work and keep
                your digital presence up to date.
              </p>
            </div>

            <div className="relative flex min-w-[170px] items-center gap-3 rounded-xl border border-white/40 bg-[#FFFDF8]/50 p-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#29382F] text-white">
                <LayoutDashboard size={21} />
              </div>

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#29382F]/60">
                  Account Role
                </p>
                <p className="mt-1 text-sm font-bold capitalize text-[#29382F]">
                  {profile.role || "Custom Role"}
                </p>
              </div>
            </div>
          </div>
        </section>

{/* BLOG STATISTICS */}
<section>
  <div className="mb-5">
    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D78359]">
      Content Performance
    </p>

    <h2
      className="mt-2 text-2xl font-bold text-[#29382F]"
      style={{
        fontFamily: "var(--font-heading), Georgia, serif",
      }}
    >
      Blog Overview
    </h2>
  </div>

  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

    {/* Total Blogs */}
    <div className="rounded-2xl border border-[#DDE4D9] bg-white p-6">
      <div className="flex items-center justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E8EDE3] text-[#29382F]">
          <BookOpen size={21} />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#829181]">
          Total
        </span>
      </div>

      <p className="mt-5 text-3xl font-bold text-[#29382F]">
        {statsLoading ? "..." : totalBlogs}
      </p>

      <p className="mt-1 text-sm text-[#667267]">
        Total Blog Articles
      </p>
    </div>

    {/* Published Blogs */}
    <div className="rounded-2xl border border-[#DDE4D9] bg-white p-6">
      <div className="flex items-center justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E8EDE3] text-[#405C48]">
          <CheckCircle2 size={21} />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#405C48]">
          Live
        </span>
      </div>

      <p className="mt-5 text-3xl font-bold text-[#29382F]">
        {statsLoading ? "..." : publishedBlogs}
      </p>

      <p className="mt-1 text-sm text-[#667267]">
        Published Blogs
      </p>
    </div>

    {/* Draft Blogs */}
    <div className="rounded-2xl border border-[#DDE4D9] bg-white p-6">
      <div className="flex items-center justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F5F0E5] text-[#29382F]">
          <FileEdit size={21} />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#829181]">
          In Progress
        </span>
      </div>

      <p className="mt-5 text-3xl font-bold text-[#29382F]">
        {statsLoading ? "..." : draftBlogs}
      </p>

      <p className="mt-1 text-sm text-[#667267]">
        Draft Blogs
      </p>
    </div>

  </div>
</section>
        {/* Dashboard Section */}
        <section>
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D78359]">
                Workspace Overview
              </p>

              <h2
                className="mt-2 text-2xl font-bold text-[#29382F]"
                style={{
                  fontFamily: "var(--font-heading), Georgia, serif",
                }}
              >
                Manage Your Website
              </h2>

              <p className="mt-2 text-sm text-[#29382F]/65">
                Access your website management sections.
              </p>
            </div>

            <span className="hidden rounded-full bg-[#E8EDE3] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#405C48] sm:inline-block">
              03 Sections
            </span>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {dashboardCards.map((card) => {
              const Icon = card.icon;

              return (
                <button
                  key={card.title}
                  type="button"
                  onClick={() => router.push(card.href)}
                  className="group relative overflow-hidden rounded-2xl border border-[#DDE4D9] bg-white p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:border-[#A5B59F] hover:shadow-[0_15px_35px_rgba(41,56,47,0.09)]"
                >
                  <div className="flex items-start justify-between">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-xl text-[#29382F]"
                      style={{ backgroundColor: card.accent }}
                    >
                      <Icon size={22} strokeWidth={1.8} />
                    </div>

                    <span className="text-xs font-bold tracking-widest text-[#29382F]/30">
                      {card.number}
                    </span>
                  </div>

                  <h3
                    className="mt-7 text-xl font-bold text-[#29382F]"
                    style={{
                      fontFamily: "var(--font-heading), Georgia, serif",
                    }}
                  >
                    {card.title}
                  </h3>

                  <p className="mt-2 min-h-[48px] text-sm leading-6 text-[#29382F]/65">
                    {card.description}
                  </p>

                  <div className="mt-6 flex items-center justify-between border-t border-[#E8EDE3] pt-4">
                    <span className="text-xs font-bold text-[#405C48] transition group-hover:text-[#D78359]">
                      Manage Section
                    </span>

                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E8EDE3] text-[#29382F] transition group-hover:bg-[#29382F] group-hover:text-white">
                      <ArrowUpRight size={17} />
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-[#E5E4DC] pt-5">
          <p className="text-xs text-[#29382F]/50">
            GrowthEnzyme CMS · Manage your digital presence
          </p>
        </footer>

      </div>
    </main>
  );
}
