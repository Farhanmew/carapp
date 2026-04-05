import Button from "@/components/Button";
import CarCard from "@/components/CarCard";
import Card from "@/components/Card";
import InputField from "@/components/InputField";
import { sampleCars } from "@/data/sampleCars";

export const metadata = {
  title: "Cars",
};

function getSearchValue(searchParams, key) {
  const value = searchParams?.[key];

  if (Array.isArray(value)) {
    return value[0] || "";
  }

  return value || "";
}

function getCarFilters(searchParams) {
  const search = getSearchValue(searchParams, "search").trim();
  const brand = getSearchValue(searchParams, "brand").trim();
  const fuelType = getSearchValue(searchParams, "fuelType").trim();
  const priceValue = getSearchValue(searchParams, "price").trim();
  const price = priceValue ? Number(priceValue) : null;

  return {
    search,
    brand,
    fuelType,
    price: Number.isNaN(price) ? null : price,
  };
}

function filterCars(cars, filters) {
  return cars.filter((car) => {
    const carBrand = car.brand || car.make || "";
    const searchableText = `${car.title} ${carBrand} ${car.model || ""} ${car.bodyType || ""}`.toLowerCase();
    const matchesSearch = filters.search ? searchableText.includes(filters.search.toLowerCase()) : true;
    const matchesBrand = filters.brand ? carBrand.toLowerCase().includes(filters.brand.toLowerCase()) : true;
    const matchesFuelType = filters.fuelType
      ? (car.fuelType || "").toLowerCase() === filters.fuelType.toLowerCase()
      : true;
    const matchesPrice = filters.price !== null ? Number(car.price) <= filters.price : true;

    return matchesSearch && matchesBrand && matchesFuelType && matchesPrice;
  });
}

export default async function CarsPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const filters = getCarFilters(resolvedSearchParams);
  const filteredCars = filterCars(sampleCars, filters);
  const hasActiveFilters = Boolean(filters.search || filters.brand || filters.fuelType || filters.price !== null);

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
        <form action="/cars" className="grid gap-4 xl:grid-cols-[1.2fr_1fr_1fr_1fr_auto]">
          {/* Keep the filters simple so buyers can narrow results quickly. */}
          <InputField
            label="Keyword"
            name="search"
            placeholder="Tesla, BMW, SUV..."
            defaultValue={filters.search}
            inputClassName="focus:ring-blue-100"
          />

          <InputField
            label="Brand"
            name="brand"
            placeholder="BMW"
            defaultValue={filters.brand}
            inputClassName="focus:ring-blue-100"
          />

          <InputField
            label="Max price"
            name="price"
            type="number"
            placeholder="50000"
            defaultValue={filters.price !== null ? String(filters.price) : ""}
            inputClassName="focus:ring-blue-100"
          />

          <div className="space-y-2">
            <label htmlFor="fuelType" className="block text-sm font-semibold text-slate-800">
              Fuel type
            </label>
            <select
              id="fuelType"
              name="fuelType"
              defaultValue={filters.fuelType}
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

        <div className="mt-4 text-sm text-[var(--color-text-soft)]">
          {hasActiveFilters ? `Showing ${filteredCars.length} matching cars.` : `Showing ${filteredCars.length} cars.`}
        </div>
      </Card>

      <section className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filteredCars.length > 0 ? (
          filteredCars.map((car) => <CarCard key={car._id} car={car} />)
        ) : (
          <Card className="border-dashed text-center xl:col-span-3" padding="lg">
            <h2 className="text-xl font-semibold text-slate-900">No cars matched your filters</h2>
            <p className="mt-3 text-sm leading-7 text-[var(--color-text-soft)]">
              Try a different brand, raise the max price, or clear one of the filters.
            </p>
          </Card>
        )}
      </section>
    </div>
  );
}
