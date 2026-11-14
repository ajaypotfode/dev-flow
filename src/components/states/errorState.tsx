interface ErrorStateProps {
  title?: string,
  description?: string,
  onRetry?: () => void;
};

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Something went wrong",
  description = "Please try again. If the problem persists, contact support.",
  onRetry
}) => {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center gap-3 rounded-lg border border-semantic-error/30 bg-semantic-error/5 px-6 py-16 text-center"
    >
      <p className="text-base font-semibold text-semantic-error">{title}</p>
      <p className="max-w-sm text-sm text-ink-mute">{description}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-pill bg-primary px-5 py-2 text-sm font-semibold text-on-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          Try again
        </button>
      ) : null}
    </div>
  )
}