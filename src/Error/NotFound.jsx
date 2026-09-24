import { ArrowLeft, Compass } from "lucide-react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function NotFound() {
  const user = useSelector((state) => state.user.user);
  const dashboardPath = user?.role === "teacher" ? "/teacher/dashboard" : "/student/dashboard";

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-teal-950 to-cyan-900 px-4 py-10">
      <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-white/20 bg-white/95 shadow-2xl">
        <section className="flex min-h-[560px] items-center px-7 py-12 sm:px-12 lg:px-16">
          <div className="max-w-lg">
            <p className="mb-5 text-7xl font-black leading-none tracking-[-0.08em] text-teal-700 sm:text-8xl">
              404
            </p>
            <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-full bg-teal-100 text-teal-700">
              <Compass size={28} strokeWidth={1.8} aria-hidden="true" />
            </div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.24em] text-teal-700">
              Smart Edu-Hub
            </p>
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl">
              It seems you may be lost.
            </h1>
            <p className="mt-5 max-w-sm text-base leading-7 text-slate-600">
              The page you are looking for does not exist or may have moved. Let us take you back to your dashboard.
            </p>
            <Link
              to={dashboardPath}
              className="mt-8 inline-flex h-11 items-center gap-2 rounded-md bg-slate-900 px-5 text-sm font-medium text-white transition-colors hover:bg-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2"
            >
              <ArrowLeft size={17} aria-hidden="true" />
              Back to dashboard
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

export default NotFound;