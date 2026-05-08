import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Space_Grotesk } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/lib/auth-context";
import { LangProvider } from "@/lib/lang-context";
import dynamic from "next/dynamic";
import "./globals.css";

const AiChat = dynamic(
  () => import("@/components/ui/AiChat").then((m) => m.AiChat),
  { ssr: false },
);

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AviationEnglish.kz - Авиационный английский ICAO",
  description: "Подготовка к экзамену ICAO для пилотов и авиадиспетчеров.",
};

export const viewport: Viewport = {
  themeColor: "#0A1628",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ru"
      suppressHydrationWarning
      className={`${plusJakarta.variable} ${spaceGrotesk.variable}`}
    >
      <body
        suppressHydrationWarning
        className="font-sans antialiased min-h-screen"
      >
        <LangProvider>
          <AuthProvider>
            {children}
            <AiChat />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: "var(--card)",
                  color: "var(--card-foreground)",
                  border: "1px solid var(--border)",
                },
              }}
            />
          </AuthProvider>
        </LangProvider>
      </body>
    </html>
  );
}
