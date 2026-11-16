import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "./components/Navbar";

const bricolageGrotesque = localFont({
  src: "../public/fonts/BricolageGrotesque.woff2",
  variable: "--font-bricolage",
  display: "swap",
});

const instrumentSans = localFont({
  src: "../public/fonts/InstrumentSans.woff2",
  variable: "--font-instrument-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "GrowthEnzyme | Engineered for Growth",
  description:
    "We combine strategy, creativity and technology to accelerate business growth.",
  icons: {
    icon: "/images/logo.jpg",
    apple: "/images/logo.jpg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${bricolageGrotesque.variable} ${instrumentSans.variable} h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200..800&family=Instrument+Sans:wght@400..700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
