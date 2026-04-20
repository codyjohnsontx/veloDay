"use client";

import { useMemo, useState, type ReactNode } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BadgeDollarSign,
  Bike,
  Camera,
  Check,
  ClipboardCheck,
  ShieldCheck,
  Truck,
  Wrench,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { currency, labelize } from "@/lib/format";
import {
  buildPreviewSubtitle,
  buildPreviewTitle,
  evaluateReadiness,
  initialWizardFormState,
  isValidSerialFormat,
  parsePrice,
  type WizardFormState,
} from "@/lib/sell-wizard-validation";
import type { ConditionGrade, ListingCategory, VerificationState } from "@/lib/types";

const steps = [
  {
    title: "Identify bike",
    icon: Bike,
    note: "Start from a catalog match, then mark the listing as-built.",
  },
  {
    title: "Specs and components",
    icon: Wrench,
    note: "Buyers can filter every field captured here.",
  },
  {
    title: "Condition and defects",
    icon: Camera,
    note: "Defects become explicit buyer-visible tags, not hidden description text.",
  },
  {
    title: "Serial and provenance",
    icon: ShieldCheck,
    note: "Full serial remains private while verification status is public.",
  },
  {
    title: "Pricing assistant",
    icon: BadgeDollarSign,
    note: "Seller keeps control while seeing comp-based guidance.",
  },
  {
    title: "Shipping or pickup",
    icon: Truck,
    note: "Offer local and shipped transactions from the same listing schema.",
  },
  {
    title: "Preview and publish",
    icon: ClipboardCheck,
    note: "Prototype state only. No real publishing or uploads are performed.",
  },
] as const;

const categorySelectOptions: { value: ListingCategory; label: string }[] = [
  { value: "complete-bike", label: "Complete bike" },
  { value: "frame", label: "Frame / frameset" },
  { value: "wheelset", label: "Wheelset" },
];

const conditionOptions: ConditionGrade[] = [
  "excellent",
  "very-good",
  "good",
  "fair",
];

const proofOptions: { value: VerificationState; label: string }[] = [
  { value: "unverified", label: "Unverified" },
  { value: "pending", label: "Pending review" },
  { value: "verified", label: "Verified" },
];

const ownershipOptions: {
  value: WizardFormState["ownershipType"];
  label: string;
}[] = [
  { value: "original-owner", label: "Original owner" },
  { value: "second-owner", label: "Second owner" },
  { value: "shop-owned", label: "Shop-owned" },
  { value: "demo", label: "Demo / floor" },
  { value: "race", label: "Race program" },
  { value: "rental", label: "Rental history" },
];

const theftOptions: {
  value: NonNullable<WizardFormState["theftCheckStatus"]>;
  label: string;
}[] = [
  { value: "clear", label: "Clear" },
  { value: "pending", label: "Pending" },
  { value: "not-checked", label: "Not checked" },
];

