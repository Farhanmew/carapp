"use client";

import { useEffect, useState } from "react";
import { CarFront, FileText, LogOut, MessageSquare, Pencil, Plus, Trash2, UserRound } from "lucide-react";
import Button from "@/components/Button";
import Card from "@/components/Card";
import InputField from "@/components/InputField";

const emptyCarForm = {
  title: "",
  brand: "",
  price: "",
  fuelType: "",
  year: "",
  kilometersDriven: "",
  imagesText: "",
};

const emptyAuthForm = {
  name: "",
  email: "",
  password: "",
  phone: "",
};

function formatPrice(price) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price || 0);
}

function formatDate(dateValue) {
  if (!dateValue) {
    return "Just now";
  }

  return new Date(dateValue).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function buildImageArray(imagesText) {
  return imagesText
    .split(",")
    .map((image) => image.trim())
    .filter(Boolean);
}

function getCarFormFromCar(car) {
  return {
    title: car.title || "",
    brand: car.brand || "",
    price: car.price?.toString() || "",
    fuelType: car.fuelType || "",
    year: car.year?.toString() || "",
    kilometersDriven: car.kilometersDriven?.toString() || "",
    imagesText: Array.isArray(car.images) ? car.images.join(", ") : "",
  };
}

function FeedbackMessage({ type, message }) {
  if (!message) {
    return null;
  }

  return (
    <p
      className={`rounded-2xl border px-4 py-3 text-sm ${
        type === "error" ? "border-red-200 bg-red-50 text-red-700" : "border-blue-200 bg-blue-50 text-blue-700"
      }`}
    >
      {message}
    </p>
  );
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <Card padding="sm" className="border-white/80 bg-white/75 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-[var(--color-brand)]">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">{label}</p>
          <p className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">{value}</p>
        </div>
      </div>
    </Card>
  );
}

