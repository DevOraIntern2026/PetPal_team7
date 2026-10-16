"use client";

import { useState } from "react";
import { FaTimes, FaSpinner } from "react-icons/fa";
import { adoptionApi, filesApi, getErrorMessage } from "../../lib/api";
import { listingSchema, DEFAULT_VALUES } from "../../lib/adoption/schema";

function Field({ label, error, children }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold uppercase text-gray-700">
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

const inputCls =
  "w-full rounded-lg border border-gray-300 p-2.5 text-sm outline-none focus:border-primary-strong";

export default function ListingFormModal({ listing, onClose, onSaved }) {
  const [values, setValues] = useState(
    listing
      ? {
          petName: listing.name,
          location: listing.location,
          gender: listing.gender,
          price: listing.price,
          weightKg: listing.weightKg,
          ageInMonths: listing.ageInMonths,
          about: listing.about,
        }
      : DEFAULT_VALUES,
  );
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const set = (key) => (e) =>
    setValues((v) => ({ ...v, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    const parsed = listingSchema.safeParse(values);
    if (!parsed.success) {
      const errs = {};
      for (const issue of parsed.error.issues) {
        errs[issue.path[0]] ??= issue.message;
      }
      setErrors(errs);
      return;
    }
    setErrors({});
    setSubmitting(true);

    try {
      let imageUrl = listing?.rawImageUrl ?? null;

      if (file) {
        const up = await filesApi.upload(file, "pets");
        // check the real upload response shape and adjust if needed
        imageUrl =
          typeof up === "string" ? up : (up.url ?? up.imageUrl ?? null);
      }

      const body = { ...parsed.data, imageUrl };

      if (listing) {
        await adoptionApi.update(listing.id, {
          ...body,
          status: listing.status,
        });
      } else {
        await adoptionApi.create(body);
      }
      onSaved();
    } catch (err) {
      setFormError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <FaTimes />
        </button>

        <h3 className="mb-4 text-xl font-bold text-gray-900">
          {listing ? "Edit Adoption Listing" : "Create New Adoption Listing"}
        </h3>

        {formError && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <Field label="Pet Name" error={errors.petName}>
            <input
              className={inputCls}
              value={values.petName}
              onChange={set("petName")}
              placeholder="e.g. Luna"
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Gender" error={errors.gender}>
              <select
                className={inputCls}
                value={values.gender}
                onChange={set("gender")}
              >
                <option value="" disabled>
                  Select...
                </option>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
              </select>
            </Field>
            <Field label="Location" error={errors.location}>
              <input
                className={inputCls}
                value={values.location}
                onChange={set("location")}
                placeholder="e.g. Nasr City, Cairo"
              />
            </Field>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Field label="Age (months)" error={errors.ageInMonths}>
              <input
                type="number"
                className={inputCls}
                value={values.ageInMonths}
                onChange={set("ageInMonths")}
              />
            </Field>
            <Field label="Weight (kg)" error={errors.weightKg}>
              <input
                type="number"
                step="0.1"
                className={inputCls}
                value={values.weightKg}
                onChange={set("weightKg")}
              />
            </Field>
            <Field label="Price (EGP)" error={errors.price}>
              <input
                type="number"
                className={inputCls}
                value={values.price}
                onChange={set("price")}
              />
            </Field>
          </div>

          <Field label="About" error={errors.about}>
            <textarea
              rows={3}
              className={`${inputCls} resize-none`}
              value={values.about}
              onChange={set("about")}
            />
          </Field>

          <Field label="Photo">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="text-sm"
            />
          </Field>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 rounded-lg bg-primary-strong px-5 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
            >
              {submitting && <FaSpinner className="animate-spin" />}
              {listing ? "Update Listing" : "Create Listing"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
