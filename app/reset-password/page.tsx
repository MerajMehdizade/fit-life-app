import { Suspense } from "react";
import Reset_Form from "./Reset_Form";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<p className="text-center mt-10">در حال بارگذاری...</p>}>
      <Reset_Form />
    </Suspense>
  );
}
