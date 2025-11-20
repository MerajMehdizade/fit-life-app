import RegisterPage from "./register/page";

export default function Home() {
  return (
    <div className="flex gap-10 flex-wrap min-h-screen items-center justify-center">
      {<RegisterPage />}
    </div>
  );
}
