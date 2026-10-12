"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import MobileMenu, { MobileMenuButton } from "./MobileMenu";

const links = [
  { label: "HOME", href: "/" },
  { label: "ADOPTION", href: "/adoption" },
  { label: "STORE", href: "/store" },
  { label: "VETS", href: "/vets" },
  { label: "AI ASSISTANT", href: "/ai-assistant" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative z-40 bg-white px-4 py-4 shadow-sm md:h-20 md:px-10"
    >
      <div className="flex h-full items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-xl leading-none">
          <Image
            src="/logo.png"
            alt="Pet Mate Logo"
            width={40}
            height={40}
            className="h-10 w-10 object-contain"
          />
          <span className="font-bold text-ink">
            Pet <span className="font-medium text-primary">Mate</span>
          </span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden gap-2 text-xs font-semibold text-ink md:flex lg:gap-6">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`rounded-full px-4 py-1.5 transition ${
                  link.href === pathname ||
                  (link.href !== "/" && pathname.startsWith(link.href))
                    ? "bg-primary text-white"
                    : "hover:text-primary"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop auth buttons */}
        <div className="hidden items-center gap-4 text-xs font-semibold md:flex">
          <Link href="/login" className="transition hover:text-primary">
            LOGIN
          </Link>
          <Link
            href="/signup"
            className="rounded-full bg-primary-strong px-5 py-2 text-white transition hover:scale-105 hover:bg-primary-deep active:scale-95"
          >
            SIGN UP
          </Link>
        </div>

        {/* Mobile menu button */}
        <MobileMenuButton open={open} onToggle={() => setOpen(!open)} />
      </div>

      {/* Mobile menu */}
      {open && <MobileMenu links={links} onClose={() => setOpen(false)} />}
    </motion.nav>
  );
}
