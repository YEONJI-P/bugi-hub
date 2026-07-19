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
  description: "직접 만든 프로젝트를 집에 있는 서버에서 운영하는 사이트",
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
