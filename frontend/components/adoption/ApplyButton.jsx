"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "../../lib/auth/AuthContext";

export default function ApplyButton({ petId }) {
  const router = useRouter();
  const { requireAuth } = useAuth();

  return (
    <button
      type="button"
      onClick={() =>
        requireAuth("adopt", () => router.push(`/adoption/${petId}/apply`))
      }
      className="btn-primary"
    >
      Apply Adopt →
    </button>
  );
}
