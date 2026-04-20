import type {
  ConditionGrade,
  ListingCategory,
  ProvenanceRecord,
  VerificationState,
} from "@/lib/types";

export type WizardOwnershipType = ProvenanceRecord["ownershipType"] | "";

export interface WizardFormState {
  brand: string;
  modelFamily: string;
  modelYear: string;
  category: ListingCategory | "";
  frameSize: string;
  wheelSize: string;
  drivetrain: string;
  brakes: string;
  conditionGrade: ConditionGrade | "";
  mileage: string;
  defectTags: string;
  serviceDate: string;
  maskedSerial: string;
  proofOfPurchase: VerificationState | "";
  ownershipType: WizardOwnershipType;
  theftCheckStatus: "clear" | "pending" | "not-checked" | "";
  price: string;
  obo: boolean;
  localPickup: boolean;
  managedShipping: boolean;
  inspectionPartner: boolean;
  region: string;
}

export const initialWizardFormState: WizardFormState = {
  brand: "",
  modelFamily: "",
  modelYear: "",
  category: "",
  frameSize: "",
  wheelSize: "",
  drivetrain: "",
  brakes: "",
  conditionGrade: "",
  mileage: "",
  defectTags: "",
  serviceDate: "",
  maskedSerial: "",
  proofOfPurchase: "",
  ownershipType: "",
  theftCheckStatus: "",
  price: "",
  obo: false,
  localPickup: false,
  managedShipping: false,
  inspectionPartner: false,
  region: "",
};

/** Public masked serial only (e.g. WSBC****8241). Full unmasked serials are not accepted here. */
export function isValidSerialFormat(raw: string): boolean {
  const s = raw.trim().toUpperCase();
  const masked = /^[A-Z0-9]{2,10}\*{2,}[A-Z0-9]{2,6}$/;
  return masked.test(s);
}

export function parsePrice(value: string): number | null {
  const n = Number(String(value).replace(/,/g, "").trim());
  if (!Number.isFinite(n) || n <= 0) return null;
  if (n > 500_000) return null;
  return n;
}

const DIGITS_ONLY = /^\d+$/;
const YEAR_FOUR_DIGITS = /^\d{4}$/;

export function parseModelYear(value: string): number | null {
  const s = value.trim();
  if (!YEAR_FOUR_DIGITS.test(s)) return null;
  const n = Number.parseInt(s, 10);
  if (!Number.isFinite(n) || n < 1990 || n > 2030) return null;
  return n;
}

export function parseMileage(value: string): number | null {
  const s = value.trim();
  if (!DIGITS_ONLY.test(s)) return null;
  const n = Number.parseInt(s, 10);
  if (!Number.isFinite(n) || n < 0) return null;
  if (n > 250_000) return null;
  return n;
}

export interface ReadinessItem {
  id: string;
  label: string;
  ok: boolean;
  hint: string;
}

