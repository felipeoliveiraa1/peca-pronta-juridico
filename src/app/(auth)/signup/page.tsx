import { Suspense } from "react";
import { SignupForm } from "./signup-form";

export const metadata = { title: "Criar conta — Peça Pronta" };

export default function SignupPage() {
  return (
    <Suspense fallback={null}>
      <SignupForm />
    </Suspense>
  );
}
