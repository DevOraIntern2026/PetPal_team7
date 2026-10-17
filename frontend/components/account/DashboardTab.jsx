"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  CalendarClock,
  CalendarPlus,
  Heart,
  PackageCheck,
  PawPrint,
  ShoppingBag,
  Stethoscope,
  Sparkles,
  CheckCircle2,
  Plus,
  ArrowRight,
} from "lucide-react";
import { FaCat, FaDog } from "react-icons/fa";
import { useDashboard } from "../../hooks/useDashboard";
import Panel from "../dashboard/Panel";
import StatStrip from "../dashboard/StatStrip";

/* ---------- helpers ---------- */

const money = new Intl.NumberFormat("en-EG", {
  style: "currency",
  currency: "EGP",
  maximumFractionDigits: 0,
});

const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
};

const fmtDate = (d, opts) => new Date(d).toLocaleDateString("en-GB", opts);
const fmtTime = (d) =>
  new Date(d).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

function countdown(startUtc) {
  const mins = Math.round((new Date(startUtc) - Date.now()) / 60000);
  if (mins < 60) return `in ${Math.max(mins, 1)} min`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `in ${hrs} hr`;
  const days = Math.round(hrs / 24);
  return days === 1 ? "tomorrow" : `in ${days} days`;
}

const ORDER_TONE = {
  delivered: "bg-emerald-50 text-emerald-700",
  completed: "bg-emerald-50 text-emerald-700",
  shipped: "bg-primary-tint text-primary-strong",
  intransit: "bg-primary-tint text-primary-strong",
  processing: "bg-accent/10 text-accent-strong",
  pending: "bg-amber-50 text-amber-700",
  cancelled: "bg-rose-50 text-danger",
};
const orderTone = (s = "") =>
  ORDER_TONE[s.toLowerCase().replace(/[\s_-]/g, "")] ??
  "bg-primary-tint text-primary-strong";

const isOpenOrder = (s = "") =>
  !["delivered", "completed", "cancelled"].includes(s.toLowerCase());

function PetAvatar({ pet }) {
  const type = pet.petTypeName?.toLowerCase();
  const Icon = type === "cat" ? FaCat : type === "dog" ? FaDog : PawPrint;
  if (pet.profileImageUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={pet.profileImageUrl}
        alt={pet.name}
        className="size-14 shrink-0 rounded-full object-cover ring-2 ring-white"
      />
    );
  }
  return (
    <span
      className={`grid size-14 shrink-0 place-items-center rounded-full ring-2 ring-white ${
        type === "cat"
          ? "bg-accent/10 text-accent-strong"
          : "bg-primary-tint text-primary-strong"
      }`}>
      <Icon size={24} aria-hidden="true" />
    </span>
  );
}

/* ---------- main ---------- */

