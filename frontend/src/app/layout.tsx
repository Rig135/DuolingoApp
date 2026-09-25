import type { Metadata } from "next"
import { Nunito } from "next/font/google"
import "./globals.css"
import { Sidebar } from "@/components/layout/Sidebar"
import { TopBar, RightRail } from "@/components/layout/TopBar"

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Duolingo Clone",
  description: "A functional clone of Duolingo",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${nunito.variable} antialiased`}>
        <div className="flex min-h-screen flex-col md:flex-row pb-20 md:pb-0">
          <Sidebar />
          
          {/* Main content wrapper offsets sidebar width on desktop */}
          <main className="flex-1 md:ml-64 flex justify-center">
            <div className="flex w-full max-w-[1056px] justify-between pt-0 md:pt-6">
              
              {/* Center Feed */}
              <div className="w-full lg:max-w-[600px] px-4 md:px-6">
                <TopBar />
                <div className="mt-6 flex flex-col gap-8 pb-24">
                  {children}
                </div>
              </div>
              
              {/* Right Panel for Desktop */}
              <RightRail />

            </div>
          </main>
        </div>
      </body>
    </html>
  )
}
