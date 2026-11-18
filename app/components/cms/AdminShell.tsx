
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  FileText,
  FolderKanban,
  Image,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ChevronRight,
  MessageSquare,
} from "lucide-react";
import { logoutUser, observeAuth } from "@/app/lib/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/app/lib/firebase";

const navigation = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Blogs", href: "/admin/blogs", icon: FileText },
  { label: "Comments", href: "/admin/comments", icon: MessageSquare },
  { label: "Case Studies", href: "/admin/case-studies", icon: FolderKanban },
  { label: "Media Library", href: "/admin/media", icon: Image },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  // Authentication states
  const [role, setRole] = useState<"admin" | "writer" | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [authError, setAuthError] = useState("");

  // Authentication check
  useEffect(() => {
    if (pathname === "/admin/login") {
      setCheckingAuth(false);
      return;
    }

    let active = true;

    setCheckingAuth(true);

    const unsubscribe = observeAuth(async (user) => {
      if (!active) return;

      if (!user) {
        setRole(null);
        setCheckingAuth(false);
        router.replace("/admin/login");
        return;
      }

      try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (!active) return;

        if (!userSnap.exists()) {
          await logoutUser();

          if (active) {
            setRole(null);
            router.replace("/admin/login");
          }

          return;
        }

        const profile = userSnap.data();

        if (
          profile.isActive !== true ||
          !["admin", "writer"].includes(profile.role)
        ) {
          await logoutUser();

          if (active) {
            setRole(null);
            router.replace("/admin/login");
          }

          return;
        }

        const userRole = profile.role as "admin" | "writer";

        setRole(userRole);
        setAuthError("");

        const adminOnlyPaths = [
          "/admin/users",
          "/admin/settings",
          "/admin/case-studies",
        ];

        const isAdminOnlyPage = adminOnlyPaths.some(
          (path) =>
            pathname === path || pathname.startsWith(`${path}/`)
        );

        if (userRole === "writer" && isAdminOnlyPage) {
          router.replace("/admin/blogs");
        }

        setCheckingAuth(false);
      } catch (error) {
        console.error("CMS authentication error:", error);

        if (!active) return;

        setAuthError(
          "Unable to verify your account. Please check your connection and try again."
        );

        setCheckingAuth(false);
      }
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, [pathname, router]);

  // Keep the login screen independent of the CMS navigation.
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (checkingAuth) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f7f7f5]">
      <div className="text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-[#405C48]" />
        <p className="mt-4 text-sm text-gray-500">
          Verifying your account...
        </p>
      </div>
    </div>
  );
}

if (authError) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#f7f7f5] px-5 text-center">
      <p className="text-sm text-red-600">{authError}</p>
      <button
        onClick={() => window.location.reload()}
        className="mt-4 rounded-lg bg-[#405C48] px-5 py-2 text-sm text-white"
      >
        Try Again
      </button>
    </div>
  );
}

if (!role) {
  return null;
}
  const currentPage =
    navigation.find((item) => pathname.startsWith(item.href))?.label ||
    (pathname.includes("/edit/") ? "Edit Blog" :
    pathname.includes("/create") ? "Create Blog" : "CMS");

  async function handleLogout() {
    try {
      setLoggingOut(true);
      await logoutUser();
      router.replace("/admin/login");
    } catch {
      setLoggingOut(false);
    }
  }

  const visibleNavigation =
  role === "admin"
    ? navigation
    : navigation.filter(
        (item) =>
          ![
            "/admin/case-studies",
            "/admin/users",
            "/admin/settings",
          ].includes(item.href)
      );

  const sidebar = (
    <aside className="flex h-full flex-col bg-[#171717] text-white">
      <div className="flex h-[82px] items-center justify-between border-b border-white/10 px-7">
        <Link href="/admin/dashboard" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-lg font-bold text-black">
            G
          </div>
          <div>
            <p className="text-[15px] font-semibold tracking-wide">
              GrowthEnzyme
            </p>
            <p className="mt-0.5 text-[10px] uppercase tracking-[0.2em] text-white/45">
              Content Studio
            </p>
          </div>
        </Link>

        <button
          onClick={() => setMobileOpen(false)}
          className="rounded-lg p-2 text-white/60 hover:bg-white/10 lg:hidden"
          aria-label="Close navigation"
        >
          <X size={20} />
        </button>
      </div>

      <div className="px-5 pt-8">
        <p className="mb-4 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/35">
          Workspace
        </p>

        <nav className="space-y-1">
          {visibleNavigation.map((item) => {
            const active = pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-3 text-[13px] transition ${
                  active
                    ? "bg-white text-[#171717] font-semibold"
                    : "text-white/65 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon size={17} strokeWidth={1.8} />
                <span>{item.label}</span>
                {active && <ChevronRight size={15} className="ml-auto" />}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto space-y-2 border-t border-white/10 p-5">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 rounded-lg px-3 py-3 text-[12px] text-white/55 transition hover:bg-white/10 hover:text-white"
        >
          <ExternalLink size={16} />
          View Website
        </Link>

        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-[12px] text-white/55 transition hover:bg-red-500/10 hover:text-red-300 disabled:opacity-50"
        >
          <LogOut size={16} />
          {loggingOut ? "Signing out..." : "Sign Out"}
        </button>

        <p className="px-3 pt-2 text-[10px] text-white/25">
          GrowthEnzyme CMS · 2026
        </p>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-[#f7f7f5]">
      <div className="fixed inset-y-0 left-0 z-40 hidden w-[255px] lg:block">
        {sidebar}
      </div>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="h-full w-[280px] max-w-[85vw]"
            onClick={(e) => e.stopPropagation()}
          >
            {sidebar}
          </div>
        </div>
      )}

      <div className="lg:pl-[255px]">
        <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-gray-200 bg-white/95 px-5 backdrop-blur-md md:px-9">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-lg border border-gray-200 p-2 text-gray-700 lg:hidden"
              aria-label="Open navigation"
            >
              <Menu size={20} />
            </button>

            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-gray-400">
                GrowthEnzyme / CMS
              </p>
              <h2 className="mt-1 text-sm font-semibold text-gray-900">
                {currentPage}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-xs font-semibold text-gray-800">
                Content Management
              </p>
              <p className="mt-1 text-[10px] text-gray-400">
                Admin Workspace
              </p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#242424] text-sm font-semibold text-white">
              G
            </div>
          </div>
        </header>

        <main className="min-h-[calc(100vh-76px)] px-5 py-8 md:px-9 md:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
