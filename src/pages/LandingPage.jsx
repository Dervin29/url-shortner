import { useNavigate } from "react-router-dom";
import { QRCode } from "react-qrcode-logo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Reveal from "@/components/Reveal";
import {
  ArrowRight,
  ChartBar,
  Copy,
  LinkSimple,
  DeviceMobile,
  Scissors,
} from "@phosphor-icons/react";
import { UrlState } from "@/context/context";

const APP_URL = import.meta.env.VITE_APP_URL || "trimrr.app";
const SHORT_DOMAIN = (() => {
  try {
    return new URL(APP_URL).hostname;
  } catch {
    return APP_URL;
  }
})();

const WEEK = [12, 28, 19, 41, 34, 57, 46];

const MiniBars = ({ values = WEEK, className = "" }) => (
  <div
    className={`flex h-16 items-end gap-1.5 ${className}`}
    aria-hidden="true"
  >
    {values.map((v, i) => (
      <span
        key={i}
        className="flex-1 rounded-t-sm bg-foreground/15 transition-colors last:bg-foreground"
        style={{ height: `${(v / Math.max(...values)) * 100}%` }}
      />
    ))}
  </div>
);

const MiniLine = () => (
  <svg
    viewBox="0 0 200 64"
    className="h-16 w-full"
    preserveAspectRatio="none"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="demoArea" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="currentColor" stopOpacity="0.2" />
        <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
      </linearGradient>
    </defs>
    <path
      d="M0 52 C 24 48, 32 30, 52 34 S 88 18, 108 26 S 150 8, 170 14 S 192 8, 200 4 L 200 64 L 0 64 Z"
      fill="url(#demoArea)"
      className="text-foreground"
    />
    <path
      d="M0 52 C 24 48, 32 30, 52 34 S 88 18, 108 26 S 150 8, 170 14 S 192 8, 200 4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      className="text-foreground"
    />
  </svg>
);

const FEATURES = [
  {
    icon: ChartBar,
    title: "Track clicks",
    description:
      "See total clicks, top cities, and device splits for every link — live.",
    visual: (
      <div className="mt-8">
        <MiniBars />
        <p className="mt-3 font-mono text-xs text-muted-foreground">
          last 7 days
        </p>
      </div>
    ),
  },
  {
    icon: LinkSimple,
    title: "Custom links",
    description:
      "Own your slug. Branded short links that look like they were always yours.",
    visual: (
      <div className="mt-8">
        <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-border bg-muted/30 p-3 font-mono text-sm">
          <span className="text-muted-foreground">{SHORT_DOMAIN}/</span>
          <span className="font-semibold text-foreground">my-brand</span>
        </div>
      </div>
    ),
  },
];

