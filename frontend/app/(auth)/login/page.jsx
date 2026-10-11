import { Suspense } from "react";
import AuthLayout from "../../../components/auth/AuthLayout";
import LoginForm from "../../../components/auth/LoginForm";

export const metadata = { title: "Log in | Pet Mate" };

export default function LoginPage() {
  return (
    <AuthLayout
      heading="Welcome back"
      subheading="Log in to continue giving your pet the best care."
      aside={{
        title: "We missed you!",
        text: "Pick up where you left off: vets, the store and your AI assistant are waiting.",
      }}>
      <Suspense>
        <LoginForm />
      </Suspense>
    </AuthLayout>
  );
}
