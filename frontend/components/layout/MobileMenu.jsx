"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Menu, X, User } from "lucide-react";
import { useAuth } from "../../lib/auth/AuthContext";

export function MobileMenuButton({ open, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className="text-ink md:hidden"
      aria-label="Toggle menu"
      aria-expanded={open}
    >
      {open ? <X size={26} /> : <Menu size={26} />}
    </button>
  );
}

export default function MobileMenu({ links, onClose, profile }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const cachedAvatar =
    typeof window !== "undefined"
      ? localStorage.getItem("petpal:profile_image")
      : null;
  const avatarUrl =
    profile?.profileImageUrl ||
    profile?.avatarUrl ||
    user?.profileImageUrl ||
    user?.avatarUrl ||
    cachedAvatar ||
    null;
  const displayName = profile?.fullName || user?.name || "User";

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="absolute left-0 top-full z-50 w-full bg-white px-4 pb-4 shadow-md md:hidden"
    >
      <ul className="flex flex-col gap-2 text-sm font-semibold text-ink">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              onClick={onClose}
              className={`block rounded-full px-4 py-2 ${
                link.href === pathname
                  ? "bg-primary text-white"
                  : "hover:text-primary"
              }`}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex items-center gap-4 border-t pt-4 text-sm font-semibold">
        {user ? (
          <>
            <Link
              href="/account"
              onClick={onClose}
              className="flex items-center gap-2 rounded-full border border-gray-200 py-1 pl-1 pr-3 transition hover:bg-gray-50"
            >
              <span className="flex size-7 shrink-0 overflow-hidden rounded-full ring-1 ring-gray-200">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={displayName}
                    className="size-full object-cover"
                  />
                ) : (
                  <span className="flex size-full items-center justify-center bg-[#E8ECEF] text-[#6C757D]">
                    <User size={15} />
                  </span>
                )}
              </span>
              <span className="text-ink font-bold">My Account</span>
            </Link>
            <button
              type="button"
              onClick={() => {
                logout();
                onClose();
              }}
              className="font-bold text-amber-600 transition hover:text-amber-700"
            >
              LOGOUT
            </button>
          </>
        ) : (
          <>
            <Link href="/login" onClick={onClose}>
              LOGIN
            </Link>
            <Link
              href="/signup"
              onClick={onClose}
              className="rounded-full bg-primary px-5 py-2 text-white"
            >
              SIGN UP
            </Link>
          </>
        )}
      </div>
    </motion.div>
  );
}
