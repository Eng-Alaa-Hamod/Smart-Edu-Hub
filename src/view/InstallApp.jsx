import { ExternalLink, Smartphone } from "lucide-react";

function getBrowserGuide() {
  const userAgent = navigator.userAgent;

  if (/iPhone|iPad|iPod/i.test(userAgent) && /Safari/i.test(userAgent)) {
    return "In Safari, tap Share, then choose Add to Home Screen.";
  }

  if (/Edg/i.test(userAgent)) {
    return "In Microsoft Edge, open the browser menu, then choose Apps and Install Smart Edu Hub.";
  }

  if (/Android/i.test(userAgent) && /Chrome/i.test(userAgent)) {
    return "In Chrome or Edge, open the browser menu, then choose Install app or Add to Home screen.";
  }

  if (/Firefox/i.test(userAgent)) {
    return "Open the browser menu and choose Add to Home Screen or Install, when available.";
  }

  if (/Safari/i.test(userAgent) && !/Chrome|Android/i.test(userAgent)) {
    return "In Safari, open the Share menu, then choose Add to Dock or Add to Home Screen.";
  }

  if (/Chrome/i.test(userAgent)) {
    return "Open the Chrome menu, then choose Install Smart Edu Hub or Create shortcut.";
  }

  return "Open your browser menu and look for Install app, Add to Home Screen, or Create shortcut.";
}

export default function InstallApp() {
  const browserGuide = getBrowserGuide();

  return (
    <main className="h-full bg-gradient-to-br from-sky-50 via-white to-emerald-50 p-4 sm:p-8">
      <section className="mx-auto max-w-2xl rounded-2xl border border-sky-100 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-teal-500 text-white shadow-lg shadow-sky-200">
          <Smartphone className="h-7 w-7" />
        </div>
        <h1 className="text-2xl font-bold text-teal-800">Install Smart Edu Hub</h1>
        <p className="mt-2 text-slate-600">
          Follow the instructions for your browser to add Smart Edu Hub to your device.
        </p>

        <div className="mt-6 rounded-xl border border-sky-100 bg-sky-50 p-4 text-sm text-slate-700">
          <p>{browserGuide}</p>
          <p className="mt-2 inline-flex items-center gap-1 text-slate-500">
            <ExternalLink className="h-4 w-4" />
            If the app is already installed, open it from your device home screen.
          </p>
        </div>
      </section>
    </main>
  );
}
