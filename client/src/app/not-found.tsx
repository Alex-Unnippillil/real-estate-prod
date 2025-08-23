import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4 text-center">
      <h2 className="text-2xl font-semibold">Page not found</h2>
      <div className="flex gap-4">
        <Link href="/search" className="underline">
          Search listings
        </Link>
        <Link href="/" className="underline">
          Go home
        </Link>
      </div>
    </div>
  );
}
