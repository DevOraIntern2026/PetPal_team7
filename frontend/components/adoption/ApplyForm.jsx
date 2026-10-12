"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  applySchema,
  STEP1_FIELDS,
  DEFAULT_VALUES,
} from "../../lib/adoption/schema";
import { RadioCardGroup } from "./RadioCardGroup";

const CITIES = ["Cairo", "Giza", "Alexandria", "Mansoura", "Assiut", "Other"];

const inputClass =
  "focus-ring w-full rounded-lg border border-primary-strong/30 bg-white px-3 py-2 text-sm text-ink transition-all duration-200 placeholder:text-ink-muted/60 focus:ring-2 focus:ring-primary/20";

const labelClass =
  "mb-1.5 block text-xs font-bold uppercase tracking-wider text-ink";

const cardClass =
  "mx-auto max-w-lg rounded-card bg-white p-8 shadow-card sm:p-10";

const primaryBtn =
  "btn-primary shadow-lg shadow-primary/25 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]";

function FieldError({ message }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-danger">{message}</p>;
}

function CheckIcon({ className }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.5"
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}

export default function ApplyForm({ pet }) {
  const draftKey = `petmate:adoption-draft:${pet.id}`;
  const doneKey = `petmate:adoption-done:${pet.id}`;

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const requested = Number(searchParams.get("step") ?? 1);
  const step = [1, 2, 3].includes(requested) ? requested : 1;

  const [ready, setReady] = useState(false);
  const [checking, setChecking] = useState(true);
  const [draftSaved, setDraftSaved] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    trigger,
    reset,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(applySchema),
    defaultValues: DEFAULT_VALUES,
  });

  const goTo = (n, { replace = false } = {}) => {
    const url = `${pathname}?step=${n}`;
    if (replace) router.replace(url);
    else router.push(url);
  };

  // Restore the saved draft, then mark the form as ready
  useEffect(() => {
    try {
      const saved = localStorage.getItem(draftKey);
      if (saved) reset({ ...DEFAULT_VALUES, ...JSON.parse(saved) });
    } catch {}
    setReady(true);
  }, [draftKey, reset]);

  // Step guard: send the user back if they skipped a step
  useEffect(() => {
    if (!ready) return;
    let cancelled = false;

    const guard = async () => {
      let allowed = true;

      if (requested === 3) {
        allowed = sessionStorage.getItem(doneKey) === "1";
      } else if (requested === 2) {
        allowed = await trigger(STEP1_FIELDS);
      } else if (requested !== 1) {
        allowed = false;
      }

      if (cancelled) return;
      if (!allowed) goTo(1, { replace: true });
      setChecking(false);
    };

    setChecking(true);
    guard();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requested, ready]);

  const next = async () => {
    const valid = await trigger(STEP1_FIELDS);
    if (valid) goTo(2);
  };

  const saveDraft = () => {
    try {
      localStorage.setItem(draftKey, JSON.stringify(getValues()));
      setDraftSaved(true);
    } catch {}
  };

  const onSubmit = async () => {
    setServerError("");
    try {
      // TODO: send the application to the backend
      // payload: { petId: pet.id, ...values, phone: `+20${values.phone}` }
      await new Promise((r) => setTimeout(r, 600));
      localStorage.removeItem(draftKey);
      sessionStorage.setItem(doneKey, "1");
      goTo(3, { replace: true });
    } catch (err) {
      setServerError(err?.message ?? "Something went wrong. Please try again.");
    }
  };

  // Avoid flashing a step the user is not allowed to see
  if (!ready || checking) {
    return <section className="min-h-[60vh]" aria-busy="true" />;
  }

  return (
    <section className="mx-auto max-w-content px-4 py-10 font-display md:px-10">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* Step 1: Personal information */}
        {step === 1 && (
          <div className={cardClass}>
            <div className="text-center">
              <h1 className="text-3xl font-extrabold tracking-tight text-ink">
                Personal Information
              </h1>
              <p className="mt-2 text-sm font-medium text-ink-muted">
                Adopting{" "}
                <span className="font-semibold text-primary-strong">
                  {pet.name}
                </span>
              </p>
            </div>

            <div className="mt-8 space-y-5">
              <div>
                <label htmlFor="fullName" className={labelClass}>
                  Full Name
                </label>
                <input
                  id="fullName"
                  placeholder="e.g. John Doe"
                  className={inputClass}
                  {...register("fullName")}
                />
                <FieldError message={errors.fullName?.message} />
              </div>

              <div>
                <label htmlFor="email" className={labelClass}>
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="example@mail.com"
                  className={inputClass}
                  {...register("email")}
                />
                <FieldError message={errors.email?.message} />
              </div>

              <div>
                <label htmlFor="phone" className={labelClass}>
                  Phone Number
                </label>
                <div className="flex rounded-lg border border-primary-strong/30 bg-white transition-all duration-200 focus-within:ring-2 focus-within:ring-primary/20">
                  <span className="inline-flex items-center rounded-l-lg border-r border-primary-strong/20 bg-primary-tint px-3.5 text-sm font-semibold text-ink-muted">
                    +20
                  </span>
                  <input
                    id="phone"
                    type="tel"
                    placeholder="1012345678"
                    className="w-full bg-transparent px-3.5 py-2 text-sm text-ink outline-none placeholder:text-ink-muted/60"
                    {...register("phone")}
                  />
                </div>
                <FieldError message={errors.phone?.message} />
              </div>

              <div>
                <label htmlFor="city" className={labelClass}>
                  City / Location
                </label>
                <div className="relative">
                  <select
                    id="city"
                    className={`${inputClass} appearance-none pr-10`}
                    {...register("city")}
                  >
                    <option value="">Select your city</option>
                    {CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-ink-muted">
                    <svg
                      className="h-4 w-4 fill-current"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </div>
                </div>
                <FieldError message={errors.city?.message} />
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3">
              <button type="button" onClick={next} className={primaryBtn}>
                Next Step
              </button>
              <button
                type="button"
                onClick={saveDraft}
                className="btn-secondary"
              >
                Save Draft
              </button>

              {draftSaved && (
                <div
                  role="status"
                  className="mt-1 flex animate-rise items-center justify-center gap-1.5 text-center text-xs font-medium text-primary-strong"
                >
                  <CheckIcon className="h-4 w-4" />
                  <span>Draft saved successfully</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Living environment */}
        {step === 2 && (
          <div className={cardClass}>
            <div className="text-center">
              <h1 className="text-3xl font-extrabold tracking-tight text-ink">
                Living Environment
              </h1>
              <p className="mt-2 text-sm font-medium text-ink-muted">
                Help us ensure a safe & comfortable home for the pet
              </p>
            </div>

            <div className="mt-8 space-y-6">
              <RadioCardGroup
                label="What type of housing do you live in?"
                name="housing"
                options={["Apartment", "House", "Other"]}
                register={register}
                error={errors.housing?.message}
              />
              <RadioCardGroup
                label="Do you have enough space for a pet?"
                name="space"
                options={["Yes", "No"]}
                register={register}
                error={errors.space?.message}
              />
              <RadioCardGroup
                label="Is a pet allowed in your home?"
                name="petAllowed"
                options={["Yes", "No"]}
                register={register}
                error={errors.petAllowed?.message}
              />
              <RadioCardGroup
                label="Do you have children or other pets?"
                name="kidsOrPets"
                options={["Yes", "No"]}
                register={register}
                error={errors.kidsOrPets?.message}
              />
            </div>

            {serverError && (
              <p role="alert" className="mt-6 text-center text-sm text-danger">
                {serverError}
              </p>
            )}

            <div className="mt-8 flex flex-col gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`${primaryBtn} gap-2 disabled:opacity-70 disabled:hover:translate-y-0`}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="h-4 w-4 animate-spin"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span>Sending Application...</span>
                  </>
                ) : (
                  "Confirm & Submit"
                )}
              </button>

              <button
                type="button"
                onClick={() => goTo(1)}
                className="btn-secondary"
              >
                Back
              </button>
            </div>
          </div>
        )}
      </form>

      {/* Step 3: Success */}
      {step === 3 && (
        <div className={`${cardClass} text-center`}>
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary-tint ring-8 ring-primary/10">
            <CheckIcon className="h-10 w-10 animate-rise text-primary-strong" />
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-ink">
            Application Sent!
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-ink-muted">
            Thank you for choosing to give an animal in need a loving home. We
            will contact you with the next steps.
          </p>

          <div className="mt-8 flex justify-center">
            <Link href="/" className={`${primaryBtn} group gap-2 sm:max-w-xs`}>
              <span>Back to Home</span>
              <svg
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
