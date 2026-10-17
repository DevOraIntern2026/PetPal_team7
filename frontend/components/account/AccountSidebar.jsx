"use client";

import {
  LayoutDashboard,
  User,
  PawPrint,
  Calendar,
  Heart,
  ShoppingBag,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../lib/auth/AuthContext";

export const ACCOUNT_TABS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "profile", label: "My Profile", icon: User },
  { id: "pets", label: "My Pets", icon: PawPrint },
  { id: "appointments", label: "My Appointments", icon: Calendar },
  { id: "favorites", label: "Favorites", icon: Heart },
  { id: "orders", label: "My orders", icon: ShoppingBag },
];

export default function AccountSidebar({
  activeTab,
  onSelectTab,
  profile,
  tabs = ACCOUNT_TABS,
  showTip = true,
}) {
  const { user, logout } = useAuth();

  const displayName = profile?.fullName || user?.name || "maryam";
  const displayEmail = profile?.email || user?.email || "maryamtarek@gmail.com";
  const avatarUrl =
    profile?.profileImageUrl ||
    profile?.avatarUrl ||
    user?.profileImageUrl ||
    user?.avatarUrl ||
    (typeof window !== "undefined"
      ? localStorage.getItem("petpal:profile_image")
      : null) ||
    null;

  return (
    <aside className="flex w-full shrink-0 flex-col justify-between border-b border-[#E5EAD9] bg-[#F7F9EE] p-6 md:sticky md:top-20 md:h-[calc(100vh-5rem)] md:self-start md:overflow-y-auto md:w-64 md:border-b-0 md:border-r lg:w-72">
      <div>
        {/* Top User Profile Header */}
        <div className="flex items-center gap-3.5 pb-6 border-b border-[#E5EAD9]">
          <div className="relative size-12 shrink-0 overflow-hidden rounded-full border border-white shadow-sm ring-1 ring-gray-200">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={displayName}
                className="size-full object-cover"
              />
            ) : (
              <span className="flex size-full items-center justify-center bg-[#E8ECEF] text-[#6C757D]">
                <User size={22} className="stroke-[1.8]" />
              </span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-base font-extrabold text-ink leading-tight">
              {displayName}
            </h2>
            <p className="truncate text-xs font-medium text-ink/50 mt-0.5">
              {displayEmail}
            </p>
          </div>
        </div>

        {/* Navigation tabs */}
        <nav className="space-y-1.5 pt-5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onSelectTab(tab.id)}
                className={`flex w-full items-center gap-3.5 rounded-xl px-4 py-3 text-sm transition-all ${
                  isActive
                    ? "border border-[#DCE4CF] bg-white font-bold text-ink shadow-sm"
                    : "font-semibold text-ink/70 hover:bg-white/60 hover:text-ink"
                }`}>
                <Icon
                  size={19}
                  className={isActive ? "text-primary-strong" : "text-ink/50"}
                />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Helpful Care Tip badge in sidebar */}
      {showTip && (
        <div className="my-4 hidden rounded-2xl border border-primary/15 bg-white/70 p-4 shadow-2xs lg:block">
          <div className="flex items-center gap-2 text-xs font-bold text-primary-strong">
            <PawPrint size={15} />
            <span>PetPal Daily Tip</span>
          </div>
          <p className="mt-1.5 text-[11px] leading-relaxed text-ink/65">
            Regular checkups and vaccinations keep your furry companions happy &
            active!
          </p>
        </div>
      )}

      {/* Bottom Section: Divider & Logout */}
      <div className="pt-4 pb-8 md:pb-6">
        <div className="mb-4 border-t border-[#E5EAD9]" />
        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-[#E76F51] transition hover:bg-orange-50 hover:text-[#c95337] active:scale-98">
          <LogOut size={19} className="text-[#E76F51]" />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
}
