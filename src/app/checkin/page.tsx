"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeftIcon, CameraIcon, CheckIcon, CopyIcon, TrashIcon, ExportIcon, DotsThreeIcon, GithubLogoIcon } from "@phosphor-icons/react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { extractRiotId } from "@/lib/riot-id"
import { cn } from "@/utils";
import { Badge } from "@/ui/badge";
import { RiotIdScanner } from "@/components/scanner"
import { exportCheckIns } from "@/components/exportscans";
import { useIsMobile } from "@/hooks/use-mobile";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/ui/tooltip";

type CheckIn = {
  riotId: string;
  checkedInAt: string;
};

const STORAGE_KEY = "riotcard-player-checkins";

export default function CheckInPage() {
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [riotId, setRiotId] = useState("");
  const [message, setMessage] = useState("");
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved) {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          setCheckIns(parsed);
        }
      }
    } catch {
      console.error("Could not load check-ins.");
    }

    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(checkIns));
    }
  }, [checkIns, loaded]);

  async function copyRiotId(riotId: string) {
    try {
      await navigator.clipboard.writeText(riotId);
      setCopiedId(riotId);
      window.setTimeout(() => setCopiedId(null), 1500);
    } catch {
      setMessage("Could not copy Riot ID to clipboard.");
    }
  }

  const addCheckIn = useCallback(
    (rawValue: string) => {
      setRiotId("");

      const id = extractRiotId(rawValue);
      
      if (!id) {
        setMessage("Invalid QR code or Riot ID.");
        return;
      }

      const normalizeRiotId = (value: string) =>
        value.normalize("NFC").trim().toLocaleLowerCase();

      const exists = checkIns.some(
        (player) =>
          normalizeRiotId(player.riotId) === normalizeRiotId(id)
      );

      if (exists) {
        setMessage(`${id} is already checked in.`);
        return;
      }

      setCheckIns((current) => [
        ...current,
        {
          riotId: id,
          checkedInAt: new Date().toISOString(),
        },
      ]);

      setMessage(`${id} checked in successfully.`);
    },
    [checkIns]
  );

  function removeCheckIn(id: string) {
    setCheckIns((current) =>
      current.filter((player) => player.riotId !== id)
    );
  }

  function clearCheckIns() {
    if (window.confirm("Remove all check-ins?")) {
      setCheckIns([]);
      setMessage("All check-ins cleared.");
    }
  }

  return (
    <main className="container mx-auto flex flex-col px-4 sm:px-6 space-y-4">
      <section className="flex items-center justify-between gap-2 py-4 border-b border-white/10 mb-4">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
          Riot ID Check-in
        </h1>
        
        <nav className="flex items-center gap-2">
          <Link href="/" className={cn(
            buttonVariants({ variant: "outline" }))}>
            <ArrowLeftIcon className="size-4" />
            Player Card
          </Link>
          <Link 
            href="https://github.com/melonendk"
            target="_blank" 
            className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "py-4")}
          >
            <GithubLogoIcon weight="fill" className="size-5" />
          </Link>
        </nav>
      </section>

      <section className="flex flex-col sm:flex-row w-full space-x-0 sm:space-x-4 space-y-4 sm:space-y-0">
        <div className="flex flex-col w-full sm:w-1/3 gap-4">
          <Card>
            <CardContent className="space-y-4">
              {cameraEnabled ? (
                <>
                  <RiotIdScanner onScan={addCheckIn} />
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setCameraEnabled(false)}
                  >
                    Stop Camera
                  </Button>
                </>
              ) : (
                <div className="flex sm:flex-row flex-col gap-2">
                  <Input
                    placeholder="Username#TAG"
                    value={riotId}
                    onChange={(event) => setRiotId(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        addCheckIn(riotId);
                      }
                    }}
                  />
                  <div className="flex flex-1 gap-2 max-w-full">
                    <Button
                      onClick={() => addCheckIn(riotId)}
                      className={"flex grow w-auto"}
                      disabled={!riotId.trim()}
                    >
                      Check In
                    </Button>
                    <Button
                      size="icon"
                      className={"px-6 sm:w-auto"}
                      onClick={() => setCameraEnabled(true)}
                    >
                      <CameraIcon weight="fill" className="size-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          {message && (
            <Tooltip >
              <div className="flex justify-center items-center"> 
                <TooltipTrigger>
                  <Badge variant="secondary" role="status" className="text-sm text-muted-foreground py-4 cursor-pointer" onClick={() => setMessage("")} >
                    {message}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Click to dissmiss</p>
                </TooltipContent>
              </div>
            </Tooltip>
          )}
        </div>

        <div className="flex flex-col w-full sm:w-2/3 gap-4">
          <div className="flex flex-row items-center gap-2 justify-between">
            <h3 className="text-lg">Checked-in Players</h3>
              {!isMobile ? (
                <div className="flex justify-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => exportCheckIns(checkIns)}
                    disabled={checkIns.length === 0}
                  >
                    <ExportIcon className="size-4" />
                    Export CSV
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={clearCheckIns}
                    disabled={checkIns.length === 0}
                  >
                    <TrashIcon className="size-4" />
                    Clear All
                  </Button>
                </div>
              ) : (
                <DropdownMenu>
                    <DropdownMenuTrigger render={
                      <Button variant="outline">
                      <DotsThreeIcon className="size-4"/>
                    </Button>
                  } />
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() => exportCheckIns(checkIns)}
                      disabled={checkIns.length === 0}
                    >
                      <ExportIcon />
                      Export CSV
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive"
                      onClick={clearCheckIns}
                      disabled={checkIns.length === 0}
                    >
                      <TrashIcon />
                      Clear All
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
            )}
          </div>
          <Card>
            <CardContent>
              {checkIns.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  No players checked in yet.
                </p>
              ) : (
                <div className="divide-y">
                  {checkIns.map((player, index) => (
                    <div
                      key={player.riotId}
                      className="flex items-center justify-between gap-4 py-3"
                    >
                      <div className="flex min-w-0 items-baseline gap-3">
                        <span className="text-sm text-muted-foreground">
                          {index + 1}.
                        </span>

                        <div className="min-w-0">
                          <p className="text-base break-all font-medium">
                            {player.riotId}
                            <Button
                              variant="ghost"
                              size="icon"
                              className={"p-2"}
                              aria-label={`Copy ${player.riotId}`}
                              onClick={() => copyRiotId(player.riotId)}
                            >
                              {copiedId === player.riotId ? (
                                <CheckIcon className="size-4 text-green-500" />
                              ) : (
                                <CopyIcon className="size-4" />
                              )}
                            </Button>
                            <span className="text-xs text-muted-foreground ml-2">
                              {new Date(player.checkedInAt).toLocaleTimeString(
                                [],
                                { hour: "2-digit", minute: "2-digit" }
                              )}
                            </span>
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Remove ${player.riotId}`}
                        onClick={() => removeCheckIn(player.riotId)}
                      >
                        <TrashIcon className="size-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
      </section>
      {/* <div className="flex items-center gap-2 rounded-lg border px-3 py-2">
        <UserCheckIcon className="size-5" />
        <span className="text-xl font-bold">{checkIns.length}</span>
      </div> */}

      
    </main>
  );
}