export function evaluateReadiness(state: WizardFormState): {
  items: ReadinessItem[];
  readyToPublish: boolean;
  fieldErrors: Record<string, string>;
} {
  const fieldErrors: Record<string, string> = {};

  const year = parseModelYear(state.modelYear);
  if (!state.brand.trim()) fieldErrors.brand = "Brand is required.";
  if (!state.modelFamily.trim()) fieldErrors.modelFamily = "Model family is required.";
  if (year === null) fieldErrors.modelYear = "Enter a year between 1990 and 2030.";
  if (!state.category) fieldErrors.category = "Choose a listing category.";

  if (!state.frameSize.trim()) fieldErrors.frameSize = "Frame or fit size is required.";
  if (!state.wheelSize.trim()) fieldErrors.wheelSize = "Wheel size is required.";
  if (!state.drivetrain.trim()) fieldErrors.drivetrain = "Drivetrain is required.";
  if (!state.brakes.trim()) fieldErrors.brakes = "Brake type is required.";

  if (!state.conditionGrade) fieldErrors.conditionGrade = "Select an overall condition grade.";
  const miles = parseMileage(state.mileage);
  if (miles === null) fieldErrors.mileage = "Enter a non-negative mileage estimate.";
  if (!state.serviceDate.trim()) fieldErrors.serviceDate = "Last major service date is required.";

  const serialOk = isValidSerialFormat(state.maskedSerial);
  if (!serialOk) {
    fieldErrors.maskedSerial =
      "Use a masked serial for public display (e.g. WSBC****8241).";
  }
  if (!state.proofOfPurchase) fieldErrors.proofOfPurchase = "Select proof-of-purchase status.";
  if (!state.ownershipType) fieldErrors.ownershipType = "Select ownership history.";
  if (!state.theftCheckStatus) fieldErrors.theftCheckStatus = "Select theft-check status.";

  const price = parsePrice(state.price);
  if (price === null) fieldErrors.price = "Enter a positive price up to $500,000.";

  const txnCount = [state.localPickup, state.managedShipping, state.inspectionPartner].filter(
    Boolean,
  ).length;
  if (txnCount === 0) {
    fieldErrors.transactionModes = "Select at least one transaction mode.";
  }

  const items: ReadinessItem[] = [
    {
      id: "identity",
      label: "Bike identity",
      ok:
        !fieldErrors.brand &&
        !fieldErrors.modelFamily &&
        !fieldErrors.modelYear &&
        !fieldErrors.category,
      hint: "Brand, model family, year, and category",
    },
    {
      id: "specs",
      label: "Build / specs",
      ok:
        !fieldErrors.frameSize &&
        !fieldErrors.wheelSize &&
        !fieldErrors.drivetrain &&
        !fieldErrors.brakes,
      hint: "Frame size, wheels, drivetrain, brakes",
    },
    {
      id: "condition",
      label: "Condition & service",
      ok:
        !fieldErrors.conditionGrade &&
        !fieldErrors.mileage &&
        !fieldErrors.serviceDate,
      hint: "Grade, mileage, last service date",
    },
    {
      id: "trust",
      label: "Serial & provenance",
      ok:
        !fieldErrors.maskedSerial &&
        !fieldErrors.proofOfPurchase &&
        !fieldErrors.ownershipType &&
        !fieldErrors.theftCheckStatus,
      hint: "Serial format, proof, ownership, theft check",
    },
    {
      id: "price",
      label: "Pricing",
      ok: !fieldErrors.price,
      hint: "Valid asking price",
    },
    {
      id: "fulfillment",
      label: "Transaction modes",
      ok: !fieldErrors.transactionModes,
      hint: "Pickup, shipping, and/or inspection partner",
    },
  ];

  const readyToPublish = items.every((i) => i.ok);

  return { items, readyToPublish, fieldErrors };
}

export function buildPreviewTitle(state: WizardFormState): string {
  const year = parseModelYear(state.modelYear);
  const y = year ?? "—";
  const brand = state.brand.trim() || "Brand";
  const family = state.modelFamily.trim() || "Model";
  const cat =
    state.category === "wheelset"
      ? "Wheelset"
      : state.category === "frame"
        ? "Frameset"
        : state.category === "complete-bike"
          ? ""
          : "";
  const suffix = cat ? ` ${cat}` : "";
  return `${y} ${brand} ${family}${suffix}`.replace(/\s+/g, " ").trim();
}

export function buildPreviewSubtitle(state: WizardFormState): string {
  const parts: string[] = [];
  if (state.frameSize.trim()) parts.push(state.frameSize.trim());
  if (state.region.trim()) parts.push(state.region.trim());
  const serialOk = isValidSerialFormat(state.maskedSerial);
  parts.push(serialOk ? "serial format OK" : "serial needs valid format");
  if (state.proofOfPurchase === "verified") parts.push("proof verified");
  else if (state.proofOfPurchase) parts.push(`proof ${state.proofOfPurchase}`);
  const modes: string[] = [];
  if (state.localPickup) modes.push("local pickup");
  if (state.managedShipping) modes.push("managed shipping");
  if (state.inspectionPartner) modes.push("inspection partner");
  parts.push(modes.length ? modes.join(", ") : "no transaction modes yet");
  return parts.join(" · ");
}
