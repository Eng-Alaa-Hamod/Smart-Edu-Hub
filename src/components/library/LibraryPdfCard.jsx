import { ArrowRight, FileText, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner";
import { ConfirmDialog } from "@/components/multi use/ConfirmDialog";

function LibraryPdfCard({ pdf, role, canDelete, deleting, onDelete }) {
  const navigate = useNavigate();

  return (
    <article className="group flex min-h-64 flex-col overflow-hidden rounded-3xl border border-sky-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-sky-200 hover:shadow-xl md:flex-row">
      <div className="flex h-48 shrink-0 items-center justify-center bg-gradient-to-br from-sky-500 to-teal-500 md:h-auto md:w-56">
        {pdf.imageUrl ? (
          <img src={pdf.imageUrl} alt={pdf.title} className="h-full w-full object-cover" />
        ) : (
          <FileText className="h-16 w-16 text-white transition group-hover:scale-110" />
        )}
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h2 className="line-clamp-2 break-words text-xl font-bold text-teal-800">
          {pdf.title}
        </h2>
        <p className="mt-2 line-clamp-3 break-words text-sm leading-6 text-slate-500">
          {pdf.description || "No description yet."}
        </p>
        <div className="mt-auto border-t border-slate-100 pt-4">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() =>
                navigate(`/${role}/dashboard/library/read/${pdf.id}`, {
                  state: { pdf },
                })
              }
              className="inline-flex items-center gap-1.5 rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-700"
            >
              Read
              <ArrowRight className="h-4 w-4" />
            </button>
            {canDelete && (
              <ConfirmDialog
                trigger={<button type="button" disabled={deleting} className="inline-flex items-center rounded-xl bg-rose-50 px-3 py-2.5 text-rose-600 hover:bg-rose-100" title="Delete PDF">{deleting ? <Spinner className="text-rose-600" /> : <Trash2 className="h-4 w-4" />}</button>}
                title="Delete this PDF?"
                description="This file and its cover image will be permanently removed."
                confirmText="Delete"
                cancelText="Cancel"
                confirmVariant="destructive"
                onConfirm={onDelete}
              />
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

export default LibraryPdfCard;
