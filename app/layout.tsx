import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "TaskMatrix — Project Workspace", template: "%s | TaskMatrix" },
  description:
    "Plan projects, manage tasks across a five-stage Kanban board, collaborate with teammates, and track progress in TaskMatrix.",
  applicationName: "TaskMatrix",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://taskmatrix.vercel.app"),
  openGraph: { title: "TaskMatrix — Project Workspace", description: "A focused workspace for planning, collaboration, and progress.", type: "website" },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
