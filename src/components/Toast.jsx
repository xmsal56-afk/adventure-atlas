import { useState, useEffect, useCallback } from "react";

let toastId = 0;
let globalAddToast = null;

export function addToast(message, type = "success") {
  if (globalAddToast) globalAddToast(message, type);
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  const add = useCallback((message, type = "success") => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2500);
  }, []);

  useEffect(() => {
    globalAddToast = add;
    return () => { globalAddToast = null; };
  }, [add]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto px-4 py-2.5 rounded-xl shadow-lg text-sm font-semibold text-white animate-[fadeInUp_0.2s_ease-out] ${
            t.type === "success" ? "bg-green-600" : "bg-gray-800"
          }`}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}
