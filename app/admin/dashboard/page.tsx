
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/app/lib/firebase";
import { logoutUser } from "@/app/lib/auth";
import { getAllBlogs, type Blog } from "@/app/lib/blog";
import { getAllUsers, type CMSUser } from "@/app/lib/users";
import {
  getCaseStudiesForDashboard,
  type CaseStudy,
} from "@/app/lib/case-studies";

import { getAllComments, type BlogComment } from "@/app/lib/comments";
import {
  BookOpen,
  BriefcaseBusiness,
  Image as ImageIcon,
  ArrowUpRight,
  LogOut,
  LayoutDashboard,
  Sparkles,
  FileText,
  FolderOpen,
  CheckCircle2
} from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
const [blogs, setBlogs] = useState<Blog[]>([]);
const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
const [statsLoading, setStatsLoading] = useState(true);
const [users, setUsers] = useState<CMSUser[]>([]);
const [comments, setComments] = useState<BlogComment[]>([]);
type DashboardPermission =
  | "blogs"
  | "comments"
  | "caseStudies"
  | "media"
  | "users";

const [isAdministrator, setIsAdministrator] = useState(false);

const [dashboardPermissions, setDashboardPermissions] = useState<
  Record<DashboardPermission, boolean>
>({
  blogs: false,
  comments: false,
  caseStudies: false,
  media: false,
  users: false,
});

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

        const rawRole = (
  data.role || data.roleId || ""
).toString().toLowerCase();

const isSystemAdmin =
  data.role === "admin" ||
  data.role === "administrator" ||
  data.roleId === "system-admin" ||
  rawRole.includes("admin") ||
  rawRole.includes("super");

