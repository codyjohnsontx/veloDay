import { SearchExperience } from "@/components/search-experience";
import { listings } from "@/lib/data";

export default function SearchPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-7 flex flex-col gap-2">
        <p className="text-sm font-black uppercase tracking-wide text-trust">
          Marketplace search
        </p>
        <h1 className="text-4xl font-black tracking-tight text-ink">
          Find a verified bike by fit, build, and trust state.
        </h1>
      </div>
      <SearchExperience listings={listings} />
    </main>
  );
}
