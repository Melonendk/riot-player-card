import Link from "next/dist/client/link"
import * as React from "react"
import { Separator } from "./ui/separator"

export function MainLayout({ children }: React.PropsWithChildren) {
  return (
    <div className="relative flex w-full flex-1 flex-col bg-background">
      <div className="flex flex-1 flex-col space-y-4">

        <div className="@container/main flex flex-1 flex-col gap-2">
          {children}
        </div>

        <footer className="flex flex-1 flex-col gap-2">
          <div className="container mx-auto flex flex-col items-center justify-center gap-2 py-4 px-4 sm:px-6 text-sm text-muted-foreground border-t border-white/10">
            <div>
              <p className="text-sm text-muted-foreground">
                Made with ❤️ by
                <Link
                  href="https://github.com/melonendk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-foreground ml-1"
                >
                  Melonendk
                </Link>
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Riot Card was created under Riot Games 
                <Link
                  href="https://www.riotgames.com/en/legal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-foreground mx-1"
                >
                  “Legal Jibber Jabber”
                </Link>
                policy using assets owned by Riot Games. Riot Games does not endorse or sponsor this project.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
