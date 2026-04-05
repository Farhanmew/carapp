import Button from "@/components/Button";
import CarCard from "@/components/CarCard";
import Card from "@/components/Card";
import InputField from "@/components/InputField";
import { sampleCars } from "@/data/sampleCars";

export const metadata = {
  title: "Cars",
};

export default function CarsPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <Card tone="soft" padding="lg">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">Browse listings</p>
        <h1 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">Cars ready to browse</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--color-text-soft)]">
          This page uses local sample data so the interface is ready before you connect a real database. The starter
          API route at <code className="rounded bg-slate-100 px-2 py-1 text-xs">/api/cars</code> can return sample data
          first and switch to MongoDB once you add your connection string.
        </p>
      </Card>

      <Card className="mt-6" padding="lg">
        <form className="grid gap-4 md:grid-cols-[1.4fr_1fr_auto]">
          {/* This starter form shows how the reusable input and button components fit together. */}
          <InputField
            label="Search cars"
            name="search"
            placeholder="Tesla, BMW, SUV..."
            helperText="Connect these fields to search or filter logic later."
          />
          <InputField label="Location" name="location" placeholder="Austin, TX" />
          <div className="flex items-end">
            <Button type="submit" className="w-full md:w-auto">
              Search cars
            </Button>
          </div>
        </form>
      </Card>

      <section className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {sampleCars.map((car) => (
          <CarCard key={car._id} car={car} />
        ))}
      </section>
    </div>
  );
}
