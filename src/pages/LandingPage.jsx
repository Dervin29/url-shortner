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
  Lightning,
  MagnifyingGlass,
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
const MARQUEE_ITEMS = [
  "Shorten URLs",
  "Track every click",
  "Custom slugs",
  "QR codes included",
  "Real-time analytics",
  "Free forever",
  "No credit card",
];

const MiniBars = ({ values = WEEK, className = "" }) => (
  <div
    className={`flex h-16 items-end gap-1.5 ${className}`}
    aria-hidden="true"
  >
    {values.map((v, i) => (
      <span
        key={i}
        className="flex-1 border border-foreground/15 bg-foreground/10 last:border-foreground last:bg-foreground"
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

const Marquee = () => (
  <div
    className="-mx-4 overflow-hidden border-y-2 border-foreground bg-foreground py-3 sm:-mx-6 lg:-mx-8"
    aria-hidden="true"
  >
    <div className="marquee-track">
      {[0, 1].map((copy) => (
        <div key={copy} className="flex shrink-0 items-center">
          {MARQUEE_ITEMS.map((item) => (
            <span
              key={`${copy}-${item}`}
              className="flex items-center gap-8 pr-8 font-mono text-xs font-bold uppercase tracking-[0.2em] text-background"
            >
              <span className="flex items-center gap-3">
                <Scissors
                  weight="bold"
                  className="size-4 text-primary"
                />
                {item}
              </span>
            </span>
          ))}
        </div>
      ))}
    </div>
  </div>
);

const FEATURES = [
  {
    icon: ChartBar,
    title: "Track clicks",
    description:
      "See total clicks, top cities, and device splits for every link — live.",
    iconClass: "bg-accent text-accent-foreground",
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
    iconClass: "bg-secondary text-secondary-foreground",
    tileClass: "md:rotate-1 hover:rotate-0",
    visual: (
      <div className="mt-8">
        <div className="flex flex-wrap items-center gap-1.5 rounded-[4px] border border-foreground bg-background p-3 font-mono text-sm shadow-input">
          <span className="text-muted-foreground">{SHORT_DOMAIN}/</span>
          <span className="font-bold text-foreground">my-brand</span>
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
        <Reveal>
          <div className="flex flex-wrap items-center gap-3">
            <Badge
              variant="outline"
              className="-rotate-2 shadow-button-sm"
            >
              Free forever
            </Badge>
            <Badge
              variant="warning"
              className="rotate-2 shadow-button-sm"
            >
              No credit card
            </Badge>
          </div>

          <h1 className="mt-6 font-display text-[3rem] leading-[0.98] font-black tracking-[-0.04em] sm:text-6xl lg:text-[4.5rem]">
            Make every link{" "}
            <span className="relative inline-block">
              count twice.
              <span
                className="absolute inset-x-0 bottom-1 -z-10 h-[0.35em] -rotate-1 bg-primary"
                aria-hidden="true"
              />
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed font-medium text-muted-foreground">
            Trimrr turns long URLs into short, trackable links — with real-time
            analytics, custom aliases, and QR codes baked in.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            {isAuthenticated ? (
              <Button size="lg" onClick={() => navigate("/dashboard")}>
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
                  onClick={() => navigate("/auth?tab=login")}
                >
                  Sign in
                </Button>
              </>
            )}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Badge variant="success" className="shadow-button-sm">
              <Lightning weight="bold" className="size-3" aria-hidden="true" />
              60-second setup
            </Badge>
            <p className="font-mono text-xs uppercase tracking-[0.08em] text-muted-foreground">
              Free forever · No credit card
            </p>
          </div>
        </Reveal>

        {/* Live product demo */}
        <Reveal delay={120}>
          <div className="relative">
            <span
              className="absolute -top-4 -left-4 z-10 hidden size-16 -rotate-6 border border-foreground bg-accent shadow-button-sm sm:block"
              aria-hidden="true"
            />
            <span
              className="absolute -bottom-6 -right-4 z-10 hidden size-10 rotate-6 rounded-full border border-foreground bg-primary shadow-button-sm sm:block"
              aria-hidden="true"
            />

            <div className="overflow-hidden rounded-lg border border-foreground bg-card shadow-card lg:rotate-1 lg:transition-transform lg:duration-300 lg:hover:rotate-0">
              <div className="flex items-center justify-between gap-3 border-b-2 border-foreground bg-secondary px-4 py-2.5 text-secondary-foreground sm:px-5">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5" aria-hidden="true">
                    <span className="size-2.5 rounded-full border border-foreground bg-primary" />
                    <span className="size-2.5 rounded-full border border-foreground bg-background" />
                    <span className="size-2.5 rounded-full border border-foreground bg-accent" />
                  </span>
                  <span className="ml-1 truncate font-mono text-xs font-medium text-secondary-foreground">
                    {SHORT_DOMAIN}/a4f9z
                  </span>
                </div>
                <Badge variant="primary" className="hidden sm:inline-flex">
                  demo preview
                </Badge>
              </div>

              <div className="p-5 sm:p-6">
                <div className="flex items-center justify-between">
                  <p className="font-mono text-xs font-bold uppercase tracking-[0.08em] text-muted-foreground">
                    Your short link
                  </p>
                  <Badge variant="info">live</Badge>
                </div>

                <div className="mt-4 flex items-center gap-2 rounded-[4px] border border-foreground bg-background p-3.5 shadow-input">
                  <span className="min-w-0 flex-1 truncate font-mono text-sm font-semibold text-foreground">
                    {SHORT_DOMAIN}/a4f9z
                  </span>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="shrink-0"
                    aria-label="Copy demo link"
                  >
                    <Copy weight="bold" className="size-4" aria-hidden="true" />
                  </Button>
                </div>

                <div className="mt-4 grid grid-cols-[auto_1fr] gap-4">
                  <div className="flex size-24 items-center justify-center rounded-[4px] border border-foreground bg-white p-2">
                    <QRCode
                      size={80}
                      value={`${APP_URL}/a4f9z`}
                      bgColor="#ffffff"
                      fgColor="#191a1e"
                      level="H"
                      includeMargin={false}
                    />
                  </div>
                  <div className="flex flex-col justify-between">
                    <div>
                      <p className="text-sm font-bold">Clicks today</p>
                      <p className="mt-0.5 font-mono text-2xl font-bold">
                        46
                      </p>
                    </div>
                    <p className="font-mono text-xs text-muted-foreground">
                      SG · DE · US · IN · GB
                    </p>
                  </div>
                </div>

                <div className="mt-4 rounded-[4px] border border-foreground bg-background p-3.5">
                  <div className="flex items-center justify-between">
                    <p className="font-mono text-xs text-muted-foreground">
                      last 7 days
                    </p>
                    <p className="font-mono text-xs font-bold text-foreground">
                      46 <span className="font-medium text-muted-foreground">today</span>
                    </p>
                  </div>
                  <MiniBars className="mt-3 h-12" />
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Ticker tape */}
      <Marquee />

      {/* Features — bento */}
      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <Reveal>
          <div className="max-w-2xl">
            <Badge variant="default" className="shadow-button-sm">
              <MagnifyingGlass weight="bold" className="size-3" aria-hidden="true" />
              Everything you need
            </Badge>
            <h2 className="mt-5 font-display text-3xl font-black tracking-[-0.03em] sm:text-4xl">
              Shorten. Share. Measure.
            </h2>
            <p className="mt-3 text-lg font-medium text-muted-foreground">
              One tool to shorten, share, and understand every link you create.
            </p>
          </div>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Shorten — large yellow tile */}
          <Reveal
            delay={0}
            className="rounded-lg border border-foreground bg-primary p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover sm:p-8 md:-rotate-1 md:col-span-1 md:hover:rotate-0"
          >
            <div className="flex items-start justify-between">
              <div className="flex size-12 items-center justify-center rounded-[4px] border border-foreground bg-background shadow-button-sm">
                <Scissors weight="bold" className="size-6" aria-hidden="true" />
              </div>
              <Badge variant="primary" className="-rotate-3">
                Fast
              </Badge>
            </div>
            <h3 className="mt-5 text-xl font-black tracking-[-0.01em]">
              Shorten URLs
            </h3>
            <p className="mt-2 text-sm leading-relaxed font-medium text-primary-foreground/80">
              Transform long, messy links into clean, shareable short URLs in
              seconds.
            </p>
            <div className="mt-8 rounded-[4px] border border-foreground bg-background p-3 font-mono text-xs shadow-input">
              <p className="truncate text-muted-foreground">
                https://example.com/very/long/path?utm_source=newsletter
              </p>
              <p className="mt-2 flex items-center gap-2 font-bold text-foreground">
                <ArrowRight
                  weight="bold"
                  className="size-3.5 text-muted-foreground"
                  aria-hidden="true"
                />
                <span className="text-secondary">{SHORT_DOMAIN}/a4f9z</span>
              </p>
            </div>
          </Reveal>

          {FEATURES.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <Reveal
                key={feature.title}
                delay={(i + 1) * 80}
                className={`rounded-lg border border-foreground bg-card p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover sm:p-8 ${feature.tileClass || ""}`}
              >
                <div className={`flex size-12 items-center justify-center rounded-[4px] border border-foreground shadow-button-sm ${feature.iconClass}`}>
                  <Icon weight="bold" className="size-6" aria-hidden="true" />
                </div>
                <h3 className="mt-5 text-xl font-black tracking-[-0.01em]">
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

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-5">
          {/* QR — wide green tile */}
          <Reveal
            delay={320}
            className="flex items-center rounded-lg border border-foreground bg-success p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover sm:p-8 md:col-span-3 md:rotate-[0.5deg] md:hover:rotate-0"
          >
            <div className="flex w-full flex-col items-center gap-6 sm:flex-row sm:items-center sm:gap-8">
              <div className="relative">
                <div className="flex size-28 shrink-0 items-center justify-center rounded-[4px] border border-foreground bg-white p-2.5 shadow-button">
                  <QRCode
                    size={92}
                    value={APP_URL}
                    bgColor="#ffffff"
                    fgColor="#191a1e"
                    level="H"
                    includeMargin={false}
                  />
                </div>
                <span
                  className="absolute -top-3 -right-3 flex size-8 -rotate-6 items-center justify-center rounded-full border border-foreground bg-accent text-accent-foreground shadow-button-sm"
                  aria-hidden="true"
                >
                  <LinkSimple weight="bold" className="size-4" />
                </span>
              </div>
              <div className="text-center sm:text-left">
                <h3 className="text-xl font-black tracking-[-0.01em]">
                  QR codes
                </h3>
                <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed font-medium text-success-foreground/80 sm:mx-0">
                  Every link ships with a scannable QR — print it, ship it,
                  point a phone at it.
                </p>
              </div>
            </div>
          </Reveal>

          {/* Analytics — narrow tile */}
          <Reveal
            delay={400}
            className="rounded-lg border border-foreground bg-card p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover sm:p-8 md:col-span-2 md:rotate-1 md:hover:rotate-0"
          >
            <div className="flex size-12 items-center justify-center rounded-[4px] border border-foreground bg-primary shadow-button-sm">
              <ChartBar weight="bold" className="size-6" aria-hidden="true" />
            </div>
            <h3 className="mt-5 text-xl font-black tracking-[-0.01em]">
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
            <div className="relative overflow-hidden rounded-lg border border-foreground bg-primary p-8 shadow-card sm:p-12">
              <span
                className="pointer-events-none absolute -top-6 -right-6 flex size-24 -rotate-12 items-center justify-center rounded-[4px] border border-foreground bg-accent text-accent-foreground shadow-button-sm sm:size-28"
                aria-hidden="true"
              >
                <Scissors weight="bold" className="size-10" />
              </span>
              <div className="relative flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
                <div className="max-w-xl">
                  <h2 className="font-display text-3xl font-black tracking-[-0.03em] sm:text-4xl">
                    Ready to simplify your links?
                  </h2>
                  <p className="mt-3 font-medium text-primary-foreground/80">
                    Join the people who trust Trimrr to manage, track, and
                    optimize their links.
                  </p>
                </div>
                <Button
                  size="lg"
                  className="bg-foreground text-background hover:bg-foreground"
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
