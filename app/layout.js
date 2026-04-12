import "./globals.css";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: {
    default: "valuedrive",
    template: "%s | valuedrive",
  },
  description: "A simple car marketplace starter built with Next.js, Tailwind CSS, and MongoDB.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="text-[var(--color-text)] antialiased">
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
