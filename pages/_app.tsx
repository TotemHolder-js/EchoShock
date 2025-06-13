import "@/styles/globals.css"
import type { AppProps } from "next/app"
import type { Session } from "@supabase/supabase-js"
import { TooltipProvider } from "@/components/ui/tooltip"

export default function App({ Component, pageProps }: AppProps) {
  return (
    <TooltipProvider>
      <Component {...pageProps} />
    </TooltipProvider>
  )
}
