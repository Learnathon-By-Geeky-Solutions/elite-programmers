'use client'

import React from 'react'
import NavBar from '@/app/(auth)/NavBar'
import '@/app/globals.css'
import Logo from '@/components/ui/TrueTestLogo'
import { Link } from '@heroui/react'
import { usePathname } from 'next/navigation'

interface RootLayoutProps {
  readonly children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  const path = usePathname()
  return (
    <div className="h-screen flex flex-col justify-between">
      <NavBar />
      <div className="flex justify-around items-center gap-12">
        {!path.includes('userprofile') && (
          <div className="flex flex-col items-center gap-4 flex-1">
            <div className="flex items-center gap-2 text-2xl">
              <Logo size={40} textsz={'text-4xl'}/>
            </div>
            <div className="flex flex-col items-center justify-center text-5xl font-bold ">
              <p>Your Secure Platform</p>
              <p>for Assessments</p>
            </div>
            <p className="text-[#71717A] max-w-md text-center">
              TrueTest ensures a fair, secure environment with real-time proctoring and anti-cheating features, so you
              can focus on showcasing your skills!
            </p>
          </div>
        )}
        <div className="flex-1">{children}</div>
      </div>
      <footer className="w-full px-5 py-4 ">
        <div className="flex justify-between items-center text-gray-400">
          <p>&copy; 2025 TrueTest. All rights reserved.</p>
          <p>
            Contact Us: <Link href="mailto:support@truetest.tech">support@truetest.tech</Link>
          </p>
        </div>
      </footer>
    </div>
  )
}
