import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BadgeDollarSign,
  CheckCircle2,
  Clock3,
  ShieldCheck,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { offers, getListing } from "@/lib/data";
import { currency, labelize } from "@/lib/format";

export default async function MessageThreadPage({
  params,
}: {
  params: Promise<{ threadId: string }>;
}) {
  const { threadId } = await params;
  const digits = threadId.replace(/\D/g, "");
  const parsed = Number.parseInt(digits, 10);
  const index = parsed - 1;

  if (
    digits.length === 0 ||
    !Number.isFinite(parsed) ||
    index < 0 ||
    index >= offers.length
  ) {
    notFound();
  }

  const offer = offers[index];
  const listing = getListing(offer.listingId);

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8"
    >
      <Button variant="ghost" asChild className="mb-5">
        <Link href="/dashboard">
          <ArrowLeft className="h-4 w-4" />
          Back to dashboard
        </Link>
      </Button>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <CardTitle>Offer thread with {offer.buyerName}</CardTitle>
                <p className="mt-2 text-sm text-muted-foreground">
                  {listing?.title}
                </p>
              </div>
              <Badge variant="warning">{labelize(offer.status)}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <Message
              sender={offer.buyerName}
              text="Would you take 6650 if I use platform checkout and pick up this weekend?"
              align="left"
            />
            <Message
              sender="Velo House Austin"
              text="We can counter at 6825. Receipt and serial are already verified, and local pickup can use the QR handoff."
              align="right"
            />
            <Message
              sender={offer.buyerName}
              text={offer.lastMessage}
              align="left"
            />

            <div className="rounded-lg border border-border bg-background p-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">
                    Counteroffer
                  </p>
                  <p className="text-3xl font-black text-ink">{currency(6825)}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button>
                    <BadgeDollarSign className="h-4 w-4" />
                    Send counter
                  </Button>
                  <Button variant="outline">Decline</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <aside className="space-y-5">
          <Card>
            <CardHeader>
              <CardTitle>Transaction timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <TimelineItem
                icon={CheckCircle2}
                title="Listing trust verified"
                text="Identity, receipt, and serial state are buyer-visible."
              />
              <TimelineItem
                icon={Clock3}
                title="Offer in counter state"
                text="Buyer has not accepted the latest price."
              />
              <TimelineItem
                icon={ShieldCheck}
                title="Use protected handoff"
                text="Keep payment and pickup confirmation on platform."
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Trust reminders</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p className="rounded-md bg-muted/70 p-3">
                Do not mark pickup complete until the buyer scans the handoff code.
              </p>
              <p className="rounded-md bg-muted/70 p-3">
                Keep serial details masked in chat; verification state is enough.
              </p>
              <p className="rounded-md bg-muted/70 p-3">
                Prototype state only. No real payment or messaging is sent.
              </p>
            </CardContent>
          </Card>
        </aside>
      </div>
    </main>
  );
}

function Message({
  sender,
  text,
  align,
}: {
  sender: string;
  text: string;
  align: "left" | "right";
}) {
  return (
    <div className={align === "right" ? "flex justify-end" : "flex justify-start"}>
      <div
        className={`max-w-[78%] rounded-lg border border-border px-4 py-3 ${
          align === "right"
            ? "bg-primary text-primary-foreground"
            : "bg-background text-ink"
        }`}
      >
        <p className="text-xs font-black uppercase tracking-wide opacity-75">
          {sender}
        </p>
        <p className="mt-1 text-sm leading-6">{text}</p>
      </div>
    </div>
  );
}

function TimelineItem({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof CheckCircle2;
  title: string;
  text: string;
}) {
  return (
    <div className="flex gap-3 rounded-md border border-border bg-background p-3">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-trust" />
      <div>
        <h3 className="font-black text-ink">{title}</h3>
        <p className="mt-1 text-sm leading-5 text-muted-foreground">{text}</p>
      </div>
    </div>
  );
}
