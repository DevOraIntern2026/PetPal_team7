"use client";

import { useState } from "react";

const TABS = [
  { key: "about", label: "About" },
  { key: "health", label: "Health" },
  { key: "personality", label: "Personality" },
  { key: "adoptionInfo", label: "Adoption info" },
];

export default function PetTabs({ pet }) {
  const [active, setActive] = useState("about");

  return (
    <div className="mt-10">
      <div
        role="tablist"
        className="flex flex-wrap gap-6 border-b border-primary-strong/20"
      >
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={active === tab.key}
            onClick={() => setActive(tab.key)}
            className={`focus-ring -mb-px border-b-2 pb-2 text-sm font-semibold transition ${
              active === tab.key
                ? "border-primary-strong text-primary-strong"
                : "border-transparent text-ink-muted hover:text-ink"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div role="tabpanel" className="pt-6">
        {active === "about" && (
          <>
            <h2 className="text-lg font-bold text-ink">Meet {pet.name}!</h2>
            <p className="mt-2 text-ink-muted">{pet.about}</p>
          </>
        )}
        {active === "health" && <p className="text-ink-muted">{pet.health}</p>}
        {active === "personality" && (
          <p className="text-ink-muted">{pet.personality}</p>
        )}
        {active === "adoptionInfo" && (
          <p className="text-ink-muted">{pet.adoptionInfo}</p>
        )}
      </div>
    </div>
  );
}



