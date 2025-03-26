'use client'

import { ThemeProvider } from 'next-themes'
import { AuthProvider } from './context/AuthProvider'


export function Providers({ children }: { children: React.ReactNode }) {

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
       {children}
      </AuthProvider>
    </ThemeProvider>
  )
}
