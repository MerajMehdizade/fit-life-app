import { Suspense } from "react";
import Reset_Form from "./Reset_Form";
import Loading from "../Components/LoadingSpin/Loading";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<Loading />}>
      <Reset_Form />
    </Suspense>
  );
}
