"use client"

import { ClerkProvider } from '@clerk/nextjs'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ClerkProvider>
          <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
            <main>
              {children}
              <Toaster />
            </main>
          </div>
        </ClerkProvider>
      </body>
    </html>
  )
}
