import "./globals.css"

export const metadata = {
  title: "Flow-X Authentication",
  description: "Next.js App Router Authentication using Auth.js",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased text-gray-900 bg-gray-50">
        {children}
      </body>
    </html>
  )
}
