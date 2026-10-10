"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";

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

export default function MobileMenu({ links, onClose }) {
  const pathname = usePathname();

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
      </div>
    </motion.div>
  );
}
