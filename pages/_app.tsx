import "@/styles/globals.css"
import type { AppProps } from "next/app"
import type { Session } from "@supabase/supabase-js"

export default function App({
  Component,
  pageProps,
}: AppProps) {
  return <Component {...pageProps} />
}
