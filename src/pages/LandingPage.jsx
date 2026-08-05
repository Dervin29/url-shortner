import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  BarChart3,
  Link2,
  QrCode,
  Scissors,
  Zap,
} from "lucide-react";
import { UrlState } from "@/context/context";

const FEATURES = [
  {
    icon: Scissors,
    title: "Shorten URLs",
    description:
      "Transform long, messy links into clean, shareable short URLs in seconds.",
  },
  {
    icon: BarChart3,
    title: "Track Clicks",
    description:
      "Get detailed analytics on every link — total clicks, locations, and device types.",
  },
  {
    icon: Link2,
    title: "Custom Links",
    description:
      "Create branded short URLs with your own custom aliases for easy recognition.",
  },
  {
    icon: QrCode,
    title: "QR Codes",
    description:
      "Generate QR codes for every shortened link to use in print or offline campaigns.",
  },
];

const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = UrlState();

  return (
    <div className="flex flex-col items-center">
      {/* Hero */}
      <section className="flex flex-col items-center gap-6 py-16 text-center sm:py-24">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
          Free forever · No credit card required
        </span>

        <h1 className="max-w-3xl text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl">
          Shorten URLs.
          <br />
          <span className="text-primary">Track everything.</span>
        </h1>

        <p className="max-w-xl text-lg text-muted-foreground sm:text-xl">
          Trimrr turns long URLs into short, powerful links. Get real-time
          analytics, custom aliases, and QR codes — all in one place.
        </p>

        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          {isAuthenticated ? (
            <Button
              size="lg"
              className="gap-2 text-base"
              onClick={() => navigate("/dashboard")}
            >
              <Zap className="size-5" aria-hidden="true" />
              Go to Dashboard
            </Button>
          ) : (
            <>
              <Button
                size="lg"
                className="gap-2 text-base"
                onClick={() => navigate("/auth?tab=signup")}
              >
                <Zap className="size-5" aria-hidden="true" />
                Get Started Free
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-base"
                onClick={() => navigate("/auth?tab=login")}
              >
                Sign In
              </Button>
            </>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="w-full py-16 sm:py-20">
        <h2 className="mb-4 text-center text-3xl font-bold tracking-tight sm:text-4xl">
          Everything you need
        </h2>
        <p className="mx-auto mb-12 max-w-md text-center text-muted-foreground">
          One tool to shorten, share, and understand every link you create.
        </p>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="flex flex-col items-center gap-3 rounded-xl border bg-card p-6 text-center shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
              >
                <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-6" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Banner */}
      {!isAuthenticated && (
        <section className="w-full py-16 sm:py-20">
          <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 to-primary/5 p-8 text-center sm:p-12">
            <h2 className="mb-3 text-2xl font-bold tracking-tight sm:text-3xl">
              Ready to simplify your links?
            </h2>
            <p className="mx-auto mb-6 max-w-md text-muted-foreground">
              Join thousands of users who trust Trimrr to manage, track, and
              optimize their links.
            </p>
            <Button
              size="lg"
              className="text-base"
              onClick={() => navigate("/auth?tab=signup")}
            >
              Create Your Free Account
            </Button>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="w-full py-16 sm:py-20">
        <h2 className="mb-12 text-center text-3xl font-bold tracking-tight sm:text-4xl">
          Frequently asked questions
        </h2>
        <Accordion
          type="multiple"
          collapsible
          className="mx-auto w-full max-w-2xl"
        >
          <AccordionItem value="item-1">
            <AccordionTrigger>
              How does the Trimrr URL shortener work?
            </AccordionTrigger>
            <AccordionContent>
              When you enter a long URL, our system generates a shorter version
              of that URL. This shortened URL redirects to the original long URL
              when accessed.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>
              Do I need an account to use the app?
            </AccordionTrigger>
            <AccordionContent>
              Yes. Creating an account allows you to manage your URLs, view
              analytics, and customize your short URLs.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>
              What analytics are available for my shortened URLs?
            </AccordionTrigger>
            <AccordionContent>
              You can view the number of clicks, geolocation data of the clicks
              and device types (mobile/desktop) for each of your shortened URLs.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
    </div>
  );
};

export default LandingPage;
