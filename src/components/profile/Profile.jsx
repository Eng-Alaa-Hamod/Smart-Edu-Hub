import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Camera,
  Clock,
  Mail,
  Shield,
  ShieldCheck,
  User,
  UserCheck,
} from "lucide-react";
import { SpinnerCustom } from "@/components/ui/spinner";
import { uploadAvatar } from "../../supabase/functions/functions";
import { updateUserProfile } from "@/store/slices/userSlice";
import { normalizeCreatedAt } from "@/functions/normalizeCreateat";
import { toast } from "sonner";

function Profile({ role: roleOverride }) {
  const dispatch = useDispatch();
  const { user, loadingUpdateProfile, errorUpdateProfile } = useSelector(
    (state) => state.user,
  );

  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [secondName, setSecondName] = useState(user?.secondName || "");
  const [CV, setCV] = useState(user?.CV || "");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageError, setImageError] = useState("");
  const role = roleOverride || user?.role || "student";
  const normalizedCreatedAt = normalizeCreatedAt(user?.createdAt);
  const createdAtDate = normalizedCreatedAt
    ? new Date(normalizedCreatedAt)
    : null;

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageError("");
    setUploadingImage(true);

    try {
      const photoURL = await uploadAvatar(file, user.uid);

      await dispatch(updateUserProfile({ photoURL })).unwrap();
      toast.success("Profile photo updated successfully!");
    } catch (err) {
      setImageError(err?.message || "Failed to upload image.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setImageError("");

    const updatedFirstName = (firstName || user?.firstName || "").trim();
    const updatedSecondName = (secondName || user?.secondName || "").trim();

    if (!updatedFirstName || !updatedSecondName) {
      return;
    }

    try {
      await dispatch(
        updateUserProfile({
          firstName: updatedFirstName,
          secondName: updatedSecondName,
          email: user?.email,
          CV: CV.trim(),
        }),
      ).unwrap();
      toast.success("Profile information updated successfully!");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-gradient-to-br from-sky-50 via-white to-emerald-50/70 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-sky-500 via-teal-500 to-emerald-500 p-6 text-white shadow-xl shadow-sky-100 sm:p-8">
          <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
            <div className="relative">
              <div className="relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-white/30 bg-white/20 text-3xl font-bold shadow-md backdrop-blur-sm sm:h-32 sm:w-32">
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="Profile Avatar"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  role === "admin" ? (
                    <ShieldCheck className="h-16 w-16 text-white/90" />
                  ) : (
                    <User className="h-16 w-16 text-white/90" />
                  )
                )}

                {uploadingImage && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-xs">
                    <SpinnerCustom inline spinnerClassName="size-8 text-white"  />
                  </div>
                )}
              </div>

              <label
                htmlFor="avatar-upload"
                className="absolute bottom-1 right-1 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white text-teal-800 shadow-lg transition hover:bg-sky-50 active:scale-95"
              >
                <Camera className="h-4 w-4" />
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={uploadingImage}
                  className="hidden"
                />
              </label>
            </div>

            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold capitalize text-white backdrop-blur-sm">
                {role === "admin" ? (
                  <ShieldCheck className="h-3.5 w-3.5" />
                ) : (
                  <Shield className="h-3.5 w-3.5" />
                )}
                {role} Account
              </span>
              <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
                {user?.firstName} {user?.secondName}
              </h1>
              <p className="mt-1 text-sm text-white/85">{user?.email}</p>
            </div>
          </div>
        </div>

        {(errorUpdateProfile || imageError) && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-800 shadow-xs">
            {errorUpdateProfile || imageError}
          </div>
        )}

        <div className="rounded-3xl border border-sky-100 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-bold text-teal-900">
            Personal Information
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Update your account details and profile information.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  First Name
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-slate-800 outline-none transition focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-100"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Second Name
                </label>
                <input
                  type="text"
                  value={secondName}
                  onChange={(e) => setSecondName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-slate-800 outline-none transition focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-100"
                  required
                />
              </div>
            </div>

            {role === "teacher" ? (
              <>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  CV
                </label>
                <textarea
                  type="text"
                  value={CV}
                  rows="3"
                  onChange={(e) => setCV(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-slate-800 outline-none transition focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-100"
                />
              </>
            ) : null}
          
            <div className="grid gap-4 rounded-2xl bg-slate-50/80 p-4 sm:grid-cols-3">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-sky-600" />
                <div>
                  <p className="text-xs text-slate-500">Email Address</p>
                  <p className="text-xs font-semibold text-slate-800 truncate max-w-[180px]">
                    {user?.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <UserCheck className="h-5 w-5 text-emerald-600" />
                <div>
                  <p className="text-xs text-slate-500">Account Status</p>
                  <p className="text-xs font-semibold text-emerald-700">
                    {user?.emailVerified ? "Verified" : "Unverified"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-teal-600" />
                <div>
                  <p className="text-xs text-slate-500">Member Since</p>
                  <p className="text-xs font-semibold text-slate-800">
                    {createdAtDate && !Number.isNaN(createdAtDate.getTime())
                      ? createdAtDate.toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loadingUpdateProfile || uploadingImage}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-teal-500 px-6 py-3 font-semibold text-white shadow-md shadow-sky-200 transition hover:from-sky-600 hover:to-teal-600 active:scale-98 disabled:opacity-60"
              >
                {loadingUpdateProfile && (
                  <SpinnerCustom inline spinnerClassName="size-4 text-white"  />
                )}
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Profile;
