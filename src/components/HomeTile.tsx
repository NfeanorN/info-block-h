import Link from "next/link";

type Props = {
  href: string;
  title: string;
  hint: string;
  action: string;
  color: string;
  soft: string;
  icon: React.ReactNode;
  delayMs?: number;
};

export function HomeTile({
  href,
  title,
  hint,
  action,
  color,
  soft,
  icon,
  delayMs = 0,
}: Props) {
  return (
    <Link
      href={href}
      className="home-tile group relative flex min-h-[150px] flex-col justify-between overflow-hidden rounded-[28px] border border-[var(--border)] bg-white p-5 transition duration-300 hover:-translate-y-1 hover:border-transparent hover:shadow-[var(--shadow-lg)] active:scale-[0.985] sm:min-h-[170px] sm:p-6 animate-fade-up"
      style={
        {
          animationDelay: `${delayMs}ms`,
          "--tile-accent": color,
          "--tile-soft": soft,
        } as React.CSSProperties
      }
    >
      <span
        className="pointer-events-none absolute inset-y-0 left-0 w-1.5 origin-left scale-y-90 rounded-r-full bg-[var(--tile-accent)] transition duration-300 group-hover:scale-y-100"
        aria-hidden
      />
      <span
        className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-0 transition duration-500 group-hover:opacity-100"
        style={{ background: `radial-gradient(circle, var(--tile-soft) 0%, transparent 70%)` }}
        aria-hidden
      />

      <div className="relative flex items-start justify-between gap-3">
        <span
          className="flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-sm transition duration-300 group-hover:scale-105"
          style={{ backgroundColor: color }}
        >
          {icon}
        </span>
        <span className="mt-1 text-sm font-bold text-[var(--fg-subtle)] transition group-hover:text-[var(--tile-accent)]">
          {action} →
        </span>
      </div>

      <div className="relative mt-5">
        <span className="block text-2xl font-extrabold leading-tight tracking-tight text-[var(--fg)] sm:text-[1.65rem]">
          {title}
        </span>
        <span className="mt-1.5 block text-sm font-medium leading-snug text-[var(--fg-muted)]">
          {hint}
        </span>
      </div>
    </Link>
  );
}
