"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "../../lib/auth/AuthContext";
import { useProfile } from "../../hooks/useProfile";
import AccountSidebar from "../../components/account/AccountSidebar";
import ProfileTab from "../../components/account/ProfileTab";
import PetsTab from "../../components/account/PetsTab";
import AppointmentsTab from "../../components/account/AppointmentsTab";
import FavoritesTab from "../../components/account/FavoritesTab";
import OrdersTab from "../../components/account/OrdersTab";
import { RefreshCw } from "lucide-react";

export default function AccountPage() {
  const { user, ready, requireAuth } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");

  const {
    profile,
    loading: profileLoading,
    updateProfile,
    changePassword,
    uploadAvatar,
  } = useProfile();

  // Redirect if not authenticated
  useEffect(() => {
    if (!ready) return;
    if (!user) {
      requireAuth("sign-in-for-account", null, "/account");
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

  return (
    <div className="flex h-[calc(100vh-5rem)] w-full overflow-hidden bg-white">
      {/* Full-height docked Sidebar */}
      <aside className="h-full shrink-0">
        <AccountSidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          profile={profile}
        />
      </aside>

      {/* Main Content Area */}
      <main className="h-full min-w-0 flex-1 overflow-y-auto bg-white p-6 md:p-10 lg:p-14">
        {profileLoading && activeTab === "profile" ? (
          <div className="flex min-h-[50vh] items-center justify-center">
            <RefreshCw size={26} className="animate-spin text-primary" />
          </div>
        ) : activeTab === "profile" ? (
          <ProfileTab
            profile={profile}
            onUpdateProfile={updateProfile}
            onChangePassword={changePassword}
            onUploadAvatar={uploadAvatar}
            onSelectTab={setActiveTab}
          />
        ) : activeTab === "pets" ? (
          <PetsTab />
        ) : activeTab === "appointments" ? (
          <AppointmentsTab />
        ) : activeTab === "favorites" ? (
          <FavoritesTab />
        ) : activeTab === "orders" ? (
          <OrdersTab />
        ) : null}
      </main>
    </div>
  );
}
