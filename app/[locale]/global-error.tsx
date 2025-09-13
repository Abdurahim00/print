"use client"

import { useTranslations } from 'next-intl'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const t = useTranslations('errors')
  return (
    <html>
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center p-4">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">{t('somethingWentWrong')}</h2>
            <p className="text-gray-600">
              {t('criticalError')}
            </p>
            <button
              onClick={() => reset()}
              className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
            >
              {t('tryAgain')}
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}