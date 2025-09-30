import Link from 'next/link';

export function Footer() {
  return (
  <footer className="border-t border-border/60 bg-background/80 backdrop-blur">
      <div className="container flex flex-col gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-medium text-foreground">CryptoTracker</p>
          <p>&copy; {new Date().getFullYear()} Powered by CoinGecko data.</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Link
            href="https://github.com/rahmatez/crypto-tracker"
            className="rounded-full border border-border/60 px-3 py-1 text-xs font-semibold text-foreground transition hover:border-primary/60 hover:text-primary"
          >
            GitHub Repository
          </Link>
          <Link
            href="https://github.com/rahmatez"
            className="rounded-full border border-border/60 px-3 py-1 text-xs font-semibold text-foreground transition hover:border-primary/60 hover:text-primary"
          >
            @rahmatez
          </Link>
        </div>
      </div>
    </footer>
  );
}
