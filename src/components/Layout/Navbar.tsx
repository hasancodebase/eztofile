'use client';

import Link from 'next/link';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

export default function Navbar() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const toggle = () => {
    const next = resolvedTheme === 'dark' ? 'light' : 'dark';
    setTheme(next);
  };

  const themeLabel =
    resolvedTheme === 'dark' ? 'Switch to light background' : 'Switch to dark background';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/80 bg-background/90 shadow-sm backdrop-blur-md supports-[backdrop-filter]:bg-background/75">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:h-[4.25rem] sm:px-6">
        <Link
          href="/"
          className="font-display text-xl font-bold tracking-tight text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:text-2xl"
        >
          Eztofile
        </Link>
        <p className="hidden max-w-[14rem] text-sm leading-snug text-muted-foreground sm:block md:max-w-xs">
          Free tools for your files — private &amp; straightforward
        </p>
        <nav className="flex shrink-0 items-center gap-2" aria-label="Site">
          {mounted ? (
            <Button
              type="button"
              variant="outline"
              size="icon-lg"
              onClick={toggle}
              className="size-11 rounded-xl border-border bg-card text-foreground shadow-sm hover:bg-muted"
              aria-label={themeLabel}
              title={themeLabel}
            >
              {resolvedTheme === 'dark' ? (
                <Sun className="size-5" aria-hidden />
              ) : (
                <Moon className="size-5" aria-hidden />
              )}
            </Button>
          ) : (
            <span className="inline-flex size-11 shrink-0 rounded-xl border border-transparent" aria-hidden />
          )}
        </nav>
      </div>
    </header>
  );
}
