import type { AppProps } from "next/app"
import { ApolloProvider } from "@apollo/client"
import { appWithTranslation } from "next-i18next"
import client from "@/lib/apollo-client"
import { AuthProvider } from "@/components/auth/AuthProvider"
import Layout from "@/components/layout/Layout"
import "@/styles/globals.css"

function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <ApolloProvider client={client}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ApolloProvider>
    </AuthProvider>
  )
}

export default appWithTranslation(App)
