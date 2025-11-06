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

  const iconColor =
    variant === "success" ? "text-success" : "text-destructive";
    
  const bgColor =
    variant === "success" ? "bg-success/10" : "bg-destructive/10";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-popover rounded-lg shadow-lg border max-w-md w-full mx-4 p-6 animate-in fade-in-0 zoom-in-95 duration-200">
        <div className="flex flex-col space-y-1.5 pb-4">
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-full ${bgColor}`}>
              {variant === "success" ? (
                <svg 
                  className={`h-6 w-6 ${iconColor}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M5 13l4 4L19 7" 
                  />
                </svg>
              ) : (
                <svg 
                  className={`h-6 w-6 ${iconColor}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                  />
                </svg>
              )}
            </div>
            <h2 className="text-lg font-semibold leading-none tracking-tight">
              {title}
            </h2>
          </div>
        </div>
        
        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            {message}
          </p>
        </div>
        
        <div className="flex justify-end">
          <button
            className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 shadow-sm ${
              variant === "success"
                ? "bg-success text-success-foreground hover:bg-success/90"
                : "bg-destructive text-destructive-foreground hover:bg-destructive/90"
            }`}
            onClick={onClose}
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