function DealerAuthSection({
  authMode,
  authForm,
  authLoading,
  feedbackMessage,
  feedbackType,
  onModeChange,
  onInputChange,
  onSubmit,
}) {
  return (
    <div className="mx-auto grid w-full max-w-5xl gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <Card tone="dark" padding="lg">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-200">Dealer access</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          Manage listings and buyer enquiries in one place.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
          Sign in with your dealer account to add cars, update listings, remove sold cars, and read new enquiries.
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          <StatCard icon={CarFront} label="Cars" value="Own stock" />
          <StatCard icon={MessageSquare} label="Leads" value="Buyer enquiries" />
          <StatCard icon={FileText} label="Actions" value="Add and edit" />
        </div>
      </Card>

      <Card padding="lg" className="border-white/80 bg-white/88 backdrop-blur-xl">
        <div className="flex gap-2 rounded-full bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => onModeChange("login")}
            className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 ${
              authMode === "login" ? "bg-white text-slate-950 shadow-sm" : "text-slate-500"
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => onModeChange("register")}
            className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 ${
              authMode === "register" ? "bg-white text-slate-950 shadow-sm" : "text-slate-500"
            }`}
          >
            Register
          </button>
        </div>

        <div className="mt-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-brand)]">
            {authMode === "login" ? "Dealer login" : "Create dealer account"}
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
            {authMode === "login" ? "Open your dashboard" : "Start selling cars"}
          </h2>
        </div>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          {authMode === "register" ? (
            <InputField
              label="Dealer name"
              name="name"
              placeholder="Enter dealer name"
              value={authForm.name}
              onChange={onInputChange}
              required
            />
          ) : null}

          <InputField
            label="Email address"
            name="email"
            type="email"
            placeholder="dealer@example.com"
            value={authForm.email}
            onChange={onInputChange}
            required
          />

          <InputField
            label="Password"
            name="password"
            type="password"
            placeholder="Enter password"
            value={authForm.password}
            onChange={onInputChange}
            helperText={authMode === "register" ? "Use at least 6 characters." : ""}
            required
          />

          {authMode === "register" ? (
            <InputField
              label="Phone number"
              name="phone"
              type="tel"
              placeholder="Enter phone number"
              value={authForm.phone}
              onChange={onInputChange}
            />
          ) : null}

          <FeedbackMessage type={feedbackType} message={feedbackMessage} />

          <Button type="submit" fullWidth className={authLoading ? "pointer-events-none opacity-70" : ""}>
            {authLoading ? "Please wait..." : authMode === "login" ? "Login as dealer" : "Create dealer account"}
          </Button>
        </form>
      </Card>
    </div>
  );
}

function DealerCarsSection({ cars, editingCarId, onEdit, onDelete }) {
  if (cars.length === 0) {
    return (
      <Card padding="lg" className="border-dashed text-center">
        <h3 className="text-xl font-semibold tracking-tight text-slate-950">No cars added yet</h3>
        <p className="mt-3 text-sm leading-7 text-[var(--color-text-soft)]">
          Use the form to add your first listing. It will appear here after it is saved to MongoDB.
        </p>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {cars.map((car) => (
        <Card key={car._id} padding="lg" className="border-white/80 bg-white/88 backdrop-blur-xl">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-brand)]">
                  {car.brand}
                </p>
                <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">{car.title}</h3>
                <p className="mt-2 text-sm text-[var(--color-text-soft)]">Added on {formatDate(car.createdAt)}</p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Price</p>
                  <p className="mt-1 text-sm font-semibold text-slate-950">{formatPrice(car.price)}</p>
                </div>
                <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Year</p>
                  <p className="mt-1 text-sm font-semibold text-slate-950">{car.year}</p>
                </div>
                <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Kilometers</p>
                  <p className="mt-1 text-sm font-semibold text-slate-950">{car.kilometersDriven}</p>
                </div>
              </div>

              <p className="text-sm text-[var(--color-text-soft)]">
                Fuel type: <span className="font-semibold text-slate-900">{car.fuelType}</span>
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Button
                type="button"
                variant="secondary"
                onClick={() => onEdit(car)}
                className={editingCarId === car._id ? "border-blue-200 bg-blue-50 text-blue-700" : ""}
              >
                <Pencil className="h-4 w-4" />
                Edit
              </Button>
              <Button type="button" variant="secondary" onClick={() => onDelete(car._id)} className="text-red-600">
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

function DealerEnquiriesSection({ enquiries }) {
  if (enquiries.length === 0) {
    return (
      <Card padding="lg" className="border-dashed text-center">
        <h3 className="text-xl font-semibold tracking-tight text-slate-950">No enquiries yet</h3>
        <p className="mt-3 text-sm leading-7 text-[var(--color-text-soft)]">
          Buyer messages for your listings will appear here once someone submits an enquiry form.
        </p>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {enquiries.map((enquiry) => (
        <Card key={enquiry._id} padding="lg" className="border-white/80 bg-white/88 backdrop-blur-xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-brand)]">
                {enquiry.carBrand ? `${enquiry.carBrand} listing` : "Buyer enquiry"}
              </p>
              <h3 className="mt-2 text-xl font-semibold tracking-tight text-slate-950">{enquiry.carTitle}</h3>
              <p className="mt-2 text-sm text-[var(--color-text-soft)]">Received on {formatDate(enquiry.createdAt)}</p>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 px-4 py-3">
              <p className="text-sm font-semibold text-slate-950">{enquiry.name}</p>
              <p className="mt-1 text-sm text-[var(--color-text-soft)]">{enquiry.phone}</p>
            </div>
          </div>

          <p className="mt-4 text-sm leading-7 text-[var(--color-text-soft)]">{enquiry.message}</p>
        </Card>
      ))}
    </div>
  );
}

export default function DealerDashboardContent() {
  const [dealer, setDealer] = useState(null);
  const [cars, setCars] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [carSaving, setCarSaving] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackType, setFeedbackType] = useState("success");
  const [authMode, setAuthMode] = useState("login");
  const [authForm, setAuthForm] = useState(emptyAuthForm);
  const [carForm, setCarForm] = useState(emptyCarForm);
  const [editingCarId, setEditingCarId] = useState("");

  useEffect(() => {
    loadDealerSession();
  }, []);

  function showFeedback(type, message) {
    setFeedbackType(type);
    setFeedbackMessage(message);
  }

  function resetCarForm() {
    setEditingCarId("");
    setCarForm(emptyCarForm);
  }

  async function loadDealerSession() {
    setPageLoading(true);

    try {
      const response = await fetch("/api/dealers/me", {
        cache: "no-store",
      });
      const result = await response.json();

      if (!response.ok) {
        setDealer(null);
        setCars([]);
        setEnquiries([]);

        // A 401 only means the dealer is not logged in yet.
        if (response.status !== 401) {
          showFeedback("error", result.message || "Could not load the dealer session.");
        }

        setPageLoading(false);
        return;
      }

      setDealer(result.dealer);
      await loadDashboardData();
    } catch (error) {
      console.error("Dealer session error:", error);
      showFeedback("error", "Something went wrong while loading the dealer dashboard.");
    } finally {
      setPageLoading(false);
    }
  }

  async function loadDashboardData() {
    try {
      const [carsResponse, enquiriesResponse] = await Promise.all([
        fetch("/api/cars?mine=true", { cache: "no-store" }),
        fetch("/api/enquiries", { cache: "no-store" }),
      ]);

      const carsResult = await carsResponse.json();
      const enquiriesResult = await enquiriesResponse.json();

      if (!carsResponse.ok) {
        throw new Error(carsResult.message || "Could not load your cars.");
      }

      if (!enquiriesResponse.ok) {
        throw new Error(enquiriesResult.message || "Could not load enquiries.");
      }

      setCars(carsResult.cars || []);
      setEnquiries(enquiriesResult.enquiries || []);
    } catch (error) {
      console.error("Dashboard data error:", error);
      showFeedback("error", error.message || "Something went wrong while loading dashboard data.");
    }
  }

  function handleAuthInputChange(event) {
    const { name, value } = event.target;

    setAuthForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  }

  function handleCarInputChange(event) {
    const { name, value } = event.target;

    setCarForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  }

  async function handleAuthSubmit(event) {
    event.preventDefault();
    setAuthLoading(true);
    showFeedback("success", "");

    try {
      const endpoint = authMode === "login" ? "/api/dealers/login" : "/api/dealers/register";
      const payload =
        authMode === "login"
          ? {
              email: authForm.email,
              password: authForm.password,
            }
          : authForm;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        showFeedback("error", result.message || "Could not continue with dealer authentication.");
        return;
      }

      setDealer(result.dealer);
      setAuthForm(emptyAuthForm);
      showFeedback("success", result.message || "Dealer session started successfully.");
      await loadDashboardData();
    } catch (error) {
      console.error("Dealer auth error:", error);
      showFeedback("error", "Something went wrong while talking to the dealer auth API.");
    } finally {
      setAuthLoading(false);
      setPageLoading(false);
    }
  }

  async function handleLogout() {
    try {
      await fetch("/api/dealers/logout", {
        method: "POST",
      });
    } catch (error) {
      console.error("Dealer logout error:", error);
    }

    setDealer(null);
    setCars([]);
    setEnquiries([]);
    setAuthForm(emptyAuthForm);
    resetCarForm();
    showFeedback("success", "Dealer logged out successfully.");
  }

  function handleEditCar(car) {
    setEditingCarId(car._id);
    setCarForm(getCarFormFromCar(car));
    showFeedback("success", "Car loaded into the form for editing.");
  }

  async function handleDeleteCar(carId) {
    const shouldDelete = window.confirm("Delete this car listing?");

    if (!shouldDelete) {
      return;
    }

    try {
      const response = await fetch(`/api/cars/${carId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        showFeedback("error", result.message || "Could not delete the car.");
        return;
      }

      // Refresh the dashboard so the cars and enquiries stay in sync.
      await loadDashboardData();

      if (editingCarId === carId) {
        resetCarForm();
      }

      showFeedback("success", result.message || "Car deleted successfully.");
    } catch (error) {
      console.error("Delete car error:", error);
      showFeedback("error", "Something went wrong while deleting the car.");
    }
  }

  async function handleCarSubmit(event) {
    event.preventDefault();
    setCarSaving(true);
    showFeedback("success", "");

    try {
      const method = editingCarId ? "PATCH" : "POST";
      const endpoint = editingCarId ? `/api/cars/${editingCarId}` : "/api/cars";

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: carForm.title,
          brand: carForm.brand,
          price: carForm.price,
          fuelType: carForm.fuelType,
          year: carForm.year,
          kilometersDriven: carForm.kilometersDriven,
          images: buildImageArray(carForm.imagesText),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        showFeedback("error", result.message || "Could not save the car.");
        return;
      }

      await loadDashboardData();
      resetCarForm();
      showFeedback("success", result.message || "Car saved successfully.");
    } catch (error) {
      console.error("Save car error:", error);
      showFeedback("error", "Something went wrong while saving the car.");
    } finally {
      setCarSaving(false);
    }
  }

  if (pageLoading) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <Card padding="lg" className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-brand)]">
            Dealer dashboard
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">Loading dashboard...</h1>
        </Card>
      </div>
    );
  }

  if (!dealer) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <DealerAuthSection
          authMode={authMode}
          authForm={authForm}
          authLoading={authLoading}
          feedbackMessage={feedbackMessage}
          feedbackType={feedbackType}
          onModeChange={setAuthMode}
          onInputChange={handleAuthInputChange}
          onSubmit={handleAuthSubmit}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Card tone="soft" padding="lg" className="border-white/80 bg-white/72 backdrop-blur-xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-brand)]">
              Dealer dashboard
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Welcome back, {dealer.name}
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--color-text-soft)]">
              Add new listings, update your current inventory, remove sold cars, and review buyer enquiries from one
              mobile-friendly dashboard.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button type="button" variant="secondary" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
            <Button href="/cars" variant="secondary">
              Browse marketplace
            </Button>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <StatCard icon={CarFront} label="Cars" value={cars.length} />
          <StatCard icon={MessageSquare} label="Enquiries" value={enquiries.length} />
          <StatCard icon={UserRound} label="Dealer" value={dealer.role} />
        </div>
      </Card>

      <div className="mt-6">
        <FeedbackMessage type={feedbackType} message={feedbackMessage} />
      </div>

      <section className="mt-8 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Card padding="lg" className="border-white/80 bg-white/88 backdrop-blur-xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-brand)]">
                {editingCarId ? "Edit car" : "Add car"}
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                {editingCarId ? "Update your listing" : "Create a new listing"}
              </h2>
            </div>

            {editingCarId ? (
              <Button type="button" variant="secondary" onClick={resetCarForm}>
                Cancel
              </Button>
            ) : null}
          </div>

          <form onSubmit={handleCarSubmit} className="mt-6 space-y-4">
            <InputField
              label="Car title"
              name="title"
              placeholder="2023 BMW X5 xDrive40i"
              value={carForm.title}
              onChange={handleCarInputChange}
              required
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <InputField
                label="Brand"
                name="brand"
                placeholder="BMW"
                value={carForm.brand}
                onChange={handleCarInputChange}
                required
              />
              <InputField
                label="Fuel type"
                name="fuelType"
                placeholder="Petrol"
                value={carForm.fuelType}
                onChange={handleCarInputChange}
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <InputField
                label="Price"
                name="price"
                type="number"
                placeholder="45000"
                value={carForm.price}
                onChange={handleCarInputChange}
                required
              />
              <InputField
                label="Year"
                name="year"
                type="number"
                placeholder="2023"
                value={carForm.year}
                onChange={handleCarInputChange}
                required
              />
              <InputField
                label="Kilometers driven"
                name="kilometersDriven"
                type="number"
                placeholder="12000"
                value={carForm.kilometersDriven}
                onChange={handleCarInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="imagesText" className="block text-sm font-semibold text-slate-800">
                Image URLs
              </label>

              <textarea
                id="imagesText"
                name="imagesText"
                rows={4}
                placeholder="Add one or more image URLs separated by commas"
                value={carForm.imagesText}
                onChange={handleCarInputChange}
                className="w-full rounded-2xl border border-[var(--color-line-strong)] bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-[var(--color-brand)] focus:ring-4 focus:ring-blue-100"
              />

              <p className="text-xs leading-6 text-[var(--color-text-soft)]">
                Keep it simple: paste full image links separated by commas.
              </p>
            </div>

            <Button type="submit" fullWidth className={carSaving ? "pointer-events-none opacity-70" : ""}>
              <Plus className="h-4 w-4" />
              {carSaving ? "Saving car..." : editingCarId ? "Update car" : "Add car"}
            </Button>
          </form>
        </Card>

        <div className="space-y-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-brand)]">Your cars</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Manage your inventory</h2>
            <p className="mt-2 text-sm leading-7 text-[var(--color-text-soft)]">
              Edit details anytime or remove a listing when it is sold.
            </p>
          </div>

          <DealerCarsSection cars={cars} editingCarId={editingCarId} onEdit={handleEditCar} onDelete={handleDeleteCar} />
        </div>
      </section>

      <section className="mt-10">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-brand)]">Buyer enquiries</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Messages for your listings</h2>
          <p className="mt-2 text-sm leading-7 text-[var(--color-text-soft)]">
            Every enquiry is linked to one of your cars and sorted with the newest message first.
          </p>
        </div>

        <div className="mt-6">
          <DealerEnquiriesSection enquiries={enquiries} />
        </div>
      </section>
    </div>
  );
}
