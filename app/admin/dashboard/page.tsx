
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/app/lib/firebase";
import { logoutUser } from "@/app/lib/auth";

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

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

  async function handleLogout() {
    await logoutUser();
    router.replace("/admin/login");
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Checking authentication...
      </div>
    );
  }

  if (!profile) return null;

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-6xl">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">GROWTHENZYME CMS</p>
            <h1 className="mt-2 text-3xl font-semibold">
              Dashboard
            </h1>
            <p className="mt-2 text-gray-500">
              Welcome, {profile.name}
            </p>
            <p className="text-sm capitalize text-gray-500">
              Role: {profile.role || "Custom Role"}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-lg bg-black px-5 py-3 text-white"
          >
            Logout
          </button>
        </header>

        <section className="mt-10 grid gap-5 md:grid-cols-3">
          {[
            ["Blogs", "Manage blog articles"],
            ["Case Studies", "Manage project case studies"],
            ["Media Library", "Manage website media"],
          ].map(([title, description]) => (
            <div
              key={title}
              className="rounded-xl border bg-white p-6 shadow-sm"
            >
              <h2 className="text-xl font-semibold">{title}</h2>
              <p className="mt-2 text-sm text-gray-500">
                {description}
              </p>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
