import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
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
      <section className="flex flex-col items-center gap-6 py-16 sm:py-24 text-center max-w-3xl">
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight">
          Shorten URLs.
          <br />
          <span className="text-blue-500">Track everything.</span>
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-xl">
          Trimrr turns long URLs into short, powerful links. Get real-time
          analytics, custom aliases, and QR codes — all in one place.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          {isAuthenticated ? (
            <Button
              size="lg"
              className="text-base h-12 px-8"
              onClick={() => navigate("/dashboard")}
            >
              <Zap size={18} />
              Go to Dashboard
            </Button>
          ) : (
            <>
              <Button
                size="lg"
                className="text-base h-12 px-8"
                onClick={() => navigate("/auth?tab=signup")}
              >
                <Zap size={18} />
                Get Started Free
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-base h-12 px-8"
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
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
          Everything you need
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="flex flex-col items-center text-center gap-3 rounded-xl border bg-card p-6 transition-colors hover:border-blue-500/40"
              >
                <div className="flex size-12 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
                  <Icon size={24} />
                </div>
                <h3 className="font-semibold text-lg">{feature.title}</h3>
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
          <div className="rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 border p-8 sm:p-12 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              Ready to simplify your links?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Join thousands of users who trust Trimrr to manage, track, and
              optimize their links.
            </p>
            <Button
              size="lg"
              className="text-base h-12 px-8"
              onClick={() => navigate("/auth?tab=signup")}
            >
              Create Your Free Account
            </Button>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="w-full py-16 sm:py-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
          Frequently asked questions
        </h2>
        <Accordion type="multiple" collapsible className="w-full max-w-2xl mx-auto">
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