import React from 'react';
import "@/styles/global.css";
import { Inter } from "next/font/google";
import { cn } from "@/utils";
import { TooltipProvider } from "@/components/ui/tooltip"
import { MainLayout } from '../components/main-layout';
import type { Metadata, Viewport } from "next";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'Riot Player Card',
  description: 'Player card generator and check-in system for Riot Games',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={cn("font-sans", inter.variable, "dark")}>
      <body
        className="vc-init"
      >
        <TooltipProvider>
          <MainLayout>
            {children}
          </MainLayout>
        </TooltipProvider>
      </body>
    </html>
  )
}