"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";
import { useAuth } from "../../lib/auth/AuthContext";
import { useProfile } from "../../hooks/useProfile";
import AccountSidebar from "../../components/account/AccountSidebar";
import DashboardTab from "../../components/account/DashboardTab";

export default function DashboardPage() {
  const { user, ready, requireAuth } = useAuth();
  const router = useRouter();
  const { profile } = useProfile();

  const isAdmin = Boolean(
    user?.roles?.some((r) => String(r).toLowerCase() === "admin"),
  );

  useEffect(() => {
    if (!ready) return;
    if (!user) {
      requireAuth("sign-in-for-account", null, "/dashboard");
      router.replace("/");
    } else if (isAdmin) {
      router.replace("/admin"); // admins use the admin dashboard
    }
  }, [ready, user, isAdmin, requireAuth, router])

  // Every other tab lives on /account
  const goToTab = (id) => {
    if (id !== "dashboard") router.push(`/account?tab=${id}`);
  };

  if (!ready || isAdmin) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <RefreshCw size={28} className="animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex h-[calc(100vh-5rem)] w-full overflow-hidden bg-white">
      <aside className="h-full shrink-0">
        <AccountSidebar
          activeTab="dashboard"
          onSelectTab={goToTab}
          profile={profile}
        />
      </aside>

      <main className="h-full min-w-0 flex-1 overflow-y-auto bg-white p-6 md:p-10 lg:p-14">
        <DashboardTab profile={profile} user={user} onSelectTab={goToTab} />
      </main>
    </div>
  );
}
