"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2 } from "lucide-react";
import { useAuth } from "../../lib/auth/AuthContext";
import { adoptionApi } from "../../lib/api";
import { applicationSchema } from "../../lib/adoption/applicationSchema";
import Field from "../auth/Field";

// The backend has no apply endpoint yet, so nothing is sent or saved.
const DEMO = true;

async function submitApplication(petId, values) {
  if (DEMO) {
    await new Promise((r) => setTimeout(r, 800));
    return { id: `DEMO-${String(Date.now()).slice(-6)}` };
  }
  // TODO: return adoptionApi.apply(petId, values);
  throw new Error("Applications are not available yet.");
}

const control =
  "w-full rounded-media border-[1.5px] border-primary-strong/25 bg-white px-4 py-3 text-base text-ink transition-colors hover:border-primary-strong/50 focus-visible:border-primary-strong focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-primary/30 aria-invalid:border-danger";

function ErrorText({ children }) {
  if (!children) return null;
  return (
    <p role="alert" className="mt-1.5 text-sm text-danger">
      {children}
    </p>
  );
}

export default function ApplyForm() {
  const { id } = useParams();
  const { user } = useAuth();
  const [pet, setPet] = useState(null);
  const [done, setDone] = useState(null);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      fullName: user?.name ?? "",
      phone: "",
      city: "",
      housing: "",
      hasOtherPets: false,
      reason: "",
      agree: false,
    },
  });

  useEffect(() => {
    const controller = new AbortController();
    adoptionApi
      .get(id, controller.signal)
      .then(setPet)
      .catch(() => {}); // the form still works without the pet details
    return () => controller.abort();
  }, [id]);

  const petName = pet?.name ?? pet?.petName ?? "this pet";

  async function onSubmit(values) {
    setServerError("");
    try {
      setDone(await submitApplication(id, values));
    } catch (err) {
      setServerError(err?.message || "Something went wrong. Please try again.");
    }
  }

  if (done) {
    return (
      <main className="grid min-h-[70vh] place-items-center bg-cream px-5 py-12 text-ink">
        <section className="w-full max-w-lg rounded-feature bg-white p-8 text-center shadow-card motion-safe:animate-rise sm:p-10">
          <div className="mx-auto grid size-16 place-items-center rounded-full bg-primary-tint text-primary-strong">
            <CheckCircle2 size={34} aria-hidden="true" />
          </div>
          <h1 className="mt-5 font-display text-2xl font-bold text-primary-strong">
            Application sent
          </h1>
          <p className="mt-3 leading-7 text-ink-muted">
            Thank you for applying to adopt {petName}. The owner will review
            your application and get back to you.
          </p>
          <p className="mt-4 text-sm text-ink-muted">Reference: {done.id}</p>
          <Link href="/adoption" className="btn-primary mt-7">
            Back to adoption
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="bg-cream bg-(image:--paw-pattern) px-4 py-10 text-ink sm:px-6 lg:py-16">
      <div className="mx-auto max-w-2xl">
        <Link
          href={`/adoption/${id}`}
          className="mb-6 inline-block text-sm font-medium text-primary-strong underline-offset-4 hover:underline">
          ← Back to {petName}
        </Link>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="grid gap-5 rounded-feature bg-white p-6 shadow-card motion-safe:animate-rise sm:p-10">
          <div>
            <h1 className="font-display text-title font-bold tracking-tight text-primary-strong">
              Apply to adopt {petName}
            </h1>
            <p className="mt-2 text-ink-muted">
              Tell the owner a little about you and your home.
            </p>
          </div>

          <Field
            label="Full name"
            autoComplete="name"
            error={errors.fullName?.message}
            {...register("fullName")}
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="Phone"
              type="tel"
              autoComplete="tel"
              error={errors.phone?.message}
              {...register("phone")}
            />
            <Field
              label="City"
              autoComplete="address-level2"
              error={errors.city?.message}
              {...register("city")}
            />
          </div>

          <div>
            <label
              htmlFor="housing"
              className="mb-1.5 block text-sm font-medium">
              Where do you live?
            </label>
            <select
              id="housing"
              aria-invalid={errors.housing ? "true" : undefined}
              className={control}
              {...register("housing")}>
              <option value="">Choose one</option>
              <option value="house-garden">House with a garden</option>
              <option value="house">House without a garden</option>
              <option value="apartment">Apartment</option>
            </select>
            <ErrorText>{errors.housing?.message}</ErrorText>
          </div>

          <label className="flex items-center gap-3 text-sm text-ink-muted">
            <input
              type="checkbox"
              className="size-5 shrink-0 accent-primary-strong"
              {...register("hasOtherPets")}
            />
            I have other pets at home
          </label>

          <div>
            <label
              htmlFor="reason"
              className="mb-1.5 block text-sm font-medium">
              Why would you like to adopt {petName}?
            </label>
            <textarea
              id="reason"
              rows={5}
              maxLength={1000}
              aria-invalid={errors.reason ? "true" : undefined}
              className={`${control} resize-y leading-6`}
              {...register("reason")}
            />
            <ErrorText>{errors.reason?.message}</ErrorText>
          </div>

          <div>
            <label className="flex items-start gap-3 text-sm text-ink-muted">
              <input
                type="checkbox"
                className="mt-0.5 size-5 shrink-0 accent-primary-strong"
                {...register("agree")}
              />
              I confirm the information above is correct and I will give this
              pet a loving home.
            </label>
            <ErrorText>{errors.agree?.message}</ErrorText>
          </div>

          {serverError && (
            <p
              role="alert"
              className="rounded-media bg-danger/10 px-4 py-3 text-sm text-danger">
              {serverError}
            </p>
          )}

          <button type="submit" disabled={isSubmitting} className="btn-primary">
            {isSubmitting ? "Sending…" : "Send application"}
          </button>
        </form>
      </div>
    </main>
  );
}
