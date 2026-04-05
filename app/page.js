import Button from "@/components/Button";
import CarCard from "@/components/CarCard";
import Card from "@/components/Card";
import InputField from "@/components/InputField";
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

export default function HomePage() {
  const featuredCars = sampleCars.filter((car) => car.featured).slice(0, 3);

  return (
    <div className="w-full px-4 py-8 sm:px-5 lg:px-6">
      <section className="mx-auto max-w-6xl">
        <div className="relative overflow-hidden rounded-[32px] border border-white/70 bg-gradient-to-b from-white/65 via-white/35 to-transparent px-4 py-10 shadow-[0_24px_60px_rgba(15,23,42,0.06)] sm:px-6 sm:py-12 lg:px-8 lg:py-14">
          <div className="pointer-events-none absolute inset-0">
            {/* Layer soft gradients behind the hero to add depth without relying on a strong image. */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.14),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.78),rgba(241,245,249,0.36))]" />
            <div className="absolute left-1/2 top-4 h-56 w-56 -translate-x-1/2 rounded-full bg-blue-500/15 blur-3xl" />
            <div className="absolute right-0 top-16 h-40 w-40 rounded-full bg-slate-900/8 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-44 w-44 rounded-full bg-blue-300/20 blur-3xl" />
            {/* Use a light overlay so the background stays subtle and the text remains easy to read. */}
            <div className="absolute inset-0 bg-white/18" />
          </div>

          <div className="relative mx-auto max-w-5xl text-center">
            <span className="inline-flex items-center rounded-full border border-white/80 bg-white/55 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-600 backdrop-blur-xl">
              Trusted premium marketplace
            </span>

            {/* Let the hero content use more width so the layout feels fuller with less empty side space. */}
            <div className="mx-auto mt-8 max-w-5xl space-y-5">
              <h1 className="mx-auto max-w-4xl text-4xl font-semibold leading-tight tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                Find trusted cars faster, with clear pricing and serious dealer listings.
              </h1>

              <p className="mx-auto max-w-3xl text-base leading-8 text-slate-600 sm:text-lg">
                Browse premium inventory, narrow results by brand or budget, and move from discovery to enquiry without
                the clutter of a generic starter interface.
              </p>
            </div>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button href="/cars" size="lg" className="min-w-[200px] px-6 shadow-lg shadow-blue-500/20">
                Explore inventory
              </Button>
              <Button href="/dealer" variant="ghost" size="lg" className="min-w-[200px] px-6">
                Dealer dashboard
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <Card
          padding="lg"
          className="mx-auto max-w-6xl rounded-[30px] border border-white/90 bg-white/92 shadow-[0_26px_70px_rgba(15,23,42,0.10)] backdrop-blur-xl"
        >
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[var(--color-brand)]">
                Quick search
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                Search by keyword, brand, price, or fuel type
              </h2>
            </div>

            <p className="max-w-2xl text-sm leading-7 text-[var(--color-text-soft)]">
              Use a few simple filters and jump straight to the cars page with matching results.
            </p>
          </div>

          <form action="/cars" className="mt-6 grid gap-4 xl:grid-cols-[1.2fr_1fr_1fr_1fr_auto]">
            {/* Keep the filter tools inside their own card so this section stays separate from the hero. */}
            <InputField
              label="Keyword"
              name="search"
              placeholder="Tesla, SUV, BMW X5..."
              inputClassName="focus:ring-blue-100"
            />

            <InputField
              label="Brand"
              name="brand"
              placeholder="BMW"
              inputClassName="focus:ring-blue-100"
            />

            <InputField
              label="Max price"
              name="price"
              type="number"
              placeholder="50000"
              inputClassName="focus:ring-blue-100"
            />

            <div className="space-y-2">
              <label htmlFor="fuelType" className="block text-sm font-semibold text-slate-800">
                Fuel type
              </label>
              <select
                id="fuelType"
                name="fuelType"
                defaultValue=""
                className="w-full rounded-2xl border border-[var(--color-line-strong)] bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition-all duration-300 focus:border-[var(--color-brand)] focus:ring-4 focus:ring-blue-100"
              >
                <option value="">Any fuel type</option>
                <option value="Electric">Electric</option>
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            <div className="flex items-end">
              <Button type="submit" className="w-full xl:w-auto">
                Search cars
              </Button>
            </div>
          </form>
        </Card>
      </section>

      <section className="mt-12">
        <div className="mx-auto max-w-6xl rounded-[36px] border border-white/70 bg-slate-50/70 px-5 py-8 shadow-[0_20px_50px_rgba(15,23,42,0.05)] sm:px-6 sm:py-10 lg:px-8">
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

          {/* Use a lighter section background so the cards sit on their own visual layer. */}
          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {featuredCars.map((car) => (
              <CarCard key={car._id} car={car} />
            ))}
          </div>
        </div>
      </section>

      <section className="mt-12">
        <div className="mx-auto grid max-w-5xl gap-4 lg:grid-cols-3">
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
      </section>
    </div>
  );
}
