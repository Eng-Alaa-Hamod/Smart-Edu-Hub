import { Download, ExternalLink, Smartphone } from "lucide-react";
import { usePWAInstall } from "react-use-pwa-install";

function getBrowserGuide() {
  const userAgent = navigator.userAgent;

  if (/iPhone|iPad|iPod/i.test(userAgent)) {
    return "In Safari, tap Share, then choose Add to Home Screen.";
  }

  if (/Android/i.test(userAgent)) {
    return "In Chrome or Edge, open the browser menu, then choose Install app or Add to Home screen.";
  }

  return "If the install button is unavailable, open the browser menu and look for Install app or Create shortcut.";
}

export default function InstallApp() {
  const install = usePWAInstall();
  const browserGuide = getBrowserGuide();

  return (
    <main className="h-full bg-gradient-to-br from-sky-50 via-white to-emerald-50 p-4 sm:p-8">
      <section className="mx-auto max-w-2xl rounded-2xl border border-sky-100 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-teal-500 text-white shadow-lg shadow-sky-200">
          <Smartphone className="h-7 w-7" />
        </div>
        <h1 className="text-2xl font-bold text-teal-800">Install Smart Edu Hub</h1>
        <p className="mt-2 text-slate-600">
          Install the app for faster access and a focused learning experience.
        </p>

        {install ? (
          <button
            type="button"
            onClick={install}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-teal-500 px-5 py-3 font-semibold text-white shadow-md shadow-sky-200 transition hover:from-sky-600 hover:to-teal-600"
          >
            <Download className="h-5 w-5" />
            Install app
          </button>
        ) : (
          <div className="mt-6 rounded-xl border border-sky-100 bg-sky-50 p-4 text-sm text-slate-700">
            <p>{browserGuide}</p>
            <p className="mt-2 inline-flex items-center gap-1 text-slate-500">
              <ExternalLink className="h-4 w-4" />
              If the app is already installed, you can open it from your device home screen.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
