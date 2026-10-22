import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";


export function RiotIdScanner({
  onScan,
}: {
  onScan: (value: string) => void;
}) {
  const [error, setError] = useState("");
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const onScanRef = useRef(onScan);

  useEffect(() => {
    onScanRef.current = onScan;
  }, [onScan]);

  useEffect(() => {
    let cancelled = false;
    let scanner: Html5Qrcode | null = null;
    let startPromise: ReturnType<Html5Qrcode["start"]> | null = null;

    async function start() {
      try {
        scanner = new Html5Qrcode("riot-qr-reader");
        scannerRef.current = scanner;

        startPromise = scanner.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 220, height: 220 },
          },
          (decodedText) => {
            if (!cancelled) onScanRef.current(decodedText);
          },
          () => {}
        );

        await startPromise;

        if (cancelled && scanner.isScanning) {
          await scanner.stop();
        }
      } catch (err) {
        if (!cancelled) {
          const errorMessage =
            err instanceof Error ? err.message : "";

          if (
            errorMessage.toLowerCase().includes("permission") ||
            errorMessage.toLowerCase().includes("notallowed")
          ) {
            setError(
              "Camera access denied. Please allow camera access in your browser settings."
            );
          } else {
            setError(
              errorMessage || "Unable to start the camera."
            );
          }
        }
      }
    }

    void start();

    return () => {
      cancelled = true;

      void (async () => {
        if (!scanner) return;

        try {
          if (startPromise) await startPromise;
          if (scanner.isScanning) await scanner.stop();
        } catch {
          // Camera may already be stopped or startup may have failed.
        }

        try {
          scanner?.clear();
        } catch {
          // Already cleared.
        }
      })();
    };
  }, []);

  return (
    <div className="space-y-3">
      <div className="mx-auto w-full h-auto max-w-sm overflow-hidden rounded-lg">
        <div id="riot-qr-reader" className="w-full h-auto" />
      </div>

      {error && (
        <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          Camera error: {error}
        </p>
      )}
    </div>
  );
}