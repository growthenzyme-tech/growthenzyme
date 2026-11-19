
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
  ShieldCheck,
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
  { label: "Roles & Permissions", href: "/admin/roles", icon: ShieldCheck },
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

  useEffect(() => {
    try {
      localStorage.removeItem("admin_theme");
      document.documentElement.classList.remove("dark");
    } catch {
      // ignore
    }
  }, []);

  // Authentication states
  type PermissionKey =
    | "dashboard"
    | "blogs"
    | "comments"
    | "media"
    | "caseStudies"
    | "users"
    | "settings";

  type RolePermissions = Record<PermissionKey, boolean>;

  const [role, setRole] = useState<string | null>(null);

  const [permissions, setPermissions] = useState<RolePermissions>({
    dashboard: false,
    blogs: false,
    comments: false,
    media: false,
    caseStudies: false,
    users: false,
    settings: false,
  });

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [authError, setAuthError] = useState("");

  // Authentication check

  // Authentication check
  // Verify authentication and load role permissions only once.

  // Verify authentication and load role permissions.
  useEffect(() => {
    // Login page must remain accessible without authentication.
    if (pathname === "/admin/login") {
      setCheckingAuth(false);
      setRole(null);
      setAuthError("");
      return;
    }

    let active = true;

    const unsubscribe = observeAuth(async (user) => {
      if (!active) return;

      if (!user) {
        setRole(null);
        setCheckingAuth(false);

        if (pathname !== "/admin/login") {
          router.replace("/admin/login");
        }

        return;
      }

      try {
        setCheckingAuth(true);
        setAuthError("");

        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (!active) return;

        if (!userSnap.exists()) {
          throw new Error("User profile not found.");
        }

        const profile = userSnap.data();

        if (profile.isActive !== true) {
          throw new Error("Your account is inactive.");
        }

        let userRole = "writer";

        let userPermissions: RolePermissions = {
          dashboard: false,
          blogs: false,
          comments: false,
          media: false,
          caseStudies: false,
          users: false,
          settings: false,
        };

        const rawRole = (
          profile.role || profile.roleId || ""
        ).toString().toLowerCase();

        const isSystemAdmin =
          profile.role === "admin" ||
          profile.role === "administrator" ||
          profile.roleId === "system-admin" ||
          rawRole.includes("admin") ||
          rawRole.includes("super");

        if (isSystemAdmin) {
          userRole = "admin";

          userPermissions = {
            dashboard: true,
            blogs: true,
            comments: true,
            media: true,
            caseStudies: true,
            users: true,
            settings: true,
          };
        } else if (profile.role === "writer" && !profile.roleId) {
          userRole = "writer";

          userPermissions = {
            dashboard: true,
            blogs: true,
            comments: false,
            media: true,
            caseStudies: false,
            users: false,
            settings: false,
          };
        } else if (profile.roleId) {
          const roleRef = doc(db, "roles", profile.roleId);
          const roleSnap = await getDoc(roleRef);

          if (!active) return;

          if (!roleSnap.exists()) {
            throw new Error("Assigned role not found.");
          }

          const roleData = roleSnap.data();

          if (roleData.isActive !== true) {
            throw new Error("Assigned role is inactive.");
          }

          const savedPermissions = roleData.permissions || {};

          userPermissions = {
            dashboard: savedPermissions.dashboard === true,
            blogs: savedPermissions.blogs === true,
            comments: savedPermissions.comments === true,
            media: savedPermissions.media === true,
            caseStudies: savedPermissions.caseStudies === true,
            users: savedPermissions.users === true,
            settings: savedPermissions.settings === true,
          };

          const hasPermission = Object.values(userPermissions).some(
            (permission) => permission === true
          );

          if (!hasPermission) {
            throw new Error("No active CMS permissions.");
          }

          userRole = roleData.name?.toLowerCase() || "custom";
        } else {
          throw new Error("No valid role is assigned to your account.");
        }

        if (!active) return;

        setRole(userRole);
        setPermissions(userPermissions);
        setAuthError("");
        setCheckingAuth(false);

        console.log("CMS authentication successful:", userRole);
      } catch (error) {
        console.error("CMS authentication error:", error);

        if (!active) return;

        setAuthError(
          error instanceof Error
            ? error.message
            : "Unable to verify your account."
        );

        setCheckingAuth(false);
      }
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, [pathname, router]);



  // Check page access using the already-loaded permissions.
  useEffect(() => {
    if (
      pathname === "/admin/login" ||
      checkingAuth ||
      authError ||
      !role
    ) {
      return;
    }

    const isAdministrator =
      role === "admin" || role === "administrator";

    // Roles & Permissions and Settings are administrator-only.
    const adminOnlyPaths = [
      "/admin/roles",
      "/admin/settings",
    ];

    const isAdminOnlyPage = adminOnlyPaths.some(
      (path) => pathname === path || pathname.startsWith(`${path}/`)
    );

    if (isAdminOnlyPage) {
      if (!isAdministrator) {
        router.replace("/admin/blogs");
      }

      return;
    }

    const routePermissions: {
      path: string;
      permission: PermissionKey;
    }[] = [
        { path: "/admin/dashboard", permission: "dashboard" },
        { path: "/admin/blogs", permission: "blogs" },
        { path: "/admin/case-studies", permission: "caseStudies" },
        { path: "/admin/media", permission: "media" },
        { path: "/admin/users", permission: "users" },
        { path: "/admin/settings", permission: "settings" },
        { path: "/admin/comments", permission: "comments" },
      ];

    const matchedRoute = routePermissions.find(
      (item) =>
        pathname === item.path ||
        pathname.startsWith(`${item.path}/`)
    );

    if (!matchedRoute || isAdministrator) {
      return;
    }

    if (!permissions[matchedRoute.permission]) {
      const firstAllowedRoute = routePermissions.find(
        (item) => permissions[item.permission]
      );

      router.replace(firstAllowedRoute?.path || "/admin/login");
    }
  }, [pathname, checkingAuth, authError, role, permissions, router]);

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
    (pathname.includes("/case-studies/edit/")
      ? "Edit Case Study"
      : pathname.includes("/case-studies/create")
      ? "Create Case Study"
      : pathname.includes("/edit/")
      ? "Edit Blog"
      : pathname.includes("/create")
      ? "Create Blog"
      : "CMS");

  async function handleLogout() {
    try {
      setLoggingOut(true);
      await logoutUser();
      router.replace("/admin/login");
    } catch {
      setLoggingOut(false);
    }
  }

  const isAdministrator =
    role === "admin" || role === "administrator";

  const visibleNavigation = navigation.filter((item) => {
    if (isAdministrator) {
      return true;
    }

    // Roles & Permissions is administrator-only.
    if (item.href === "/admin/roles") {
      return false;
    }

    const permissionMap: Record<string, PermissionKey> = {
      "/admin/dashboard": "dashboard",
      "/admin/blogs": "blogs",
      "/admin/case-studies": "caseStudies",
      "/admin/media": "media",
      "/admin/users": "users",
      "/admin/settings": "settings",
      "/admin/comments": "comments",
    };

    const permission = permissionMap[item.href];

    return permission ? permissions[permission] : false;
  });


  const sidebar = (
    <aside className="flex h-full flex-col bg-[#29382F] text-white">

      {/* Brand Header */}
      <div className="flex h-[82px] items-center justify-between border-b border-white/15 px-7">
        <Link href="/admin/dashboard" className="group flex items-center gap-3">
          <img
            src="/images/logo.png"
            alt="Growth Enzyme Logo"
            className="h-10 w-10 object-contain drop-shadow-sm transition-transform duration-200 group-hover:scale-105"
          />

          <span className="text-[16px] font-bold tracking-wide text-white transition-colors group-hover:text-[#B6CBA9]">
            Growth Enzyme
          </span>
        </Link>

        <button
          onClick={() => setMobileOpen(false)}
          className="rounded-lg p-2 text-white/80 transition hover:bg-white/15 hover:text-white lg:hidden"
          aria-label="Close navigation"
        >
          <X size={20} />
        </button>
      </div>

      {/* Navigation */}
      <div className="px-5 pt-8">
        <div className="mb-5 flex items-center gap-3 px-3">
          <span className="h-1.5 w-1.5 rounded-full bg-[#D78359]" />
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/70">
            Workspace
          </p>
        </div>

        <nav className="space-y-1.5">
          {visibleNavigation.map((item) => {
            const active = pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`group relative flex items-center gap-3 overflow-hidden rounded-xl px-3.5 py-3 text-[13px] transition-all duration-200 ${active
                  ? "bg-[#B6CBA9] font-bold text-[#29382F] shadow-[0_4px_12px_rgba(0,0,0,0.12)]"
                  : "font-medium text-white/90 hover:bg-white/10 hover:text-white"
                  }`}
              >
                {active && (
                  <span className="absolute bottom-2 left-0 top-2 w-1 rounded-r-full bg-[#D78359]" />
                )}

                <Icon
                  size={18}
                  strokeWidth={active ? 2.2 : 1.9}
                  className={`shrink-0 transition-colors ${active
                    ? "text-[#29382F]"
                    : "text-white/85 group-hover:text-[#B6CBA9]"
                    }`}
                />

                <span>{item.label}</span>

                {active && (
                  <ChevronRight
                    size={16}
                    strokeWidth={2.5}
                    className="ml-auto text-[#29382F]"
                  />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Actions */}
      <div className="mt-auto space-y-2 border-t border-white/15 p-5">

        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 rounded-xl px-3.5 py-3 text-[12px] font-semibold text-white/90 transition hover:bg-white/10 hover:text-[#B6CBA9]"
        >
          <ExternalLink size={17} />
          View Website
        </Link>

        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-left text-[12px] font-semibold text-white/90 transition hover:bg-[#D78359]/15 hover:text-[#F2B18F] disabled:opacity-50"
        >
          <LogOut size={17} />
          {loggingOut ? "Signing out..." : "Sign Out"}
        </button>

        <div className="mt-3 border-t border-white/10 px-3 pt-4">
          <p className="text-[10px] font-medium tracking-wide text-white/65">
            Growth Enzyme CMS · 2026
          </p>
        </div>
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
              className="rounded-lg border border-gray-200 p-2 text-gray-700 transition hover:bg-gray-100 lg:hidden"
              aria-label="Open navigation"
            >
              <Menu size={20} />
            </button>

            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-gray-400">
                Growth Enzyme / CMS
              </p>
              <h2 className="mt-1 text-sm font-semibold text-gray-900">
                {currentPage}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Log Out Option */}
            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="flex items-center gap-2 rounded-xl border border-red-200/80 bg-red-50/70 px-3.5 py-2 text-xs font-semibold text-red-600 shadow-sm transition hover:bg-red-100 hover:text-red-700 disabled:opacity-50"
              title="Log Out"
            >
              <LogOut size={15} />
              <span className="hidden sm:inline">
                {loggingOut ? "Signing out..." : "Log Out"}
              </span>
            </button>

            {/* Growth Enzyme Logo */}
            <Link
              href="/admin/dashboard"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white p-1.5 shadow-sm transition hover:scale-105 hover:border-[#29382F]/30"
              title="Growth Enzyme Dashboard"
            >
              <img
                src="/images/logo.png"
                alt="Growth Enzyme Logo"
                className="h-full w-full object-contain"
              />
            </Link>
          </div>
        </header>

        <main
          className={`min-h-[calc(100vh-76px)] px-5 py-8 md:py-10 ${pathname === "/admin/comments"
            ? "md:px-5"
            : "md:px-9"
            }`}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
