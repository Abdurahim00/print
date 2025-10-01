import type React from "react"
import { ReduxProvider } from "@/components/providers/redux-provider"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Toaster } from "sonner"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { CustomSessionProvider } from "@/components/providers/session-provider"
import { CurrencyProvider } from "@/contexts/CurrencyContext"
import { NextIntlClientProvider } from 'next-intl'
import { notFound } from 'next/navigation'
import { locales } from '@/i18n'

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  if (!locales.includes(locale as any)) {
    notFound()
  }

  const session = await getServerSession(authOptions)
  
  // Manually import messages
  let messages;
  try {
    messages = (await import(`../../messages/${locale}.json`)).default
  } catch (error) {
    notFound()
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <CustomSessionProvider session={session as any}>
        <ReduxProvider>
          <CurrencyProvider>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 text-slate-800 dark:from-slate-900 dark:to-slate-800 dark:text-slate-200 font-sans">
              <Navbar />
              <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
                <UserIdBridge />
                {children}
              </main>
              <Footer />
            </div>
            <Toaster />
          </CurrencyProvider>
        </ReduxProvider>
      </CustomSessionProvider>
    </NextIntlClientProvider>
  )
}

function UserIdBridge() {
  return (
    <div id="__current_user_meta__" data-uid="" style={{ display: 'none' }} />
  )
}