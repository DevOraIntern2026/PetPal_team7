"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Package,
  RefreshCw,
  ShieldAlert,
  Stethoscope,
  User,
} from "lucide-react";
import { useAuth } from "../../lib/auth/AuthContext";
import { useProfile } from "../../hooks/useProfile";
import AccountSidebar from "../account/AccountSidebar";
import ProductsSection from "./ProductsSection";
import DoctorsSection from "./DoctorsSection";

const SECTIONS = [
  {
    id: "products",
    label: "Products",
    subtitle: "Manage the store catalog.",
    icon: Package,
    Component: ProductsSection,
  },
  {
    id: "doctors",
    label: "Doctors",
    subtitle: "Manage the vets users can book.",
    icon: Stethoscope,
    Component: DoctorsSection,
  },
];

// Sidebar items: the two admin sections plus a way back to the user account
const ADMIN_TABS = [
  ...SECTIONS,
  { id: "account", label: "My Account", icon: User },
];

export default function AdminDashboard() {
  const { user, ready, requireAuth } = useAuth();
  const router = useRouter();
  const { profile } = useProfile();
  const [active, setActive] = useState("products");

  const isAdmin = Boolean(
    user?.roles?.some((r) => String(r).toLowerCase() === "admin"),
  );

  useEffect(() => {
    if (!ready) return;
    if (!user) {
      requireAuth("sign-in-for-account", null, "/dashboard");
      router.replace("/");
    }
  }, [ready, user, requireAuth, router]);

  const selectTab = (id) =>
    id === "account" ? router.push("/account") : setActive(id);

  if (!ready) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <RefreshCw size={28} className="animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  if (!isAdmin) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center gap-3 px-6 text-center">
        <ShieldAlert size={32} className="text-danger" aria-hidden="true" />
        <h1 className="text-xl font-bold text-ink">Admins only</h1>
        <p className="text-ink-muted">
          Your account does not have access to this page.
        </p>
        <Link href="/" className="btn-primary w-auto!">
          Back to home
        </Link>
      </div>
    );
  }

  const section = SECTIONS.find((s) => s.id === active);
  const { Component } = section;

  return (
    <div className="flex h-[calc(100vh-5rem)] w-full overflow-hidden bg-white">
      <aside className="h-full shrink-0">
        <AccountSidebar
          activeTab={active}
          onSelectTab={selectTab}
          profile={profile}
          tabs={ADMIN_TABS}
          showTip={false}
        />
      </aside>

      <main className="h-full min-w-0 flex-1 overflow-y-auto bg-white p-6 md:p-10 lg:p-14">
        <div className="mx-auto w-full max-w-content space-y-6">
          <div>
            <h1 className="text-title font-bold text-ink">{section.label}</h1>
            <p className="mt-1 text-ink-muted">{section.subtitle}</p>
          </div>
          <Component key={active} />
        </div>
      </main>
    </div>
  );
}
