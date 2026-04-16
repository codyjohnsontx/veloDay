"use client";

import { useState } from "react";
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

const steps = [
  {
    title: "Identify bike",
    icon: Bike,
    fields: ["Brand", "Model family", "Model year", "Category"],
    note: "Start from a catalog match, then mark the listing as-built.",
  },
  {
    title: "Specs and components",
    icon: Wrench,
    fields: ["Frame size", "Wheel size", "Drivetrain", "Brake type"],
    note: "Buyers can filter every field captured here.",
  },
  {
    title: "Condition and defects",
    icon: Camera,
    fields: ["Overall grade", "Mileage estimate", "Defect tags", "Service date"],
    note: "Defects become explicit buyer-visible tags, not hidden description text.",
  },
  {
    title: "Serial and provenance",
    icon: ShieldCheck,
    fields: ["Masked serial", "Proof of purchase", "Owner history", "Theft check"],
    note: "Full serial remains private while verification status is public.",
  },
  {
    title: "Pricing assistant",
    icon: BadgeDollarSign,
    fields: ["Asking price", "Market band", "Days-to-sell", "OBO toggle"],
    note: "Seller keeps control while seeing comp-based guidance.",
  },
  {
    title: "Shipping or pickup",
    icon: Truck,
    fields: ["Local pickup", "Managed shipping", "Inspection partner", "Region"],
    note: "Offer local and shipped transactions from the same listing schema.",
  },
  {
    title: "Preview and publish",
    icon: ClipboardCheck,
    fields: ["Trust checklist", "Listing preview", "Missing evidence", "Publish state"],
    note: "Prototype state only. No real publishing or uploads are performed.",
  },
];

export function SellWizard() {
  const [step, setStep] = useState(0);
  const active = steps[step];

  return (
    <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
      <aside className="space-y-2 rounded-lg border border-border bg-card p-3 shadow-sm">
        {steps.map((item, index) => (
          <button
            key={item.title}
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
              <Badge variant="trust">Step {step + 1} of {steps.length}</Badge>
              <h1 className="mt-3 text-3xl font-black text-ink">{active.title}</h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
                {active.note}
              </p>
            </div>
            <active.icon className="h-10 w-10 text-trust" />
          </div>

          <div className="mt-7 grid gap-4 md:grid-cols-2">
            {active.fields.map((field) => (
              <label key={field} className="space-y-2">
                <span className="text-sm font-bold text-ink">{field}</span>
                <Input placeholder={`Example ${field.toLowerCase()}`} />
              </label>
            ))}
          </div>

          <div className="mt-7 rounded-lg border border-border bg-background p-4">
            <p className="text-sm font-black uppercase tracking-wide text-trust">
              Live listing preview
            </p>
            <div className="mt-3 grid gap-4 md:grid-cols-[160px_1fr]">
              <div className="aspect-[4/3] rounded-md bg-muted" />
              <div>
                <h2 className="text-xl font-black text-ink">
                  2024 Cervelo Aspero Force AXS Gravel
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  54 cm, verified serial, proof pending, managed shipping enabled
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge variant="trust">Serial verified</Badge>
                  <Badge variant="warning">Proof pending</Badge>
                  <Badge variant="outline">Excellent condition</Badge>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-7 flex items-center justify-between gap-3">
            <Button
              variant="outline"
              disabled={step === 0}
              onClick={() => setStep((current) => Math.max(0, current - 1))}
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <Button
              onClick={() =>
                setStep((current) => Math.min(steps.length - 1, current + 1))
              }
            >
              {step === steps.length - 1 ? "Mock publish" : "Continue"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
