"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { toPng } from "html-to-image";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { CaretDownIcon, DownloadIcon, GithubLogoIcon, QrCodeIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { isValidRiotId } from "@/lib/riot-id"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/ui/collapsible";
import { Badge } from "@/ui/badge";

export default function PlayerCardPage() {
  const [riotId, setRiotId] = useState("");
  const [cardId, setCardId] = useState("");

  async function downloadCard() {
    const card = document.getElementById("player-card");
    if (!card || !riotId.trim()) return;

    const dataUrl = await toPng(card, {
      pixelRatio: 3,
      cacheBust: true,
      backgroundColor: "#09090b",
    });

    const link = document.createElement("a");
    link.download = `${riotId.replace("#", "-")}-card.png`;
    link.href = dataUrl;
    link.click();
  }

  const validRiotId = isValidRiotId(riotId);
  const infoButton = (
    <Button variant="ghost" className="py-4 sm:py-6 px-4 w-full">
      <span className="text-xl">Info</span>
      <CaretDownIcon className="ml-auto group-data-panel-open/button:rotate-180" />
    </Button>
  )
  
  return (
    <main className="container mx-auto flex flex-col px-4 sm:px-6">
      <section className="flex items-center justify-between gap-2 py-4 border-b border-white/10 mb-4">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
          Riot ID Generator
        </h1>
        
        <nav className="flex items-center gap-2">
          <Link href="/checkin" className={cn(
            buttonVariants({ variant: "outline" }))}>
            <QrCodeIcon className="size-4" />
            Check-in Tool
          </Link>
          <Link 
            href="https://github.com/Melonendk/riot-player-card"
            target="_blank" 
            className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "py-4")}
          >
            <GithubLogoIcon weight="fill" className="size-5" />
          </Link>
        </nav>
      </section>

      <section className="flex flex-col sm:flex-row w-full space-x-0 sm:space-x-4 space-y-4 sm:space-y-0">

        <div className="flex flex-col w-full sm:w-1/2 gap-4">
          <Card className="gap-2 overflow-hidden py-0">
            <CardContent className="px-0 items-center">
              <Collapsible defaultOpen>
                <CollapsibleTrigger render={infoButton} />
                <CollapsibleContent
                 className="flex flex-col gap-2 p-4 text-sm text-muted-foreground"
                >
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    You can find your Riot ID on the account page or on riots app.
                  </p>
                  <Link 
                    href="https://account.riotgames.com/" 
                    target="_blank" 
                    className={"text-base underline text-left!"}
                  >
                    https://account.riotgames.com
                  </Link>
                </CollapsibleContent>
              </Collapsible>
            </CardContent>
          </Card>

          <Card className="gap-2 overflow-hidden py-4">
            <CardContent className="flex px-4 flex-col sm:flex-row gap-2 items-center">
              <div className="flex w-full gap-2">
                <Input
                  placeholder="Username#TAG"
                  className="text-base! sm:text-3xl"
                  value={riotId}
                  onChange={(event) => {
                    setRiotId(event.target.value);
                    setCardId(event.target.value.trim());
                  }}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={downloadCard}
                  disabled={!validRiotId}
                >
                  <DownloadIcon className="mr-2 size-4" />
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col w-full sm:w-1/2 gap-4">
          <Card
            id="player-card"
            className="overflow-hidden py-0"
          >
            <CardContent className="relative flex flex-col items-center gap-6 p-8 border-0 bg-zinc-950 text-white shadow-2xl">
              <div className="absolute inset-0 bg-linear-to-br from-red-950 via-zinc-950 to-zinc-900" />

              <div className="relative w-full text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.4em] text-red-400">
                  Riot ID
                </p>
                <h2 className="relative mt-3 w-full wrap-break-word text-center font-black leading-tight text-[clamp(1rem,4vw,1.75rem)]">
                  {riotId.trim() || "YourName #TAG"}
                </h2>
              </div>

              <div className="relative rounded-xl bg-white p-4">
                {validRiotId ? (
                  <QRCodeSVG
                    value={riotId.trim()}
                    size={180}
                    level="H"
                    marginSize={2}
                  />
                ) : (
                  <div className="flex size-45 items-center justify-center text-center text-sm text-zinc-500">
                    Enter a valid Riot ID
                  </div>
                )}
              </div>

              <div className="relative w-full border-t border-white/10 pt-4 text-center">
                <p className="text-xs font-medium uppercase tracking-widest text-zinc-400">
                  Made @ riotcard.rehollow.com
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

      </section>
    </main>
  );
}
