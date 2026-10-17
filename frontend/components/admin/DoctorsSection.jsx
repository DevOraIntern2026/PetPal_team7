"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Pencil, Plus, Search, Stethoscope, Trash2 } from "lucide-react";
import { adminApi } from "../../lib/adminApi";
import { getErrorMessage } from "../../lib/api";
import { money } from "../../lib/format";
import { useAdminList, useDebounced } from "../../hooks/useAdminList";
import DataTable from "./DataTable";
import { ConfirmModal, Field, Modal, ModalActions, inputCls } from "./Modal";

const PAGE_SIZE = 20;
const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const schema = z.object({
  fullName: z.string().trim().min(2, "Enter the doctor's name"),
  specialty: z.string().trim().min(2, "Enter a specialty"),
  email: z.string().trim().email("Enter a valid email"),
  phone: z.string().trim().min(6, "Enter a phone number"),
  consultationPrice: z
    .string()
    .refine(
      (v) => v.trim() !== "" && !Number.isNaN(Number(v)) && Number(v) >= 0,
      "Enter a valid price",
    ),
  description: z.string().trim(),
});

function DoctorForm({ doctor, onSaved, onCancel }) {
  const [serverError, setServerError] = useState("");
  const [hoursError, setHoursError] = useState("");
  const [days, setDays] = useState([
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
  ]);
  const [start, setStart] = useState("09:00");
  const [end, setEnd] = useState("17:00");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: doctor?.fullName ?? "",
      specialty: doctor?.specialty ?? "",
      email: doctor?.email ?? "",
      phone: doctor?.phone ?? "",
      consultationPrice: doctor ? String(doctor.consultationPrice) : "",
      description: doctor?.description ?? "",
    },
  });

  const toggleDay = (d) =>
    setDays((cur) =>
      cur.includes(d) ? cur.filter((x) => x !== d) : [...cur, d],
    );

  async function onSubmit(v) {
    setServerError("");
    setHoursError("");
    const body = {
      fullName: v.fullName,
      specialty: v.specialty,
      description: v.description,
      phone: v.phone,
      email: v.email,
      consultationPrice: Number(v.consultationPrice),
    };

    if (!doctor) {
      if (days.length === 0)
        return setHoursError("Pick at least one working day.");
      if (end <= start)
        return setHoursError("The end time must be after the start time.");
      body.workingHours = DAYS.filter((d) => days.includes(d)).map((d) => ({
        dayOfWeek: d,
        startTime: `${start}:00`,
        endTime: `${end}:00`,
      }));
    }

    try {
      if (doctor) await adminApi.doctors.update(doctor.id, body);
      else await adminApi.doctors.create(body);
      onSaved();
    } catch (err) {
      setServerError(
        getErrorMessage(err, "Could not save the doctor. Please try again."),
      );
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name" error={errors.fullName?.message}>
          <input className={inputCls} {...register("fullName")} />
        </Field>
        <Field label="Specialty" error={errors.specialty?.message}>
          <input className={inputCls} {...register("specialty")} />
        </Field>
        <Field label="Email" error={errors.email?.message}>
          <input type="email" className={inputCls} {...register("email")} />
        </Field>
        <Field label="Phone" error={errors.phone?.message}>
          <input type="tel" className={inputCls} {...register("phone")} />
        </Field>
        <Field
          label="Consultation price (EGP)"
          error={errors.consultationPrice?.message}>
          <input
            inputMode="decimal"
            className={inputCls}
            {...register("consultationPrice")}
          />
        </Field>
        <Field
          label="Description"
          error={errors.description?.message}
          className="sm:col-span-2">
          <textarea
            rows={2}
            className={inputCls}
            {...register("description")}
          />
        </Field>
      </div>

      {doctor ? (
        <p className="mt-4 rounded-xl bg-primary-tint/60 px-4 py-3 text-sm text-ink-muted">
          Working hours cannot be changed here yet.
        </p>
      ) : (
        <fieldset className="mt-5">
          <legend className="mb-2 text-sm font-semibold text-ink">
            Working hours
          </legend>
          <div className="flex flex-wrap gap-2">
            {DAYS.map((d) => (
              <button
                key={d}
                type="button"
                aria-pressed={days.includes(d)}
                onClick={() => toggleDay(d)}
                className={`focus-ring rounded-full px-3.5 py-1.5 text-sm font-semibold transition ${
                  days.includes(d)
                    ? "bg-primary-strong text-white"
                    : "bg-primary-tint text-primary-strong hover:bg-primary-tint/70"
                }`}>
                {d.slice(0, 3)}
              </button>
            ))}
          </div>
          <div className="mt-3 grid grid-cols-2 gap-4">
            <Field label="From">
              <input
                type="time"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                className={inputCls}
              />
            </Field>
            <Field label="To">
              <input
                type="time"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                className={inputCls}
              />
            </Field>
          </div>
          {hoursError && (
            <p role="alert" className="mt-2 text-xs text-danger">
              {hoursError}
            </p>
          )}
        </fieldset>
      )}

      {serverError && (
        <p role="alert" className="mt-4 text-sm text-danger">
          {serverError}
        </p>
      )}
      <ModalActions
        onCancel={onCancel}
        busy={isSubmitting}
        submitLabel={doctor ? "Save changes" : "Add doctor"}
      />
    </form>
  );
}

