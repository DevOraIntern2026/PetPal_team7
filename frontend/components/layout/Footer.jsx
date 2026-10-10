import Link from "next/link";

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

export default function Footer() {
  return (
    <footer className="w-full bg-white px-4 pt-8 text-[#171717] sm:px-6">
      <div className="mx-auto max-w-6xl">
        {/* Logo */}
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1 text-lg font-bold text-[#28afc5]"
        >
          <span className="text-2xl" aria-hidden="true">
            ♡
          </span>
          <span>Pet Mate</span>
        </Link>

        {/* Footer Content */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 px-2 pb-7 sm:grid-cols-3 sm:gap-8 sm:px-8">
          {/* Quick Links */}
          <div className="col-span-2 sm:col-span-1">
            <h3 className="mb-4 text-xs font-bold">Quick Links</h3>

            <div className="grid grid-cols-2 gap-x-5 gap-y-3">
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[11px] transition-colors hover:text-[#28afc5]"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Support */}
          <div>
            <h3 className="mb-4 text-xs font-bold">Support</h3>

            <div className="flex flex-col items-start gap-3">
              {supportLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[11px] transition-colors hover:text-[#28afc5]"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Social Media */}
          <div className="col-span-2 sm:col-span-1 sm:justify-self-end">
            <h3 className="mb-3 text-xs font-bold sm:text-center">Follow Us</h3>

            <div className="flex items-center gap-2 sm:justify-center">
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="flex h-6 w-6 items-center justify-center rounded-full bg-[#28afc5] text-sm font-bold text-white transition-transform hover:-translate-y-1"
              >
                ◎
              </a>

              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="flex h-6 w-6 items-center justify-center rounded-full bg-[#28afc5] text-sm font-bold text-white transition-transform hover:-translate-y-1"
              >
                f
              </a>

              <a
                href="https://www.tiktok.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="TikTok"
                className="flex h-6 w-6 items-center justify-center rounded-full bg-[#28afc5] text-sm font-bold text-white transition-transform hover:-translate-y-1"
              >
                ♪
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-[#ccecf1] py-4">
          <p className="text-[10px] text-[#888888]">
            © 2026 Pet Mate. All rights reserved.{" "}
          </p>
        </div>
      </div>
    </footer>
  );
}
