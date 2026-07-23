import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import ResetPasswordForm from "./ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-6 h-6 animate-spin text-accent" />
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
