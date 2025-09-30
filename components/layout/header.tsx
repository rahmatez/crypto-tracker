"use client";

import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import type { ChangeEvent } from 'react';
import { Bookmark, LineChart, Search } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { CurrencySwitcher } from '../currency-switcher';
import { ThemeToggle } from '../theme-toggle';

function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState('');
  const [debounced, setDebounced] = useState('');

  useEffect(() => {
    const initial = searchParams.get('query') ?? '';
    setSearch(initial);
    setDebounced(initial);
  }, [searchParams]);

  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(search), 300);
    return () => clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (debounced) {
      params.set('query', debounced);
    } else {
      params.delete('query');
    }
    const queryString = params.toString();
    router.replace(queryString ? `/?${queryString}` : '/');
  }, [debounced, router, searchParams]);

  return (
    <>
      <Search className="h-4 w-4" aria-hidden />
      <Input
        value={search}
        onChange={(event: ChangeEvent<HTMLInputElement>) => setSearch(event.target.value)}
        placeholder="Search coins..."
        className="h-6 w-56 border-0 bg-transparent px-0 py-0 text-sm focus-visible:ring-0"
      />
    </>
  );
}

export function Header() {
  const pathname = usePathname();
  const isHome = pathname === '/';

  return (
    <header className="sticky top-0 z-30 border-b border-border/80 bg-background/70 backdrop-blur">
      <div className="container flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
            <LineChart className="h-5 w-5 text-primary" />
            <span>CryptoTracker</span>
          </Link>
          {isHome ? (
            <div className="hidden items-center gap-2 rounded-full border border-border/80 bg-muted/40 px-3 py-1.5 text-sm text-muted-foreground sm:flex">
              <Suspense fallback={
                <>
                  <Search className="h-4 w-4" aria-hidden />
                  <div className="h-6 w-56 bg-transparent" />
                </>
              }>
                <SearchInput />
              </Suspense>
            </div>
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          <CurrencySwitcher />
          <Button variant={pathname === '/watchlist' ? 'default' : 'ghost'} asChild>
            <Link href="/watchlist" className="flex items-center gap-1">
              <Bookmark className="h-4 w-4" />
              <span className="hidden sm:inline">Watchlist</span>
            </Link>
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
