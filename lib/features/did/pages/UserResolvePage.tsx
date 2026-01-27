"use client";

import { PublicHeader } from "@/components/layout/PublicHeader";
import { ResolveContent } from "../components/ResolveContent";

export default function UserResolvePage() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <PublicHeader />

      <main className="flex flex-1 flex-col items-center justify-start p-4 sm:px-6 lg:px-8 pt-10">
        <ResolveContent />
      </main>
    </div>
  );
}
