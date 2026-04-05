"use client";

import { useEffect, useState } from "react";
import { CarFront, LogOut, MessageSquare, ShieldCheck, Trash2, Users } from "lucide-react";
import Button from "@/components/Button";
import Card from "@/components/Card";
import InputField from "@/components/InputField";

const emptyLoginForm = {
  email: "",
  password: "",
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

function AdminLoginSection({ loginForm, loading, feedbackMessage, feedbackType, onInputChange, onSubmit }) {
  return (
    <div className="mx-auto grid w-full max-w-5xl gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <Card tone="dark" padding="lg">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-200">Super admin</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          Review the whole marketplace from one secure dashboard.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
          Admin access lets you manage dealers, review all cars, and read every enquiry across the platform.
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          <StatCard icon={Users} label="Dealers" value="Manage accounts" />
          <StatCard icon={CarFront} label="Cars" value="All listings" />
          <StatCard icon={MessageSquare} label="Leads" value="All enquiries" />
        </div>

        <p className="mt-6 text-xs leading-6 text-slate-300">
          This starter keeps admin login simple. Create an account in MongoDB with the `Dealer` model and set
          `role` to `admin`.
        </p>
      </Card>

      <Card padding="lg" className="border-white/80 bg-white/88 backdrop-blur-xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-brand)]">Admin login</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Open the control panel</h2>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <InputField
            label="Email address"
            name="email"
            type="email"
            placeholder="admin@example.com"
            value={loginForm.email}
            onChange={onInputChange}
            required
          />

          <InputField
            label="Password"
            name="password"
            type="password"
            placeholder="Enter password"
            value={loginForm.password}
            onChange={onInputChange}
            required
          />

          <FeedbackMessage type={feedbackType} message={feedbackMessage} />

          <Button type="submit" fullWidth className={loading ? "pointer-events-none opacity-70" : ""}>
            {loading ? "Logging in..." : "Login as admin"}
          </Button>
        </form>
      </Card>
    </div>
  );
}

function DealersSection({ dealers, onDeleteDealer }) {
  if (dealers.length === 0) {
    return (
      <Card padding="lg" className="border-dashed text-center">
        <h3 className="text-xl font-semibold tracking-tight text-slate-950">No dealers found</h3>
        <p className="mt-3 text-sm leading-7 text-[var(--color-text-soft)]">
          Dealer accounts will appear here after they register on the platform.
        </p>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {dealers.map((dealer) => (
        <Card key={dealer._id} padding="lg" className="border-white/80 bg-white/88 backdrop-blur-xl">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-brand)]">Dealer</p>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">{dealer.name}</h3>
              <div className="mt-3 space-y-2 text-sm text-[var(--color-text-soft)]">
                <p>{dealer.email}</p>
                <p>{dealer.phone || "Phone not added"}</p>
                <p>Joined on {formatDate(dealer.createdAt)}</p>
              </div>
            </div>

            <Button type="button" variant="secondary" onClick={() => onDeleteDealer(dealer._id)} className="text-red-600">
              <Trash2 className="h-4 w-4" />
              Delete dealer
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}

function CarsSection({ cars }) {
  if (cars.length === 0) {
    return (
      <Card padding="lg" className="border-dashed text-center">
        <h3 className="text-xl font-semibold tracking-tight text-slate-950">No cars found</h3>
        <p className="mt-3 text-sm leading-7 text-[var(--color-text-soft)]">
          Car listings from all dealers will appear here.
        </p>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {cars.map((car) => (
        <Card key={car._id} padding="lg" className="border-white/80 bg-white/88 backdrop-blur-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-brand)]">{car.brand}</p>
          <h3 className="mt-2 text-xl font-semibold tracking-tight text-slate-950">{car.title}</h3>
          <p className="mt-2 text-sm text-[var(--color-text-soft)]">
            Dealer: <span className="font-semibold text-slate-900">{car.dealerName}</span>
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Price</p>
              <p className="mt-1 text-sm font-semibold text-slate-950">{formatPrice(car.price)}</p>
            </div>
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Year</p>
              <p className="mt-1 text-sm font-semibold text-slate-950">{car.year}</p>
            </div>
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Fuel</p>
              <p className="mt-1 text-sm font-semibold text-slate-950">{car.fuelType}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

function EnquiriesSection({ enquiries }) {
  if (enquiries.length === 0) {
    return (
      <Card padding="lg" className="border-dashed text-center">
        <h3 className="text-xl font-semibold tracking-tight text-slate-950">No enquiries found</h3>
        <p className="mt-3 text-sm leading-7 text-[var(--color-text-soft)]">
          Buyer messages from across the platform will appear here.
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
                {enquiry.carBrand ? `${enquiry.carBrand} enquiry` : "Marketplace enquiry"}
              </p>
              <h3 className="mt-2 text-xl font-semibold tracking-tight text-slate-950">{enquiry.carTitle}</h3>
              <p className="mt-2 text-sm text-[var(--color-text-soft)]">
                Dealer: <span className="font-semibold text-slate-900">{enquiry.dealerName}</span>
              </p>
              <p className="mt-1 text-sm text-[var(--color-text-soft)]">Received on {formatDate(enquiry.createdAt)}</p>
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

export default function AdminDashboardContent() {
  const [admin, setAdmin] = useState(null);
  const [dealers, setDealers] = useState([]);
  const [cars, setCars] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackType, setFeedbackType] = useState("success");
  const [loginForm, setLoginForm] = useState(emptyLoginForm);

  useEffect(() => {
    loadAdminSession();
  }, []);

  function showFeedback(type, message) {
    setFeedbackType(type);
    setFeedbackMessage(message);
  }

  async function loadAdminSession() {
    setPageLoading(true);

    try {
      const response = await fetch("/api/admin/me", {
        cache: "no-store",
      });
      const result = await response.json();

      if (!response.ok) {
        setAdmin(null);
        setDealers([]);
        setCars([]);
        setEnquiries([]);

        if (response.status !== 401) {
          showFeedback("error", result.message || "Could not load the admin session.");
        }

        setPageLoading(false);
        return;
      }

      setAdmin(result.admin);
      await loadDashboardData();
    } catch (error) {
      console.error("Admin session error:", error);
      showFeedback("error", "Something went wrong while loading the admin dashboard.");
    } finally {
      setPageLoading(false);
    }
  }

  async function loadDashboardData() {
    try {
      const [dealersResponse, carsResponse, enquiriesResponse] = await Promise.all([
        fetch("/api/admin/dealers", { cache: "no-store" }),
        fetch("/api/admin/cars", { cache: "no-store" }),
        fetch("/api/admin/enquiries", { cache: "no-store" }),
      ]);

      const dealersResult = await dealersResponse.json();
      const carsResult = await carsResponse.json();
      const enquiriesResult = await enquiriesResponse.json();

      if (!dealersResponse.ok) {
        throw new Error(dealersResult.message || "Could not load dealers.");
      }

      if (!carsResponse.ok) {
        throw new Error(carsResult.message || "Could not load cars.");
      }

      if (!enquiriesResponse.ok) {
        throw new Error(enquiriesResult.message || "Could not load enquiries.");
      }

      setDealers(dealersResult.dealers || []);
      setCars(carsResult.cars || []);
      setEnquiries(enquiriesResult.enquiries || []);
    } catch (error) {
      console.error("Admin dashboard data error:", error);
      showFeedback("error", error.message || "Something went wrong while loading the admin dashboard.");
    }
  }

  function handleInputChange(event) {
    const { name, value } = event.target;

    setLoginForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  }

  async function handleLogin(event) {
    event.preventDefault();
    setLoginLoading(true);
    showFeedback("success", "");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginForm),
      });

      const result = await response.json();

      if (!response.ok) {
        showFeedback("error", result.message || "Could not log in as admin.");
        return;
      }

      setAdmin(result.admin);
      setLoginForm(emptyLoginForm);
      showFeedback("success", result.message || "Admin logged in successfully.");
      await loadDashboardData();
    } catch (error) {
      console.error("Admin login error:", error);
      showFeedback("error", "Something went wrong while logging in as admin.");
    } finally {
      setLoginLoading(false);
      setPageLoading(false);
    }
  }

  async function handleLogout() {
    try {
      await fetch("/api/admin/logout", {
        method: "POST",
      });
    } catch (error) {
      console.error("Admin logout error:", error);
    }

    setAdmin(null);
    setDealers([]);
    setCars([]);
    setEnquiries([]);
    setLoginForm(emptyLoginForm);
    showFeedback("success", "Admin logged out successfully.");
  }

  async function handleDeleteDealer(dealerId) {
    const shouldDelete = window.confirm("Delete this dealer and all related cars and enquiries?");

    if (!shouldDelete) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/dealers/${dealerId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        showFeedback("error", result.message || "Could not delete the dealer.");
        return;
      }

      // Reload everything so dealer, car, and enquiry lists stay in sync.
      await loadDashboardData();
      showFeedback("success", result.message || "Dealer deleted successfully.");
    } catch (error) {
      console.error("Delete dealer error:", error);
      showFeedback("error", "Something went wrong while deleting the dealer.");
    }
  }

  if (pageLoading) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <Card padding="lg" className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-brand)]">
            Super admin panel
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">Loading admin dashboard...</h1>
        </Card>
      </div>
    );
  }

  if (!admin) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <AdminLoginSection
          loginForm={loginForm}
          loading={loginLoading}
          feedbackMessage={feedbackMessage}
          feedbackType={feedbackType}
          onInputChange={handleInputChange}
          onSubmit={handleLogin}
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
              Super admin panel
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Welcome back, {admin.name}
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--color-text-soft)]">
              Review dealer accounts, monitor all cars, and read enquiries from one simple role-based dashboard.
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

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          <StatCard icon={ShieldCheck} label="Admin" value={admin.role} />
          <StatCard icon={Users} label="Dealers" value={dealers.length} />
          <StatCard icon={CarFront} label="Cars" value={cars.length} />
          <StatCard icon={MessageSquare} label="Enquiries" value={enquiries.length} />
        </div>
      </Card>

      <div className="mt-6">
        <FeedbackMessage type={feedbackType} message={feedbackMessage} />
      </div>

      <section className="mt-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-brand)]">Dealers</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Manage dealer accounts</h2>
          <p className="mt-2 text-sm leading-7 text-[var(--color-text-soft)]">
            Delete dealer accounts when needed. Related cars and enquiries are removed at the same time.
          </p>
        </div>

        <div className="mt-6">
          <DealersSection dealers={dealers} onDeleteDealer={handleDeleteDealer} />
        </div>
      </section>

      <section className="mt-10">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-brand)]">Cars</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">All marketplace listings</h2>
        </div>

        <div className="mt-6">
          <CarsSection cars={cars} />
        </div>
      </section>

      <section className="mt-10">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-brand)]">Enquiries</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">All buyer messages</h2>
        </div>

        <div className="mt-6">
          <EnquiriesSection enquiries={enquiries} />
        </div>
      </section>
    </div>
  );
}
