import Link from "next/link";
import Image from "next/image";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50 via-white to-white">
      <header className="container-page flex h-16 items-center">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Image src="/logo.svg" alt="Peça Pronta" width={36} height={36} priority />
          Peça Pronta
        </Link>
      </header>
      <main className="container-page flex flex-1 justify-center pb-20">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
