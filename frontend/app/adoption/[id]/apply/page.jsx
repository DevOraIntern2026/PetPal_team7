import { Suspense } from "react";
import RequireAuth from "../../../../components/auth/RequireAuth";
import ApplyForm from "../../../../components/adoption/ApplyForm";

export const metadata = { title: "Adoption application | Pet Mate" };

export default function ApplyPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh]" />}>
      <RequireAuth>
        <ApplyForm />
      </RequireAuth>
    </Suspense>
  );
}