if (isSystemAdmin) {
  setIsAdministrator(true);

  setDashboardPermissions({
    blogs: true,
    comments: true,
    caseStudies: true,
    media: true,
    users: true,
  });
} else if (data.role === "writer" && !data.roleId) {
  setIsAdministrator(false);

  setDashboardPermissions({
    blogs: true,
    comments: false,
    caseStudies: false,
    media: true,
    users: false,
  });
} else if (data.roleId) {
  const roleRef = doc(db, "roles", data.roleId);
  const roleSnap = await getDoc(roleRef);

  if (!roleSnap.exists() || roleSnap.data().isActive !== true) {
    throw new Error("Assigned role is inactive or unavailable.");
  }

  const roleData = roleSnap.data();
  const savedPermissions = roleData.permissions || {};

  const isAdminRole = ["admin", "administrator"].includes(
    String(roleData.name || "").toLowerCase()
  );

  setIsAdministrator(isAdminRole);

  setDashboardPermissions({
    blogs: savedPermissions.blogs === true,
    comments: savedPermissions.comments === true,
    caseStudies: savedPermissions.caseStudies === true,
    media: savedPermissions.media === true,
    users: savedPermissions.users === true,
  });
} else {
  throw new Error("No valid role is assigned to your account.");
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
      const results = await Promise.allSettled([
        getAllBlogs(),
        getCaseStudiesForDashboard(),
        getAllUsers(),
        getAllComments(),
      ]);

      const [
        blogResult,
        caseStudyResult,
        userResult,
        commentResult,
      ] = results;

      if (blogResult.status === "fulfilled") {
        setBlogs(blogResult.value as Blog[]);
      } else {
        console.error("Blogs error:", blogResult.reason);
      }

      if (caseStudyResult.status === "fulfilled") {
        setCaseStudies(caseStudyResult.value);
      } else {
        console.error("Case studies error:", caseStudyResult.reason);
      }

      if (userResult.status === "fulfilled") {
        setUsers(userResult.value);
      } else {
        console.error("Users error:", userResult.reason);
      }

      if (commentResult.status === "fulfilled") {
        setComments(commentResult.value);
      } else {
        console.error("Comments error:", commentResult.reason);
      }
    } catch (error) {
      console.error("Dashboard statistics error:", error);
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

// Blog statistics
const totalBlogs = blogs.length;
const publishedBlogs = blogs.filter(
  (blog) => blog.status === "published"
).length;
const draftBlogs = blogs.filter(
  (blog) => blog.status === "draft"
).length;

// Case study statistics
const totalCaseStudies = caseStudies.length;
const publishedCaseStudies = caseStudies.filter(
  (study) => study.status === "published"
).length;
const draftCaseStudies = caseStudies.filter(
  (study) => study.status === "draft"
).length;

// User statistics
const totalUsers = users.length;
const activeUsers = users.filter(
  (user) => user.isActive === true
).length;

// Comment statistics
const totalComments = comments.length;

const pendingComments = comments.filter(
  (comment) => comment.status === "pending"
).length;

const approvedComments = comments.filter(
  (comment) => comment.status === "approved"
).length;

const rejectedComments = comments.filter(
  (comment) => comment.status === "rejected"
).length;

return (
  <main className="min-h-screen w-full bg-[#FFFDF8]  ">
  <div className="w-full space-y-8 pb-12">

      {/* PAGE HEADING */}
      <header className="relative isolate overflow-hidden rounded-2xl bg-[#B6CBA9] px-6 py-8 text-[#29382F] sm:px-9 sm:py-10">
        <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-[#FFFDF8]/30 blur-3xl" />

        <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <div className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#29382F]">
              <span className="h-2 w-2 rounded-full bg-[#D78359]" />
              GrowthEnzyme CMS
            </div>

            <h1 className="mt-5 font-heading text-4xl font-bold leading-tight tracking-tight text-[#29382F] sm:text-5xl lg:text-6xl">
              Dashboard
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-7 text-[#29382F]/80">
              Welcome back, {profile.name}. Manage your website content and
              digital presence from one place.
            </p>
          </div>

          {/* <button
            onClick={handleLogout}
            className="group inline-flex items-center justify-center gap-3 rounded-xl border border-[#D5E1CC] bg-gradient-to-b from-[#B9D99C] via-[#A5CC83] to-[#8DB76D] px-5 py-3.5 text-sm font-bold text-[#29382F] shadow-[0_5px_0_#6F9259,0_9px_18px_rgba(41,56,47,0.13)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_7px_0_#6F9259,0_12px_22px_rgba(41,56,47,0.18)]"
          >
            <LogOut size={17} />
            Logout
          </button> */}
        </div>

        <div className="relative mt-7 flex flex-wrap items-center gap-2 border-t border-[#29382F]/15 pt-5">
          <span className="rounded-full bg-[#29382F] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#FFFDF8]">
            Content Studio
          </span>
          <span className="text-xs font-medium text-[#29382F]/70">
            Your website management workspace
          </span>
        </div>
      </header>

      {/* WELCOME BANNER */}
      <section className="relative isolate overflow-hidden rounded-2xl border border-[#DDE4D9] bg-white p-6 shadow-[0_5px_25px_rgba(41,56,47,0.035)] sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-[#B6CBA9]/20 blur-3xl" />

        <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div className="max-w-2xl">
            <div className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#506B59]">
              <span className="h-2 w-2 rounded-full bg-[#D78359]" />
              <Sparkles size={13} />
              Welcome to your workspace
            </div>

            <h2 className="font-heading text-3xl font-bold leading-tight tracking-tight text-[#29382F] sm:text-4xl">
              Good to see you, {profile.name}.
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-7 text-[#29382F]/65">
              Manage your website content, showcase your work and keep
              your digital presence up to date.
            </p>
          </div>

          <div className="relative flex min-w-[190px] items-center gap-3 rounded-xl border border-[#DDE4D9] bg-[#F5F7F2] p-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#B6CBA9]/50 text-[#29382F]">
              <LayoutDashboard size={21} />
            </div>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[#657365]">
                Account Role
              </p>
              <p className="mt-1 text-sm font-bold capitalize text-[#29382F]">
                {profile.role || "Custom Role"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CMS OVERVIEW */}
      <section className="space-y-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#6F9259]">
              Overview
            </p>
            <h2 className="mt-2 font-heading text-2xl font-bold text-[#29382F]">
              CMS Overview
            </h2>
          </div>

          <span className="text-xs font-medium text-[#657365]">
            Your content at a glance
          </span>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

          {/* TOTAL BLOGS */}
          <div className="group rounded-2xl border border-[#DDE4D9] bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(41,56,47,0.07)]">
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#B6CBA9]/40 text-[#29382F]">
                <FileText size={20} />
              </div>
              <span className="rounded-full bg-[#F5F0E5] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#29382F]/65">
                Total Content
              </span>
            </div>

            <p className="mt-5 text-3xl font-bold text-[#29382F]">
              {statsLoading ? "—" : totalBlogs}
            </p>
            <p className="mt-1 text-xs font-medium text-[#657365]">
              Total blogs
            </p>
            <p className="mt-2 text-xs text-[#657365]">
              {publishedBlogs} published · {draftBlogs} drafts
            </p>
          </div>

          {/* CASE STUDIES */}
          <div className="group rounded-2xl border border-[#DDE4D9] bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(41,56,47,0.07)]">
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E8EDE3] text-[#405C48]">
                <FolderOpen size={20} />
              </div>
              <span className="rounded-full bg-[#E8EDE3] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#405C48]">
                Portfolio
              </span>
            </div>

            <p className="mt-5 text-3xl font-bold text-[#29382F]">
              {statsLoading ? "—" : totalCaseStudies}
            </p>
            <p className="mt-1 text-xs font-medium text-[#657365]">
              Case Studies
            </p>
            <p className="mt-2 text-xs text-[#657365]">
              {publishedCaseStudies} published · {draftCaseStudies} drafts
            </p>
          </div>

          {/* USERS */}
          <div className="group rounded-2xl border border-[#DDE4D9] bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(41,56,47,0.07)]">
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F5F0E5] text-[#9B684B]">
                <LayoutDashboard size={20} />
              </div>
              <span className="rounded-full bg-[#F5F0E5] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#9B684B]">
                Team
              </span>
            </div>

            <p className="mt-5 text-3xl font-bold text-[#29382F]">
              {statsLoading ? "—" : totalUsers}
            </p>
            <p className="mt-1 text-xs font-medium text-[#657365]">
              Total Users
            </p>
            <p className="mt-2 text-xs text-[#657365]">
              {statsLoading ? "Loading..." : `${activeUsers} active users`}
            </p>
          </div>

          {/* COMMENTS */}
          <div className="group rounded-2xl border border-[#DDE4D9] bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(41,56,47,0.07)]">
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E8EDE3] text-[#405C48]">
                <CheckCircle2 size={20} />
              </div>
              <span className="rounded-full bg-[#F5F0E5] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#9B684B]">
                Engagement
              </span>
            </div>

            <p className="mt-5 text-3xl font-bold text-[#29382F]">
              {statsLoading ? "—" : totalComments}
            </p>
            <p className="mt-1 text-xs font-medium text-[#657365]">
              Total Comments
            </p>
            <p className="mt-2 text-xs text-[#657365]">
              {pendingComments} pending · {approvedComments} approved
            </p>
            <p className="mt-1 text-xs text-[#657365]">
              {rejectedComments} rejected
            </p>
          </div>
        </div>
      </section>

      {/* WORKSPACE SECTIONS */}
      <section>
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D78359]">
              Workspace Overview
            </p>

            <h2 className="mt-2 font-heading text-2xl font-bold text-[#29382F]">
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

                <h3 className="mt-7 font-heading text-xl font-bold text-[#29382F]">
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

      {/* FOOTER */}
      <footer className="flex flex-col gap-2 border-t border-[#E5E4DC] pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[11px] font-medium text-[#657365]">
          GrowthEnzyme CMS · Manage your digital presence
        </p>
        <p className="text-[10px] font-medium tracking-wide text-[#657365]/70">
          Content Studio
        </p>
      </footer>

    </div>
  </main>
);
}
