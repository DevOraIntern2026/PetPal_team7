"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  LoaderCircle,
  PawPrint,
  RefreshCw,
  Stethoscope,
} from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { useMyAppointments } from "@/hooks/useAppointments";

function formatDateTime(value) {
  if (!value) return "Not specified";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function getDoctorName(appointment) {
  return (
    appointment?.doctor?.name ??
    appointment?.doctor?.fullName ??
    appointment?.doctorName ??
    "Veterinarian"
  );
}

function getAppointmentDate(appointment) {
  return (
    appointment?.startUtc ??
    appointment?.appointmentDate ??
    appointment?.date ??
    appointment?.startTime ??
    null
  );
}

function getStatus(appointment) {
  return appointment?.status ?? appointment?.appointmentStatus ?? "Pending";
}

function statusClasses(status) {
  const normalized = String(status).toLowerCase();

  if (normalized.includes("confirm") || normalized.includes("approved")) {
    return "bg-emerald-50 text-emerald-700";
  }

  if (normalized.includes("cancel") || normalized.includes("reject")) {
    return "bg-red-50 text-red-700";
  }

  if (normalized.includes("complete") || normalized.includes("finish")) {
    return "bg-blue-50 text-blue-700";
  }

  return "bg-amber-50 text-amber-700";
}

export default function MyAppointmentsPage() {
  const router = useRouter();
  const { isAuthenticated, ready } = useAuth();

  const { appointments, loading, error, refresh } = useMyAppointments();

  useEffect(() => {
    if (ready && !isAuthenticated) {
      router.replace(`/login?next=${encodeURIComponent("/my-appointments")}`);
    }
  }, [ready, isAuthenticated, router]);

  if (!ready || !isAuthenticated) {
    return (
      <main className="grid min-h-[60vh] place-items-center bg-cream px-5">
        <div className="text-center">
          <LoaderCircle
            size={34}
            className="mx-auto animate-spin text-primary-strong"
          />
          <p className="mt-4 text-sm text-ink-muted">
            Preparing your appointments...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-cream text-ink">
      <section className="relative overflow-hidden bg-primary-deep">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,rgba(43,159,192,0.35),transparent_40%)]" />

        <div className="relative mx-auto max-w-content px-5 py-12 sm:px-8 sm:py-16">
          <Link
            href="/"
            className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-white/80 transition hover:text-white"
          >
            <ArrowLeft size={17} />
            Back to home
          </Link>

          <div className="flex items-start gap-4">
            <div className="hidden size-14 shrink-0 place-items-center rounded-2xl bg-white/10 text-white sm:grid">
              <CalendarDays size={28} />
            </div>

            <div>
              <span className="text-sm font-semibold uppercase tracking-[0.16em] text-[#b9edf7]">
                Your pet's care
              </span>

              <h1 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-5xl">
                My appointments
              </h1>

              <p className="mt-4 max-w-xl leading-7 text-white/75">
                Keep track of your veterinary visits and appointment details in
                one place.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-content px-5 py-10 sm:px-8 sm:py-14">
        <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Your bookings</h2>
            <p className="mt-2 text-sm text-ink-muted">
              View the appointments associated with your account.
            </p>
          </div>

          <button
            type="button"
            onClick={() => refresh()}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-full border border-primary-strong/20 bg-white px-4 py-2.5 text-sm font-semibold text-primary-strong transition hover:bg-primary-tint disabled:opacity-50"
          >
            {loading ? (
              <LoaderCircle size={17} className="animate-spin" />
            ) : (
              <RefreshCw size={17} />
            )}
            Refresh
          </button>
        </div>

        {loading && appointments.length === 0 && (
          <div
            role="status"
            className="rounded-3xl border border-primary-strong/10 bg-white px-5 py-16 text-center shadow-card"
          >
            <LoaderCircle
              size={34}
              className="mx-auto animate-spin text-primary-strong"
            />
            <p className="mt-4 font-semibold">Loading your appointments...</p>
            <p className="mt-2 text-sm text-ink-muted">
              Please wait while we retrieve your bookings.
            </p>
          </div>
        )}

        {!loading && error && appointments.length === 0 && (
          <div
            role="alert"
            className="rounded-3xl border border-red-200 bg-white px-5 py-12 text-center shadow-card"
          >
            <CalendarDays size={34} className="mx-auto text-red-500" />
            <h3 className="mt-4 text-xl font-bold">
              Couldn't load your appointments
            </h3>
            <p className="mt-2 text-sm leading-6 text-ink-muted">
              {typeof error === "string"
                ? error
                : error.message || "Please try again."}
            </p>
            <button
              type="button"
              onClick={() => refresh()}
              className="mt-5 rounded-full bg-primary-strong px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-deep"
            >
              Try again
            </button>
          </div>
        )}

        {!loading && !error && appointments.length === 0 && (
          <div className="rounded-3xl border border-dashed border-primary-strong/30 bg-white px-5 py-16 text-center">
            <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-primary-tint text-primary-strong">
              <PawPrint size={30} />
            </div>

            <h3 className="mt-5 text-xl font-bold">No appointments yet</h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-ink-muted">
              You haven't booked a veterinary visit yet. Explore our
              veterinarians to find the right care for your pet.
            </p>

            <Link
              href="/vets"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary-strong px-6 py-3 font-semibold text-white transition hover:bg-primary-deep"
            >
              <Stethoscope size={18} />
              Find a veterinarian
            </Link>
          </div>
        )}

        {appointments.length > 0 && (
          <div className="grid gap-5 lg:grid-cols-2">
            {appointments.map((appointment, index) => {
              const appointmentId =
                appointment.id ??
                appointment.appointmentId ??
                appointmentIdFallback(appointment, index);

              const doctorName = getDoctorName(appointment);
              const appointmentDate = getAppointmentDate(appointment);
              const status = getStatus(appointment);

              return (
                <article
                  key={appointmentId}
                  className="rounded-3xl border border-primary-strong/10 bg-white p-5 shadow-card transition hover:shadow-lg sm:p-6"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-primary-tint text-primary-strong">
                        <Stethoscope size={23} />
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate text-lg font-bold">
                          {doctorName}
                        </h3>
                        <p className="mt-1 text-sm text-ink-muted">
                          {appointment.doctor?.specialty?.name ??
                            appointment.doctor?.specialty ??
                            appointment.specialty ??
                            "Veterinary appointment"}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${statusClasses(status)}`}
                    >
                      {status}
                    </span>
                  </div>

                  <div className="my-5 border-t border-slate-100" />

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <CalendarDays
                        size={18}
                        className="mt-0.5 shrink-0 text-primary-strong"
                      />
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                          Appointment date
                        </p>
                        <p className="mt-1 text-sm font-medium">
                          {formatDateTime(appointmentDate)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Clock3
                        size={18}
                        className="mt-0.5 shrink-0 text-primary-strong"
                      />
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                          Booking reference
                        </p>
                        <p className="mt-1 break-all text-sm font-medium">
                          {appointment.id ??
                            appointment.appointmentId ??
                            "Not provided"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {appointment.notes && (
                    <div className="mt-5 rounded-xl bg-primary-tint/50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                        Notes
                      </p>
                      <p className="mt-2 whitespace-pre-wrap text-sm leading-6">
                        {appointment.notes}
                      </p>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}

        <div className="mt-10 rounded-3xl bg-primary-tint p-6 sm:flex sm:items-center sm:justify-between sm:gap-5 sm:p-8">
          <div>
            <h3 className="text-xl font-bold">Need another visit?</h3>
            <p className="mt-2 text-sm leading-6 text-ink-muted">
              Choose a veterinarian and find a suitable appointment time.
            </p>
          </div>

          <Link
            href="/vets"
            className="mt-5 inline-flex shrink-0 items-center gap-2 font-semibold text-primary-deep hover:underline sm:mt-0"
          >
            Browse veterinarians
            <ArrowLeft size={17} className="rotate-180" />
          </Link>
        </div>
      </section>
    </main>
  );
}

function appointmentIdFallback(appointment, index) {
  return `${appointment.startUtc ?? appointment.date ?? "appointment"}-${index}`;
}
