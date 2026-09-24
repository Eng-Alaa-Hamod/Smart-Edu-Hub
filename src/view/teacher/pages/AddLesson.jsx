import { useState } from "react";
import { ArrowLeft, FilePlus, FileText, Upload } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { addLesson } from "@/store/slices/LessonTeacherSlice";
import { uploadFile } from "@/supabase/functions/functions";
import { Spinner } from "@/components/ui/spinner";
import { ConfirmDialog } from "@/components/multi use/ConfirmDialog";

function AddLesson() {
  const { courseId } = useParams();
  const { state } = useLocation();
  const course = state?.course;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector((store) => store.lessons?.uploading);
  const [data, setData] = useState({ title: "", description: "", order: 1 });
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    if (!file) return setError("Please choose a PDF file.");
    try {
      setError("");
      setUploading(true);
      const pdfUrl = await uploadFile(file, course?.teacherId);
      await dispatch(addLesson({ courseId, ...data, pdfUrl })).unwrap();
      navigate(`/teacher/dashboard/courses/read/${courseId}`, { state: { course } });
    } catch (submitError) {
      setError(submitError?.message || "The lesson could not be added.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-5rem)] bg-gradient-to-br from-sky-50 via-white to-emerald-50/70">
      <div className="mx-auto max-w-3xl p-4 sm:p-6 lg:p-8">
        <button type="button" onClick={() => navigate(-1)} className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-sky-700">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <form onSubmit={submit} className="rounded-3xl border border-sky-100 bg-white p-5 shadow-xl sm:p-8">
          <p className="flex items-center gap-2 text-sm font-medium text-sky-600"><FilePlus className="h-4 w-4" /> Teacher Workspace</p>
          <h1 className="mt-2 text-3xl font-bold text-teal-800">Add a new lesson</h1>
          <div className="mt-6 space-y-5">
            <label className="block text-sm font-medium text-slate-700">Lesson title
              <input required value={data.title} onChange={(e) => setData({ ...data, title: e.target.value })} className="mt-2 w-full rounded-xl border border-sky-100 px-4 py-3" />
            </label>
            <label className="block text-sm font-medium text-slate-700">Description
              <textarea value={data.description} onChange={(e) => setData({ ...data, description: e.target.value })} rows="4" className="mt-2 w-full rounded-xl border border-sky-100 px-4 py-3" />
            </label>
            <label className="block text-sm font-medium text-slate-700">Lesson order
              <input type="number" min="1" required value={data.order} onChange={(e) => setData({ ...data, order: e.target.value })} className="mt-2 w-full rounded-xl border border-sky-100 px-4 py-3" />
            </label>
            <label className="block text-sm font-medium text-slate-700">PDF file
              <span className="mt-2 flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-sky-200 bg-sky-50 p-3 transition hover:border-sky-400 hover:bg-sky-100">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
                  <FileText className="h-6 w-6" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-slate-700">
                    {file ? file.name : "Choose a PDF file"}
                  </span>
                  <span className="block text-xs text-slate-500">PDF files only</span>
                </span>
                <Upload className="h-5 w-5 text-sky-600" />
                <input required type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files?.[0])} className="hidden" />
              </span>
            </label>
          </div>
          {error && <p className="mt-4 text-sm font-medium text-rose-600">{error}</p>}
          <ConfirmDialog
            trigger={<button type="button" disabled={loading || uploading} className="mt-6 w-full rounded-xl bg-gradient-to-r from-sky-500 to-teal-500 px-5 py-3 font-semibold text-white disabled:opacity-60">{uploading ? (
              <>
                <Spinner className="mr-2 inline-block text-white" />
              </>
            ) : loading ? (
              <>
                <Spinner className="mr-2 inline-block text-white" />
              </>
            ) : (
              "Save lesson"
            )}</button>}
            title="Save this lesson?"
            description="The lesson and its PDF file will be added to this course."
            confirmText="Save lesson"
            cancelText="Cancel"
            confirmClassName="bg-teal-700 text-white hover:bg-teal-800"
            onConfirm={() => submit({ preventDefault() {} })}
          />
        </form>
      </div>
    </main>
  );
}

export default AddLesson;
