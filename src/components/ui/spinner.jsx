import { LoaderIcon } from "lucide-react";
import { cn } from "@/lib/utils";

function Spinner({ className, ...props }) {
  return (
    <LoaderIcon
      role="status"
      aria-label="Loading"
      className={cn("size-4 animate-spin text-current", className)}
      {...props}
    />
  );
}

function SpinnerCustom({ className, ...props }) {
  return (
    <div className={cn("flex items-center justify-center gap-3", className)}>
      <Spinner {...props} />
    </div>
  );
}

export { Spinner, SpinnerCustom };
