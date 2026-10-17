"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authApi } from "../../lib/auth/authApi";
import { getErrorMessage } from "../../lib/api";
import { forgotSchema } from "../../lib/auth/schema";
import Field from "./Field";

export default function ForgotPasswordForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit({ email }) {
    setServerError("");
    try {
      await authApi.forgotPassword({ email });
      router.push(`/reset-password?email=${encodeURIComponent(email)}`);
    } catch (err) {
      setServerError(getErrorMessage(err));
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-5">
      <Field
        label="Email"
        type="email"
        autoComplete="email"
        error={errors.email?.message}
        {...register("email")}
      />

      {serverError && (
        <p
          role="alert"
          className="rounded-media bg-danger/10 px-4 py-3 text-sm text-danger">
          {serverError}
        </p>
      )}

      <button type="submit" disabled={isSubmitting} className="btn-primary">
        {isSubmitting ? "Sending…" : "Send reset code"}
      </button>

      <p className="text-center text-sm text-ink-muted">
        <Link
          href="/login"
          className="font-semibold text-primary-strong underline-offset-4 hover:underline">
          Back to log in
        </Link>
      </p>
    </form>
  );
}
