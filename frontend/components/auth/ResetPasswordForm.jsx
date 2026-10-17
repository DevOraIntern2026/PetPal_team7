"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authApi } from "../../lib/auth/authApi";
import { getErrorMessage } from "../../lib/api";
import { resetSchema } from "../../lib/auth/schema";
import Field from "./Field";

export default function ResetPasswordForm() {
  const email = useSearchParams().get("email") ?? "";
  const [serverError, setServerError] = useState("");
  const [done, setDone] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(resetSchema),
    defaultValues: { email, code: "", newPassword: "" },
  });

  async function onSubmit(values) {
    setServerError("");
    try {
      await authApi.resetPassword(values);
      setDone(true);
    } catch (err) {
      setServerError(
        getErrorMessage(err, "Couldn't reset your password. Please try again."),
      );
    }
  }

  if (done) {
    return (
      <div className="grid gap-5 text-center">
        <p className="rounded-media bg-primary-tint px-4 py-3 text-primary-deep">
          Your password was updated. You can log in with the new one.
        </p>
        <Link href="/login" className="btn-primary">
          Log in
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-5">
      <p className="rounded-media bg-primary-tint px-4 py-3 text-sm text-primary-deep">
        If that email is registered, a reset code was sent. Check your inbox.
      </p>

      <Field
        label="Email"
        type="email"
        autoComplete="email"
        error={errors.email?.message}
        {...register("email")}
      />
      <Field
        label="Code"
        inputMode="numeric"
        autoComplete="one-time-code"
        error={errors.code?.message}
        {...register("code")}
      />
      <Field
        label="New password"
        type="password"
        autoComplete="new-password"
        error={errors.newPassword?.message}
        {...register("newPassword")}
      />

      {serverError && (
        <p
          role="alert"
          className="rounded-media bg-danger/10 px-4 py-3 text-sm text-danger">
          {serverError}
        </p>
      )}

      <button type="submit" disabled={isSubmitting} className="btn-primary">
        {isSubmitting ? "Updating…" : "Reset password"}
      </button>

      <p className="text-center text-sm text-ink-muted">
        No code yet?{" "}
        <Link
          href="/forgot-password"
          className="font-semibold text-primary-strong underline-offset-4 hover:underline">
          Send it again
        </Link>
      </p>
    </form>
  );
}
