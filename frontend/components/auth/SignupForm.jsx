"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../../lib/auth/AuthContext";
import { safeNext } from "../../lib/utils";
import Field from "./Field";
import SocialAuth from "./SocialAuth";
import { signupSchema } from "../../lib/auth/schema";

export default function SignupForm() {
  const router = useRouter();
  const next = safeNext(useSearchParams().get("next"));
  const { signup } = useAuth();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  async function onSubmit(values) {
    setServerError("");
    try {
      await signup(values);
      router.replace(next);
    } catch (err) {
      setServerError(err?.message || "Something went wrong. Please try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-5">
      <SocialAuth />

      <Field
        label="Name"
        autoComplete="name"
        error={errors.name?.message}
        {...register("name")}
      />
      <Field
        label="Email"
        type="email"
        autoComplete="email"
        error={errors.email?.message}
        {...register("email")}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Password"
          type="password"
          autoComplete="new-password"
          error={errors.password?.message}
          {...register("password")}
        />
        <Field
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />
      </div>

      <div>
        <label className="flex items-start gap-3 text-sm text-ink-muted">
          <input
            type="checkbox"
            className="mt-0.5 size-5 shrink-0 accent-primary-strong"
            {...register("terms")}
          />
          <span>
            I agree to the{" "}
            <Link
              href="/terms"
              className="font-medium text-primary-strong underline-offset-4 hover:underline">
              terms &amp; conditions
            </Link>
          </span>
        </label>
        {errors.terms && (
          <p role="alert" className="mt-1.5 text-sm text-danger">
            {errors.terms.message}
          </p>
        )}
      </div>

      {serverError && (
        <p
          role="alert"
          className="rounded-media bg-danger/10 px-4 py-3 text-sm text-danger">
          {serverError}
        </p>
      )}

      <button type="submit" disabled={isSubmitting} className="btn-primary">
        {isSubmitting ? "Creating account…" : "Create account"}
      </button>

      <p className="text-center text-sm text-ink-muted">
        Already have an account?{" "}
        <Link
          href={`/login?next=${encodeURIComponent(next)}`}
          className="font-semibold text-primary-strong underline-offset-4 hover:underline">
          Log in
        </Link>
      </p>
    </form>
  );
}
