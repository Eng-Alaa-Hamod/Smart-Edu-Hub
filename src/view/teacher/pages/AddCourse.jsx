import { useState } from "react";
import { ArrowLeft, ImagePlus, Plus, Upload } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addCourseTeacher } from "@/store/slices/CourseTeacherSlice";
import { uploadCourseCover } from "@/supabase/functions/functions";
import { SpinnerCustom } from "@/components/ui/spinner";
import { ConfirmDialog } from "@/components/multi use/ConfirmDialog";

function AddCourse() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.user.user);
  const loading = useSelector((state) => state.courseTeacher?.loading);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const [coverFile, setCoverFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [formError, setFormError] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleChange = ({ target }) => {
    setFormData((current) => ({ ...current, [target.name]: target.value }));
  };

  const handleFileChange = ({ target }) => {
    const file = target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setFormError("Please choose a valid image file.");
      setCoverFile(null);
      setPreviewUrl("");
      return;
    }

    setFormError("");
    setCoverFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError("");

    if (!user?.uid) {
      setFormError(
        "Your teacher account could not be identified. Please log in again.",
      );
      return;
    }

    if (!formData.title.trim() || !formData.description.trim()) {
      setFormError("Please enter a course title and description.");
      return;
    }

    if (!coverFile) {
      setFormError("Please choose a cover image for your course.");
      return;
    }

    try {
      setUploading(true);
      const coverUrl = await uploadCourseCover(coverFile, user.uid);

      await dispatch(
        addCourseTeacher({
          teacherId: user.uid,
          teacherName:
            `${user.firstName ?? ""} ${user.secondName ?? ""}`.trim(),
          teacherPhotoURL: user.photoURL || "",
          title: formData.title.trim(),
          description: formData.description.trim(),
          coverUrl,
        }),
      ).unwrap();

      navigate("/teacher/dashboard/courses", { replace: true });
    } catch (submitError) {
      setFormError(
        submitError?.message || submitError || "The course could not be added.",
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-5rem)] bg-gradient-to-br from-sky-50 via-white to-emerald-50/70">
      <div className="mx-auto max-w-3xl p-4 sm:p-6 lg:p-8">
        <button
          type="button"
          onClick={() => navigate("/teacher/dashboard/courses")}
          className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-sky-700 transition hover:text-teal-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to courses
        </button>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-sky-100 bg-white p-5 shadow-xl shadow-sky-100/60 sm:p-8"
        >
          <div className="mb-6">
            <p className="flex items-center gap-2 text-sm font-medium text-sky-600">
              <Plus className="h-4 w-4" />
              Teacher Workspace
            </p>
            <h1 className="mt-2 text-3xl font-bold text-teal-800">
              Add a new course
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Add the course details and upload a cover image for your students.
            </p>
          </div>

          <div className="space-y-5">
            <label className="block text-sm font-medium text-slate-700">
              Course title
              <input
                required
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Introduction to Biology"
                className="mt-2 w-full rounded-xl border border-sky-100 px-4 py-3 text-slate-700 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
              />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Description
              <textarea
                required
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="5"
                placeholder="Describe the course content and learning goals..."
                className="mt-2 w-full resize-y rounded-xl border border-sky-100 px-4 py-3 text-slate-700 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
              />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Course cover image
              <span className="mt-2 flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-sky-200 bg-sky-50 p-3 transition hover:border-sky-400 hover:bg-sky-100">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Course cover preview"
                    className="h-11 w-11 rounded-xl object-cover"
                  />
                ) : (
                  <ImagePlus className="h-6 w-6 text-sky-500" />
                )}
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-slate-700">
                    {coverFile ? coverFile.name : "Choose a cover image"}
                  </span>
                  <span className="block text-xs text-slate-500">PNG, JPG, or WEBP</span>
                </span>
                <Upload className="h-5 w-5 text-sky-600" />
                <input
                  required
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleFileChange}
                  className="sr-only"
                />
              </span>
            </label>
          </div>

          {formError && (
            <p className="mt-4 text-sm font-medium text-rose-600">
              {formError}
            </p>
          )}

          <ConfirmDialog
            trigger={<button type="button" disabled={loading || uploading} className="mt-6 w-full rounded-xl bg-gradient-to-r from-sky-500 to-teal-500 px-5 py-3 font-semibold text-white shadow-md transition hover:from-sky-600 hover:to-teal-600 disabled:cursor-not-allowed disabled:opacity-60">{uploading ? (
              <>
                <SpinnerCustom inline spinnerClassName="mr-2 inline-block text-white"  />
                Uploading cover...
              </>
            ) : loading ? (
              <>
                <SpinnerCustom inline spinnerClassName="mr-2 inline-block text-white"  />
                Saving course...
              </>
            ) : (
              "Save course"
            )}</button>}
            title="Save this course?"
            description="The course and its cover image will be added to your teaching workspace."
            confirmText="Save course"
            cancelText="Cancel"
            confirmClassName="bg-teal-700 text-white hover:bg-teal-800"
            onConfirm={() => handleSubmit({ preventDefault() {} })}
          />
        </form>
      </div>
    </main>
  );
}

export default AddCourse;
