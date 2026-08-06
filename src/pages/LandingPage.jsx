import { useNavigate } from "react-router-dom";
import { QRCode } from "react-qrcode-logo";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BarChart3,
  Copy,
  Link2,
  MonitorSmartphone,
  QrCode,
  Scissors,
} from "lucide-react";
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
        className="flex-1 rounded-t-md bg-primary/70 transition-colors last:bg-primary"
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
        <stop offset="0%" stopColor="currentColor" stopOpacity="0.25" />
        <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
      </linearGradient>
    </defs>
    <path
      d="M0 52 C 24 48, 32 30, 52 34 S 88 18, 108 26 S 150 8, 170 14 S 192 8, 200 4 L 200 64 L 0 64 Z"
      fill="url(#demoArea)"
      className="text-primary"
    />
    <path
      d="M0 52 C 24 48, 32 30, 52 34 S 88 18, 108 26 S 150 8, 170 14 S 192 8, 200 4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      className="text-primary"
    />
  </svg>
);

const FEATURES = [
  {
    icon: BarChart3,
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
    className: "",
  },
  {
    icon: Link2,
    title: "Custom links",
    description:
      "Own your slug. Branded short links that look like they were always yours.",
    visual: (
      <div className="mt-8">
        <div className="flex flex-wrap items-center gap-1.5 rounded-xl border bg-muted/40 p-3 font-mono text-sm">
          <span className="text-muted-foreground">{SHORT_DOMAIN}/</span>
          <span className="font-semibold text-primary">my-brand</span>
        </div>
      </div>
    ),
    className: "",
  },
];