export default function DashboardTab({ profile, user, onSelectTab }) {
  const { pets, appointments, orders, adoptions, reload } = useDashboard();

  const firstName = (
    profile?.fullName ||
    profile?.name ||
    user?.name ||
    "there"
  ).split(" ")[0];

  const upcoming = useMemo(
    () =>
      appointments.data
        .filter(
          (a) =>
            new Date(a.startUtc) >= new Date() &&
            !["cancelled", "completed"].includes(a.status?.toLowerCase()),
        )
        .sort((a, b) => new Date(a.startUtc) - new Date(b.startUtc)),
    [appointments.data],
  );

  const latestOrders = useMemo(
    () =>
      [...orders.data]
        .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
        .slice(0, 3),
    [orders.data],
  );

  const openOrders = orders.data.filter((o) => isOpenOrder(o.status));

  // Derived from data you already load, so it needs no extra endpoint
  const attention = useMemo(() => {
    const items = [];
    const next = upcoming[0];
    if (next && new Date(next.startUtc) - Date.now() < 48 * 3600 * 1000) {
      items.push({
        id: "appt",
        icon: CalendarClock,
        title: `Visit with ${next.doctorName} ${countdown(next.startUtc)}`,
        sub: `${fmtTime(next.localStart)}. Add any symptoms to your notes.`,
        tab: "appointments",
      });
    }
    openOrders.forEach((o) =>
      items.push({
        id: `order-${o.id}`,
        icon: PackageCheck,
        title: `Order is ${o.status.toLowerCase()}`,
        sub: `${o.items?.[0]?.productName ?? "Your order"}, ${money.format(o.totalAmount)}`,
        tab: "orders",
      }),
    );
    pets.data
      .filter((p) => !p.profileImageUrl)
      .forEach((p) =>
        items.push({
          id: `photo-${p.id}`,
          icon: PawPrint,
          title: `Add a photo for ${p.name}`,
          sub: "Pets with photos are easier to spot in your list.",
          tab: "pets",
        }),
      );
    pets.data
      .filter((p) => !p.bloodType)
      .forEach((p) =>
        items.push({
          id: `blood-${p.id}`,
          icon: Stethoscope,
          title: `Add ${p.name}'s blood type`,
          sub: "Useful for your vet in an emergency.",
          tab: "pets",
        }),
      );
    return items.slice(0, 4);
  }, [upcoming, openOrders, pets.data]);

  const stats = [
    {
      key: "pets",
      label: "Pets",
      value: pets.data.length,
      icon: PawPrint,
      tone: "accent",
      status: pets.status,
      onClick: () => onSelectTab("pets"),
    },
    {
      key: "appointments",
      label: "Upcoming visits",
      value: upcoming.length,
      hint: upcoming[0] ? `Next ${countdown(upcoming[0].startUtc)}` : null,
      icon: CalendarClock,
      tone: "primary",
      status: appointments.status,
      onClick: () => onSelectTab("appointments"),
    },
    {
      key: "orders",
      label: "Orders",
      value: orders.data.length,
      hint: openOrders.length ? `${openOrders.length} in progress` : null,
      icon: ShoppingBag,
      tone: "green",
      status: orders.status,
      onClick: () => onSelectTab("orders"),
    },
    {
      key: "adoptions",
      label: "Adoption listings",
      value: adoptions.data.length,
      icon: Heart,
      tone: "rose",
      status: adoptions.status,
      onClick: () => (window.location.href = "/adoption"),
    },
  ];

  const actions = [
    { label: "Book a vet", icon: CalendarPlus, href: "/vets" },
    { label: "Shop supplies", icon: ShoppingBag, href: "/store" },
    { label: "Adopt a pet", icon: Heart, href: "/adoption" },
  ];

  return (
    <div className="mx-auto w-full max-w-content space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-title font-bold text-ink">
            {greeting()}, {firstName}
          </h1>
          <p className="mt-1 text-ink-muted">
            {fmtDate(new Date(), {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {actions.map(({ label, icon: Icon, href }) => (
            <Link
              key={label}
              href={href}
              className="focus-ring inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-primary-strong shadow-card ring-1 ring-primary/15 transition hover:bg-primary-tint">
              <Icon size={16} aria-hidden="true" />
              {label}
            </Link>
          ))}
        </div>
      </div>

      <StatStrip items={stats} />

      {/* Appointments and attention */}
      <div className="grid gap-6 lg:grid-cols-5">
        <Panel
          className="lg:col-span-3"
          title="Upcoming appointments"
          icon={CalendarClock}
          status={appointments.status}
          isEmpty={upcoming.length === 0}
          onRetry={reload}
          onAction={() => onSelectTab("appointments")}
          empty={
            <>
              <p className="text-ink-muted">No visits booked yet.</p>
              <Link href="/vets" className="btn-primary !w-auto">
                Book a vet
              </Link>
            </>
          }>
          <ul className="space-y-3">
            {upcoming.slice(0, 3).map((a, i) => (
              <li
                key={a.id}
                className={`flex items-center gap-4 rounded-media p-4 ${
                  i === 0
                    ? "bg-primary-deep text-white"
                    : "bg-primary-tint/50 text-ink"
                }`}>
                <div
                  className={`grid w-16 shrink-0 place-items-center rounded-xl py-2 text-center ${
                    i === 0 ? "bg-white/15" : "bg-white"
                  }`}>
                  <span className="text-2xl font-bold leading-none">
                    {fmtDate(a.localStart, { day: "numeric" })}
                  </span>
                  <span className="text-xs">
                    {fmtDate(a.localStart, { month: "short" })}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold">{a.doctorName}</p>
                  <p
                    className={`truncate text-sm ${
                      i === 0 ? "text-white/80" : "text-ink-muted"
                    }`}>
                    {a.specialty}, {fmtTime(a.localStart)}
                  </p>
                  {a.notes && (
                    <p
                      className={`mt-1 truncate text-xs ${
                        i === 0 ? "text-white/70" : "text-ink-muted"
                      }`}>
                      {a.notes}
                    </p>
                  )}
                </div>
                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                    i === 0
                      ? "bg-accent text-white"
                      : "bg-white text-primary-strong"
                  }`}>
                  {countdown(a.startUtc)}
                </span>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel
          className="lg:col-span-2"
          title="Needs your attention"
          icon={Sparkles}
          status={
            [pets, appointments, orders].some((s) => s.status === "loading")
              ? "loading"
              : "ready"
          }
          isEmpty={attention.length === 0}
          empty={
            <>
              <CheckCircle2
                size={28}
                className="text-emerald-600"
                aria-hidden="true"
              />
              <p className="text-ink-muted">You are all caught up.</p>
            </>
          }>
          <ul className="space-y-2">
            {attention.map(({ id, icon: Icon, title, sub, tab }) => (
              <li key={id}>
                <button
                  type="button"
                  onClick={() => onSelectTab(tab)}
                  className="focus-ring group flex w-full items-start gap-3 rounded-media p-3 text-left transition hover:bg-primary-tint/60">
                  <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent-strong">
                    <Icon size={18} aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-ink">
                      {title}
                    </span>
                    <span className="block text-xs text-ink-muted">{sub}</span>
                  </span>
                  <ArrowRight
                    size={14}
                    className="mt-1 shrink-0 text-ink-muted/50 group-hover:text-primary-strong"
                    aria-hidden="true"
                  />
                </button>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      {/* Pets and orders */}
      <div className="grid gap-6 lg:grid-cols-5">
        <Panel
          className="lg:col-span-2"
          title="My pets"
          icon={PawPrint}
          status={pets.status}
          isEmpty={pets.data.length === 0}
          onRetry={reload}
          onAction={() => onSelectTab("pets")}
          empty={
            <>
              <p className="text-ink-muted">
                Add your first pet to get started.
              </p>
              <button
                type="button"
                onClick={() => onSelectTab("pets")}
                className="btn-primary !w-auto gap-2">
                <Plus size={16} aria-hidden="true" /> Add a pet
              </button>
            </>
          }>
          <ul className="space-y-2">
            {pets.data.slice(0, 4).map((p) => (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => onSelectTab("pets")}
                  className="focus-ring flex w-full items-center gap-4 rounded-media p-2 text-left transition hover:bg-primary-tint/60">
                  <PetAvatar pet={p} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-bold text-ink">
                      {p.name}
                    </span>
                    <span className="block truncate text-sm text-ink-muted">
                      {p.breedName}, {p.gender}
                    </span>
                  </span>
                  <span className="shrink-0 rounded-full bg-primary-tint px-3 py-1 text-xs font-semibold text-primary-strong">
                    {p.ageInYears < 1 ? "Under 1 yr" : `${p.ageInYears} yr`}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel
          className="lg:col-span-3"
          title="Latest orders"
          icon={ShoppingBag}
          status={orders.status}
          isEmpty={latestOrders.length === 0}
          onRetry={reload}
          onAction={() => onSelectTab("orders")}
          empty={
            <>
              <p className="text-ink-muted">
                You have not ordered anything yet.
              </p>
              <Link href="/store" className="btn-primary !w-auto">
                Browse the store
              </Link>
            </>
          }>
          <ul className="divide-y divide-primary/10">
            {latestOrders.map((o) => {
              const first = o.items?.[0]?.productName ?? "Order";
              const extra = (o.items?.length ?? 1) - 1;
              return (
                <li key={o.id} className="flex items-center gap-4 py-3">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary-tint text-primary-strong">
                    <ShoppingBag size={18} aria-hidden="true" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-ink">
                      {first}
                      {extra > 0 && (
                        <span className="font-normal text-ink-muted">
                          {" "}
                          and {extra} more
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-ink-muted">
                      #{o.id.slice(0, 8).toUpperCase()},{" "}
                      {fmtDate(o.orderDate, {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-ink">
                      {money.format(o.totalAmount)}
                    </p>
                    <span
                      className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${orderTone(o.status)}`}>
                      {o.status}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
