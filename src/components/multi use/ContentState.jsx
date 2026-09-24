import { AlertCircle, Inbox } from "lucide-react";
import { SpinnerCustom } from "@/components/ui/spinner";

export function LoadingState({ label = "Loading..." }) {
  return (
    <div role="status" className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-white p-8 text-center text-slate-500">
      <SpinnerCustom className="text-teal-700" />
      <span className="text-sm">{label}</span>
    </div>
  );
}

export function EmptyState({ message = "Nothing here yet." }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-sky-200 bg-white p-10 text-center text-slate-500">
      <Inbox className="h-7 w-7 text-sky-500" aria-hidden="true" />
      <p className="text-sm">{message}</p>
    </div>
  );
}

export function ErrorState({ message = "Something went wrong." }) {
  return (
    <div className="flex items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 p-5 text-center text-sm text-rose-600">
      <AlertCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
}
