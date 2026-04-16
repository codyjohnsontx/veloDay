import {
  AlertTriangle,
  BadgeCheck,
  CheckCircle2,
  Clock3,
  ShieldCheck,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { labelize } from "@/lib/format";
import type { SerialVerification, VerificationState } from "@/lib/types";

function variantForState(state: VerificationState) {
  if (state === "verified") return "trust" as const;
  if (state === "pending") return "warning" as const;
  return "danger" as const;
}

function IconForState({ state }: { state: VerificationState }) {
  if (state === "verified") return <CheckCircle2 className="h-3.5 w-3.5" />;
  if (state === "pending") return <Clock3 className="h-3.5 w-3.5" />;
  return <AlertTriangle className="h-3.5 w-3.5" />;
}

export function VerificationBadge({
  label,
  state,
}: {
  label: string;
  state: VerificationState;
}) {
  return (
    <Badge variant={variantForState(state)} className="gap-1.5">
      <IconForState state={state} />
      {label}: {labelize(state)}
    </Badge>
  );
}

export function SerialTrustBadge({ serial }: { serial: SerialVerification }) {
  return (
    <Badge variant={variantForState(serial.state)} className="gap-1.5">
      <ShieldCheck className="h-3.5 w-3.5" />
      Serial {labelize(serial.state)}
    </Badge>
  );
}

export function SellerTrustBadge({ verified }: { verified: boolean }) {
  return (
    <Badge variant={verified ? "trust" : "warning"} className="gap-1.5">
      <BadgeCheck className="h-3.5 w-3.5" />
      {verified ? "Identity verified" : "Identity pending"}
    </Badge>
  );
}
