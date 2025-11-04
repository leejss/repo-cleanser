import { useEffect } from "react";

type AlertDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  variant?: "success" | "error";
};

export default function AlertDialog({
  isOpen,
  onClose,
  title,
  message,
  variant = "success",
}: AlertDialogProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const bgColor =
    variant === "success" ? "bg-green-600" : "bg-red-600";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-neutral-800 rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <p className="text-neutral-300 mb-6">{message}</p>
        <div className="flex justify-end">
          <button
            className={`px-4 py-2 ${bgColor} hover:opacity-90 text-white rounded-md font-semibold transition-colors`}
            onClick={onClose}
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
