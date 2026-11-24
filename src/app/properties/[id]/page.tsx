import Link from "next/link";
import { notFound } from "next/navigation";
import PropertyMapLoader from "@/components/PropertyMapLoader";
import ProgressBar from "@/components/ProgressBar";
import Alert from "@/components/Alert";
import { PropertyReviews } from "@/components/reviews/PropertyReviews";
import {
  getPropertyById,
  getPropertyReviews,
  getPropertyVibe,
} from "@/services/properties";
import { formatPrice } from "@/utils/format";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PropertyDetailPage({ params }: PageProps) {
  const { id } = await params;

  if (!/^\d+$/.test(id)) notFound();

  let property;

  try {
    property = await getPropertyById(id);
  } catch {
    notFound();
  }

  const [reviewsResult, vibeResult] = await Promise.allSettled([
    getPropertyReviews(id),
    getPropertyVibe(id),
  ]);

  const reviews =
    reviewsResult.status === "fulfilled" ? reviewsResult.value : [];
  const vibe = vibeResult.status === "fulfilled" ? vibeResult.value : null;

  const vibeItems = vibe
    ? [
        { label: "Student community", value: vibe.studentDensity },
        { label: "Nightlife", value: vibe.nightlife },
        { label: "Study spots", value: vibe.studySpots },
        { label: "Quietness", value: vibe.quietness },
        { label: "Essential services", value: vibe.essentialSpots },
      ]
    : [];

  return (
    <main className="min-h-screen bg-gray-50 px-5 py-8 text-gray-900 md:px-12">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/properties"
          className="font-semibold text-red-600 hover:underline"
        >
          ← Back to properties
        </Link>

        <header className="mb-8 mt-6">
          <div className="mb-3 flex flex-wrap gap-2">
            <span className="rounded-full bg-red-50 px-3 py-1 text-sm text-red-700">
              {property.propertyType?.name ?? "Housing"}
            </span>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-sm">
              {property.available ? "Available" : "Unavailable"}
            </span>
          </div>

          <h1 className="text-3xl font-bold md:text-4xl">{property.name}</h1>
          <p className="mt-3 text-gray-600">📍 {property.address}</p>
          <p className="mt-4 text-2xl font-bold text-red-600">
            {formatPrice(property.price)}
            <span className="ml-2 text-sm font-normal text-gray-500">
              / month
            </span>
          </p>
        </header>

        <section className="mb-6 rounded-2xl border bg-white p-6">
          <h2 className="mb-3 text-xl font-bold">About this place</h2>
          <p className="leading-7 text-gray-600">{property.description}</p>
          <p className="mt-4 text-sm text-gray-600">
            Distance to campus:{" "}
            {(property.distanceToCampus / 1000).toLocaleString("en-US", {
              maximumFractionDigits: 2,
            })}{" "}
            km
          </p>
        </section>

        <section className="mb-6 rounded-2xl border bg-white p-6">
          <h2 className="mb-4 text-xl font-bold">Features</h2>
          {property.characteristics?.length ? (
            <ul className="grid gap-2 sm:grid-cols-2">
              {property.characteristics.map((item, index) => (
                <li
                  key={`${item}-${index}`}
                  className="rounded-lg bg-gray-50 p-3"
                >
                  ✓ {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No additional features listed.</p>
          )}

          <h3 className="mb-3 mt-6 font-semibold">Services &amp; amenities</h3>
          <div className="flex flex-wrap gap-2">
            {property.amenities.map((amenity) => (
              <span
                key={amenity.id}
                className="rounded-full bg-red-50 px-3 py-2 text-sm text-red-800"
              >
                {amenity.name}
              </span>
            ))}
            {!property.amenities.length && (
              <p className="text-gray-500">No amenities listed.</p>
            )}
          </div>
        </section>

        <section className="mb-6 rounded-2xl border bg-white p-6">
          <h2 className="mb-3 text-xl font-bold">Contract conditions</h2>
          <p className="whitespace-pre-line leading-7 text-gray-600">
            {property.contractConditions ||
              "Ask the landlord about the contract conditions."}
          </p>
        </section>

        <section className="mb-6 rounded-2xl border bg-white p-6">
          <h2 className="mb-2 text-xl font-bold">Student Vibe Analyzer</h2>
          <p className="mb-6 text-sm text-gray-500">
            Neighborhood indicators shown as a percentage out of 100%.
          </p>
          {vibeItems.length ? (
            <div className="space-y-5">
              {vibeItems.map((item) => (
                <ProgressBar
                  key={item.label}
                  label={item.label}
                  value={item.value * 20}
                />
              ))}
            </div>
          ) : (
            <Alert
              type="info"
              message="No vibe analysis is available for this property yet."
            />
          )}
        </section>

        <section className="mb-6 rounded-2xl border bg-white p-6">
          <h2 className="mb-4 text-xl font-bold">Location</h2>
          <PropertyMapLoader
            latitude={property.latitude}
            longitude={property.longitude}
            name={property.name}
          />
        </section>

        <PropertyReviews propertyId={property.id} initialReviews={reviews} />
      </div>
    </main>
  );
}
