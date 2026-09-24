import { useEffect, useState } from "react";
import { CalendarDays, Mail, User, ArrowRight, Search } from "lucide-react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../../../firebase/firebase";
import { SpinnerCustom } from "../../../components/ui/spinner";

function BookLessonWithTeacher() {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const filteredTeachers = teachers.filter((teacher) =>
    `${teacher.firstName || ""} ${teacher.secondName || ""} ${teacher.email || ""}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  useEffect(() => {
    const loadTeachers = async () => {
      try {
        const teachersQuery = query(
          collection(db, "users"),
          where("role", "==", "teacher"),
        );

        const snapshot = await getDocs(teachersQuery);
        setTeachers(
          snapshot.docs.map((teacher) => ({
            id: teacher.id,
            ...teacher.data(),
          })),
        );
      } catch (loadError) {
        setError(loadError?.message || "Teachers could not be loaded.");
      } finally {
        setLoading(false);
      }
    };

    loadTeachers();
  }, []);

  return (
    <main className="min-h-[calc(100vh-5rem)] bg-gradient-to-br from-sky-50 via-white to-emerald-50/70 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-3xl bg-gradient-to-r from-sky-600 via-teal-500 to-emerald-500 p-6 text-white shadow-xl shadow-sky-100 sm:p-8">
          <div className="flex items-center gap-3">
            <CalendarDays className="h-8 w-8 text-sky-100" />
            <div>
              <p className="text-sm font-medium text-sky-100">Student Area</p>
              <h1 className="text-2xl font-bold sm:text-3xl">
                Book a lesson with a teacher
              </h1>
            </div>
          </div>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/85">
            Choose a teacher to view available times and request a lesson.
          </p>
        </header>

        <label className="flex items-center gap-3 rounded-2xl border border-sky-100 bg-white px-4 py-3 shadow-sm">
          <Search className="h-5 w-5 text-sky-600" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search teachers by name or email..."
            className="min-w-0 flex-1 bg-transparent text-sm text-slate-700 outline-none"
          />
        </label>

        {loading && <SpinnerCustom className="min-h-24 text-sky-600" />}
        {error && (
          <p className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-700">
            {error}
          </p>
        )}
        {!loading && !error && !teachers.length && (
          <p className="rounded-2xl border border-sky-100 bg-white p-8 text-center text-slate-500 shadow-sm">
            No teachers available yet.
          </p>
        )}

        <section className="grid gap-5 md:grid-cols-2">
          {filteredTeachers.map((teacher) => {
            const name =
              `${teacher.firstName || ""} ${teacher.secondName || ""}`.trim() ||
              "Teacher";

            return (
              <article
                key={teacher.id}
                className="flex flex-col rounded-3xl border border-sky-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl sm:flex-row sm:items-start sm:gap-5 sm:p-6"
              >
                <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-sky-100 to-emerald-100 text-sky-600">
                  {teacher.photoURL ? (
                    <img
                      src={teacher.photoURL}
                      alt={name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User className="h-9 w-9" />
                  )}
                </div>
                <div className="mt-4 min-w-0 flex-1 sm:mt-0">
                  <h2 className="break-words text-xl font-bold text-teal-800">{name}</h2>
                  <p className="mt-1 flex items-center gap-2 break-words text-sm text-slate-500">
                    <Mail className="h-4 w-4 shrink-0 text-sky-600" />
                    {teacher.email || "No email available"}
                  </p>
                  {teacher.CV && (
                    <p className="mt-3 line-clamp-4 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                      {teacher.CV}
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={() =>
                      navigate("../ask-for-date", { state: { teacher } })
                    }
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-700"
                  >
                    Ask for date
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </article>
            );
          })}
        </section>
      </div>
    </main>
  );
}

export default BookLessonWithTeacher;
