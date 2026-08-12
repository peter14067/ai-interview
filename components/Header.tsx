import Link from "next/link";
import { GearIcon } from "@/components/icons";

const navLinks = [
  { href: "/#features", label: "產品特色" },
  { href: "/#how-it-works", label: "使用方式" },
  { href: "/#faq", label: "常見問題" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/70 backdrop-blur-md dark:border-white/10 dark:bg-black/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand to-accent text-sm font-bold text-white">
            M
          </span>
          <span className="text-base font-semibold tracking-tight text-black dark:text-white">
            MockMate
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-zinc-600 md:flex dark:text-zinc-400">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-black dark:hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/settings"
            aria-label="設定"
            className="flex h-9 w-9 items-center justify-center rounded-full text-zinc-500 transition-colors hover:bg-black/5 hover:text-black dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-white"
          >
            <GearIcon className="h-5 w-5" />
          </Link>
          <Link
            href="/interview"
            className="rounded-full bg-gradient-to-r from-brand to-accent px-5 py-2 text-sm font-semibold text-white shadow-sm shadow-brand/30 transition-transform hover:scale-[1.03]"
          >
            開始模擬面試
          </Link>
        </div>
      </div>
    </header>
  );
}
