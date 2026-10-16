"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Camera,
  Lock,
  User,
  Phone,
  MapPin,
  AlignLeft,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";

export default function EditProfileModal({
  isOpen,
  onClose,
  profile,
  onUpdateProfile,
  onChangePassword,
  onUploadAvatar,
  initialTab = "info",
}) {
  const [activeSubTab, setActiveSubTab] = useState(initialTab || "info");

  useEffect(() => {
    if (initialTab) {
      setActiveSubTab(initialTab);
    }
  }, [initialTab, isOpen]);
  const [fullName, setFullName] = useState(profile?.fullName || "");
  const [phoneNumber, setPhoneNumber] = useState(
    profile?.phoneNumber || "01225964843",
  );
  const [country, setCountry] = useState(profile?.country || "Egypt");
  const [bio, setBio] = useState(profile?.bio || "");
  const [profileImageUrl, setProfileImageUrl] = useState(
    profile?.profileImageUrl || "",
  );

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  if (!isOpen) return null;

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setMessage({ text: "", type: "" });
    try {
      const url = await onUploadAvatar(file);
      setProfileImageUrl(url);
      // Immediately update profile so Navbar and all components reflect the new photo in real-time
      await onUpdateProfile({
        fullName,
        phoneNumber,
        country,
        bio,
        profileImageUrl: url,
      });
      setMessage({ text: "Profile picture uploaded and updated!", type: "success" });
    } catch {
      setMessage({ text: "Could not upload image.", type: "error" });
    } finally {
      setUploading(false);
    }
  }

  async function handleSaveInfo(e) {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: "", type: "" });

    try {
      await onUpdateProfile({
        fullName,
        phoneNumber,
        country,
        bio,
        profileImageUrl,
      });
      setMessage({ text: "Profile updated successfully!", type: "success" });
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err) {
      setMessage({
        text: err?.message || "Failed to update profile.",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  }

  async function handleSavePassword(e) {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      setMessage({ text: "Please fill all password fields.", type: "error" });
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage({ text: "New passwords do not match.", type: "error" });
      return;
    }

    setSaving(true);
    setMessage({ text: "", type: "" });

    try {
      await onChangePassword({ currentPassword, newPassword });
      setMessage({ text: "Password changed successfully!", type: "success" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err) {
      setMessage({
        text: err?.message || "Failed to change password.",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl border border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-extrabold text-ink">Edit Profile</h2>
            <p className="text-xs text-ink/50 mt-0.5">
              Update your account details and security
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-ink/40 transition hover:bg-gray-100 hover:text-ink"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-6 pt-4">
          <div className="flex rounded-2xl bg-gray-100/80 p-1">
            <button
              type="button"
              onClick={() => {
                setActiveSubTab("info");
                setMessage({ text: "", type: "" });
              }}
              className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition-all ${
                activeSubTab === "info"
                  ? "bg-white text-ink shadow-xs"
                  : "text-ink/60 hover:text-ink"
              }`}
            >
              <User size={15} />
              <span>Personal Info</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveSubTab("password");
                setMessage({ text: "", type: "" });
              }}
              className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition-all ${
                activeSubTab === "password"
                  ? "bg-white text-ink shadow-xs"
                  : "text-ink/60 hover:text-ink"
              }`}
            >
              <Lock size={15} />
              <span>Change Password</span>
            </button>
          </div>
        </div>

        {/* Feedback message */}
        {message.text && (
          <div className="px-6 pt-3">
            <div
              className={`flex items-center gap-2 rounded-xl p-3 text-xs font-bold ${
                message.type === "success"
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-rose-50 text-rose-700 border border-rose-200"
              }`}
            >
              {message.type === "success" ? (
                <CheckCircle size={16} className="shrink-0" />
              ) : (
                <AlertCircle size={16} className="shrink-0" />
              )}
              <span>{message.text}</span>
            </div>
          </div>
        )}

        {/* Form Body */}
        <div className="px-6 py-5 max-h-[75vh] overflow-y-auto">
          {activeSubTab === "info" ? (
            <form onSubmit={handleSaveInfo} className="space-y-4">
              {/* Avatar Uploader */}
              <div className="flex flex-col items-center justify-center pb-2">
                <label className="group relative cursor-pointer">
                  <div className="size-24 rounded-full overflow-hidden border-2 border-white shadow-md ring-2 ring-gray-200 group-hover:ring-[#28A8C7] transition">
                    {profileImageUrl ? (
                      <img
                        src={profileImageUrl}
                        alt="Profile preview"
                        className="size-full object-cover"
                      />
                    ) : (
                      <span className="flex size-full items-center justify-center bg-[#E8ECEF] text-[#6C757D]">
                        <User size={40} className="stroke-[1.8]" />
                      </span>
                    )}
                  </div>

                  {/* Camera Badge */}
                  <div className="absolute bottom-0 right-0 flex size-8 items-center justify-center rounded-full bg-[#28A8C7] text-white shadow-md ring-2 ring-white group-hover:bg-[#208ca5] transition">
                    {uploading ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Camera size={16} />
                    )}
                  </div>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                <p className="mt-2 text-xs font-semibold text-ink/50">
                  {uploading ? "Uploading photo…" : "Click avatar to upload photo"}
                </p>
              </div>

              {/* Full Name */}
              <div>
                <label className="mb-1 block text-xs font-bold text-ink/70">
                  Full Name
                </label>
                <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 transition focus-within:border-[#28A8C7] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#28A8C7]/20">
                  <User size={18} className="mr-2 text-ink/40" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    placeholder="e.g. Nadeen Khaled Muharram"
                    className="w-full bg-transparent text-sm font-semibold outline-none text-ink placeholder:text-ink/30"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="mb-1 block text-xs font-bold text-ink/70">
                  Phone Number
                </label>
                <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 transition focus-within:border-[#28A8C7] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#28A8C7]/20">
                  <Phone size={18} className="mr-2 text-ink/40" />
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="e.g. 01225964843"
                    className="w-full bg-transparent text-sm font-semibold outline-none text-ink placeholder:text-ink/30"
                  />
                </div>
              </div>

              {/* Country */}
              <div>
                <label className="mb-1 block text-xs font-bold text-ink/70">
                  Country / City
                </label>
                <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 transition focus-within:border-[#28A8C7] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#28A8C7]/20">
                  <MapPin size={18} className="mr-2 text-ink/40" />
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="e.g. Egypt"
                    className="w-full bg-transparent text-sm font-semibold outline-none text-ink placeholder:text-ink/30"
                  />
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="mb-1 block text-xs font-bold text-ink/70">
                  Bio
                </label>
                <div className="flex items-start rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 transition focus-within:border-[#28A8C7] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#28A8C7]/20">
                  <AlignLeft size={18} className="mr-2 mt-0.5 text-ink/40" />
                  <textarea
                    rows={2}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="e.g. Pet Parent since 2025"
                    className="w-full resize-none bg-transparent text-sm font-semibold outline-none text-ink placeholder:text-ink/30"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full px-5 py-2.5 text-sm font-bold text-ink/60 transition hover:bg-gray-100 hover:text-ink"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || uploading}
                  className="inline-flex items-center gap-2 rounded-full bg-[#28A8C7] px-7 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#208ca5] active:scale-95 disabled:opacity-50"
                >
                  {saving && <Loader2 size={16} className="animate-spin" />}
                  <span>{saving ? "Saving…" : "Save Changes"}</span>
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSavePassword} className="space-y-4 pt-1">
              {/* Current Password */}
              <div>
                <label className="mb-1 block text-xs font-bold text-ink/70">
                  Current Password
                </label>
                <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 transition focus-within:border-[#28A8C7] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#28A8C7]/20">
                  <Lock size={18} className="mr-2 text-ink/40" />
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full bg-transparent text-sm font-semibold outline-none text-ink placeholder:text-ink/30"
                  />
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="mb-1 block text-xs font-bold text-ink/70">
                  New Password
                </label>
                <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 transition focus-within:border-[#28A8C7] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#28A8C7]/20">
                  <Lock size={18} className="mr-2 text-ink/40" />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    placeholder="At least 6 characters"
                    className="w-full bg-transparent text-sm font-semibold outline-none text-ink placeholder:text-ink/30"
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="mb-1 block text-xs font-bold text-ink/70">
                  Confirm New Password
                </label>
                <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 transition focus-within:border-[#28A8C7] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#28A8C7]/20">
                  <Lock size={18} className="mr-2 text-ink/40" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Re-enter new password"
                    className="w-full bg-transparent text-sm font-semibold outline-none text-ink placeholder:text-ink/30"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full px-5 py-2.5 text-sm font-bold text-ink/60 transition hover:bg-gray-100 hover:text-ink"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-full bg-[#28A8C7] px-7 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#208ca5] active:scale-95 disabled:opacity-50"
                >
                  {saving && <Loader2 size={16} className="animate-spin" />}
                  <span>{saving ? "Updating…" : "Update Password"}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
