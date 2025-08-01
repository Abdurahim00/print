'use client'

import { SessionProvider } from "next-auth/react"
import type { Session } from "next-auth"

export function CustomSessionProvider({
  children,
  session,
}: {
  children: React.ReactNode
  session: Session | null
}) {
  // Patch: always provide an 'expires' property
  const sessionWithExpires =
    session
      ? { ...(session as any), expires: (session as any).expires ?? new Date(0).toISOString() }
      : null

  return <SessionProvider session={sessionWithExpires}>{children}</SessionProvider>
}