export default function DoctorsSection() {
  const [specialty, setSpecialty] = useState("");
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [delState, setDelState] = useState({ busy: false, error: "" });

  const debounced = useDebounced(specialty);
  const { items, totalCount, status, reload } = useAdminList(
    adminApi.doctors.list,
    { specialty: debounced, page, pageSize: PAGE_SIZE },
  );

  async function confirmDelete() {
    setDelState({ busy: true, error: "" });
    try {
      await adminApi.doctors.remove(deleting.id);
      setDeleting(null);
      setDelState({ busy: false, error: "" });
      reload();
    } catch (err) {
      setDelState({
        busy: false,
        error: getErrorMessage(err, "Could not delete the doctor."),
      });
    }
  }

  const columns = [
    {
      key: "doctor",
      header: "Doctor",
      render: (d) => (
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-full bg-primary-tint text-primary-strong">
            <Stethoscope size={18} aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="truncate font-semibold">{d.fullName}</p>
            <p className="truncate text-xs text-ink-muted">{d.email}</p>
          </div>
        </div>
      ),
    },
    { key: "specialty", header: "Specialty", render: (d) => d.specialty },
    {
      key: "price",
      header: "Price",
      render: (d) => money.format(d.consultationPrice),
    },
    {
      key: "hours",
      header: "Working hours",
      render: (d) => {
        const wh = d.workingHours ?? [];
        if (wh.length === 0)
          return <span className="text-ink-muted">Not set</span>;
        return (
          <div>
            <p>{wh.map((h) => h.dayOfWeek.slice(0, 3)).join(", ")}</p>
            <p className="text-xs text-ink-muted">
              {wh[0].startTime.slice(0, 5)} to {wh[0].endTime.slice(0, 5)}
            </p>
          </div>
        );
      },
    },
    {
      key: "status",
      header: "Status",
      render: (d) => (
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            d.isActive
              ? "bg-emerald-50 text-emerald-700"
              : "bg-gray-100 text-ink-muted"
          }`}>
          {d.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      render: (d) => (
        <div className="flex justify-end gap-1">
          <button
            type="button"
            aria-label={`Edit ${d.fullName}`}
            onClick={() => setEditing(d)}
            className="focus-ring grid size-9 place-items-center rounded-full text-primary-strong hover:bg-primary-tint">
            <Pencil size={16} />
          </button>
          <button
            type="button"
            aria-label={`Delete ${d.fullName}`}
            onClick={() => {
              setDelState({ busy: false, error: "" });
              setDeleting(d);
            }}
            className="focus-ring grid size-9 place-items-center rounded-full text-danger hover:bg-rose-50">
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative w-full max-w-sm">
          <Search
            size={16}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted"
            aria-hidden="true"
          />
          <input
            type="search"
            value={specialty}
            onChange={(e) => {
              setSpecialty(e.target.value);
              setPage(1);
            }}
            placeholder="Filter by specialty"
            aria-label="Filter by specialty"
            className={`${inputCls} pl-10`}
          />
        </div>
        <button
          type="button"
          onClick={() => setEditing("new")}
          className="btn-primary w-auto! gap-2">
          <Plus size={16} aria-hidden="true" /> Add doctor
        </button>
      </div>

      <DataTable
        columns={columns}
        rows={items}
        status={status}
        onRetry={reload}
        page={page}
        pageSize={PAGE_SIZE}
        totalCount={totalCount}
        onPage={setPage}
        emptyText="No doctors found."
      />

      <Modal
        open={Boolean(editing)}
        title={editing && editing !== "new" ? "Edit doctor" : "Add doctor"}
        onClose={() => setEditing(null)}>
        <DoctorForm
          doctor={editing === "new" ? null : editing}
          onCancel={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            reload();
          }}
        />
      </Modal>

      <ConfirmModal
        open={Boolean(deleting)}
        title="Delete doctor"
        message={`Delete ${deleting?.fullName}? This cannot be undone.`}
        busy={delState.busy}
        error={delState.error}
        onConfirm={confirmDelete}
        onClose={() => setDeleting(null)}
      />
    </div>
  );
}
