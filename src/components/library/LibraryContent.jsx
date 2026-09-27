import { useEffect, useState } from "react";
import { BookOpen, FileText, Upload, ImageUp, Search } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { SpinnerCustom } from "@/components/ui/spinner";
import LibraryPdfCard from "./LibraryPdfCard";
import { EmptyState, ErrorState, LoadingState } from "../multi use/ContentState";
import {
  AddLibraryPdf,
  deletePdf,
  fetchLibraryPdfs,
} from "@/store/slices/LibraryPdfsFromStudentSlice";

function LibraryContent({ role }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const { lessons, uploading, loading, deletingPdfId, error } = useSelector(
    (state) => state.library,
  );
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [search, setSearch] = useState("");
  const filteredLessons = lessons.filter((pdf) =>
    `${pdf.title}`.toLowerCase().includes(search.toLowerCase()),
  );

  useEffect(() => {
    dispatch(fetchLibraryPdfs());
  }, [dispatch]);

  const submit = async (event) => {
    event.preventDefault();
    if (!file || !title || !user?.uid) return;

    await dispatch(
      AddLibraryPdf({
        title,
        description,
        file,
        imageFile,
        userId: user.uid,
      }),
    ).unwrap();

    setTitle("");
    setDescription("");
    setFile(null);
    setImageFile(null);
    event.target.reset();
  };

  return (
    <main className="min-h-[calc(100vh-5rem)] bg-gradient-to-br from-sky-50 via-white to-emerald-50/70">
      <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
        <section className="rounded-3xl bg-gradient-to-r from-sky-500 via-teal-500 to-emerald-500 p-6 text-white shadow-xl sm:p-8">
          <p className="flex items-center gap-2 text-sm font-medium text-sky-100">
            <BookOpen className="h-4 w-4" />
            Shared Library
          </p>
          <h1 className="mt-2 text-2xl font-bold sm:text-4xl">
            {role !== "teacher"
              ? "Upload and read PDF lessons"
              : "Pdf lessons from student"}
          </h1>
        </section>

        {role !== "teacher" && role !== "admin" && (
          <form
            onSubmit={submit}
            className="rounded-3xl border border-sky-100 bg-white p-5 shadow-xl sm:p-6"
          >
            <div className="grid gap-4">
              <input
                required
                id="pdf-title"
                aria-label="PDF title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="PDF title"
                className="rounded-xl border border-sky-100 p-3"
              />
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-sky-200 bg-sky-50 p-3 transition hover:border-sky-400 hover:bg-sky-100">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
                  <FileText className="h-6 w-6" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-slate-700">
                    {file ? file.name : "Choose a PDF file"}
                  </span>
                  <span className="block text-xs text-slate-500">
                    PDF files only
                  </span>
                </span>
                <Upload className="h-5 w-5 text-sky-600" />
                <input
                  required
                  type="file"
                  accept="application/pdf"
                  onChange={(event) => setFile(event.target.files?.[0])}
                  className="hidden"
                />
              </label>
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-sky-200 bg-sky-50 p-3 transition hover:border-sky-400 hover:bg-sky-100">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
                  <ImageUp className="h-6 w-6" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="min-w-0 h-11 w-11 shrink-0 flex-1 text-sm font-semibold text-slate-700">
                    {imageFile ? imageFile.name : "Choose cover image"}
                  </span>
                  <span className="block text-xs text-slate-500">
                    Image files only
                  </span>
                </span>
                <Upload className="h-5 w-5 text-sky-600" />
                <input
                  required
                  type="file"
                  accept="image/*"
                  onChange={(event) => setImageFile(event.target.files?.[0])}
                  className="hidden"
                />
              </label>
            </div>
            <textarea
              id="pdf-description"
              aria-label="PDF description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Description"
              className="mt-3 w-full rounded-xl border border-sky-100 p-3"
            />
            <button
              disabled={uploading}
              className="mt-4 rounded-xl bg-teal-600 px-5 py-3 font-semibold text-white disabled:opacity-50"
            >
              {uploading ? (
                <>
                  <SpinnerCustom inline spinnerClassName="text-white"  />
                </>
              ) : (
                "Upload PDF"
              )}
            </button>
            {error && <p className="mt-3 text-sm text-rose-600">{error}</p>}
          </form>
        )}

        <label className="flex items-center gap-3 rounded-2xl border border-sky-100 bg-white px-4 py-3 shadow-sm">
          <Search className="h-5 w-5 text-sky-600" />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search PDF lessons..." className="min-w-0 flex-1 bg-transparent text-sm text-slate-700 outline-none" />
        </label>

        {loading && filteredLessons.length === 0 ? (
          <LoadingState label="Loading PDF lessons..." />
        ) : error && filteredLessons.length === 0 ? (
          <ErrorState message={error} />
        ) : filteredLessons.length ? (
          <div className="grid gap-5 lg:grid-cols-2">
            {filteredLessons.map((pdf) => (
              <LibraryPdfCard
                key={pdf.id}
                pdf={pdf}
                role={role}
                canDelete={role === "admin" || pdf.userId === user?.uid}
                deleting={deletingPdfId === pdf.id}
                onDelete={() => dispatch(deletePdf({ pdfId: pdf.id }))}
              />
            ))}
          </div>
        ) : (
          <EmptyState message="No PDF lessons yet." />
        )}
      </div>
    </main>
  );
}

export default LibraryContent;
