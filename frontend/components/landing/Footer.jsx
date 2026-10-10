"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  FaPaw,
  FaInstagram,
  FaFacebookF,
  FaTiktok,
  FaArrowRight,
  FaHeart,
  FaShieldAlt,
  FaBrain,
  FaHeadset,
  FaUsers,
  FaCommentDots,
} from "react-icons/fa";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Find a vet", href: "/find-a-vet" },
  { label: "AI Assistant", href: "/ai-assistant" },
  { label: "About Us", href: "/about-us" },
  { label: "Services", href: "/services" },
];

const supportLinks = [
  { label: "Contact Us", href: "/contact-us" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "FAQ", href: "/faq" },
  { label: "Terms & Conditions", href: "/terms" },
];

const features = [
  { icon: FaShieldAlt, label: "Trusted Vets" },
  { icon: FaHeart, label: "Better Care" },
  { icon: FaBrain, label: "AI Assistant" },
  { icon: FaPaw, label: "Happy Pets" },
];

const socialLinks = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/",
    icon: FaInstagram,
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/",
    icon: FaFacebookF,
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/",
    icon: FaTiktok,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" },
  },
};

function SectionTitle({ icon: Icon, children }) {
  return (
    <div className="mb-7 flex items-center gap-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-tint text-xl text-primary-strong transition-transform duration-300 hover:rotate-6 hover:scale-110">
        <Icon aria-hidden="true" />
      </div>

      <h3 className="text-lg font-bold tracking-tight text-ink sm:text-xl">
        {children}
      </h3>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="relative mt-16 w-full overflow-hidden border-t border-primary-tint bg-gradient-to-b from-white via-cream to-primary-tint text-ink sm:mt-20">
      {/* Decorative background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-10 h-64 w-64 rounded-full bg-primary-tint opacity-60 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-primary opacity-10 blur-3xl"
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.12 }}
        className="relative mx-auto max-w-7xl px-5 pb-12 pt-14 sm:px-8 sm:pb-14 sm:pt-16 lg:px-10 lg:pt-20"
      >
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 sm:gap-x-10 lg:grid-cols-[1.35fr_1fr_1fr_1fr] lg:gap-12">
          {/* Brand */}
          <motion.div variants={itemVariants} className="max-w-md">
            <Link
              href="/"
              aria-label="Pet Mate Home"
              className="group mb-5 inline-flex items-center gap-3"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-strong text-3xl text-white shadow-lg shadow-primary/20 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105">
                <FaPaw aria-hidden="true" />
              </span>

              <span className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
                Pet <span className="text-primary-strong">Mate</span>
              </span>
            </Link>

            <p className="mb-5 text-lg font-medium leading-8 text-primary-deep">
              Better care. Happier pets.
              <br />A healthier tomorrow.
            </p>

            <p className="max-w-sm text-sm leading-7 text-ink-muted sm:text-base">
              At Pet Mate, we believe every pet deserves love, care, and the
              best support. Our platform connects pet owners with trusted vets,
              helpful resources, and smart tools — all in one place.
            </p>

            {/* Pet care features */}
            <div className="mt-8 grid grid-cols-4 gap-3">
              {features.map(({ icon: Icon, label }) => (
                <motion.div
                  key={label}
                  whileHover={{ y: -5, scale: 1.04 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col items-center gap-3 text-center"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-primary-tint bg-white text-lg text-primary-strong shadow-sm sm:h-14 sm:w-14 sm:text-xl">
                    <Icon aria-hidden="true" />
                  </div>

                  <span className="text-xs font-medium leading-5 text-ink-muted sm:text-sm">
                    {label}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <SectionTitle icon={FaArrowRight}>Quick Links</SectionTitle>

            <ul className="space-y-4">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-3 text-sm text-ink-muted transition-colors duration-200 hover:text-primary-strong sm:text-base"
                  >
                    <FaArrowRight
                      aria-hidden="true"
                      className="shrink-0 text-xs text-primary transition-transform duration-200 group-hover:translate-x-1"
                    />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Support */}
          <motion.div variants={itemVariants}>
            <SectionTitle icon={FaHeadset}>Support</SectionTitle>

            <ul className="space-y-4">
              {supportLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-3 text-sm text-ink-muted transition-colors duration-200 hover:text-primary-strong sm:text-base"
                  >
                    <FaArrowRight
                      aria-hidden="true"
                      className="shrink-0 text-xs text-primary transition-transform duration-200 group-hover:translate-x-1"
                    />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>

            {/* Contact card */}
            <motion.div
              whileHover={{ y: -4 }}
              className="mt-8 rounded-card border border-primary-tint bg-white/80 p-5 shadow-sm transition-shadow duration-300 hover:shadow-card"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-tint text-lg text-primary-strong">
                  <FaCommentDots aria-hidden="true" />
                </div>

                <div>
                  <h4 className="font-bold text-ink">Need help?</h4>

                  <p className="mt-2 text-sm leading-6 text-ink-muted">
                    Our support team is here to help you.
                  </p>

                  <Link
                    href="/contact-us"
                    className="group mt-3 inline-flex items-center gap-2 text-sm font-semibold text-primary-strong transition-colors hover:text-primary-deep"
                  >
                    Get in touch
                    <FaArrowRight
                      aria-hidden="true"
                      className="text-xs transition-transform duration-200 group-hover:translate-x-1"
                    />
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Social Media */}
          <motion.div variants={itemVariants}>
            <SectionTitle icon={FaUsers}>Follow Us</SectionTitle>

            <p className="mb-6 max-w-xs text-sm leading-7 text-ink-muted sm:text-base">
              Stay connected for pet care tips, updates, and more!
            </p>

            <div className="flex items-center gap-3">
              {socialLinks.map(({ label, href, icon: Icon }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  whileHover={{ y: -5, scale: 1.08 }}
                  whileTap={{ scale: 0.94 }}
                  className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-strong text-lg text-white shadow-md shadow-primary/15 transition-shadow duration-300 hover:shadow-lg hover:shadow-primary/30 sm:h-14 sm:w-14 sm:text-xl"
                >
                  <Icon aria-hidden="true" />
                </motion.a>
              ))}
            </div>

            {/* Friendly closing message */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="mt-9 rounded-feature border border-primary-tint bg-gradient-to-br from-primary-tint to-white p-6"
            >
              <div className="mb-3 flex items-center gap-2 text-2xl text-primary-strong">
                <FaPaw aria-hidden="true" />
                <FaHeart aria-hidden="true" className="text-lg" />
              </div>

              <p className="text-lg font-bold leading-7 text-ink">
                Every pet deserves a little more love.
              </p>

              <p className="mt-2 text-sm leading-6 text-ink-muted">
                We’re here to make caring for your best friend easier.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Bottom bar */}
      <div className="relative border-t border-primary-tint bg-primary-tint/70">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-6 sm:px-8 md:flex-row lg:px-10">
          <p className="text-center text-xs text-ink-muted sm:text-sm">
            © {new Date().getFullYear()} Pet Mate. All rights reserved.
          </p>

          <div className="flex items-center gap-2 text-sm font-medium text-primary-deep">
            <FaPaw className="text-primary-strong" aria-hidden="true" />
            <span>Health</span>
            <span className="mx-1 text-primary">•</span>
            <span>Love</span>
            <span className="mx-1 text-primary">•</span>
            <span>Together</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
