"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { User, LogOut, LogIn, UserPlus, ChevronDown } from "lucide-react";
import MobileMenu, { MobileMenuButton } from "./MobileMenu";
import { useAuth } from "../../lib/auth/AuthContext";
import { useProfile } from "../../hooks/useProfile";

const links = [
  { label: "HOME", href: "/" },
  { label: "ADOPTION", href: "/adoption" },
  { label: "STORE", href: "/store" },
  { label: "VETS", href: "/vets" },
];

function ProfileDropdown({ user, profile, logout }) {
  const [open, setOpen] = useState(false);
  const [cachedAvatar, setCachedAvatar] = useState(null);
  const ref = useRef(null);

  const avatarUrl =
    profile?.profileImageUrl ||
    profile?.avatarUrl ||
    user?.profileImageUrl ||
    user?.avatarUrl ||
    cachedAvatar ||
    null;
  const displayName = profile?.fullName || user?.name || "User";
  const displayEmail = profile?.email || user?.email || "";

  // Close on outside click
  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    function handleKey(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleKey);
    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.removeEventListener("mousedown", handleClick);
    };
  }, []);

  return (
    <div ref={ref} className="relative">
      {/* Trigger button */}
      <button
        type="button"
        id="navbar-profile-btn"
        onClick={() => setOpen((v) => !v)}
        className="group flex items-center gap-2 rounded-full border border-gray-200 p-0.5 pr-2 transition hover:bg-gray-50 focus:outline-none"
        aria-haspopup="true"
        aria-expanded={open}
        title={user ? displayName : "Account"}>
        {/* Avatar: Photo if uploaded, else grey icon */}
        <span className="relative flex size-8 shrink-0 overflow-hidden rounded-full ring-1 ring-gray-200">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={displayName}
              className="size-full object-cover"
            />
          ) : (
            <span className="flex size-full items-center justify-center bg-[#E8ECEF] text-[#6C757D]">
              <User size={18} className="stroke-[2]" />
            </span>
          )}
        </span>

        {user && (
          <span className="max-w-[90px] truncate text-xs font-bold text-ink group-hover:text-primary">
            {displayName.split(" ")[0]}
          </span>
        )}
        <ChevronDown
          size={13}
          className={`text-ink/50 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl ring-1 ring-black/5">
            {user && (
              <>
                {/* User info header */}
                <div className="flex items-center gap-3 border-b border-gray-100 px-4 py-3 bg-[#FAFBF5]">
                  <span className="flex size-10 shrink-0 overflow-hidden rounded-full border border-gray-200">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt={displayName}
                        className="size-full object-cover"
                      />
                    ) : (
                      <span className="flex size-full items-center justify-center bg-[#E8ECEF] text-[#6C757D]">
                        <User size={20} />
                      </span>
                    )}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-extrabold text-ink">
                      {displayName}
                    </p>
                    {displayEmail && (
                      <p className="truncate text-[11px] text-ink/50 font-medium">
                        {displayEmail}
                      </p>
                    )}
                  </div>
                </div>

                {/* Logged in items: Profile, Login (switch), Logout */}
                <div className="p-1.5 space-y-0.5">
                  <Link
                    href="/dashboard"
                    id="navbar-profile-link"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-ink transition hover:bg-primary-tint hover:text-primary-strong">
                    <User size={16} className="text-primary-strong" />
                    <span>My Dashboard</span>
                  </Link>

                  <Link
                    href="/account"
                    id="navbar-profile-link"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-ink transition hover:bg-primary-tint hover:text-primary-strong">
                    <User size={16} className="text-primary-strong" />
                    <span>My Profile</span>
                  </Link>

                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold text-ink/70 transition hover:bg-gray-50 hover:text-ink">
                    <LogIn size={15} className="text-ink/50" />
                    <span>Log In to Another Account</span>
                  </Link>

                  <div className="my-1 border-t border-gray-100" />

                  <button
                    type="button"
                    id="navbar-logout-btn"
                    onClick={() => {
                      logout();
                      setOpen(false);
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-amber-600 transition hover:bg-amber-50 hover:text-amber-700">
                    <LogOut size={16} />
                    <span>Log Out</span>
                  </button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const { user, logout, ready } = useAuth();
  const { profile } = useProfile();

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-gray-100/90 shadow-xs">
      <div className="mx-auto flex h-20 items-center justify-between px-6 md:px-10 lg:px-12">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 text-xl leading-none transition hover:opacity-90">
          <Image
            src="/images/landing/logo.png"
            alt="Pet Mate Logo"
            width={40}
            height={40}
            className="h-10 w-10 object-contain"
          />
          <span className="font-bold text-ink">
            Pet <span className="font-medium text-primary">Mate</span>
          </span>
        </Link>

        {/* Desktop nav links */}
        <ul className="hidden items-center gap-2 text-xs font-bold tracking-wider text-ink md:flex lg:gap-4">
          {links.map((link) => {
            const isActive =
              link.href === pathname ||
              (link.href !== "/" && pathname.startsWith(link.href));

            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`inline-flex items-center justify-center rounded-full px-4 py-2 transition-all ${
                    isActive
                      ? "bg-primary-strong text-white shadow-xs"
                      : "text-ink/75 hover:bg-gray-100/70 hover:text-primary-strong"
                  }`}>
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Desktop right actions */}
        <div className="hidden items-center gap-3 text-xs font-semibold md:flex">
          {/* Auth */}
          {!ready ? (
            <div aria-hidden="true" className="h-9 w-32" />
          ) : user ? (
            <ProfileDropdown user={user} profile={profile} logout={logout} />
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="rounded-full px-4 py-2 font-bold text-ink transition hover:text-primary">
                LOGIN
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-primary-strong px-5 py-2 font-bold text-white shadow-xs transition hover:scale-105 hover:bg-primary-deep active:scale-95">
                SIGN UP
              </Link>
            </div>
          )}
        </div>

        {/* Mobile toggle */}
        <MobileMenuButton open={open} onToggle={() => setOpen((p) => !p)} />
      </div>

      {/* Mobile menu */}
      {open && (
        <MobileMenu
          links={links}
          onClose={() => setOpen(false)}
          profile={profile}
        />
      )}
    </header>
  );
}
