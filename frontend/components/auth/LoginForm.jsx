"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../../lib/auth/AuthContext";
import Field from "./Field";
import SocialAuth from "./SocialAuth";
import { loginSchema } from "../../lib/auth/schema";
import { safeNext } from "../../lib/utils";

export default function LoginForm() {
  const router = useRouter();
  const next = safeNext(useSearchParams().get("next"));
  const { login } = useAuth();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", remember: true },
  });

  async function onSubmit(values) {
    setServerError("");
    try {
      await login(values);
      router.replace(next);
    } catch (err) {
      setServerError(err?.message || "Something went wrong. Please try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-5">
      <SocialAuth />

      <Field
        label="Email"
        type="email"
        autoComplete="email"
        error={errors.email?.message}
        {...register("email")}
      />
      <Field
        label="Password"
        type="password"
        autoComplete="current-password"
        error={errors.password?.message}
        {...register("password")}
      />

      <div className="flex items-center justify-between gap-4 text-sm">
        <label className="flex items-center gap-2 text-ink-muted">
          <input
            type="checkbox"
            className="size-4 accent-primary-strong"
            {...register("remember")}
          />
          Remember me
        </label>
        <Link
          href="/forgot-password"
          className="font-medium text-primary-strong underline-offset-4 hover:underline">
          Forgot password?
        </Link>
      </div>

      {serverError && (
        <p
          role="alert"
          className="rounded-media bg-danger/10 px-4 py-3 text-sm text-danger">
          {serverError}
        </p>
      )}

      <button type="submit" disabled={isSubmitting} className="btn-primary">
        {isSubmitting ? "Logging in…" : "Log in"}
      </button>

      <p className="text-center text-sm text-ink-muted">
        New to Pet Mate?{" "}
        <Link
          href={`/signup?next=${encodeURIComponent(next)}`}
          className="font-semibold text-primary-strong underline-offset-4 hover:underline">
          Create an account
        </Link>
      </p>
    </form>
  );
}
