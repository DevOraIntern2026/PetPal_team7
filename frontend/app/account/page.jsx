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
    <div className="flex min-h-[calc(100vh-5rem)] w-full flex-col bg-white md:flex-row md:items-start">
      {/* Full-height docked Sidebar */}
      <AccountSidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        profile={profile}
      />

      {/* Main Content Area */}
      <main className="min-w-0 flex-1 bg-white p-6 md:p-10 lg:p-14">
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
