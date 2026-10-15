"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Star,
  Stethoscope,
} from "lucide-react";

import { useDoctors } from "../../hooks/useDoctors";
import { useAuth } from "../../lib/auth/AuthContext";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?auto=format&fit=crop&w=1100&q=85";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=700&q=85";

export default function VetsPage() {
  const router = useRouter();
  const { requireAuth } = useAuth();

  const [search, setSearch] = useState("");
  const [specialty, setSpecialty] = useState("All Specialties");
  const [sort, setSort] = useState("recommended");

  const { doctors: apiDoctors = [], loading, error } = useDoctors();

  const handleBookNow = (vetId) => {
    const targetUrl = `/appointments?vet=${encodeURIComponent(vetId)}`;
    requireAuth("vets", () => router.push(targetUrl), targetUrl);
  };

  const handleGeneralBooking = () => {
    requireAuth("vets", () => router.push("/appointments"), "/appointments");
  };

  const vets = useMemo(() => {
    return apiDoctors.map((doctor) => ({
      ...doctor,

      id: doctor.id ?? doctor.doctorId ?? doctor._id,

      name:
        doctor.name ?? doctor.fullName ?? doctor.doctorName ?? "Veterinarian",

      specialty:
        doctor.specialty?.name ??
        doctor.specialty ??
        doctor.specialtyName ??
        doctor.specialization ??
        "General Practice",

      experience: Number(
        doctor.experience ??
          doctor.yearsOfExperience ??
          doctor.experienceYears ??
          0,
      ),

      rating: Number(doctor.rating ?? doctor.averageRating ?? 0),

      reviews: Number(
        doctor.reviews ?? doctor.reviewCount ?? doctor.reviewsCount ?? 0,
      ),

      price: Number(doctor.price ?? doctor.consultationFee ?? doctor.fee ?? 0),

      location:
        doctor.location ??
        doctor.clinicAddress ??
        doctor.address ??
        "Location not available",

      image:
        doctor.image ??
        doctor.imageUrl ??
        doctor.profileImageUrl ??
        doctor.photoUrl ??
        "",

      available: doctor.available ?? doctor.isAvailable ?? true,
    }));
  }, [apiDoctors]);

  const specialties = useMemo(
    () => [
      "All Specialties",
      ...new Set(vets.map((vet) => vet.specialty).filter(Boolean)),
    ],
    [vets],
  );

  const filteredVets = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    let result = vets.filter((vet) => {
      const matchesSearch =
        String(vet.name).toLowerCase().includes(normalizedSearch) ||
        String(vet.specialty).toLowerCase().includes(normalizedSearch);

      const matchesSpecialty =
        specialty === "All Specialties" || vet.specialty === specialty;

      return matchesSearch && matchesSpecialty;
    });

    if (sort === "rating") {
      result = [...result].sort((a, b) => b.rating - a.rating);
    } else if (sort === "price-low") {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sort === "experience") {
      result = [...result].sort((a, b) => b.experience - a.experience);
    }

    return result;
  }, [vets, search, specialty, sort]);

  function resetFilters() {
    setSearch("");
    setSpecialty("All Specialties");
    setSort("recommended");
  }

  return (
    <main className="min-h-screen bg-cream text-ink">
      {/* Hero */}
      <section className="relative overflow-hidden bg-primary-deep">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(43,159,192,0.35),transparent_38%)]" />

        <div className="relative mx-auto grid max-w-content items-center gap-8 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:py-24">
          <div className="max-w-2xl">
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white">
              <ShieldCheck size={17} />
              Trusted care for every pet
            </span>

            <h1 className="max-w-xl text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              The right vet for a{" "}
              <span className="text-[#b9edf7]">healthier, happier</span> pet.
            </h1>

            <p className="mt-5 max-w-lg text-base leading-7 text-white/75 sm:text-lg">
              Find experienced veterinarians, explore their specialties, and
              book your pet&apos;s next visit with confidence.
            </p>

            <div className="mt-8 flex flex-wrap gap-3 text-sm text-white/85">
              <span className="flex items-center gap-2">
                <CheckCircle2 size={17} className="text-[#b9edf7]" />
                Trusted professionals
              </span>

              <span className="flex items-center gap-2">
                <CheckCircle2 size={17} className="text-[#b9edf7]" />
                Easy appointment booking
              </span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl">
            <div className="absolute -inset-3 rotate-3 rounded-[2rem] border border-white/15" />

            <div className="relative overflow-hidden rounded-[1.75rem] border border-white/20 bg-white/10 p-2 shadow-2xl">
              <img
                src={HERO_IMAGE}
                alt="Veterinarian caring for an animal"
                className="h-64 w-full rounded-2xl object-cover sm:h-80 lg:h-95"
              />

              <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/50 bg-white/95 p-4 shadow-xl backdrop-blur">
                <div className="flex items-center gap-3">
                  <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary-tint text-primary-strong">
                    <Stethoscope size={23} />
                  </div>

                  <div>
                    <p className="font-semibold">Care that starts with trust</p>
                    <p className="mt-1 text-sm text-ink-muted">
                      Your pet deserves the best.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Doctors */}
      <section className="mx-auto max-w-content px-5 py-14 sm:px-8 sm:py-20">
        <div className="mb-9 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="text-sm font-bold uppercase tracking-[0.18em] text-primary-strong">
              Meet our specialists
            </span>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Find your pet&apos;s doctor
            </h2>

            <p className="mt-3 max-w-xl leading-7 text-ink-muted">
              Explore our veterinary team and choose the right care for your
              furry family member.
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-ink-muted">
            <ShieldCheck size={19} className="text-primary-strong" />
            Carefully selected professionals
          </div>
        </div>

        {/* Search and filters */}
        <div className="mb-8 rounded-2xl border border-primary-strong/10 bg-white p-4 shadow-card sm:p-5">
          <div className="grid gap-4 md:grid-cols-[1.4fr_1fr_1fr]">
            <label className="relative block">
              <span className="mb-2 block text-sm font-semibold">
                Search doctors
              </span>

              <Search
                size={19}
                className="absolute left-3 top-[42px] text-ink-muted"
              />

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Doctor name or specialty..."
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-3 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
              />
            </label>

            <label>
              <span className="mb-2 block text-sm font-semibold">
                Specialty
              </span>

              <select
                value={specialty}
                onChange={(event) => setSpecialty(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
              >
                {specialties.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span className="mb-2 flex items-center gap-2 text-sm font-semibold">
                <SlidersHorizontal size={16} />
                Sort by
              </span>

              <select
                value={sort}
                onChange={(event) => setSort(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
              >
                <option value="recommended">Recommended</option>
                <option value="rating">Highest rating</option>
                <option value="price-low">Lowest price</option>
                <option value="experience">Most experienced</option>
              </select>
            </label>
          </div>
        </div>

        {/* Results count */}
        <div className="mb-5 flex items-center justify-between gap-3">
          <p className="text-sm text-ink-muted">
            <span className="font-bold text-ink">
              {loading ? "..." : filteredVets.length}
            </span>{" "}
            {filteredVets.length === 1 ? "doctor" : "doctors"} found
          </p>

          {(search ||
            specialty !== "All Specialties" ||
            sort !== "recommended") && (
            <button
              type="button"
              onClick={resetFilters}
              className="text-sm font-semibold text-primary-strong hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Loading state */}
        {loading && (
          <div
            className="rounded-3xl border border-primary-strong/10 bg-white px-5 py-16 text-center"
            role="status"
          >
            <div className="mx-auto size-10 animate-spin rounded-full border-4 border-primary-tint border-t-primary-strong" />
            <p className="mt-4 font-semibold">Loading veterinarians...</p>
            <p className="mt-2 text-sm text-ink-muted">
              Please wait while we load the doctors.
            </p>
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div
            className="rounded-3xl border border-red-200 bg-white px-5 py-12 text-center"
            role="alert"
          >
            <ShieldCheck size={32} className="mx-auto text-red-600" />

            <h3 className="mt-4 text-xl font-bold">
              Couldn&apos;t load veterinarians
            </h3>

            <p className="mt-2 text-sm text-ink-muted">{error}</p>
          </div>
        )}

        {/* Doctors grid */}
        {!loading && !error && filteredVets.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredVets.map((vet) => (
              <article
                key={vet.id}
                className="group overflow-hidden rounded-3xl border border-primary-strong/10 bg-white shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative h-56 overflow-hidden bg-primary-tint">
                  <img
                    src={vet.image || FALLBACK_IMAGE}
                    alt={vet.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />

                  <span className="absolute left-4 top-4 max-w-[70%] truncate rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-primary-deep shadow-sm">
                    {vet.specialty}
                  </span>

                  <span
                    className={`absolute right-4 top-4 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold shadow-sm ${
                      vet.available
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-white text-ink-muted"
                    }`}
                  >
                    <span
                      className={`size-1.5 rounded-full ${
                        vet.available ? "bg-emerald-500" : "bg-slate-400"
                      }`}
                    />

                    {vet.available ? "Available" : "Check schedule"}
                  </span>
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate text-lg font-bold">{vet.name}</h3>

                      <p className="mt-1 text-sm text-ink-muted">
                        {vet.experience} years of experience
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-1 rounded-lg bg-amber-50 px-2 py-1 text-sm font-bold text-amber-700">
                      <Star size={14} fill="currentColor" />
                      {vet.rating.toFixed(1)}
                    </div>
                  </div>

                  <p className="mt-4 flex items-center gap-2 text-sm text-ink-muted">
                    <MapPin
                      size={16}
                      className="shrink-0 text-primary-strong"
                    />
                    <span className="truncate">{vet.location}</span>
                  </p>

                  <p className="mt-2 flex items-center gap-2 text-sm text-ink-muted">
                    <Clock3
                      size={16}
                      className="shrink-0 text-primary-strong"
                    />
                    {vet.reviews} client reviews
                  </p>

                  <div className="my-5 border-t border-slate-100" />

                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs text-ink-muted">Consultation fee</p>

                      <p className="mt-1 text-xl font-bold text-primary-strong">
                        {vet.price > 0 ? `EGP ${vet.price}` : "Contact clinic"}
                      </p>
                    </div>

                    {vet.id != null ? (
                      <button
                        type="button"
                        onClick={() => handleBookNow(vet.id)}
                        className="inline-flex shrink-0 items-center gap-2 rounded-full bg-primary-strong px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-deep"
                      >
                        <CalendarDays size={16} />
                        Book now
                      </button>
                    ) : (
                      <span className="text-xs text-ink-muted">
                        Booking unavailable
                      </span>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && filteredVets.length === 0 && (
          <div className="rounded-3xl border border-dashed border-primary/40 bg-white px-5 py-16 text-center">
            <Search size={32} className="mx-auto text-primary-strong" />

            <h3 className="mt-4 text-xl font-bold">No doctors found</h3>

            <p className="mt-2 text-sm text-ink-muted">
              Try another name or choose a different specialty.
            </p>

            <button
              type="button"
              onClick={resetFilters}
              className="mt-5 rounded-full bg-primary-strong px-5 py-3 text-sm font-semibold text-white hover:bg-primary-deep"
            >
              Reset filters
            </button>
          </div>
        )}

        {/* Call to action */}
        <div className="mt-12 flex flex-col items-start justify-between gap-4 rounded-3xl bg-primary-tint p-6 sm:flex-row sm:items-center sm:p-8">
          <div>
            <h3 className="text-xl font-bold">Not sure which vet to choose?</h3>

            <p className="mt-2 max-w-xl text-sm leading-6 text-ink-muted">
              Start with a general consultation to find the best care for your
              pet.
            </p>
          </div>

          <button
            type="button"
            onClick={handleGeneralBooking}
            className="inline-flex shrink-0 items-center gap-2 font-semibold text-primary-deep hover:underline"
          >
            Explore your options <ArrowRight size={18} />
          </button>
        </div>
      </section>
    </main>
  );
}
