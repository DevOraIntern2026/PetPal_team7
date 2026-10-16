"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  LoaderCircle,
  PawPrint,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";

import { useAuth } from "../../lib/auth/AuthContext";
import { useDoctor, useDoctors, useAvailability } from "../../hooks/useDoctors";
import { useBookAppointment } from "../../hooks/useAppointments";

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDateTime(value) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return String(value);

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function getDoctorName(doctor) {
  return (
    doctor?.name ?? doctor?.fullName ?? doctor?.doctorName ?? "Veterinarian"
  );
}

function getDoctorSpecialty(doctor) {
  return (
    doctor?.specialty?.name ??
    doctor?.specialty ??
    doctor?.specialtyName ??
    doctor?.specialization ??
    ""
  );
}

function getDoctorPrice(doctor) {
  return doctor?.price ?? doctor?.consultationFee ?? doctor?.fee ?? null;
}

function getErrorText(error, fallback) {
  if (typeof error === "string") return error;
  return error?.message ?? fallback;
}

export default function AppointmentPage() {
  const router = useRouter();
  const { user, isAuthenticated, ready, requireAuth } = useAuth();

  const [doctorId, setDoctorId] = useState("");
  const [date, setDate] = useState(() => formatDate(new Date()));
  const [selectedSlot, setSelectedSlot] = useState("");
  const [notes, setNotes] = useState("");
  const [formError, setFormError] = useState("");
  const [bookingResult, setBookingResult] = useState(null);

  const { doctors: allDoctors = [], loading: allDoctorsLoading } = useDoctors();

  const {
    doctor,
    loading: doctorLoading,
    error: doctorError,
  } = useDoctor(doctorId);

  const {
    slots,
    loading: slotsLoading,
    error: slotsError,
  } = useAvailability(doctorId, date);

  const { book, loading: booking } = useBookAppointment();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("vet");

    if (id) setDoctorId(id);
  }, []);

  useEffect(() => {
    if (ready && !isAuthenticated) {
      const next = window.location.pathname + window.location.search;
      requireAuth("vets", null, next);
    }
  }, [ready, isAuthenticated, requireAuth]);

  const minimumDate = useMemo(() => formatDate(new Date()), []);

  const maximumDate = useMemo(() => {
    const max = new Date();
    max.setDate(max.getDate() + 60);
    return formatDate(max);
  }, []);

  const availableSlots = useMemo(() => {
    if (!Array.isArray(slots)) return [];

    return slots
      .map((slot) => {
        if (typeof slot === "string") {
          return { startUtc: slot };
        }
        const timeVal =
          slot?.startUtc ||
          slot?.startTime ||
          slot?.dateTime ||
          slot?.date ||
          slot?.time;
        if (!timeVal) return null;
        return {
          ...slot,
          startUtc: timeVal,
        };
      })
      .filter((slot) => slot?.startUtc);
  }, [slots]);

  const activeDoctor =
    doctor ||
    allDoctors.find(
      (d) => String(d.id ?? d.doctorId ?? d._id) === String(doctorId),
    );

  const doctorName = getDoctorName(activeDoctor);
  const doctorSpecialty = getDoctorSpecialty(activeDoctor);
  const doctorPrice = getDoctorPrice(activeDoctor);

  function handleDateChange(event) {
    setDate(event.target.value);
    setSelectedSlot("");
    setFormError("");
    setBookingResult(null);
  }

  function handleDoctorChange(event) {
    setDoctorId(event.target.value);
    setSelectedSlot("");
    setBookingResult(null);
    setFormError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError("");

    if (!isAuthenticated) {
      const next = window.location.pathname + window.location.search;
      requireAuth("vets", null, next);
      return;
    }

    if (!doctorId) {
      setFormError("Please select a valid veterinarian.");
      return;
    }

    if (!selectedSlot) {
      setFormError("Please select an available appointment time.");
      return;
    }

    try {
      const numericId = Number(doctorId);
      const formattedDoctorId =
        !Number.isNaN(numericId) && String(numericId) === String(doctorId).trim()
          ? numericId
          : doctorId;

      const result = await book({
        doctorId: formattedDoctorId,
        startUtc: selectedSlot,
        appointmentDate: selectedSlot,
        dateTime: selectedSlot,
        notes: notes.trim(),
        description: notes.trim(),
      });

      setBookingResult(result?.data ?? result ?? {});
      setNotes("");
      setSelectedSlot("");
    } catch (error) {
      setFormError(
        getErrorText(
          error,
          "We couldn't complete your booking. Please try again.",
        ),
      );
    }
  }

  if (!ready) {
    return (
      <main className="grid min-h-[60vh] place-items-center bg-cream px-5">
        <div className="text-center">
          <LoaderCircle
            className="mx-auto animate-spin text-primary-strong"
            size={34}
          />
          <p className="mt-4 text-sm text-ink-muted">
            Preparing your appointment...
          </p>
        </div>
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="grid min-h-[60vh] place-items-center bg-cream px-5 py-12 text-ink">
        <section className="w-full max-w-md rounded-3xl border border-primary-strong/10 bg-white p-8 text-center shadow-card sm:p-10">
          <div className="mx-auto grid size-16 place-items-center rounded-full bg-primary-tint text-primary-strong">
            <Stethoscope size={32} />
          </div>

          <h1 className="mt-5 text-2xl font-bold">Sign in required</h1>

          <p className="mt-3 leading-7 text-ink-muted">
            You need to be signed in to your account before booking an appointment with a veterinarian.
          </p>

          <button
            type="button"
            onClick={() => {
              const next = window.location.pathname + window.location.search;
              requireAuth("vets", null, next);
            }}
            className="mt-6 w-full rounded-full bg-primary-strong px-6 py-3 font-semibold text-white transition hover:bg-primary-deep"
          >
            Sign in now
          </button>

          <button
            type="button"
            onClick={() => router.push("/vets")}
            className="mt-3 w-full rounded-full border border-primary-strong/20 px-6 py-3 font-semibold text-primary-strong transition hover:bg-primary-tint"
          >
            Back to veterinarians
          </button>
        </section>
      </main>
    );
  }

  if (bookingResult) {
    const bookingId =
      bookingResult.id ??
      bookingResult.appointmentId ??
      bookingResult.data?.id ??
      bookingResult.data?.appointmentId;

    return (
      <main className="grid min-h-[70vh] place-items-center bg-cream px-5 py-12 text-ink">
        <section className="w-full max-w-lg rounded-3xl border border-primary-strong/10 bg-white p-8 text-center shadow-card sm:p-10">
          <div className="mx-auto grid size-16 place-items-center rounded-full bg-emerald-50 text-emerald-600">
            <CheckCircle2 size={34} />
          </div>

          <h1 className="mt-5 text-2xl font-bold">
            Appointment request submitted!
          </h1>

          <p className="mt-3 leading-7 text-ink-muted">
            Your booking request was accepted by the server. You can check your
            appointment details in your account.
          </p>

          {bookingId != null && (
            <p className="mt-4 text-sm text-ink-muted">
              Booking reference: {bookingId}
            </p>
          )}

          <button
            type="button"
            onClick={() => router.push("/")}
            className="mt-7 w-full rounded-full bg-primary-strong px-6 py-3 font-semibold text-white transition hover:bg-primary-deep"
          >
            Back to home
          </button>

          <button
            type="button"
            onClick={() => router.push("/vets")}
            className="mt-3 w-full rounded-full border border-primary-strong/20 px-6 py-3 font-semibold text-primary-strong transition hover:bg-primary-tint"
          >
            Explore veterinarians
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-cream text-ink">
      {/* Hero */}
      <section className="relative overflow-hidden bg-primary-deep">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,rgba(43,159,192,0.35),transparent_40%)]" />

        <div className="relative mx-auto max-w-content px-5 py-12 sm:px-8 sm:py-16">
          <button
            type="button"
            onClick={() => router.push("/vets")}
            className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-white/80 transition hover:text-white"
          >
            <ArrowLeft size={17} />
            Back to veterinarians
          </button>

          <div className="flex items-start gap-4">
            <div className="hidden size-14 shrink-0 place-items-center rounded-2xl bg-white/10 text-white sm:grid">
              <CalendarDays size={28} />
            </div>

            <div>
              <span className="text-sm font-semibold uppercase tracking-[0.16em] text-[#b9edf7]">
                Personalized pet care
              </span>

              <h1 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-5xl">
                Book an appointment
              </h1>

              <p className="mt-4 max-w-xl leading-7 text-white/75">
                Choose your veterinarian, find a suitable time, and arrange the
                care your pet deserves.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Booking form */}
      <section className="mx-auto max-w-content px-5 py-10 sm:px-8 sm:py-14">
        <div className="grid items-start gap-7 lg:grid-cols-[minmax(0,1fr)_350px]">
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-primary-strong/10 bg-white p-5 shadow-card sm:p-8"
          >
            <div className="mb-7">
              <h2 className="text-2xl font-bold">Appointment details</h2>
              <p className="mt-2 text-sm leading-6 text-ink-muted">
                Complete the information below to request your visit.
              </p>
            </div>

            {/* Doctor selection */}
            <label className="block text-sm font-semibold">
              Veterinarian
              <select
                value={doctorId}
                onChange={handleDoctorChange}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-normal outline-none transition focus:border-primary-strong focus:ring-4 focus:ring-primary/10"
                required
              >
                <option value="">Choose a veterinarian</option>

                {allDoctors.map((doc) => {
                  const id = doc.id ?? doc.doctorId ?? doc._id;
                  const name = getDoctorName(doc);
                  const spec = getDoctorSpecialty(doc);
                  return (
                    <option key={id} value={id}>
                      {name}
                      {spec ? ` — ${spec}` : ""}
                    </option>
                  );
                })}

                {doctorId &&
                  doctor &&
                  !allDoctors.some(
                    (d) =>
                      String(d.id ?? d.doctorId ?? d._id) === String(doctorId),
                  ) && (
                    <option value={doctor.id ?? doctor.doctorId ?? doctorId}>
                      {doctorName}
                      {doctorSpecialty ? ` — ${doctorSpecialty}` : ""}
                    </option>
                  )}
              </select>
            </label>

            {!doctorId && (
              <p className="mt-2 text-sm text-ink-muted">
                Choose a doctor from the{" "}
                <button
                  type="button"
                  onClick={() => router.push("/vets")}
                  className="font-semibold text-primary-strong hover:underline"
                >
                  veterinarians page
                </button>
                .
              </p>
            )}

            {doctorLoading && doctorId && !activeDoctor && (
              <p className="mt-3 flex items-center gap-2 text-sm text-ink-muted">
                <LoaderCircle size={16} className="animate-spin" />
                Loading veterinarian details...
              </p>
            )}

            {doctorError && doctorId && !activeDoctor && (
              <div className="mt-4 rounded-xl bg-red-50 p-4 text-sm text-danger">
                <p>
                  {getErrorText(
                    doctorError,
                    "Failed to load veterinarian details.",
                  )}
                </p>
                <p className="mt-2 text-xs">
                  Please check the doctor ID and try again.
                </p>
              </div>
            )}

            <div className="mt-6">
              <label className="block text-sm font-semibold">
                Appointment date
                <input
                  type="date"
                  value={date}
                  min={minimumDate}
                  max={maximumDate}
                  onChange={handleDateChange}
                  required
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-normal outline-none transition focus:border-primary-strong focus:ring-4 focus:ring-primary/10"
                />
              </label>

              <p className="mt-2 text-xs leading-5 text-ink-muted">
                Available dates are limited to the next 60 days.
              </p>
            </div>

            {/* Available time slots */}
            <div className="mt-7">
              <div className="flex items-center justify-between gap-3">
                <h3 className="flex items-center gap-2 font-semibold">
                  <Clock3 size={18} className="text-primary-strong" />
                  Available time slots
                </h3>
              </div>

              {!doctorId ? (
                <p className="mt-4 rounded-xl bg-primary-tint/60 p-4 text-sm text-ink-muted">
                  Select a veterinarian first to see available times.
                </p>
              ) : slotsLoading ? (
                <div className="mt-4 flex items-center gap-3 rounded-xl bg-primary-tint/50 p-5 text-sm text-ink-muted">
                  <LoaderCircle
                    size={20}
                    className="animate-spin text-primary-strong"
                  />
                  Loading available times...
                </div>
              ) : slotsError ? (
                <div className="mt-4 rounded-xl bg-red-50 p-4 text-sm text-danger">
                  <p>
                    {getErrorText(
                      slotsError,
                      "Failed to load available times.",
                    )}
                  </p>
                </div>
              ) : availableSlots.length === 0 ? (
                <div className="mt-4 rounded-xl border border-dashed border-primary-strong/20 px-4 py-8 text-center">
                  <CalendarDays
                    size={28}
                    className="mx-auto text-primary-strong"
                  />
                  <p className="mt-3 font-semibold">
                    No available appointments
                  </p>
                  <p className="mt-2 text-sm text-ink-muted">
                    Choose another date to check for available times.
                  </p>
                </div>
              ) : (
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {availableSlots.map((slot) => {
                    const selected = selectedSlot === slot.startUtc;

                    return (
                      <button
                        key={slot.startUtc}
                        type="button"
                        onClick={() => {
                          setSelectedSlot(slot.startUtc);
                          setFormError("");
                        }}
                        aria-pressed={selected}
                        className={`rounded-xl border px-3 py-3 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-deep ${
                          selected
                            ? "border-primary-strong bg-primary-strong text-white shadow-sm"
                            : "border-primary-strong/15 bg-white text-ink hover:border-primary-strong hover:bg-primary-tint"
                        }`}
                      >
                        {formatDateTime(slot.startUtc)}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Notes */}
            <label className="mt-7 block text-sm font-semibold">
              Notes for the veterinarian
              <span className="ml-2 font-normal text-ink-muted">
                (Optional)
              </span>
              <textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                rows={4}
                maxLength={1000}
                placeholder="Describe your pet's symptoms or any special concerns..."
                className="mt-2 w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 font-normal leading-6 outline-none transition placeholder:text-slate-400 focus:border-primary-strong focus:ring-4 focus:ring-primary/10"
              />
            </label>

            {formError && (
              <p
                role="alert"
                className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-danger"
              >
                {formError}
              </p>
            )}

            <button
              type="submit"
              disabled={
                booking ||
                !doctorId ||
                !selectedSlot ||
                slotsLoading
              }
              className="mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-primary-strong px-6 py-4 font-semibold text-white transition hover:bg-primary-deep disabled:cursor-not-allowed disabled:opacity-50"
            >
              {booking ? (
                <>
                  <LoaderCircle size={19} className="animate-spin" />
                  Submitting request...
                </>
              ) : (
                <>
                  Confirm appointment
                  <CalendarDays size={19} />
                </>
              )}
            </button>

            <p className="mt-4 text-center text-xs leading-5 text-ink-muted">
              Your request will be sent securely to PetPal.
            </p>
          </form>

          {/* Appointment summary */}
          <aside className="space-y-5 lg:sticky lg:top-24">
            <div className="overflow-hidden rounded-3xl border border-primary-strong/10 bg-white shadow-card">
              <div className="bg-primary-tint p-6">
                <div className="flex items-center gap-3">
                  <div className="grid size-12 place-items-center rounded-2xl bg-white text-primary-strong">
                    <Stethoscope size={25} />
                  </div>

                  <div>
                    <h2 className="font-bold">Your appointment</h2>
                    <p className="mt-1 text-sm text-ink-muted">
                      Booking summary
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-5 p-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                    Veterinarian
                  </p>

                  <p className="mt-2 font-semibold">
                    {doctorLoading && !activeDoctor
                      ? "Loading doctor..."
                      : activeDoctor
                        ? doctorName
                        : "Not selected"}
                  </p>

                  {doctorSpecialty && (
                    <p className="mt-1 text-sm text-ink-muted">
                      {doctorSpecialty}
                    </p>
                  )}
                </div>

                <div className="border-t border-slate-100" />

                <div>
                  <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">
                    <CalendarDays size={15} />
                    Date
                  </p>

                  <p className="mt-2 font-semibold">
                    {formatDateTime(`${date}T12:00:00`)}
                  </p>
                </div>

                <div>
                  <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">
                    <Clock3 size={15} />
                    Selected time
                  </p>

                  <p className="mt-2 font-semibold">
                    {selectedSlot
                      ? formatDateTime(selectedSlot)
                      : "Choose a time slot"}
                  </p>
                </div>

                <div className="border-t border-slate-100" />

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                    Consultation fee
                  </p>

                  <p className="mt-2 text-2xl font-bold text-primary-strong">
                    {doctorPrice != null ? `EGP ${doctorPrice}` : "—"}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-primary-strong/10 bg-white p-5">
              <div className="flex items-start gap-3">
                <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary-tint text-primary-strong">
                  <ShieldCheck size={21} />
                </div>

                <div>
                  <h3 className="font-semibold">Trusted pet care</h3>
                  <p className="mt-2 text-sm leading-6 text-ink-muted">
                    Review your selected doctor and appointment time before
                    submitting your request.
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-start gap-3">
                <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary-tint text-primary-strong">
                  <PawPrint size={21} />
                </div>

                <div>
                  <h3 className="font-semibold">Every pet matters</h3>
                  <p className="mt-2 text-sm leading-6 text-ink-muted">
                    Add useful details about your pet to help the veterinarian
                    prepare for the visit.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
