import type { GetStaticProps } from "next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import LoginForm from "@/components/auth/LoginForm"

export default function AuthPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <LoginForm />
    </div>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? "en", ["common"])),
  },
})
