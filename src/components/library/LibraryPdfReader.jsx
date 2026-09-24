import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { db } from "@/firebase/firebase";

function LibraryPdfReader() {
  const { state } = useLocation();
  const navigate = useNavigate();
  
  const { pdfId } = useParams();
  const [pdf, setPdf] = useState(state?.pdf);

  useEffect(() => {
    if (pdf || !pdfId) return;

    getDoc(doc(db, "library", pdfId)).then((snapshot) => {
      if (snapshot.exists()) {
        setPdf({ id: snapshot.id, ...snapshot.data() });
      }
    });
  }, [pdf, pdfId]);

  return (
    <main className="min-h-[calc(100vh-5rem)] bg-slate-50 p-4 sm:p-6">
      <div className="mx-auto max-w-7xl">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-4 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-sky-700 shadow-sm"
        >
          Back
        </button>
        {pdf?.description && (
          <section className="mb-4 rounded-2xl border border-sky-100 bg-white p-5 shadow-sm">
            <h1 className="break-words text-2xl font-bold text-teal-800">{pdf.title}</h1>
            <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-7 text-slate-600">
              {pdf.description}
            </p>
          </section>
        )}
        {pdf?.pdfUrl ? (
          <iframe
            src={pdf.pdfUrl}
            title={pdf.title || "PDF lesson"}
            className="h-[78vh] w-full rounded-2xl border border-slate-200 bg-white"
          />
        ) : (
          <p className="rounded-2xl bg-white p-8 text-center text-slate-500">
            PDF not found.
          </p>
        )}
      </div>
    </main>
  );
}

export default LibraryPdfReader;
