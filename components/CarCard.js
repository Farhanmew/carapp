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

export default function CarCard({ car }) {
  const carId = car._id?.toString ? car._id.toString() : String(car._id);
  const carDetailsPath = `/cars/${car.slug || carId}`;
  const specItems = getSpecItems(car);

  return (
    <Card
      as="article"
      id={car.slug}
      padding="none"
      className="group overflow-hidden border border-white/80 bg-white/88 shadow-[var(--shadow-card)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
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

        <div className="relative aspect-[16/10] bg-slate-200">
          <img
            src={car.coverImage}
            alt={car.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950/60 to-transparent" />
        </div>
      </div>

      <div className="space-y-5 p-6">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[var(--color-brand)]">
                {car.bodyType || "Premium listing"}
              </p>
              <h3 className="text-2xl font-semibold tracking-tight text-slate-950">{car.title}</h3>
            </div>
            <p className="text-xl font-semibold tracking-tight text-slate-950">{formatPrice(car.price)}</p>
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[var(--color-text-soft)]">
            <span>{car.location}</span>
            <span className="h-1 w-1 rounded-full bg-slate-300" />
            <span>{car.dealerName}</span>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-50/80">
          <div className="grid grid-cols-2">
            {specItems.map((item, index) => {
              const Icon = item.icon;
              const borderClasses = [
                index % 2 === 0 ? "border-r border-slate-200/80" : "",
                index < 2 ? "border-b border-slate-200/80" : "",
              ]
                .filter(Boolean)
                .join(" ");

              return (
                <div key={item.label} className={`flex items-center gap-3 px-4 py-4 ${borderClasses}`}>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[var(--color-brand)] shadow-sm">
                    <Icon className="h-4 w-4" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">{item.label}</p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">{item.value}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <p className="text-sm leading-7 text-[var(--color-text-soft)]">{car.description}</p>

        <Button href={carDetailsPath} variant="secondary" fullWidth className="border-slate-200 bg-slate-50/80">
          View details
        </Button>
      </div>
    </Card>
  );
}