const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = UrlState();

  return (
    <div>
      {/* Hero — asymmetric split */}
      <section className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:px-8">
        <div>
          <span className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Free forever · no credit card
          </span>

          <h1 className="mt-6 text-4xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Make every link
            <br />
            <span className="inline-flex flex-wrap items-center gap-3">
              <span className="inline-flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-card sm:size-11">
                <Scissors className="size-4.5 sm:size-5.5" aria-hidden="true" />
              </span>
              <span className="text-primary">count twice.</span>
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Trimrr turns long URLs into short, trackable links — with real-time
            analytics, custom aliases, and QR codes baked in.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            {isAuthenticated ? (
              <Button
                size="lg"
                className="text-base"
                onClick={() => navigate("/dashboard")}
              >
                Go to Dashboard
                <ArrowRight className="size-4" aria-hidden="true" />
              </Button>
            ) : (
              <>
                <Button
                  size="lg"
                  className="text-base"
                  onClick={() => navigate("/auth?tab=signup")}
                >
                  Get Started Free
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Button>
                <Button
                  size="lg"
                  variant="ghost"
                  className="text-base text-muted-foreground"
                  onClick={() => navigate("/auth?tab=login")}
                >
                  Sign in
                </Button>
              </>
            )}
          </div>

          <p className="mt-6 font-mono text-xs uppercase tracking-widest text-muted-foreground/80">
            No credit card · 60-second setup
          </p>
        </div>

        {/* Live product demo */}
        <div className="animate-float lg:pl-6">
          <div className="rounded-3xl border border-border bg-card p-5 shadow-card sm:p-6">
            <div className="flex items-center justify-between">
              <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                Your short link
              </p>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 font-mono text-xs font-medium text-primary">
                demo preview
              </span>
            </div>

            <div className="mt-4 flex items-center gap-2 rounded-xl border border-border bg-background p-3.5">
              <span className="min-w-0 flex-1 truncate font-mono text-sm text-foreground">
                {SHORT_DOMAIN}/a4f9z
              </span>
              <Button
                variant="ghost"
                size="icon-sm"
                className="shrink-0 text-muted-foreground"
                aria-label="Copy demo link"
              >
                <Copy className="size-4" aria-hidden="true" />
              </Button>
            </div>

            <div className="mt-4 grid grid-cols-[auto_1fr] gap-4">
              <div className="flex size-24 items-center justify-center rounded-xl border border-border bg-background p-2">
                <QRCode
                  size={80}
                  value={`${APP_URL}/a4f9z`}
                  bgColor="#ffffff"
                  fgColor="#18181b"
                  level="H"
                  includeMargin={false}
                />
              </div>
              <div className="flex flex-col justify-between">
                <div>
                  <p className="text-sm font-semibold">Clicks today</p>
                  <p className="mt-0.5 font-mono text-2xl font-semibold text-primary">
                    46
                  </p>
                </div>
                <p className="font-mono text-xs text-muted-foreground">
                  SG · DE · US · IN · GB
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-border bg-background p-3.5">
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
      </section>

      {/* Features — bento */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">
            One tool to shorten, share, and understand every link you create.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Shorten — large tile */}
          <div
            className="stagger-item rounded-3xl border border-border bg-card p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover sm:p-8 md:col-span-1"
            style={{ "--i": 0 }}
          >
            <div className="flex size-12 animate-float items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Scissors className="size-6" aria-hidden="true" />
            </div>
            <h3 className="mt-5 text-xl font-semibold">Shorten URLs</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Transform long, messy links into clean, shareable short URLs in
              seconds.
            </p>
            <div className="mt-8 rounded-xl border border-border bg-muted/40 p-3 font-mono text-xs">
              <p className="truncate text-muted-foreground">
                https://example.com/very/long/path?utm_source=newsletter
              </p>
              <p className="mt-2 flex items-center gap-2 text-foreground">
                <ArrowRight
                  className="size-3.5 text-muted-foreground"
                  aria-hidden="true"
                />
                <span className="text-primary">{SHORT_DOMAIN}/a4f9z</span>
              </p>
            </div>
          </div>

          {FEATURES.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="stagger-item rounded-3xl border border-border bg-card p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover sm:p-8"
                style={{ "--i": i + 1 }}
              >
                <div className="flex size-12 animate-float animate-float-delayed items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon className="size-6" aria-hidden="true" />
                </div>
                <h3 className="mt-5 text-xl font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
                {feature.visual}
              </div>
            );
          })}
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-5">
          {/* QR — wide tile */}
          <div
            className="stagger-item rounded-3xl border border-border bg-card p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover sm:p-8 md:col-span-3"
            style={{ "--i": 3 }}
          >
            <div className="flex items-start gap-6 sm:items-center">
              <div className="flex size-24 shrink-0 items-center justify-center rounded-2xl border border-border bg-background p-2">
                <QRCode
                  size={80}
                  value={APP_URL}
                  bgColor="#ffffff"
                  fgColor="#18181b"
                  level="H"
                  includeMargin={false}
                />
              </div>
              <div>
                <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <QrCode className="size-6" aria-hidden="true" />
                </div>
                <h3 className="mt-5 text-xl font-semibold">QR codes</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Every link ships with a scannable QR — print it, ship it,
                  point a phone at it.
                </p>
              </div>
            </div>
          </div>

          {/* Analytics — narrow tile */}
          <div
            className="stagger-item rounded-3xl border border-border bg-card p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover sm:p-8 md:col-span-2"
            style={{ "--i": 4 }}
          >
            <div className="flex size-12 animate-float items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <BarChart3 className="size-6" aria-hidden="true" />
            </div>
            <h3 className="mt-5 text-xl font-semibold">Real-time analytics</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Cities, devices, and click curves — refreshed the moment a link is
              hit.
            </p>
            <div className="mt-6">
              <MiniLine />
              <div className="mt-3 flex flex-wrap gap-1.5">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-2 py-0.5 font-mono text-xs text-muted-foreground">
                  <MonitorSmartphone className="size-3" aria-hidden="true" />
                  Desktop
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-2 py-0.5 font-mono text-xs text-muted-foreground">
                  Mobile
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      {!isAuthenticated && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-[#18181b] p-8 text-white sm:p-12">
            <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-primary/20 blur-3xl" />
            <div className="relative flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
              <div className="max-w-xl">
                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  Ready to simplify your links?
                </h2>
                <p className="mt-3 text-muted-foreground">
                  Join the people who trust Trimrr to manage, track, and
                  optimize their links.
                </p>
              </div>
              <Button
                size="lg"
                className="bg-white text-[#18181b] hover:bg-white/90"
                onClick={() => navigate("/auth?tab=signup")}
              >
                Create Your Free Account
                <ArrowRight className="size-4" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default LandingPage;
