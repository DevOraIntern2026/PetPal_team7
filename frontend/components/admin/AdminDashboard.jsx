"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Package, RefreshCw, ShieldAlert, Stethoscope } from "lucide-react";
import { useAuth } from "../../lib/auth/AuthContext";
import ProductsSection from "./ProductsSection";
import DoctorsSection from "./DoctorsSection";

const SECTIONS = [
  {
    id: "products",
    label: "Products",
    icon: Package,
    Component: ProductsSection,
  },
  {
    id: "doctors",
    label: "Doctors",
    icon: Stethoscope,
    Component: DoctorsSection,
  },
];

export default function AdminDashboard() {
  const { user, ready, requireAuth } = useAuth();
  const router = useRouter();
  const [active, setActive] = useState("products");

  const isAdmin = Boolean(
    user?.roles?.some((r) => String(r).toLowerCase() === "admin"),
  );

  useEffect(() => {
    if (!ready) return;
    if (!user) {
      requireAuth("sign-in-for-account", null, "/admin");
      router.replace("/");
    }
  }, [ready, user, requireAuth, router]);

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

  const { Component } = SECTIONS.find((s) => s.id === active);

  return (
    <div className="mx-auto w-full max-w-content space-y-6 p-6 md:p-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-title font-bold text-ink">Admin</h1>
          <p className="mt-1 text-ink-muted">Manage the store and the vets.</p>
        </div>
        <div className="flex gap-1 rounded-full bg-primary-tint p-1">
          {SECTIONS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              aria-pressed={active === id}
              onClick={() => setActive(id)}
              className={`focus-ring inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition ${
                active === id
                  ? "bg-white text-primary-strong shadow-card"
                  : "text-ink-muted hover:text-ink"
              }`}>
              <Icon size={16} aria-hidden="true" />
              {label}
            </button>
          ))}
        </div>
      </div>

      <Component key={active} />
    </div>
  );
}
