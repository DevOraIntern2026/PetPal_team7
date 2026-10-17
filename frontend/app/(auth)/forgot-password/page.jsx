import AuthLayout from "@/components/auth/AuthLayout";
import ForgotPasswordForm from "../../../components/auth/ForgotPasswordForm";

export const metadata = { title: "Forgot password | Pet Mate" };

export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      heading="Forgot your password?"
      subheading="Enter your email and we will send you a code to reset it."
      aside={{
        title: "It happens to everyone",
        text: "We will get you back to your pet in no time.",
      }}>
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
