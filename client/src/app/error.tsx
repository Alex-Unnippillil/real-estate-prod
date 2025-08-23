"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4 text-center">
      <h2 className="text-2xl font-semibold">Something went wrong</h2>
      <div className="flex gap-4">
        <button onClick={() => reset()} className="underline">
          Try again
        </button>
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
