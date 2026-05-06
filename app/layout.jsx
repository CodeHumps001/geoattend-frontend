import { Geist } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/components/providers/QueryProvider";
import { Toaster } from "@/components/ui/sonner";

const geist = Geist({ subsets: ["latin"] });

export const metadata = {
  metadataBase: new URL("https://klassrep.vercel.app"),
  title: {
    default: "KlassRep — Smart Class Attendance for Students",
    template: "%s | KlassRep",
  },
  description:
    "KlassRep is a GPS-powered attendance platform built around course reps. Students join with a class code, mark attendance in one tap, and track their percentage — all in real time.",
  keywords: [
    "attendance system",
    "course rep",
    "GPS attendance",
    "student attendance",
    "KlassRep",
    "KsTU attendance",
    "Ghana university attendance",
    "class attendance tracker",
    "digital attendance",
    "smart attendance",
  ],
  authors: [{ name: "Fosu Yaw Humphrey", url: "https://klassrep.vercel.app" }],
  creator: "Fosu Yaw Humphrey",
  publisher: "Velux Corporation",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://klassrep.vercel.app",
    siteName: "KlassRep",
    title: "KlassRep — Smart Class Attendance for Students",
    description:
      "GPS-powered attendance built around your course rep. Join your class in seconds, mark attendance with one tap.",
    images: [
      {
        url: "/klassrep.png",
        width: 1200,
        height: 630,
        alt: "KlassRep — Smart Class Attendance",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "KlassRep — Smart Class Attendance",
    description:
      "GPS-powered attendance built around your course rep. Join, mark, track.",
    images: ["/klassrep.png"],
    creator: "@YawFosu869776",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  verification: {
    // Add your Google Search Console verification code here after you verify
    // google: "your-verification-code",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={geist.className}>
        <QueryProvider>
          {children}
          <Toaster position="top-right" richColors closeButton />
        </QueryProvider>
      </body>
    </html>
  );
}
