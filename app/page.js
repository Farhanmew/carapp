import Button from "@/components/Button";
import CarCard from "@/components/CarCard";
import Card from "@/components/Card";
import { sampleCars } from "@/data/sampleCars";

const featureCards = [
  {
    title: "Dealer-managed inventory",
    description: "Professional listings with trusted dealer profiles, clear pricing, and full vehicle details.",
  },
  {
    title: "Serious buyer enquiries",
    description: "Premium presentation gives buyers more confidence before they reach out to the seller.",
  },
  {
    title: "Admin oversight",
    description: "A clear foundation for approvals, moderation, and platform-level trust controls.",
  },
];

const homeChecklist = [
  "Verified dealer experience",
  "Luxury-inspired interface",
  "Mobile-first browsing",
  "MongoDB-ready backend",
];

export default function HomePage() {
  const featuredCars = sampleCars.filter((car) => car.featured).slice(0, 3);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Card
        tone="soft"
        padding="none"
        className="relative overflow-hidden border-white/70 px-6 py-10 text-center sm:px-10 sm:py-14 lg:px-16 lg:py-20"
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-56 w-56 -translate-x-1/2 rounded-full bg-blue-500/15 blur-3xl" />
          <div className="absolute right-8 top-16 h-40 w-40 rounded-full bg-slate-900/8 blur-3xl" />
          <div className="absolute bottom-8 left-10 h-44 w-44 rounded-full bg-blue-300/20 blur-3xl" />
        </div>

        <div className="relative">
          <span className="inline-flex items-center rounded-full border border-white/80 bg-white/55 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-600 backdrop-blur-xl">
            Trusted premium marketplace
          </span>

          <div className="mx-auto mt-8 max-w-5xl space-y-6">
            <h1 className="mx-auto max-w-4xl text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
              <span className="bg-gradient-to-r from-slate-950 via-slate-700 to-[var(--color-brand)] bg-clip-text text-transparent">
                Buy and sell exceptional cars with confidence.
              </span>
            </h1>

            <p className="mx-auto max-w-2xl text-base leading-8 text-[var(--color-text-soft)] sm:text-lg">
              A premium marketplace for serious buyers, trusted dealers, and polished car listings that feel credible
              from the first glance.
            </p>
          </div>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href="/cars" size="lg">
              Explore inventory
            </Button>
            <Button href="/dealer" variant="secondary" size="lg">
              Dealer dashboard
            </Button>
          </div>

          <div className="mx-auto mt-10 grid max-w-4xl gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {homeChecklist.map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/80 bg-white/55 px-4 py-4 text-sm font-semibold tracking-[0.02em] text-slate-700 backdrop-blur-xl"
              >
                {item}
              </div>
            ))}
          </div>

          <div className="mx-auto mt-10 grid max-w-5xl gap-4 lg:grid-cols-3">
            {featureCards.map((card) => (
              <Card
                key={card.title}
                padding="lg"
                className="border-white/80 bg-white/72 text-left backdrop-blur-xl"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[var(--color-brand)]">
                  Platform value
                </p>
                <h2 className="mt-3 text-xl font-semibold tracking-tight text-slate-950">{card.title}</h2>
                <p className="mt-3 text-sm leading-7 text-[var(--color-text-soft)]">{card.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </Card>

      <section className="mt-16">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[var(--color-brand)]">
              Featured inventory
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Curated listings with a high-trust presentation
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-[var(--color-text-soft)]">
            Premium buyers notice polish immediately. A cleaner layout, stronger spacing, and consistent details make
            every listing feel more credible.
          </p>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {featuredCars.map((car) => (
            <CarCard key={car._id} car={car} />
          ))}
        </div>
      </section>
    </div>
  );
}
