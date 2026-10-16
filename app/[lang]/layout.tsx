import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer";
import ModalWrapper from "@/components/modal-wrapper";
import { ThemeProvider } from "next-themes"
import { getDictionary } from "@/dictionaries";
import ProgressBarProvider from "@/components/ProgressBarProvider";
import { Analytics } from "@vercel/analytics/next"
import "../globals.css";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Eric Zhou - Full Stack Developer Portfolio",
  description: "Personal portfolio showcasing projects, experience, and blog posts by Eric Zhou",
};

export default async function RootLayout({
  children,
  modal,
  params
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params as { lang: 'en' | 'zh' };
  const dict = await getDictionary(lang as 'en' | 'zh');

  return (
    <html lang={lang} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider 
          attribute="class"
          defaultTheme="light" 
          enableSystem
          disableTransitionOnChange
        >
          <ProgressBarProvider />
          <Navbar dict={dict} />
          <main>
            <div className="pt-[57px] lg:pt-[77px] text-white">
              {children}
              <ModalWrapper modal={modal} />
            </div>
          </main>
          <Footer dict={dict} />
        </ThemeProvider>
        <Analytics/>
      </body>
    </html>
  );
}
