import type { AppProps } from "next/app"
import { ThemeProvider } from "next-themes"
import Layout from "../components/layout/Layout"
import "../styles/globals.css"

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ThemeProvider>
  )
}