const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = UrlState();

  return (
    <div>
      {/* Hero — asymmetric split */}
      <section className="relative mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:px-8">
        <div className="ambient-blob -top-32 left-1/4 -z-10 hidden size-[32rem] bg-brand sm:block" />

        <Reveal>
          <Badge variant="outline">Free forever · no credit card</Badge>

          <h1 className="mt-6 font-display text-[2.75rem] leading-[1.05] font-medium tracking-[-0.03em] sm:text-6xl lg:text-[4rem]">
            Make every link
            <br />
            count twice.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Trimrr turns long URLs into short, trackable links — with real-time
            analytics, custom aliases, and QR codes baked in.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            {isAuthenticated ? (
              <Button
                size="lg"
                onClick={() => navigate("/dashboard")}
              >
                Go to Dashboard
                <ArrowRight weight="bold" className="size-4" aria-hidden="true" />
              </Button>
            ) : (
              <>
                <Button
                  size="lg"
                  onClick={() => navigate("/auth?tab=signup")}
                >
                  Get Started Free
                  <ArrowRight weight="bold" className="size-4" aria-hidden="true" />
                </Button>
                <Button
                  size="lg"
                  variant="ghost"
                  className="text-muted-foreground"
                  onClick={() => navigate("/auth?tab=login")}
                >
                  Sign in
                </Button>
              </>
            )}
          </div>

          <p className="mt-6 font-mono text-xs uppercase tracking-[0.08em] text-muted-foreground">
            No credit card · 60-second setup
          </p>
        </Reveal>

        {/* Live product demo */}
        <Reveal delay={120}>
          <div className="overflow-hidden rounded-xl border border-border bg-card">
            <div className="flex items-center gap-3 border-b border-border bg-muted/20 px-4 py-2.5 sm:px-5">
              <span className="flex items-center gap-1.5" aria-hidden="true">
                <span className="size-2.5 rounded-full bg-muted" />
                <span className="size-2.5 rounded-full bg-muted" />
                <span className="size-2.5 rounded-full bg-muted" />
              </span>
              <span className="ml-1 truncate font-mono text-xs text-muted-foreground">
                {SHORT_DOMAIN}/a4f9z
              </span>
            </div>

            <div className="p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <p className="font-mono text-xs uppercase tracking-[0.08em] text-muted-foreground">
                  Your short link
                </p>
                <Badge variant="info">demo preview</Badge>
              </div>

            <div className="mt-4 flex items-center gap-2 rounded-lg border border-border bg-background p-3.5">
              <span className="min-w-0 flex-1 truncate font-mono text-sm text-foreground">
                {SHORT_DOMAIN}/a4f9z
              </span>
              <Button
                variant="ghost"
                size="icon-sm"
                className="shrink-0 text-muted-foreground"
                aria-label="Copy demo link"
              >
                <Copy weight="bold" className="size-4" aria-hidden="true" />
              </Button>
            </div>

            <div className="mt-4 grid grid-cols-[auto_1fr] gap-4">
              <div className="flex size-24 items-center justify-center rounded-lg border border-border bg-background p-2">
                <QRCode
                  size={80}
                  value={`${APP_URL}/a4f9z`}
                  bgColor="#ffffff"
                  fgColor="#171717"
                  level="H"
                  includeMargin={false}
                />
              </div>
              <div className="flex flex-col justify-between">
                <div>
                  <p className="text-sm font-semibold">Clicks today</p>
                  <p className="mt-0.5 font-mono text-2xl font-semibold">
                    46
                  </p>
                </div>
                <p className="font-mono text-xs text-muted-foreground">
                  SG · DE · US · IN · GB
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-lg border border-border bg-background p-3.5">
              <div className="flex items-center justify-between">
                <p className="font-mono text-xs text-muted-foreground">
                  last 7 days
                </p>
                <p className="font-mono text-xs font-medium text-foreground">
                  46 <span className="text-muted-foreground">today</span>
                </p>
              </div>
              <MiniBars className="mt-3 h-12" />
            </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Features — bento */}
      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <Reveal>
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-medium tracking-[-0.02em] sm:text-4xl">
              Everything you need
            </h2>
            <p className="mt-3 text-lg text-muted-foreground">
              One tool to shorten, share, and understand every link you create.
            </p>
          </div>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Shorten — large tile */}
          <Reveal
            delay={0}
            className="rounded-lg border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover sm:p-8 md:col-span-1"
          >
            <div className="flex size-12 items-center justify-center rounded-lg border border-border bg-muted/40">
              <Scissors weight="bold" className="size-6" aria-hidden="true" />
            </div>
            <h3 className="mt-5 text-xl font-semibold tracking-[-0.01em]">
              Shorten URLs
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Transform long, messy links into clean, shareable short URLs in
              seconds.
            </p>
            <div className="mt-8 rounded-lg border border-border bg-muted/30 p-3 font-mono text-xs">
              <p className="truncate text-muted-foreground">
                https://example.com/very/long/path?utm_source=newsletter
              </p>
              <p className="mt-2 flex items-center gap-2 text-foreground">
                <ArrowRight
                  weight="bold"
                  className="size-3.5 text-muted-foreground"
                  aria-hidden="true"
                />
                <span className="text-primary">{SHORT_DOMAIN}/a4f9z</span>
              </p>
            </div>
          </Reveal>

          {FEATURES.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <Reveal
                key={feature.title}
                delay={(i + 1) * 80}
                className="rounded-lg border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover sm:p-8"
              >
                <div className="flex size-12 items-center justify-center rounded-lg border border-border bg-muted/40">
                  <Icon weight="bold" className="size-6" aria-hidden="true" />
                </div>
                <h3 className="mt-5 text-xl font-semibold tracking-[-0.01em]">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
                {feature.visual}
              </Reveal>
            );
          })}
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-5">
          {/* QR — wide tile */}
          <Reveal
            delay={320}
            className="flex items-center rounded-lg border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover sm:p-8 md:col-span-3"
          >
            <div className="flex w-full flex-col items-center gap-6 sm:flex-row sm:items-center sm:gap-8">
              <div className="flex size-28 shrink-0 items-center justify-center rounded-lg border border-border bg-background p-2.5">
                <QRCode
                  size={92}
                  value={APP_URL}
                  bgColor="#ffffff"
                  fgColor="#171717"
                  level="H"
                  includeMargin={false}
                />
              </div>
              <div className="text-center sm:text-left">
                <h3 className="text-xl font-semibold tracking-[-0.01em]">
                  QR codes
                </h3>
                <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground sm:mx-0">
                  Every link ships with a scannable QR — print it, ship it,
                  point a phone at it.
                </p>
              </div>
            </div>
          </Reveal>

          {/* Analytics — narrow tile */}
          <Reveal
            delay={400}
            className="rounded-lg border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover sm:p-8 md:col-span-2"
          >
            <div className="flex size-12 items-center justify-center rounded-lg border border-border bg-muted/40">
              <ChartBar weight="bold" className="size-6" aria-hidden="true" />
            </div>
            <h3 className="mt-5 text-xl font-semibold tracking-[-0.01em]">
              Real-time analytics
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Cities, devices, and click curves — refreshed the moment a link is
              hit.
            </p>
            <div className="mt-6">
              <MiniLine />
              <div className="mt-3 flex flex-wrap gap-1.5">
                <Badge variant="outline">
                  <DeviceMobile weight="bold" className="mr-1.5 size-3" aria-hidden="true" />
                  Desktop
                </Badge>
                <Badge variant="outline">Mobile</Badge>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      {!isAuthenticated && (
        <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <Reveal>
            <div className="relative overflow-hidden rounded-xl bg-primary p-8 text-primary-foreground sm:p-12">
              <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-foreground/10 blur-3xl" />
              <div className="relative flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
                <div className="max-w-xl">
                  <h2 className="font-display text-3xl font-medium tracking-[-0.02em]">
                    Ready to simplify your links?
                  </h2>
                  <p className="mt-3 text-primary-foreground/70">
                    Join the people who trust Trimrr to manage, track, and
                    optimize their links.
                  </p>
                </div>
                <Button
                  size="lg"
                  className="bg-primary-foreground text-primary hover:opacity-90"
                  onClick={() => navigate("/auth?tab=signup")}
                >
                  Create Your Free Account
                  <ArrowRight weight="bold" className="size-4" aria-hidden="true" />
                </Button>
              </div>
            </div>
          </Reveal>
        </section>
      )}
    </div>
  );
};

export default LandingPage;
