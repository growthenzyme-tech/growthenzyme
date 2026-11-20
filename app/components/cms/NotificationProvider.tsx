
"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import {
  CheckCircle2,
  AlertCircle,
  Info,
  AlertTriangle,
  X,
} from "lucide-react";


type NotificationType = "success" | "error" | "info" | "warning";

type NotificationContextType = {
  notify: (message: string, type?: NotificationType) => void;
};

type Toast = {
  id: number;
  message: string;
  type: NotificationType;
};

const NotificationContext =
  createContext<NotificationContextType | undefined>(undefined);

export function useNotification() {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error(
      "useNotification must be used inside NotificationProvider"
    );
  }

  return context;
}

export default function NotificationProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const notify = useCallback(
    (message: string, type: NotificationType = "success") => {
      const id = Date.now() + Math.random();

      setToasts((previous) => [
        ...previous,
        { id, message, type },
      ]);

      window.setTimeout(() => {
        setToasts((previous) =>
          previous.filter((toast) => toast.id !== id)
        );
      }, 3000);
    },
    []
  );

  const removeToast = (id: number) => {
    setToasts((previous) =>
      previous.filter((toast) => toast.id !== id)
    );
  };

  const icons = {
    success: CheckCircle2,
    error: AlertCircle,
    info: Info,
    warning: AlertTriangle,
  };

  const accents = {
    success: "text-emerald-600 bg-emerald-50",
    error: "text-rose-600 bg-rose-50",
    info: "text-blue-600 bg-blue-50",
    warning: "text-amber-600 bg-amber-50",
  };

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}

      <div
        className="pointer-events-none fixed right-5 top-5 z-[100] flex w-[calc(100%-40px)] max-w-[360px] flex-col gap-3"
        aria-live="polite"
      >
        {toasts.map((toast) => {
          const Icon = icons[toast.type];

          return (
            <div
              key={toast.id}
              role="status"
              className="pointer-events-auto flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-3.5 shadow-[0_12px_40px_rgba(0,0,0,0.10)] animate-in slide-in-from-right-5 fade-in duration-200"
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${accents[toast.type]}`}
              >
                <Icon size={20} strokeWidth={2} />
              </div>

              <p className="flex-1 text-[13px] font-medium leading-5 text-gray-800">
                {toast.message}
              </p>

              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                aria-label="Close notification"
              >
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </NotificationContext.Provider>
  );
}
