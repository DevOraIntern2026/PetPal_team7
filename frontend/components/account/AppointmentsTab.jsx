"use client";

import { useState } from "react";
import { Calendar, Clock, User, X, RefreshCw } from "lucide-react";
import { useMyAppointments, useCancelAppointment } from "../../hooks/useAppointments";

function formatDate(dateStr) {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function formatTime(timeStr) {
  if (!timeStr) return "";
  try {
    const [h, m] = timeStr.split(":");
    const date = new Date();
    date.setHours(+h, +m);
    return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  } catch {
    return timeStr;
  }
}

function statusColor(status) {
  const s = (status || "").toLowerCase();
  if (s === "confirmed" || s === "booked") return "bg-emerald-100 text-emerald-700";
  if (s === "pending") return "bg-amber-100 text-amber-700";
  if (s === "cancelled" || s === "canceled") return "bg-red-100 text-red-600";
  if (s === "completed") return "bg-blue-100 text-blue-700";
  return "bg-gray-100 text-gray-600";
}

export default function AppointmentsTab() {
  const { appointments, loading, error, refresh } = useMyAppointments();
  const { cancel, loading: cancelling } = useCancelAppointment();
  const [cancelingId, setCancelingId] = useState(null);

  async function handleCancel(id) {
    if (!window.confirm("Cancel this appointment?")) return;
    setCancelingId(id);
    try {
      await cancel(id);
      refresh();
    } catch {
      // error already in hook
    } finally {
      setCancelingId(null);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-ink/40">
        <RefreshCw size={32} className="animate-spin mb-3" />
        <p className="text-sm font-medium">Loading appointments…</p>
      </div>
    );
  }

  if (error && !appointments.length) {
    return (
      <div className="rounded-2xl bg-red-50 border border-red-100 px-6 py-8 text-center text-sm text-red-600">
        {error}
      </div>
    );
  }

  if (!appointments.length) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-ink/40">
        <Calendar size={48} className="mb-4 text-primary/30" />
        <p className="text-lg font-bold text-ink/50">No appointments yet</p>
        <p className="mt-1 text-sm">Book a vet visit to see it here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black text-ink">My Appointments</h2>
        <button
          type="button"
          onClick={() => refresh()}
          className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-primary-strong hover:bg-primary-tint transition"
        >
          <RefreshCw size={13} />
          Refresh
        </button>
      </div>

      <div className="grid gap-4">
        {appointments.map((appt) => {
          const id = appt.id ?? appt.appointmentId;
          const doctorName =
            appt.doctorName ??
            appt.doctor?.name ??
            appt.doctor?.fullName ??
            "Unknown Doctor";
          const specialty =
            appt.specialty ??
            appt.doctor?.specialty ??
            appt.specialization ??
            "";
          const date = appt.date ?? appt.appointmentDate ?? appt.scheduledAt;
          const time = appt.time ?? appt.appointmentTime;
          const status = appt.status ?? "Booked";
          const isCanceling = cancelingId === id;

          return (
            <div
              key={id}
              className="flex flex-col gap-4 rounded-2xl border border-primary/10 bg-white p-5 shadow-sm sm:flex-row sm:items-start"
            >
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary-tint text-primary-strong">
                <User size={22} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-extrabold text-ink">{doctorName}</h3>
                  {specialty && (
                    <span className="rounded-full bg-primary-tint px-2.5 py-0.5 text-xs font-semibold text-primary-strong">
                      {specialty}
                    </span>
                  )}
                </div>

                <div className="mt-2 flex flex-wrap gap-4 text-sm text-ink/60">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-primary" />
                    {formatDate(date)}
                  </span>
                  {time && (
                    <span className="flex items-center gap-1.5">
                      <Clock size={14} className="text-primary" />
                      {formatTime(time)}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${statusColor(status)}`}
                >
                  {status}
                </span>

                {status?.toLowerCase() !== "cancelled" &&
                  status?.toLowerCase() !== "canceled" &&
                  status?.toLowerCase() !== "completed" && (
                    <button
                      type="button"
                      onClick={() => handleCancel(id)}
                      disabled={isCanceling || cancelling}
                      className="flex items-center gap-1 rounded-full border border-red-200 px-3 py-1 text-xs font-semibold text-red-500 transition hover:bg-red-50 disabled:opacity-50"
                    >
                      <X size={12} />
                      {isCanceling ? "Cancelling…" : "Cancel"}
                    </button>
                  )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
