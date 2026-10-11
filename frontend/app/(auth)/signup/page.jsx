import { Suspense } from "react";
import AuthLayout from "../../../components/auth/AuthLayout";
import SignupForm from "../../../components/auth/SignupForm";

export const metadata = { title: "Create account | Pet Mate" };

export default function SignupPage() {
  return (
    <AuthLayout
      heading="Create your account"
      subheading="Let's start your journey with your pet."
      aside={{
        title: "Everything your pet needs, one account",
        text: "Book vets, shop the store, adopt a companion and ask the AI assistant anything.",
      }}>
      <Suspense>
        <SignupForm />
      </Suspense>
    </AuthLayout>
  );
}
