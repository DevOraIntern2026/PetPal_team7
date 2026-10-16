"use client";

import { useCallback, useEffect, useState } from "react";
import { userApi, filesApi, getErrorMessage } from "../lib/api";
import { useAuth } from "../lib/auth/AuthContext";
import { saveSession, readSession } from "../lib/auth/session";

const PROFILE_IMAGE_KEY = "petpal:profile_image";
const PROFILE_EVENT_KEY = "petpal:profile-updated";

function getCachedAvatar() {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(PROFILE_IMAGE_KEY) || null;
  } catch {
    return null;
  }
}

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(() => {
    const cachedImage = getCachedAvatar();
    const sessionUser = readSession()?.user;
    if (sessionUser) {
      return {
        fullName: sessionUser.name || "maryam",
        email: sessionUser.email || "maryamtarek@gmail.com",
        phoneNumber: sessionUser.phone || "01225964843",
        country: "Egypt",
        bio: "Pet Parent since 2025",
        profileImageUrl: cachedImage || sessionUser.profileImageUrl || null,
      };
    }
    return null;
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProfile = useCallback(async (signal) => {
    setLoading(true);
    setError("");

    try {
      const data = await userApi.getProfile(signal);
      if (data) {
        const cachedImage = getCachedAvatar();
        const mergedData = {
          ...data,
          profileImageUrl: data.profileImageUrl || cachedImage || null,
        };
        setProfile(mergedData);

        // Sync to local session
        const currentSession = readSession();
        if (currentSession) {
          currentSession.user = {
            ...currentSession.user,
            name: data.fullName || currentSession.user?.name,
            email: data.email || currentSession.user?.email,
            profileImageUrl: mergedData.profileImageUrl,
          };
          saveSession(currentSession);
        }
      }
    } catch (err) {
      if (err?.name !== "CanceledError" && !signal?.aborted) {
        // Fallback to auth context or cached profile
        const cachedImage = getCachedAvatar();
        if (user) {
          setProfile((prev) => ({
            fullName: user.name || prev?.fullName || "maryam",
            email: user.email || prev?.email || "maryamtarek@gmail.com",
            phoneNumber: user.phone || prev?.phoneNumber || "01225964843",
            country: prev?.country || "Egypt",
            bio: prev?.bio || "Pet Parent since 2025",
            profileImageUrl: cachedImage || prev?.profileImageUrl || user.profileImageUrl || null,
          }));
        }
      }
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  }, [user]);

  useEffect(() => {
    const controller = new AbortController();
    fetchProfile(controller.signal);
    return () => controller.abort();
  }, [fetchProfile]);

  // Synchronize profile updates in real-time across all components (Navbar, Sidebar, Page)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleProfileUpdated = (e) => {
      if (e?.detail) {
        setProfile((prev) => ({ ...prev, ...e.detail }));
      }
    };

    window.addEventListener(PROFILE_EVENT_KEY, handleProfileUpdated);
    return () => {
      window.removeEventListener(PROFILE_EVENT_KEY, handleProfileUpdated);
    };
  }, []);

  const updateProfile = useCallback(async (updatedData) => {
    try {
      const res = await userApi.updateProfile(updatedData);
      const newProfile = res || updatedData;

      if (updatedData.profileImageUrl && typeof window !== "undefined") {
        try {
          localStorage.setItem(PROFILE_IMAGE_KEY, updatedData.profileImageUrl);
        } catch {}
      }

      setProfile((prev) => ({ ...prev, ...newProfile }));

      // Update local session
      const currentSession = readSession();
      if (currentSession) {
        currentSession.user = {
          ...currentSession.user,
          name: updatedData.fullName || currentSession.user?.name,
          profileImageUrl: updatedData.profileImageUrl || currentSession.user?.profileImageUrl,
        };
        saveSession(currentSession);
      }

      // Broadcast update event to all instances of useProfile (e.g. Navbar)
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent(PROFILE_EVENT_KEY, {
            detail: newProfile,
          }),
        );
      }

      return { success: true };
    } catch (err) {
      // Optimistically update locally and broadcast even if backend API fails
      if (updatedData.profileImageUrl && typeof window !== "undefined") {
        try {
          localStorage.setItem(PROFILE_IMAGE_KEY, updatedData.profileImageUrl);
        } catch {}
      }

      setProfile((prev) => ({ ...prev, ...updatedData }));

      const currentSession = readSession();
      if (currentSession) {
        currentSession.user = {
          ...currentSession.user,
          name: updatedData.fullName || currentSession.user?.name,
          profileImageUrl: updatedData.profileImageUrl || currentSession.user?.profileImageUrl,
        };
        saveSession(currentSession);
      }

      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent(PROFILE_EVENT_KEY, {
            detail: updatedData,
          }),
        );
      }

      return {
        success: true,
        warning: getErrorMessage(err, "Updated locally."),
      };
    }
  }, []);

  const changePassword = useCallback(async ({ currentPassword, newPassword }) => {
    try {
      await userApi.changePassword({ currentPassword, newPassword });
      return { success: true };
    } catch (err) {
      throw new Error(getErrorMessage(err, "Could not change password."));
    }
  }, []);

  const uploadAvatar = useCallback(async (file) => {
    try {
      const res = await filesApi.upload(file, "profiles");
      const url = res?.url ?? res?.fileUrl ?? res?.data?.url ?? res;
      if (typeof url === "string" && (url.startsWith("http") || url.startsWith("/"))) {
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem(PROFILE_IMAGE_KEY, url);
          } catch {}
        }
        return url;
      }
      throw new Error("Invalid response from server");
    } catch (err) {
      // Convert to Base64 data URL fallback so image persists across refreshes and tabs
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Url = reader.result;
          if (typeof window !== "undefined") {
            try {
              localStorage.setItem(PROFILE_IMAGE_KEY, base64Url);
            } catch {}
          }
          resolve(base64Url);
        };
        reader.readAsDataURL(file);
      });
    }
  }, []);

  return {
    profile,
    loading,
    error,
    refetch: fetchProfile,
    updateProfile,
    changePassword,
    uploadAvatar,
  };
}
