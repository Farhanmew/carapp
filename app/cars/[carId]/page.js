import { notFound } from "next/navigation";
import Button from "@/components/Button";
import Card from "@/components/Card";
import CarCard from "@/components/CarCard";
import EnquiryForm from "@/components/EnquiryForm";
import CarImageGallery from "@/components/CarImageGallery";
import { sampleCars } from "@/data/sampleCars";

function formatPrice(price) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

function getCarById(carId) {
  return sampleCars.find((car) => car.slug === carId || String(car._id) === carId);
}

function getGalleryImages(car) {
  const savedImages = Array.isArray(car.images) ? car.images.filter(Boolean) : [];

  if (savedImages.length > 0) {
    return savedImages;
  }

  return car.coverImage ? [car.coverImage] : [];
}

function getCarDetails(car) {
  return [
    { label: "Brand", value: car.brand || car.make || "Not added" },
    { label: "Model", value: car.model || "Not added" },
    { label: "Year", value: car.year || "Not added" },
    { label: "Fuel type", value: car.fuelType || "Not added" },
    { label: "Transmission", value: car.transmission || "Not added" },
    { label: "Body type", value: car.bodyType || "Not added" },
    { label: "Mileage", value: car.mileage || car.kilometersDriven || "Not added" },
    { label: "Location", value: car.location || "Not added" },
  ];
}

function getDealerInfo(car) {
  return {
    name: car.dealerName || "Dealer not added",
    email: car.dealerEmail || "sales@valuedrive.com",
    phone: car.dealerPhone || "+1 (555) 010-2020",
    location: car.location || "Location not added",
  };
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const car = getCarById(resolvedParams.carId);

  if (!car) {
    return {
      title: "Car Not Found",
    };
  }

  return {
    title: car.title,
  };
}

export default async function CarDetailsPage({ params }) {
  const resolvedParams = await params;
  const car = getCarById(resolvedParams.carId);

  if (!car) {
    notFound();
  }

  const galleryImages = getGalleryImages(car);
  const dealerInfo = getDealerInfo(car);
  const carDetails = getCarDetails(car);
  const relatedCars = sampleCars.filter((item) => item._id !== car._id).slice(0, 3);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button href="/cars" variant="secondary">
          Back to cars
        </Button>

        <Button href="#enquiry-form" size="lg">
          Send enquiry
        </Button>
      </div>

      <section className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <CarImageGallery images={galleryImages} title={car.title} />

        <div className="space-y-6">
          <Card tone="soft" padding="lg">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">
              {car.bodyType || "Car details"}
            </p>
            <h1 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">{car.title}</h1>
            <p className="mt-3 text-3xl font-extrabold text-[var(--color-brand)]">{formatPrice(car.price)}</p>
            <p className="mt-4 text-sm leading-7 text-[var(--color-text-soft)]">{car.description}</p>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <Card padding="sm" className="bg-white text-sm">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Fuel</p>
                <p className="mt-1 font-semibold text-slate-900">{car.fuelType}</p>
              </Card>
              <Card padding="sm" className="bg-white text-sm">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Year</p>
                <p className="mt-1 font-semibold text-slate-900">{car.year}</p>
              </Card>
              <Card padding="sm" className="bg-white text-sm">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Mileage</p>
                <p className="mt-1 font-semibold text-slate-900">{car.mileage || car.kilometersDriven}</p>
              </Card>
              <Card padding="sm" className="bg-white text-sm">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Transmission</p>
                <p className="mt-1 font-semibold text-slate-900">{car.transmission || "Not added"}</p>
              </Card>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button href="#enquiry-form" size="lg" fullWidth>
                Send enquiry
              </Button>
              <Button href={`tel:${dealerInfo.phone.replace(/[^+\d]/g, "")}`} variant="secondary" size="lg" fullWidth>
                Call dealer
              </Button>
            </div>
          </Card>

          <Card padding="lg" className="space-y-4" id="dealer-info">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">Dealer info</p>
              <h2 className="mt-2 text-2xl font-bold text-slate-900">{dealerInfo.name}</h2>
            </div>

            <div className="space-y-3 text-sm text-[var(--color-text-soft)]">
              <p>
                <span className="font-semibold text-slate-900">Email:</span> {dealerInfo.email}
              </p>
              <p>
                <span className="font-semibold text-slate-900">Phone:</span> {dealerInfo.phone}
              </p>
              <p>
                <span className="font-semibold text-slate-900">Location:</span> {dealerInfo.location}
              </p>
            </div>
          </Card>
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <Card padding="lg">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">Full car info</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {carDetails.map((detail) => (
              <div key={detail.label} className="rounded-2xl bg-slate-50 px-4 py-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{detail.label}</p>
                <p className="mt-2 text-sm font-semibold text-slate-900">{detail.value}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card tone="soft" padding="lg" id="enquiry-form">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">Send an enquiry</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900">Ask the dealer about this car.</h2>
          <p className="mt-3 text-sm leading-7 text-[var(--color-text-soft)]">
            Fill out the form below and your enquiry will be saved with this car id in MongoDB.
          </p>

          <div className="mt-5">
            <EnquiryForm carId={car._id} carTitle={car.title} />
          </div>
        </Card>
      </section>

      <section className="mt-12">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">More cars</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">Other listings you may like</h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-[var(--color-text-soft)]">
            The details page reuses the same listing cards so the browsing experience stays consistent.
          </p>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {relatedCars.map((relatedCar) => (
            <CarCard key={relatedCar._id} car={relatedCar} />
          ))}
        </div>
      </section>
    </div>
  );
}
