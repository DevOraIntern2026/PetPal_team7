"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Pencil,
  Camera,
  User,
  Mail,
  Phone,
  MapPin,
  PawPrint,
  Calendar,
  Heart,
  ShoppingBag,
  BadgeCheck,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Bot,
  Lock,
  Loader2,
} from "lucide-react";
import EditProfileModal from "./EditProfileModal";

export default function ProfileTab({
  profile,
  onUpdateProfile,
  onChangePassword,
  onUploadAvatar,
  onSelectTab,
}) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [initialEditTab, setInitialEditTab] = useState("info");
  const [uploading, setUploading] = useState(false);

  const displayName = profile?.fullName || "maryam";
  const displayEmail = profile?.email || "maryamtarek@gmail.com";
  const displayBio = profile?.bio || "Pet Parent since 2025";
  const displayPhone = profile?.phoneNumber || "01225964843";
  const displayCountry = profile?.country || "Egypt";
  const cachedAvatar =
    typeof window !== "undefined"
      ? localStorage.getItem("petpal:profile_image")
      : null;
  const avatarUrl =
    profile?.profileImageUrl ||
    profile?.avatarUrl ||
    cachedAvatar ||
    null;

  async function handleDirectAvatarUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await onUploadAvatar(file);
      await onUpdateProfile({
        ...profile,
        profileImageUrl: url,
      });
    } catch (err) {
      console.error("Avatar upload failed:", err);
    } finally {
      setUploading(false);
    }
  }

  function openEdit(tab = "info") {
    setInitialEditTab(tab);
    setIsEditOpen(true);
  }

  return (
    <div className="mx-auto max-w-5xl space-y-7 py-2">
      {/* 1. Hero Profile Banner */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-[#FAFBF5] via-white to-primary-tint/30 p-6 sm:p-8 shadow-xs"
      >
        {/* Decorative background glow */}
        <div className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-16 -bottom-16 size-64 rounded-full bg-amber-200/20 blur-3xl" />

        <div className="relative flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:justify-between">
          {/* Avatar + Main info */}
          <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
            {/* Avatar Frame with Gradient Border and Camera Badge */}
            <div className="relative group shrink-0">
              <div className="relative size-28 sm:size-32 rounded-full p-1 bg-gradient-to-tr from-[#28A8C7] via-primary-tint to-amber-200/70 shadow-md">
                <div className="size-full overflow-hidden rounded-full bg-white ring-2 ring-white">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={displayName}
                      className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex size-full flex-col items-center justify-center bg-gradient-to-b from-[#EBF6F9] to-[#E3F2F6] text-[#28A8C7]">
                      {uploading ? (
                        <Loader2 size={36} className="animate-spin" />
                      ) : (
                        <User size={46} className="stroke-[1.75]" />
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Direct Camera Upload Badge */}
              <label
                className="absolute bottom-0 right-0 flex size-9 items-center justify-center rounded-full bg-gradient-to-tr from-[#28A8C7] to-[#1888a2] text-white shadow-md ring-3 ring-white transition-all hover:scale-110 active:scale-95 cursor-pointer"
                title="Change photo"
              >
                {uploading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Camera size={16} />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleDirectAvatarUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>

            {/* Name, Email, Pills */}
            <div className="min-w-0">
              <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <h1 className="text-2xl font-black tracking-tight text-ink sm:text-3xl">
                  {displayName}
                </h1>
                <span
                  className="inline-flex items-center gap-1 rounded-full bg-[#E6F7FA] px-2.5 py-0.5 text-xs font-bold text-[#147B97]"
                  title="Verified Pet Owner"
                >
                  <BadgeCheck size={14} />
                  <span>Pet Parent</span>
                </span>
              </div>

              <p className="mt-1 text-sm font-semibold text-ink/60">
                {displayEmail}
              </p>

              {/* Meta pills */}
              <div className="mt-3.5 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200/80 bg-white/90 px-3 py-1 text-xs font-semibold text-ink/75 shadow-2xs">
                  <PawPrint size={13} className="text-amber-500" />
                  <span>{displayBio}</span>
                </span>

                <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200/80 bg-white/90 px-3 py-1 text-xs font-semibold text-ink/75 shadow-2xs">
                  <MapPin size={13} className="text-primary-strong" />
                  <span>{displayCountry}</span>
                </span>

                <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200/80 bg-white/90 px-3 py-1 text-xs font-semibold text-ink/75 shadow-2xs">
                  <Phone size={13} className="text-emerald-500" />
                  <span>{displayPhone}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Action button */}
          <div className="shrink-0">
            <button
              type="button"
              onClick={() => openEdit("info")}
              className="inline-flex items-center gap-2 rounded-full bg-[#28A8C7] px-7 py-3 text-sm font-extrabold text-white shadow-sm transition-all hover:bg-[#1f8da8] hover:shadow-md active:scale-95"
            >
              <Pencil size={16} />
              <span>Edit Profile</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* 2. Interactive Quick Stats Cards (Addresses spacing & empty void) */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {/* Card 1: Pets */}
        <motion.button
          type="button"
          whileHover={{ y: -4 }}
          transition={{ duration: 0.15 }}
          onClick={() => onSelectTab && onSelectTab("pets")}
          className="group flex flex-col justify-between rounded-2xl border border-primary/15 bg-white p-4 text-left shadow-2xs transition hover:border-primary/40 hover:shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div className="flex size-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 group-hover:scale-110 transition-transform">
              <PawPrint size={20} />
            </div>
            <ArrowRight size={15} className="text-ink/30 group-hover:text-primary transition-colors" />
          </div>
          <div className="mt-3">
            <p className="text-xs font-bold text-ink/50 uppercase tracking-wider">My Pets</p>
            <p className="text-lg font-black text-ink">1 Registered</p>
          </div>
        </motion.button>

        {/* Card 2: Appointments */}
        <motion.button
          type="button"
          whileHover={{ y: -4 }}
          transition={{ duration: 0.15 }}
          onClick={() => onSelectTab && onSelectTab("appointments")}
          className="group flex flex-col justify-between rounded-2xl border border-primary/15 bg-white p-4 text-left shadow-2xs transition hover:border-primary/40 hover:shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div className="flex size-10 items-center justify-center rounded-xl bg-teal-50 text-[#147B97] group-hover:scale-110 transition-transform">
              <Calendar size={20} />
            </div>
            <ArrowRight size={15} className="text-ink/30 group-hover:text-primary transition-colors" />
          </div>
          <div className="mt-3">
            <p className="text-xs font-bold text-ink/50 uppercase tracking-wider">Appointments</p>
            <p className="text-lg font-black text-ink">2 Scheduled</p>
          </div>
        </motion.button>

        {/* Card 3: Favorites */}
        <motion.button
          type="button"
          whileHover={{ y: -4 }}
          transition={{ duration: 0.15 }}
          onClick={() => onSelectTab && onSelectTab("favorites")}
          className="group flex flex-col justify-between rounded-2xl border border-primary/15 bg-white p-4 text-left shadow-2xs transition hover:border-primary/40 hover:shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div className="flex size-10 items-center justify-center rounded-xl bg-rose-50 text-rose-500 group-hover:scale-110 transition-transform">
              <Heart size={20} />
            </div>
            <ArrowRight size={15} className="text-ink/30 group-hover:text-primary transition-colors" />
          </div>
          <div className="mt-3">
            <p className="text-xs font-bold text-ink/50 uppercase tracking-wider">Favorites</p>
            <p className="text-lg font-black text-ink">4 Saved</p>
          </div>
        </motion.button>

        {/* Card 4: Orders */}
        <motion.button
          type="button"
          whileHover={{ y: -4 }}
          transition={{ duration: 0.15 }}
          onClick={() => onSelectTab && onSelectTab("orders")}
          className="group flex flex-col justify-between rounded-2xl border border-primary/15 bg-white p-4 text-left shadow-2xs transition hover:border-primary/40 hover:shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div className="flex size-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 group-hover:scale-110 transition-transform">
              <ShoppingBag size={20} />
            </div>
            <ArrowRight size={15} className="text-ink/30 group-hover:text-primary transition-colors" />
          </div>
          <div className="mt-3">
            <p className="text-xs font-bold text-ink/50 uppercase tracking-wider">Store Orders</p>
            <p className="text-lg font-black text-ink">1 Completed</p>
          </div>
        </motion.button>
      </div>

      {/* 3. Detailed Information & Security Grid (Balanced 2-Columns) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left Column: Personal Information Card */}
        <div className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-2xs transition hover:shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div className="flex items-center gap-2.5">
              <div className="flex size-9 items-center justify-center rounded-xl bg-primary-tint text-primary-strong">
                <User size={18} />
              </div>
              <h2 className="text-base font-extrabold text-ink">
                Personal Information
              </h2>
            </div>
            <button
              type="button"
              onClick={() => openEdit("info")}
              aria-label="Edit personal information"
              className="flex size-8 items-center justify-center rounded-full text-ink/50 transition hover:bg-gray-100 hover:text-ink"
            >
              <Pencil size={15} />
            </button>
          </div>

          <div className="space-y-4 pt-4 text-sm">
            <div className="flex items-start justify-between rounded-2xl bg-gray-50/70 p-3.5 border border-gray-100">
              <div className="flex items-center gap-3">
                <User size={17} className="text-ink/40 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-ink/50">Full Name</p>
                  <p className="font-bold text-ink">{displayName}</p>
                </div>
              </div>
            </div>

            <div className="flex items-start justify-between rounded-2xl bg-gray-50/70 p-3.5 border border-gray-100">
              <div className="flex items-center gap-3">
                <Mail size={17} className="text-ink/40 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-ink/50">Email Address</p>
                  <p className="font-bold text-ink">{displayEmail}</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                <BadgeCheck size={13} />
                Verified
              </span>
            </div>

            <div className="flex items-start justify-between rounded-2xl bg-gray-50/70 p-3.5 border border-gray-100">
              <div className="flex items-center gap-3">
                <Phone size={17} className="text-ink/40 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-ink/50">Phone Number</p>
                  <p className="font-bold text-ink">{displayPhone}</p>
                </div>
              </div>
            </div>

            <div className="flex items-start justify-between rounded-2xl bg-gray-50/70 p-3.5 border border-gray-100">
              <div className="flex items-center gap-3">
                <MapPin size={17} className="text-ink/40 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-ink/50">Country / Location</p>
                  <p className="font-bold text-ink">{displayCountry}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Security & Pet Assistant Helper */}
        <div className="flex flex-col justify-between rounded-3xl border border-gray-200/80 bg-white p-6 shadow-2xs transition hover:shadow-sm">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <ShieldCheck size={18} />
                </div>
                <h2 className="text-base font-extrabold text-ink">
                  Security & Assistant
                </h2>
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                Protected
              </span>
            </div>

            {/* Security Box */}
            <div className="mt-4 rounded-2xl bg-gray-50/70 p-4 border border-gray-100 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Lock size={17} className="text-ink/40" />
                  <div>
                    <p className="text-xs font-semibold text-ink/50">Password</p>
                    <p className="font-bold text-ink">••••••••••••</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => openEdit("password")}
                  className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-bold text-ink transition hover:border-primary hover:text-primary shadow-2xs"
                >
                  Change
                </button>
              </div>
            </div>

            {/* AI Assistant Banner */}
            <div className="mt-4 rounded-2xl border border-primary/20 bg-gradient-to-r from-primary-tint/50 to-white p-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-white shadow-sm">
                  <Bot size={22} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-ink">
                    Need instant pet guidance?
                  </h3>
                  <p className="text-xs text-ink/60">
                    Ask our AI Vet Assistant anytime about symptoms or pet diet.
                  </p>
                </div>
              </div>
              <a
                href="/ai-assistant"
                className="mt-3.5 inline-flex items-center gap-1.5 text-xs font-bold text-primary-strong hover:underline"
              >
                <span>Chat with AI Assistant</span>
                <ArrowRight size={13} />
              </a>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-ink/50">
            <span>Account Type: Verified Pet Parent</span>
            <span>PetPal ID: #7721</span>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        profile={profile}
        onUpdateProfile={onUpdateProfile}
        onChangePassword={onChangePassword}
        onUploadAvatar={onUploadAvatar}
        initialTab={initialEditTab}
      />
    </div>
  );
}
