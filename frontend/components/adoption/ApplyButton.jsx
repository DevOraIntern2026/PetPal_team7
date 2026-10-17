"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "../../lib/auth/AuthContext";

export default function ApplyButton({ petId }) {
  const router = useRouter();
  const { requireAuth } = useAuth();
  const target = `/adoption/${petId}/apply`;

  return (
    <button
      type="button"
      onClick={() => requireAuth("adopt", () => router.push(target), target)}
      className="btn-primary">
      Apply to adopt →
    </button>
  );
}
