import type React from "react"
import "./globals.css"

export const metadata = {
  title: "Edulogy - Tıp Eğitimi Platformu | Healision",
  description:
    "Healision bünyesinde sunulan, tıp fakültesi öğrencileri için interaktif eğitim platformu. Modern öğrenme deneyimi ile tıp eğitiminde yeni bir dönem.",
  generator: "v0.dev",
  keywords: "tıp eğitimi, interaktif öğrenme, tıp fakültesi, Healision, Edulogy",
  authors: [{ name: "Healision" }],
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
