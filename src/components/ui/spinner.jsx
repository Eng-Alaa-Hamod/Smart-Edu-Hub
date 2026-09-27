import { LoaderIcon } from "lucide-react";
import { cn } from "@/lib/utils";

function Spinner({ className, ...props }) {
  return (
    <LoaderIcon
      role="status"
      aria-label="Loading"
      className={cn("size-5 animate-spin text-teal-600", className)}
      {...props}
    />
  );
}

function SpinnerCustom({ className, spinnerClassName, inline = false, ...props }) {
  const Wrapper = inline ? "span" : "div";

  return (
    <Wrapper
      className={cn(
        inline
          ? "inline-flex items-center justify-center align-middle"
          : "flex items-center justify-center gap-3",
        className,
      )}
    >
      <Spinner className={spinnerClassName} {...props} />
    </Wrapper>
  );
}

export { SpinnerCustom };
