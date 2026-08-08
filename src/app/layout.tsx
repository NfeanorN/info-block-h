import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { I18nProvider } from "@/lib/i18n/context";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Инфомат — ГП №25 Алматы",
  description:
    "Информационный киоск городской поликлиники №25 (Алматы, мкр. Дархан): навигация, расписание, НПА, оценка персонала",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="kk" className={`${manrope.variable} h-full`}>
      <body className="min-h-full font-sans antialiased">
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
