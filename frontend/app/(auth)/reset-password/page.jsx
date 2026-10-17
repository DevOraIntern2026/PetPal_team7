import { Suspense } from "react";
import ResetPasswordForm from "../../../components/auth/ResetPasswordForm";
import AuthLayout from "@/components/auth/AuthLayout";

export const metadata = { title: "Reset password | Pet Mate" };

export default function ResetPasswordPage() {
  return (
    <AuthLayout
      heading="Set a new password"
      subheading="Enter the code from your email and choose a new password."
      aside={{
        title: "Almost there",
        text: "One more step and you are back in.",
      }}>
      <Suspense>
        <ResetPasswordForm />
      </Suspense>
    </AuthLayout>
  );
}
