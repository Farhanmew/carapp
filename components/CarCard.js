import { Calendar, Fuel, Gauge, Settings2 } from "lucide-react";
import Button from "@/components/Button";
import Card from "@/components/Card";
import WishlistButton from "@/components/WishlistButton";

function formatPrice(price) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

function getSpecItems(car) {
  return [
    {
      label: "Year",
      value: car.year,
      icon: Calendar,
    },
    {
      label: "Mileage",
      value: car.mileage || car.kilometersDriven,
      icon: Gauge,
    },
    {
      label: "Fuel",
      value: car.fuelType,
      icon: Fuel,
    },
    {
      label: "Gearbox",
      value: car.transmission || "Automatic",
      icon: Settings2,
    },
  ];
}

function getShortDescription(description) {
  if (!description) {
    return "";
  }

  // Keep the card height tighter by showing a shorter summary in the grid.
  if (description.length <= 90) {
    return description;
  }

  return `${description.slice(0, 87)}...`;
}

export default function CarCard({ car }) {
  const carId = car._id?.toString ? car._id.toString() : String(car._id);
  const carDetailsPath = `/cars/${car.slug || carId}`;
  const specItems = getSpecItems(car);

  return (
    <Card
      as="article"
      id={car.slug}
      padding="none"
      className="group flex h-full flex-col overflow-hidden border border-white/80 bg-white/88 shadow-[var(--shadow-card)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
    >
      <div className="relative overflow-hidden">
        <div className="absolute left-4 top-4 z-10">
          {car.featured ? (
            <span className="inline-flex items-center rounded-full border border-white/20 bg-slate-950/45 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-white backdrop-blur-xl">
              Featured
            </span>
          ) : (
            <span className="inline-flex items-center rounded-full border border-white/20 bg-white/16 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-white backdrop-blur-xl">
              Verified
            </span>
          )}
        </div>

        <div className="absolute right-4 top-4 z-10">
          <WishlistButton carId={carId} />
        </div>

        <div className="relative aspect-[16/9] bg-slate-200">
          <img
            src={car.coverImage}
            alt={car.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950/60 to-transparent" />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[var(--color-brand)]">
                {car.bodyType || "Premium listing"}
              </p>
              <h3 className="text-xl font-semibold tracking-tight text-slate-950">{car.title}</h3>
            </div>
            <p className="shrink-0 text-lg font-semibold tracking-tight text-slate-950">{formatPrice(car.price)}</p>
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[var(--color-text-soft)]">
            <span>{car.location}</span>
            <span className="h-1 w-1 rounded-full bg-slate-300" />
            <span>{car.dealerName}</span>
          </div>
        </div>

        {/* Use a stable 2x2 grid so spec items keep the same readable layout on every card. */}
        <div className="grid grid-cols-2 gap-3">
          {specItems.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                title={`${item.label}: ${item.value}`}
                className="flex items-start gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/80 px-3 py-3 sm:px-4 sm:py-4"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-[var(--color-brand)] shadow-sm">
                  <Icon className="h-4 w-4" strokeWidth={2} />
                </div>

                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">{item.label}</p>
                  <p className="mt-1 truncate text-sm font-semibold leading-tight text-slate-900">{item.value}</p>
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-sm leading-6 text-[var(--color-text-soft)]">{getShortDescription(car.description)}</p>

        {/* Push the CTA to the bottom so buttons line up evenly across the listing grid. */}
        <Button
          href={carDetailsPath}
          variant="secondary"
          fullWidth
          className="mt-auto border-slate-200 bg-slate-50/80"
        >
          View details
        </Button>
      </div>
    </Card>
  );
}
