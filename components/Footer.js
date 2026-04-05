export default function Footer() {
  return (
    <footer className="border-t border-[var(--color-line)] bg-white/70">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-6 text-sm text-[var(--color-text-soft)] sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <p>CarApp starter built with Next.js, Tailwind CSS, and MongoDB.</p>
        <p>Keep the foundation simple, then connect authentication and real data later.</p>
      </div>
    </footer>
  );
}