export function SellWizard() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<WizardFormState>(initialWizardFormState);
  const [mockPublished, setMockPublished] = useState(false);

  const active = steps[step];
  const { items, readyToPublish, fieldErrors } = useMemo(
    () => evaluateReadiness(form),
    [form],
  );
  const readinessScore = Math.round(
    (items.filter((i) => i.ok).length / items.length) * 100,
  );
  const previewPrice = parsePrice(form.price);
  const title = buildPreviewTitle(form);
  const subtitle = buildPreviewSubtitle(form);

  const update = <K extends keyof WizardFormState>(key: K, value: WizardFormState[K]) => {
    setMockPublished(false);
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
      <aside className="space-y-2 rounded-lg border border-border bg-card p-3 shadow-sm">
        {steps.map((item, index) => (
          <button
            key={item.title}
            type="button"
            onClick={() => setStep(index)}
            className={`flex w-full items-center gap-3 rounded-md px-3 py-3 text-left text-sm font-bold transition ${
              index === step
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-background/20">
              {index < step ? (
                <Check className="h-4 w-4" />
              ) : (
                <item.icon className="h-4 w-4" />
              )}
            </span>
            {item.title}
          </button>
        ))}
      </aside>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <Badge variant="trust">
                Step {step + 1} of {steps.length}
              </Badge>
              <h1 className="mt-3 text-3xl font-black text-ink">{active.title}</h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
                {active.note}
              </p>
            </div>
            <active.icon className="h-10 w-10 text-trust" />
          </div>

          <div className="mt-7">{renderStepFields(step, form, update, fieldErrors)}</div>

          <div className="mt-7 rounded-lg border border-border bg-background p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm font-black uppercase tracking-wide text-trust">
                Live listing preview
              </p>
              <Badge variant={readyToPublish ? "trust" : "outline"}>
                Readiness {readinessScore}%
              </Badge>
            </div>

            {Object.keys(fieldErrors).length > 0 && (
              <ul
                aria-live="polite"
                aria-atomic="true"
                className="mt-3 space-y-1 rounded-md border border-trust-danger/30 bg-red-50 p-3 text-sm text-red-900 dark:bg-red-950/40 dark:text-red-100"
              >
                {[...new Set(Object.values(fieldErrors))].map((message) => (
                  <li key={message}>{message}</li>
                ))}
              </ul>
            )}

            <div className="mt-3 grid gap-4 md:grid-cols-[160px_1fr]">
              <div className="aspect-[4/3] rounded-md bg-muted" aria-hidden />
              <div>
                <h2 className="text-xl font-black text-ink">{title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
                <p className="mt-2 text-lg font-bold text-ink">
                  {previewPrice !== null ? currency(previewPrice) : "—"}
                  {form.obo ? (
                    <span className="ml-2 text-sm font-semibold text-muted-foreground">
                      OBO
                    </span>
                  ) : null}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {isValidSerialFormat(form.maskedSerial) ? (
                    <Badge variant="trust">Serial format OK</Badge>
                  ) : (
                    <Badge variant="danger">Serial needs valid format</Badge>
                  )}
                  {form.proofOfPurchase === "verified" ? (
                    <Badge variant="trust">Proof verified</Badge>
                  ) : form.proofOfPurchase === "pending" ? (
                    <Badge variant="warning">Proof pending</Badge>
                  ) : form.proofOfPurchase === "unverified" ? (
                    <Badge variant="outline">Proof unverified</Badge>
                  ) : (
                    <Badge variant="outline">Proof not set</Badge>
                  )}
                  {form.conditionGrade ? (
                    <Badge variant="outline">{labelize(form.conditionGrade)} condition</Badge>
                  ) : (
                    <Badge variant="outline">Condition not set</Badge>
                  )}
                  {(() => {
                    const tags = form.defectTags
                      .split(",")
                      .map((t) => t.trim())
                      .filter(Boolean);
                    if (tags.length === 0) {
                      return (
                        <Badge variant="outline">No defects listed</Badge>
                      );
                    }
                    return tags.map((tag, index) => (
                      <Badge key={`${tag}-${index}`} variant="secondary">
                        {tag}
                      </Badge>
                    ));
                  })()}
                </div>
              </div>
            </div>

            <div className="mt-5 border-t border-border pt-4">
              <p className="text-xs font-black uppercase tracking-wide text-muted-foreground">
                Publish checklist
              </p>
              <ul className="mt-2 space-y-2">
                {items.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-start gap-2 text-sm"
                  >
                    <span
                      className={
                        item.ok
                          ? "mt-0.5 text-trust"
                          : "mt-0.5 text-muted-foreground"
                      }
                      aria-hidden
                    >
                      {item.ok ? <Check className="h-4 w-4" /> : "○"}
                    </span>
                    <span>
                      <span className="font-bold text-ink">{item.label}</span>
                      <span className="text-muted-foreground"> — {item.hint}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {step === steps.length - 1 && (
              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button
                  type="button"
                  disabled={!readyToPublish || mockPublished}
                  onClick={() => setMockPublished(true)}
                >
                  {mockPublished ? "Prototype saved" : "Mock publish"}
                </Button>
                {mockPublished && (
                  <p className="text-sm text-muted-foreground">
                    Listing stays in this browser session only. Nothing is uploaded or stored
                    on a server.
                  </p>
                )}
                {!readyToPublish && !mockPublished && (
                  <p className="text-sm text-muted-foreground">
                    Fix validation errors above to enable mock publish.
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="mt-7 flex items-center justify-between gap-3">
            <Button
              type="button"
              variant="outline"
              disabled={step === 0}
              onClick={() => setStep((current) => Math.max(0, current - 1))}
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            {step < steps.length - 1 ? (
              <Button
                type="button"
                onClick={() =>
                  setStep((current) => Math.min(steps.length - 1, current + 1))
                }
              >
                Continue
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function renderStepFields(
  step: number,
  form: WizardFormState,
  update: <K extends keyof WizardFormState>(key: K, value: WizardFormState[K]) => void,
  fieldErrors: Record<string, string>,
) {
  const err = (name: keyof WizardFormState) =>
    fieldErrors[name as string] ? (
      <p className="text-xs font-semibold text-red-600 dark:text-red-400">
        {fieldErrors[name as string]}
      </p>
    ) : null;

  switch (step) {
    case 0:
      return (
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Brand">
            <Input
              value={form.brand}
              onChange={(e) => update("brand", e.target.value)}
              placeholder="e.g. Specialized"
              aria-invalid={Boolean(fieldErrors.brand)}
            />
            {err("brand")}
          </Field>
          <Field label="Model family">
            <Input
              value={form.modelFamily}
              onChange={(e) => update("modelFamily", e.target.value)}
              placeholder="e.g. Tarmac"
              aria-invalid={Boolean(fieldErrors.modelFamily)}
            />
            {err("modelFamily")}
          </Field>
          <Field label="Model year">
            <Input
              inputMode="numeric"
              value={form.modelYear}
              onChange={(e) => update("modelYear", e.target.value)}
              placeholder="e.g. 2023"
              aria-invalid={Boolean(fieldErrors.modelYear)}
            />
            {err("modelYear")}
          </Field>
          <Field label="Category">
            <select
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              value={form.category}
              onChange={(e) =>
                update("category", e.target.value as ListingCategory | "")
              }
              aria-invalid={Boolean(fieldErrors.category)}
            >
              <option value="">Select category</option>
              {categorySelectOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            {err("category")}
          </Field>
        </div>
      );
    case 1:
      return (
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Frame size">
            <Input
              value={form.frameSize}
              onChange={(e) => update("frameSize", e.target.value)}
              placeholder="e.g. 56 cm or Large"
              aria-invalid={Boolean(fieldErrors.frameSize)}
            />
            {err("frameSize")}
          </Field>
          <Field label="Wheel size">
            <Input
              value={form.wheelSize}
              onChange={(e) => update("wheelSize", e.target.value)}
              placeholder="e.g. 700c or 29 in"
              aria-invalid={Boolean(fieldErrors.wheelSize)}
            />
            {err("wheelSize")}
          </Field>
          <Field label="Drivetrain">
            <Input
              value={form.drivetrain}
              onChange={(e) => update("drivetrain", e.target.value)}
              placeholder="e.g. SRAM Red AXS"
              aria-invalid={Boolean(fieldErrors.drivetrain)}
            />
            {err("drivetrain")}
          </Field>
          <Field label="Brake type">
            <Input
              value={form.brakes}
              onChange={(e) => update("brakes", e.target.value)}
              placeholder="e.g. Hydraulic disc"
              aria-invalid={Boolean(fieldErrors.brakes)}
            />
            {err("brakes")}
          </Field>
        </div>
      );
    case 2:
      return (
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Overall grade">
            <select
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              value={form.conditionGrade}
              onChange={(e) =>
                update("conditionGrade", e.target.value as ConditionGrade | "")
              }
              aria-invalid={Boolean(fieldErrors.conditionGrade)}
            >
              <option value="">Select condition</option>
              {conditionOptions.map((g) => (
                <option key={g} value={g}>
                  {labelize(g)}
                </option>
              ))}
            </select>
            {err("conditionGrade")}
          </Field>
          <Field label="Mileage estimate">
            <Input
              inputMode="numeric"
              value={form.mileage}
              onChange={(e) => update("mileage", e.target.value)}
              placeholder="e.g. 1200"
              aria-invalid={Boolean(fieldErrors.mileage)}
            />
            {err("mileage")}
          </Field>
          <Field label="Defect tags (comma-separated)">
            <Input
              value={form.defectTags}
              onChange={(e) => update("defectTags", e.target.value)}
              placeholder="Optional — e.g. shoe rub, small paint chip"
            />
          </Field>
          <Field label="Last major service date">
            <Input
              type="date"
              value={form.serviceDate}
              onChange={(e) => update("serviceDate", e.target.value)}
              aria-invalid={Boolean(fieldErrors.serviceDate)}
            />
            {err("serviceDate")}
          </Field>
        </div>
      );
    case 3:
      return (
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Masked serial (public)">
            <Input
              value={form.maskedSerial}
              onChange={(e) => update("maskedSerial", e.target.value)}
              placeholder="e.g. WSBC****8241"
              autoCapitalize="characters"
              aria-invalid={Boolean(fieldErrors.maskedSerial)}
            />
            {err("maskedSerial")}
          </Field>
          <Field label="Proof of purchase">
            <select
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              value={form.proofOfPurchase}
              onChange={(e) =>
                update("proofOfPurchase", e.target.value as VerificationState | "")
              }
              aria-invalid={Boolean(fieldErrors.proofOfPurchase)}
            >
              <option value="">Select status</option>
              {proofOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            {err("proofOfPurchase")}
          </Field>
          <Field label="Ownership history">
            <select
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              value={form.ownershipType}
              onChange={(e) =>
                update(
                  "ownershipType",
                  e.target.value as WizardFormState["ownershipType"],
                )
              }
              aria-invalid={Boolean(fieldErrors.ownershipType)}
            >
              <option value="">Select ownership</option>
              {ownershipOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            {err("ownershipType")}
          </Field>
          <Field label="Theft check status">
            <select
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              value={form.theftCheckStatus}
              onChange={(e) =>
                update(
                  "theftCheckStatus",
                  e.target.value as WizardFormState["theftCheckStatus"],
                )
              }
              aria-invalid={Boolean(fieldErrors.theftCheckStatus)}
            >
              <option value="">Select status</option>
              {theftOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            {err("theftCheckStatus")}
          </Field>
        </div>
      );
    case 4:
      return (
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Asking price (USD)">
            <Input
              inputMode="decimal"
              value={form.price}
              onChange={(e) => update("price", e.target.value)}
              placeholder="e.g. 4200"
              aria-invalid={Boolean(fieldErrors.price)}
            />
            {err("price")}
          </Field>
          <label className="flex items-end gap-2 pb-2 text-sm font-semibold">
            <input
              type="checkbox"
              className="h-4 w-4 accent-primary"
              checked={form.obo}
              onChange={(e) => update("obo", e.target.checked)}
            />
            Or best offer (OBO)
          </label>
          <div className="md:col-span-2 rounded-md border border-border bg-card/50 p-4 text-sm text-muted-foreground">
            <p className="font-bold text-ink">Pricing assistant (prototype)</p>
            <p className="mt-1">
              Market band and days-to-sell estimates would appear here using comparable
              listings once a data service is connected.
            </p>
          </div>
        </div>
      );
    case 5:
      return (
        <div className="space-y-4">
          <p className="text-sm font-semibold text-ink">Transaction modes</p>
          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-2 text-sm font-semibold">
              <input
                type="checkbox"
                className="h-4 w-4 accent-primary"
                checked={form.localPickup}
                onChange={(e) => update("localPickup", e.target.checked)}
              />
              Local pickup
            </label>
            <label className="flex items-center gap-2 text-sm font-semibold">
              <input
                type="checkbox"
                className="h-4 w-4 accent-primary"
                checked={form.managedShipping}
                onChange={(e) => update("managedShipping", e.target.checked)}
              />
              Managed shipping
            </label>
            <label className="flex items-center gap-2 text-sm font-semibold">
              <input
                type="checkbox"
                className="h-4 w-4 accent-primary"
                checked={form.inspectionPartner}
                onChange={(e) => update("inspectionPartner", e.target.checked)}
              />
              Inspection partner
            </label>
          </div>
          {fieldErrors.transactionModes ? (
            <p className="text-xs font-semibold text-red-600 dark:text-red-400">
              {fieldErrors.transactionModes}
            </p>
          ) : null}
          <Field label="Region / ship-to (optional)">
            <Input
              value={form.region}
              onChange={(e) => update("region", e.target.value)}
              placeholder="e.g. Lower 48, Continental US"
            />
          </Field>
        </div>
      );
    default:
      return (
        <p className="text-sm text-muted-foreground">
          Review the live preview and checklist. Use{" "}
          <span className="font-semibold text-ink">Mock publish</span> when every checklist
          item passes validation.
        </p>
      );
  }
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-bold text-ink">{label}</span>
      {children}
    </label>
  );
}
