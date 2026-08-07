import { Component } from "react";
import { Scissors, WarningCircle } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

const buttonClass =
  "inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-[4px] border border-foreground bg-background px-4 text-sm font-bold shadow-button transition-[background-color,color,transform,box-shadow] duration-150 ease-out select-none active:scale-[0.97] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-button-pressed";

const FallbackUI = ({ onReset }) => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-16 text-foreground">
      <div className="w-full max-w-xl page-enter">
        <div className="border-2 border-foreground bg-card p-8 shadow-card sm:p-12">
          <div className="flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-[4px] border border-foreground bg-primary text-primary-foreground shadow-button-sm">
              <Scissors weight="bold" className="size-5" aria-hidden="true" />
            </span>
            <span className="font-mono text-xs font-bold uppercase tracking-[0.08em] text-muted-foreground">
              Trimrr · Error Boundary
            </span>
          </div>

          <div className="mt-8 flex items-start gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-[4px] border border-foreground bg-danger-surface text-destructive shadow-button-sm">
              <WarningCircle weight="bold" className="size-4" aria-hidden="true" />
            </span>
            <div>
              <h1 className="text-2xl font-extrabold uppercase tracking-tight sm:text-3xl">
                Something went wrong
              </h1>
              <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                An unexpected error interrupted this page. Reloading usually
                fixes it — if the problem persists, try again in a moment.
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button type="button" className={buttonClass} onClick={onReset}>
              Try again
            </button>
            <button
              type="button"
              className={cn(
                buttonClass,
                "bg-primary text-primary-foreground hover:bg-primary",
              )}
              onClick={() => window.location.reload()}
            >
              Reload page
            </button>
          </div>
        </div>

        <p className="mt-6 text-center font-mono text-xs uppercase tracking-[0.08em] text-muted-foreground">
          error code 500 · {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ error: null });
  };

  render() {
    const { error } = this.state;
    if (error) {
      return <FallbackUI error={error} onReset={this.handleReset} />;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
export { FallbackUI };
