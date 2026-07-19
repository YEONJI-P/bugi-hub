import type { Metadata } from "next";
import { Sidebar } from "@/components/sidebar";
import "./globals.css";

const themeScript = `
  try {
    const savedTheme = localStorage.getItem("bugi-theme");
    const systemTheme = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    document.documentElement.dataset.theme = savedTheme || systemTheme;
  } catch {
    document.documentElement.dataset.theme = "light";
  }
`;

export const metadata: Metadata = {
  title: {
    default: "Bugi Hub",
    template: "%s · Bugi Hub",
  },
  description: "개인 프로젝트와 서비스를 직접 운영하는 홈서버 허브",
  icons: { icon: "/favicon.png" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body suppressHydrationWarning>
        <div className="layout">
          <Sidebar />
          <main className="main">{children}</main>
        </div>
      </body>
    </html>
  );
}
