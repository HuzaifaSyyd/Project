import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/header"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
   title: "Whozaifa",
  description: "Professional portfolio website showcasing my work and services",
    generator: 'Huzaifa_Syyd',
    icons: {
      icon: { url: '/favicon.jpg' }, // Or the path to your icon.png or other file
    },
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  )
}
