import { SellWizard } from "@/components/sell-wizard";

export default function SellPage() {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
    >
      <div className="mb-7">
        <p className="text-sm font-black uppercase tracking-wide text-trust">
          Guided listing wizard
        </p>
        <h1 className="mt-1 text-4xl font-black tracking-tight text-ink">
          Publish with trust evidence.
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
          This prototype captures the data that makes a high-value bike listing
          searchable, comparable, and safer to transact.
        </p>
      </div>
      <SellWizard />
    </main>
  );
}
